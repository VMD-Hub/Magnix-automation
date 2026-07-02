import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { authLoginSchema } from "@/lib/validation/auth";
import { verifyPassword } from "@/lib/auth/password";
import { normalizeVnPhone, isValidVnPhone } from "@/lib/phone";
import { attachSessionCookie } from "@/lib/auth/cookie-response";
import { loadSessionProfile } from "@/lib/auth/session-profile";
import { isRateLimited } from "@/lib/redis";
import { ipHash } from "@/lib/api/request-meta";

const AUTH_RATE_MAX = Number(process.env.AUTH_RATE_MAX ?? "10");
const AUTH_RATE_WINDOW_SEC = Number(process.env.AUTH_RATE_WINDOW_SEC ?? "900");

export async function POST(req: NextRequest) {
  try {
    const ip = ipHash(req);
    if (await isRateLimited(`auth:login:${ip}`, AUTH_RATE_MAX, AUTH_RATE_WINDOW_SEC)) {
      return fail(429, "RATE_LIMITED", "Quá nhiều lần thử. Vui lòng thử lại sau.");
    }

    const body = authLoginSchema.parse(await req.json());
    const normalizedPhone = normalizeVnPhone(body.phone);
    if (!isValidVnPhone(normalizedPhone)) {
      return fail(422, "INVALID_PHONE", "Số điện thoại không hợp lệ.");
    }

    const account = await prisma.userAccount.findUnique({
      where: { normalizedPhone },
    });

    if (!account || !verifyPassword(body.password, account.passwordHash)) {
      return fail(
        401,
        "INVALID_CREDENTIALS",
        "Số điện thoại hoặc mật khẩu không đúng.",
      );
    }

    const profile = await loadSessionProfile({ id: account.id });
    const res = ok({ user: profile });
    return attachSessionCookie(res, account.id);
  } catch (err) {
    return handleApiError(err);
  }
}
