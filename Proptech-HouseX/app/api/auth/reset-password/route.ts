import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { resetPasswordSchema } from "@/lib/validation/auth";
import { hashPassword } from "@/lib/auth/password";
import { consumeUserAuthToken } from "@/lib/data/auth-tokens";

export async function POST(req: NextRequest) {
  try {
    const body = resetPasswordSchema.parse(await req.json());

    const consumed = await consumeUserAuthToken(body.token, "PASSWORD_RESET");
    if (!consumed) {
      return fail(
        400,
        "INVALID_TOKEN",
        "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
      );
    }

    await prisma.userAccount.update({
      where: { id: consumed.userAccountId },
      data: { passwordHash: hashPassword(body.password) },
    });

    return ok({ reset: true });
  } catch (err) {
    return handleApiError(err);
  }
}
