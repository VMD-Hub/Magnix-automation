import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import {
  getSessionUser,
  getSessionUserFromRequest,
} from "@/lib/auth/session";
import {
  AccountPasswordError,
  changePassword,
} from "@/lib/auth/account-password";
import { passwordChangeSchema } from "@/lib/validation/password-account";

export function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

export async function POST(req: NextRequest) {
  try {
    const session =
      getSessionUserFromRequest(req) ?? (await getSessionUser());
    if (!session) {
      return applyApiCors(
        fail(401, "UNAUTHORIZED", "Cần đăng nhập."),
        req,
      );
    }
    const body = passwordChangeSchema.parse(await req.json());
    await changePassword({
      sessionUserId: session.id,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    });
    return applyApiCors(ok({ changed: true }), req);
  } catch (err) {
    if (err instanceof AccountPasswordError) {
      return applyApiCors(fail(422, err.code, err.message), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
