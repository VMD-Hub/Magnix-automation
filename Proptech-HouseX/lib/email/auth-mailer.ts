import { issueUserAuthToken } from "@/lib/data/auth-tokens";
import { sendEmail } from "@/lib/email/send";
import {
  buildResetUrl,
  buildTelesalesLoginUrl,
  buildTelesalesSetPasswordUrl,
  buildVerifyUrl,
  passwordResetEmail,
  telesalesInviteEmail,
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

/** Super cấp TELESALES_CRM → email đặt mật khẩu (72h) + hướng dẫn /ops/telesales. */
export async function sendTelesalesInviteEmail(
  userAccountId: string,
  name: string,
  email: string,
): Promise<{ sent: boolean }> {
  const token = await issueUserAuthToken(userAccountId, "PASSWORD_RESET", 72);
  const tpl = telesalesInviteEmail(
    name,
    buildTelesalesSetPasswordUrl(token),
    buildTelesalesLoginUrl(),
  );
  const result = await sendEmail({ ...tpl, to: email });
  return { sent: result.ok };
}
