import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { consumeUserAuthToken } from "@/lib/data/auth-tokens";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
      return fail(422, "MISSING_TOKEN", "Thiếu mã xác nhận.");
    }

    const consumed = await consumeUserAuthToken(token, "EMAIL_VERIFY");
    if (!consumed) {
      return fail(
        400,
        "INVALID_TOKEN",
        "Link xác nhận không hợp lệ hoặc đã hết hạn.",
      );
    }

    await prisma.userAccount.update({
      where: { id: consumed.userAccountId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    return ok({ verified: true });
  } catch (err) {
    return handleApiError(err);
  }
}
