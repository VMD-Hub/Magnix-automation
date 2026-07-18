import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import {
  getSessionUser,
  getSessionUserFromRequest,
} from "@/lib/auth/session";
import {
  AccountPasswordError,
  requestPasswordOtp,
} from "@/lib/auth/account-password";
import { passwordRequestOtpSchema } from "@/lib/validation/password-account";
import { ipHash } from "@/lib/api/request-meta";

export function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

export async function POST(req: NextRequest) {
  try {
    const body = passwordRequestOtpSchema.parse(await req.json());
    const session =
      getSessionUserFromRequest(req) ?? (await getSessionUser());
    const result = await requestPasswordOtp({
      email: body.email,
      purpose: body.purpose,
      sessionUserId: session?.id,
      ipKey: ipHash(req),
    });
    return applyApiCors(ok(result), req);
  } catch (err) {
    if (err instanceof AccountPasswordError) {
      const status =
        err.code === "UNAUTHORIZED"
          ? 401
          : err.code === "RATE_LIMITED"
            ? 429
            : 422;
      return applyApiCors(fail(status, err.code, err.message), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
