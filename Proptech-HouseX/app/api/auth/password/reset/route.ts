import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import {
  AccountPasswordError,
  resetPasswordWithOtp,
} from "@/lib/auth/account-password";
import { passwordResetWithOtpSchema } from "@/lib/validation/password-account";

export function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

export async function POST(req: NextRequest) {
  try {
    const body = passwordResetWithOtpSchema.parse(await req.json());
    await resetPasswordWithOtp({
      email: body.email,
      otp: body.otp,
      password: body.password,
    });
    return applyApiCors(
      ok({
        reset: true,
        message: "Đã đặt lại mật khẩu. Đăng nhập bằng SĐT + mật khẩu mới.",
      }),
      req,
    );
  } catch (err) {
    if (err instanceof AccountPasswordError) {
      return applyApiCors(fail(422, err.code, err.message), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
