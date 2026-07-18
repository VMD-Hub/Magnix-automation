import { issueUserAuthToken } from "@/lib/data/auth-tokens";
import { sendEmail } from "@/lib/email/send";
import {
  buildAccountPasswordHintUrl,
  buildResetUrl,
  buildTelesalesLoginUrl,
  buildVerifyUrl,
  passwordOtpEmail,
  passwordResetEmail,
  telesalesGrantNotifyEmail,
  verifyEmailEmail,
} from "@/lib/email/templates";

export async function sendVerificationEmail(
  userAccountId: string,
  name: string,
  email: string,
): Promise<{ sent: boolean }> {
  const token = await issueUserAuthToken(userAccountId, "EMAIL_VERIFY");
  const tpl = verifyEmailEmail(name, buildVerifyUrl(token));
  const result = await sendEmail({ ...tpl, to: email });
  return { sent: result.ok };
}

export async function sendPasswordResetEmail(
  userAccountId: string,
  name: string,
  email: string,
): Promise<{ sent: boolean }> {
  const token = await issueUserAuthToken(userAccountId, "PASSWORD_RESET");
  const tpl = passwordResetEmail(name, buildResetUrl(token));
  const result = await sendEmail({ ...tpl, to: email });
  return { sent: result.ok };
}

export async function sendPasswordOtpEmail(
  name: string,
  email: string,
  code: string,
  purpose: "SET_PASSWORD" | "RESET_PASSWORD",
): Promise<{ sent: boolean }> {
  const tpl = passwordOtpEmail(name, code, purpose);
  const result = await sendEmail({ ...tpl, to: email });
  return { sent: result.ok };
}

/** Thông báo đã cấp CRM Telesales — hướng dẫn đặt MK trong Tài khoản (OTP). */
export async function sendTelesalesGrantNotifyEmail(
  name: string,
  email: string,
): Promise<{ sent: boolean }> {
  const tpl = telesalesGrantNotifyEmail(
    name,
    buildAccountPasswordHintUrl(),
    buildTelesalesLoginUrl(),
  );
  const result = await sendEmail({ ...tpl, to: email });
  return { sent: result.ok };
}
