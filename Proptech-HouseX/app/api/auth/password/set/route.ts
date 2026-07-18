import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import {
  getSessionUser,
  getSessionUserFromRequest,
} from "@/lib/auth/session";
import {
  AccountPasswordError,
  setPasswordWithOtp,
} from "@/lib/auth/account-password";
import { passwordSetSchema } from "@/lib/validation/password-account";

export function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

export async function POST(req: NextRequest) {
  try {
    const session =
      getSessionUserFromRequest(req) ?? (await getSessionUser());
    if (!session) {
      return applyApiCors(
        fail(401, "UNAUTHORIZED", "Cần đăng nhập để đặt mật khẩu."),
        req,
      );
    }
    const body = passwordSetSchema.parse(await req.json());
    await setPasswordWithOtp({
      sessionUserId: session.id,
      email: body.email,
      otp: body.otp,
      password: body.password,
    });
    return applyApiCors(
      ok({
        set: true,
        message: "Đã đặt mật khẩu. Có thể đăng nhập web bằng SĐT + mật khẩu.",
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
