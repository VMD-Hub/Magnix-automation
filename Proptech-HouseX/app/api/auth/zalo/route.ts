import { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { zaloAuthSchema } from "@/lib/validation/zalo-auth";
import {
  isZaloAuthError,
  loginOrRegisterWithZalo,
} from "@/lib/auth/zalo-login";
import { isRateLimited } from "@/lib/redis";
import { ipHash } from "@/lib/api/request-meta";

const AUTH_RATE_MAX = Number(process.env.AUTH_RATE_MAX ?? "20");
const AUTH_RATE_WINDOW_SEC = Number(process.env.AUTH_RATE_WINDOW_SEC ?? "900");

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/**
 * Mini App Zalo login (ADR-014).
 * Trả Bearer session token (cùng format web hx_session).
 */
export async function POST(req: NextRequest) {
  try {
    const ip = ipHash(req);
    if (
      await isRateLimited(
        `auth:zalo:${ip}`,
        AUTH_RATE_MAX,
        AUTH_RATE_WINDOW_SEC,
      )
    ) {
      return applyApiCors(
        fail(
          429,
          "RATE_LIMITED",
          "Quá nhiều lần thử. Vui lòng thử lại sau.",
        ),
        req,
      );
    }

    const body = zaloAuthSchema.parse(await req.json());
    if (!body.accessToken && !body.zaloUserId) {
      return applyApiCors(
        fail(
          422,
          "VALIDATION_ERROR",
          "Cần accessToken hoặc zaloUserId (dev bypass).",
        ),
        req,
      );
    }

    const result = await loginOrRegisterWithZalo(body);
    return applyApiCors(ok(result), req);
  } catch (err) {
    if (isZaloAuthError(err)) {
      const status =
        err.code === "INVALID_PHONE" || err.code === "ZALO_TOKEN_REQUIRED"
          ? 422
          : err.code === "PHONE_LINKED_OTHER_ZALO"
            ? 409
            : 401;
      return applyApiCors(fail(status, err.code, err.message), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
