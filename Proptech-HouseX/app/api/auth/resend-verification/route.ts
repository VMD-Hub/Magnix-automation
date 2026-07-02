import { fail, handleApiError, ok } from "@/lib/api/http";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email/auth-mailer";
import { isRateLimited } from "@/lib/redis";

const RESEND_MAX = 3;
const RESEND_WINDOW_SEC = 3600;

export async function POST() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return fail(401, "AUTH_REQUIRED", "Vui lòng đăng nhập.");
    }

    if (await isRateLimited(`auth:resend:${session.id}`, RESEND_MAX, RESEND_WINDOW_SEC)) {
      return fail(429, "RATE_LIMITED", "Bạn đã gửi quá nhiều email. Thử lại sau.");
    }

    const account = await prisma.userAccount.findUnique({
      where: { id: session.id },
      select: { id: true, name: true, email: true, emailVerified: true },
    });

    if (!account) {
      return fail(404, "NOT_FOUND", "Không tìm thấy tài khoản.");
    }
    if (account.emailVerified) {
      return ok({ alreadyVerified: true });
    }

    const { sent } = await sendVerificationEmail(
      account.id,
      account.name,
      account.email,
    );
    if (!sent) {
      return fail(500, "EMAIL_FAILED", "Không gửi được email. Thử lại sau.");
    }

    return ok({ sent: true });
  } catch (err) {
    return handleApiError(err);
  }
}
