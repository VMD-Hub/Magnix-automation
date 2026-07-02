import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { forgotPasswordSchema } from "@/lib/validation/auth";
import { normalizeEmail } from "@/lib/email/normalize";
import { sendPasswordResetEmail } from "@/lib/email/auth-mailer";
import { isRateLimited } from "@/lib/redis";
import { ipHash } from "@/lib/api/request-meta";

const FORGOT_RATE_MAX = Number(process.env.AUTH_FORGOT_MAX ?? "5");
const FORGOT_RATE_WINDOW_SEC = Number(process.env.AUTH_FORGOT_WINDOW_SEC ?? "3600");

const GENERIC_MSG =
  "Nếu email tồn tại trong hệ thống, chúng tôi đã gửi link đặt lại mật khẩu.";

export async function POST(req: NextRequest) {
  try {
    const ip = ipHash(req);
    if (
      await isRateLimited(`auth:forgot:${ip}`, FORGOT_RATE_MAX, FORGOT_RATE_WINDOW_SEC)
    ) {
      return fail(429, "RATE_LIMITED", "Quá nhiều yêu cầu. Vui lòng thử lại sau.");
    }

    const body = forgotPasswordSchema.parse(await req.json());
    const email = normalizeEmail(body.email);

    const account = await prisma.userAccount.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, emailVerified: true },
    });

    if (account?.emailVerified) {
      try {
        await sendPasswordResetEmail(account.id, account.name, account.email);
      } catch (err) {
        console.error(
          "[auth/forgot] reset email failed:",
          err instanceof Error ? err.message : err,
        );
      }
    }

    return ok({ message: GENERIC_MSG });
  } catch (err) {
    return handleApiError(err);
  }
}
