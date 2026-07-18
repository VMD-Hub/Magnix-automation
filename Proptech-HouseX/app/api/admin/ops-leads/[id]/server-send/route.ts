import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import {
  OpsTelesalesAccessError,
  requireOpsTelesalesAccess,
} from "@/lib/admin/ops-telesales-access";
import { requireIdempotencyKey } from "@/lib/sales-core/http";
import { opsLeadServerSendSchema } from "@/lib/validation/ops-lead";
import {
  sendTelesalesServerChannels,
  TelesalesServerSendError,
} from "@/lib/messaging/telesales-server-send";

type RouteCtx = { params: Promise<{ id: string }> };

export function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

function accessFail(err: OpsTelesalesAccessError, req: NextRequest) {
  const status = err.code === "UNAUTHORIZED" ? 401 : 403;
  return applyApiCors(fail(status, err.code, err.message), req);
}

/** POST Phase 2 — gửi OA / SMS từ server + NurtureDispatch. */
export async function POST(req: NextRequest, ctx: RouteCtx) {
  try {
    const access = await requireOpsTelesalesAccess(req);
    const { id } = await ctx.params;
    const idempotencyKey = requireIdempotencyKey(req);
    const body = opsLeadServerSendSchema.parse(await req.json());
    const actorId =
      body.actorId === "ops-ui" || body.actorId === "ops-miniapp"
        ? access.actorId
        : body.actorId;
    const result = await sendTelesalesServerChannels({
      leadId: id,
      channels: body.channels,
      actorId,
      correlationId: body.correlationId,
      idempotencyKey,
    });
    return applyApiCors(ok(result), req);
  } catch (err) {
    if (err instanceof OpsTelesalesAccessError) return accessFail(err, req);
    if (err instanceof TelesalesServerSendError) {
      const status =
        err.code === "NOT_FOUND"
          ? 404
          : err.code === "SERVER_SEND_DISABLED"
            ? 403
            : 422;
      return applyApiCors(fail(status, err.code, err.message), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
