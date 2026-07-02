import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  REFERRAL_COOKIE,
  referralCookieOptions,
  resolveReferralTarget,
} from "@/lib/rules/referral-attribution";
import { kv } from "@/lib/redis";
import { ipHash } from "@/lib/api/request-meta";

export const dynamic = "force-dynamic";

// GET /api/referrals/:code/redirect — rule #3.
// Tăng clickCount, set cookie first-touch (không ghi đè), rồi redirect tới đích.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const origin = req.nextUrl.origin;

  const referral = await prisma.referral.findUnique({
    where: { code },
    include: {
      project: { select: { slug: true } },
      listing: { select: { code: true } },
    },
  });

  // Không tìm thấy → về trang chủ, không attribution.
  if (!referral) {
    return NextResponse.redirect(new URL("/", origin));
  }

  const target = resolveReferralTarget(referral) ?? "/";
  const expired = referral.expiresAt != null && referral.expiresAt < new Date();

  // Click dedup: chỉ tăng clickCount 1 lần / (code, ipHash, ngày) để chống bơm ảo.
  const day = new Date().toISOString().slice(0, 10);
  const firstClickToday = await kv.setNx(
    `click:${referral.code}:${ipHash(req)}:${day}`,
    "1",
    24 * 3600,
  );
  if (firstClickToday) {
    await prisma.referral.update({
      where: { id: referral.id },
      data: { clickCount: { increment: 1 } },
    });
  }

  const res = NextResponse.redirect(new URL(target, origin));

  // First-touch: chỉ set khi chưa có cookie và referral còn hiệu lực.
  const existing = req.cookies.get(REFERRAL_COOKIE);
  if (!existing && !expired) {
    res.cookies.set(REFERRAL_COOKIE, referral.code, referralCookieOptions);
  }

  return res;
}
