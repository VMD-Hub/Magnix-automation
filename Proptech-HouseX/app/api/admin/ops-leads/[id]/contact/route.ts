import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import {
  OpsTelesalesAccessError,
  requireOpsTelesalesAccess,
} from "@/lib/admin/ops-telesales-access";
import {
  getOpsLeadContactBundle,
  OpsLeadPatchError,
  recordOpsTelesalesContact,
} from "@/lib/leads/ops-lead-board";
import { opsLeadContactSchema } from "@/lib/validation/ops-lead";
import { requireIdempotencyKey } from "@/lib/sales-core/http";

type RouteCtx = { params: Promise<{ id: string }> };

export function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

function accessFail(err: OpsTelesalesAccessError, req: NextRequest) {
  const status = err.code === "UNAUTHORIZED" ? 401 : 403;
  return applyApiCors(fail(status, err.code, err.message), req);
}

/** GET contact bundle: deep-links, last contact, timeline, cooldown. */
export async function GET(req: NextRequest, ctx: RouteCtx) {
  try {
    await requireOpsTelesalesAccess(req);
    const { id } = await ctx.params;
    const bundle = await getOpsLeadContactBundle(id);
    if (!bundle) {
      return applyApiCors(
        fail(404, "NOT_FOUND", "Không tìm thấy lead Ops."),
        req,
      );
    }
    return applyApiCors(ok(bundle), req);
  } catch (err) {
    if (err instanceof OpsTelesalesAccessError) return accessFail(err, req);
    return applyApiCors(handleApiError(err), req);
  }
}

/** POST telesales result chip (call/SMS/Zalo). */
export async function POST(req: NextRequest, ctx: RouteCtx) {
  try {
    const access = await requireOpsTelesalesAccess(req);
    const { id } = await ctx.params;
    const idempotencyKey = requireIdempotencyKey(req);
    const body = opsLeadContactSchema.parse(await req.json());
    const result = await recordOpsTelesalesContact({
      leadId: id,
      result: body.result,
      note: body.note,
      actorId: body.actorId === "ops-ui" || body.actorId === "ops-miniapp"
        ? access.actorId
        : body.actorId,
      correlationId: body.correlationId,
      idempotencyKey,
    });
    return applyApiCors(ok(result), req);
  } catch (err) {
    if (err instanceof OpsTelesalesAccessError) return accessFail(err, req);
    if (err instanceof OpsLeadPatchError) {
      const status = err.code === "CALL_COOLDOWN" ? 409 : 422;
      return applyApiCors(fail(status, err.code, err.message), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
