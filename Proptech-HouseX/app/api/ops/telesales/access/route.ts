import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import {
  getSessionUser,
  getSessionUserFromRequest,
} from "@/lib/auth/session";
import { getTelesalesAccessForSession } from "@/lib/admin/ops-telesales-access";

export function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/** Mini App / web: Bearer or hx_session → whether TELESALES_CRM is allowed. */
export async function GET(req: NextRequest) {
  const session =
    getSessionUserFromRequest(req) ?? (await getSessionUser());
  const access = await getTelesalesAccessForSession(session?.id);
  return applyApiCors(
    ok({
      allowed: access.allowed,
      tool: access.tool,
      reason: access.allowed
        ? null
        : session
          ? "NO_GRANT"
          : "NOT_AUTHENTICATED",
    }),
    req,
  );
}
