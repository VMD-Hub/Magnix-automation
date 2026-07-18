/**
 * Account-layer password: set / change / reset via email OTP (not tool grants).
 */
import type { EmailOtpPurpose } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  consumeEmailOtp,
  EmailOtpError,
  issueEmailOtp,
} from "@/lib/auth/email-otp";
import { normalizeEmail } from "@/lib/email/normalize";
import { sendPasswordOtpEmail } from "@/lib/email/auth-mailer";
import { isPlaceholderHouseXEmail } from "@/lib/admin/ops-tool-grants";
import { isRateLimited } from "@/lib/redis";

export class AccountPasswordError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "AccountPasswordError";
  }
}

const OTP_RATE_MAX = 5;
const OTP_RATE_WINDOW_SEC = 3600;

export async function requestPasswordOtp(input: {
  email: string;
  purpose: EmailOtpPurpose;
  sessionUserId?: string | null;
  ipKey: string;
}): Promise<{ sent: boolean; message: string }> {
  const email = normalizeEmail(input.email);
  if (isPlaceholderHouseXEmail(email)) {
    throw new AccountPasswordError(
      "INVALID_EMAIL",
      "Cần email thật (không dùng email Zalo tạm).",
    );
  }

  if (
    await isRateLimited(
      `auth:pwd-otp:${input.ipKey}:${email}`,
      OTP_RATE_MAX,
      OTP_RATE_WINDOW_SEC,
    )
  ) {
    throw new AccountPasswordError(
      "RATE_LIMITED",
      "Quá nhiều yêu cầu mã. Thử lại sau.",
    );
  }

  if (input.purpose === "SET_PASSWORD") {
    if (!input.sessionUserId) {
      throw new AccountPasswordError(
        "UNAUTHORIZED",
        "Cần đăng nhập (Zalo/web) để đặt mật khẩu lần đầu.",
      );
    }
    const account = await prisma.userAccount.findUnique({
      where: { id: input.sessionUserId },
      select: { id: true, name: true, passwordSetAt: true },
    });
    if (!account) {
      throw new AccountPasswordError("UNAUTHORIZED", "Phiên không hợp lệ.");
    }
    if (account.passwordSetAt) {
      throw new AccountPasswordError(
        "PASSWORD_ALREADY_SET",
        "Tài khoản đã có mật khẩu. Dùng Đổi mật khẩu hoặc Quên mật khẩu.",
      );
    }

    const taken = await prisma.userAccount.findUnique({
      where: { email },
      select: { id: true },
    });
    if (taken && taken.id !== account.id) {
      throw new AccountPasswordError(
        "EMAIL_IN_USE",
        "Email đã gắn tài khoản khác.",
      );
    }

    const { code } = await issueEmailOtp({
      email,
      purpose: "SET_PASSWORD",
      userAccountId: account.id,
    });
    const sent = await sendPasswordOtpEmail(
      account.name,
      email,
      code,
      "SET_PASSWORD",
    );
    if (!sent.sent) {
      throw new AccountPasswordError(
        "EMAIL_SEND_FAILED",
        "Không gửi được email. Thử lại sau.",
      );
    }
    return {
      sent: true,
      message: "Đã gửi mã 6 số tới email. Kiểm tra hộp thư (hiệu lực 10 phút).",
    };
  }

  // RESET_PASSWORD — generic response (no account enumeration)
  const generic =
    "Nếu email tồn tại, chúng tôi đã gửi mã xác minh (hiệu lực 10 phút).";
  const account = await prisma.userAccount.findUnique({
    where: { email },
    select: { id: true, name: true, passwordSetAt: true },
  });
  if (account?.passwordSetAt) {
    try {
      const { code } = await issueEmailOtp({
        email,
        purpose: "RESET_PASSWORD",
        userAccountId: account.id,
      });
      await sendPasswordOtpEmail(account.name, email, code, "RESET_PASSWORD");
    } catch (err) {
      console.error(
        "[password-otp] reset send failed:",
        err instanceof Error ? err.message : err,
      );
    }
  }
  return { sent: true, message: generic };
}

export async function setPasswordWithOtp(input: {
  sessionUserId: string;
  email: string;
  otp: string;
  password: string;
}) {
  const email = normalizeEmail(input.email);
  if (isPlaceholderHouseXEmail(email)) {
    throw new AccountPasswordError("INVALID_EMAIL", "Cần email thật.");
  }

  const account = await prisma.userAccount.findUnique({
    where: { id: input.sessionUserId },
    select: { id: true, passwordSetAt: true },
  });
  if (!account) {
    throw new AccountPasswordError("UNAUTHORIZED", "Phiên không hợp lệ.");
  }
  if (account.passwordSetAt) {
    throw new AccountPasswordError(
      "PASSWORD_ALREADY_SET",
      "Đã có mật khẩu. Dùng Đổi mật khẩu.",
    );
  }

  try {
    await consumeEmailOtp({
      email,
      purpose: "SET_PASSWORD",
      code: input.otp,
      userAccountId: account.id,
    });
  } catch (err) {
    if (err instanceof EmailOtpError) {
      throw new AccountPasswordError(err.code, err.message);
    }
    throw err;
  }

  const taken = await prisma.userAccount.findUnique({
    where: { email },
    select: { id: true },
  });
  if (taken && taken.id !== account.id) {
    throw new AccountPasswordError("EMAIL_IN_USE", "Email đã gắn tài khoản khác.");
  }

  const now = new Date();
  await prisma.userAccount.update({
    where: { id: account.id },
    data: {
      email,
      emailVerified: true,
      emailVerifiedAt: now,
      passwordHash: hashPassword(input.password),
      passwordSetAt: now,
    },
  });

  return { ok: true as const };
}

export async function changePassword(input: {
  sessionUserId: string;
  currentPassword: string;
  newPassword: string;
}) {
  const account = await prisma.userAccount.findUnique({
    where: { id: input.sessionUserId },
    select: { id: true, passwordHash: true, passwordSetAt: true },
  });
  if (!account?.passwordSetAt) {
    throw new AccountPasswordError(
      "NO_PASSWORD",
      "Chưa đặt mật khẩu. Dùng Đặt mật khẩu (OTP email).",
    );
  }
  if (!verifyPassword(input.currentPassword, account.passwordHash)) {
    throw new AccountPasswordError(
      "INVALID_PASSWORD",
      "Mật khẩu hiện tại không đúng.",
    );
  }
  await prisma.userAccount.update({
    where: { id: account.id },
    data: {
      passwordHash: hashPassword(input.newPassword),
      passwordSetAt: new Date(),
    },
  });
  return { ok: true as const };
}

export async function resetPasswordWithOtp(input: {
  email: string;
  otp: string;
  password: string;
}) {
  const email = normalizeEmail(input.email);
  const account = await prisma.userAccount.findUnique({
    where: { email },
    select: { id: true, passwordSetAt: true },
  });
  if (!account) {
    throw new AccountPasswordError(
      "OTP_INVALID",
      "Mã không hợp lệ hoặc đã hết hạn.",
    );
  }

  try {
    await consumeEmailOtp({
      email,
      purpose: "RESET_PASSWORD",
      code: input.otp,
      userAccountId: account.id,
    });
  } catch (err) {
    if (err instanceof EmailOtpError) {
      throw new AccountPasswordError(err.code, err.message);
    }
    throw err;
  }

  const now = new Date();
  await prisma.userAccount.update({
    where: { id: account.id },
    data: {
      passwordHash: hashPassword(input.password),
      passwordSetAt: now,
      emailVerified: true,
      emailVerifiedAt: now,
    },
  });

  return { ok: true as const };
}
