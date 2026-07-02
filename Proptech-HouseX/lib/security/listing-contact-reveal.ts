import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api/http";
import { getSessionUserFromRequest } from "@/lib/auth/session";
import { assertContactRevealAllowed } from "@/lib/auth/contact-reveal";
import { isRateLimited } from "@/lib/redis";
import { ipHashFromRequest } from "@/lib/security/client-ip";
import { verifyTurnstileToken } from "@/lib/security/turnstile";
import { maskPhone } from "@/lib/privacy/phone";

const REVEAL_MAX = Number(process.env.PHONE_REVEAL_MAX ?? "30");
const REVEAL_WINDOW_SEC = Number(process.env.PHONE_REVEAL_WINDOW_SEC ?? "3600");

type RevealInput = {
  code: string;
  turnstileToken?: string | null;
};

/** Logic chung reveal SĐT — dùng cho GET (dev) và POST (có Turnstile). */
export async function revealListingContact(req: NextRequest, input: RevealInput) {
  const captcha = await verifyTurnstileToken(req, input.turnstileToken);
  if (!captcha.ok) {
    return fail(403, "CAPTCHA_FAILED", captcha.reason);
  }

  const session = getSessionUserFromRequest(req);

  const account = session
    ? await prisma.userAccount.findUnique({
        where: { id: session.id },
        select: { role: true, emailVerified: true, email: true },
      })
    : null;

  const gate = assertContactRevealAllowed(account);
  if (!gate.ok) {
    const status = gate.code === "AUTH_REQUIRED" ? 401 : 403;
    return fail(status, gate.code, gate.message);
  }

  const limited = await Promise.all([
    isRateLimited(`reveal:u:${session!.id}`, REVEAL_MAX, REVEAL_WINDOW_SEC),
    isRateLimited(`reveal:ip:${ipHashFromRequest(req)}`, REVEAL_MAX * 2, REVEAL_WINDOW_SEC),
  ]);
  if (limited.some(Boolean)) {
    return fail(429, "RATE_LIMITED", "Bạn đã xem quá nhiều số. Thử lại sau.");
  }

  const listing = await prisma.listing.findFirst({
    where: { code: input.code, deletedAt: null, status: "ACTIVE" },
    select: {
      broker: { select: { fullName: true, phone: true } },
    },
  });

  if (!listing) {
    return fail(404, "NOT_FOUND", "Không tìm thấy tin đăng.");
  }

  return ok({
    brokerName: listing.broker.fullName,
    phone: listing.broker.phone,
    masked: maskPhone(listing.broker.phone),
  });
}
