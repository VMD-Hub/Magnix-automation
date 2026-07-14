import { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { createMiniappHandoffCode } from "@/lib/auth/miniapp-handoff";
import { getSessionUserFromRequest } from "@/lib/auth/session";
import { isRateLimited } from "@/lib/redis";
import { ipHash } from "@/lib/api/request-meta";

const HANDOFF_RATE_MAX = Number(process.env.AUTH_HANDOFF_RATE_MAX ?? "30");
const HANDOFF_RATE_WINDOW_SEC = Number(
  process.env.AUTH_HANDOFF_RATE_WINDOW_SEC ?? "900",
);

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/**
 * Mini App (Bearer) → one-time code để webview Set-Cookie hx_session.
 */
export async function POST(req: NextRequest) {
  try {
    const session = getSessionUserFromRequest(req);
    if (!session?.id) {
      return applyApiCors(
        fail(401, "AUTH_REQUIRED", "Vui lòng đăng nhập Mini App trước."),
        req,
      );
    }

    const ip = ipHash(req);
    if (
      await isRateLimited(
        `auth:handoff:${ip}:${session.id}`,
        HANDOFF_RATE_MAX,
        HANDOFF_RATE_WINDOW_SEC,
      )
    ) {
      return applyApiCors(
        fail(429, "RATE_LIMITED", "Quá nhiều lần thử. Vui lòng thử lại sau."),
        req,
      );
    }

    const { code, expiresIn } = createMiniappHandoffCode(session.id);
    return applyApiCors(ok({ code, expiresIn }), req);
  } catch (err) {
    return applyApiCors(handleApiError(err), req);
  }
}
