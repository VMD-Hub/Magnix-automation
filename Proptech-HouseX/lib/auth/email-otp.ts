import { createHash, randomInt, timingSafeEqual } from "crypto";
import type { EmailOtpPurpose } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/email/normalize";

export const EMAIL_OTP_TTL_MS = 10 * 60_000;
export const EMAIL_OTP_MAX_ATTEMPTS = 5;

export class EmailOtpError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "EmailOtpError";
  }
}

export function hashEmailOtp(code: string): string {
  return createHash("sha256").update(`housex-otp:${code.trim()}`).digest("hex");
}

export function generateEmailOtpCode(): string {
  return String(randomInt(100_000, 1_000_000));
}

export function verifyEmailOtpCode(code: string, codeHash: string): boolean {
  const a = Buffer.from(hashEmailOtp(code), "hex");
  const b = Buffer.from(codeHash, "hex");
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Invalidate open challenges then create a new one; returns plaintext code once. */
export async function issueEmailOtp(input: {
  email: string;
  purpose: EmailOtpPurpose;
  userAccountId?: string | null;
}): Promise<{ code: string; expiresAt: Date }> {
  const email = normalizeEmail(input.email);
  const code = generateEmailOtpCode();
  const expiresAt = new Date(Date.now() + EMAIL_OTP_TTL_MS);

  await prisma.$transaction([
    prisma.emailOtpChallenge.updateMany({
      where: {
        email,
        purpose: input.purpose,
        consumedAt: null,
      },
      data: { consumedAt: new Date() },
    }),
    prisma.emailOtpChallenge.create({
      data: {
        email,
        purpose: input.purpose,
        codeHash: hashEmailOtp(code),
        userAccountId: input.userAccountId ?? null,
        expiresAt,
      },
    }),
  ]);

  return { code, expiresAt };
}

export async function consumeEmailOtp(input: {
  email: string;
  purpose: EmailOtpPurpose;
  code: string;
  userAccountId?: string | null;
}): Promise<{ challengeId: string }> {
  const email = normalizeEmail(input.email);
  const row = await prisma.emailOtpChallenge.findFirst({
    where: {
      email,
      purpose: input.purpose,
      consumedAt: null,
      ...(input.userAccountId
        ? { userAccountId: input.userAccountId }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  if (!row) {
    throw new EmailOtpError(
      "OTP_INVALID",
      "Mã không hợp lệ hoặc đã hết hạn. Yêu cầu mã mới.",
    );
  }
  if (row.expiresAt.getTime() < Date.now()) {
    await prisma.emailOtpChallenge.update({
      where: { id: row.id },
      data: { consumedAt: new Date() },
    });
    throw new EmailOtpError("OTP_EXPIRED", "Mã đã hết hạn. Yêu cầu mã mới.");
  }
  if (row.attempts >= EMAIL_OTP_MAX_ATTEMPTS) {
    await prisma.emailOtpChallenge.update({
      where: { id: row.id },
      data: { consumedAt: new Date() },
    });
    throw new EmailOtpError(
      "OTP_LOCKED",
      "Nhập sai quá nhiều lần. Yêu cầu mã mới.",
    );
  }

  if (!verifyEmailOtpCode(input.code, row.codeHash)) {
    await prisma.emailOtpChallenge.update({
      where: { id: row.id },
      data: { attempts: { increment: 1 } },
    });
    throw new EmailOtpError("OTP_INVALID", "Mã xác minh không đúng.");
  }

  await prisma.emailOtpChallenge.update({
    where: { id: row.id },
    data: { consumedAt: new Date() },
  });

  return { challengeId: row.id };
}
