import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { isAdminAuthorized } from "@/lib/admin/session";
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

/** GET contact bundle: deep-links, last contact, timeline, cooldown. */
export async function GET(req: NextRequest, ctx: RouteCtx) {
  try {
    if (!isAdminAuthorized(req)) {
      return applyApiCors(
        fail(403, "FORBIDDEN", "Không có quyền đọc contact lead."),
        req,
      );
    }
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
    return applyApiCors(handleApiError(err), req);
  }
}

/** POST telesales result chip (call/SMS/Zalo). */
export async function POST(req: NextRequest, ctx: RouteCtx) {
  try {
    if (!isAdminAuthorized(req)) {
      return applyApiCors(
        fail(403, "FORBIDDEN", "Không có quyền ghi contact lead."),
        req,
      );
    }
    const { id } = await ctx.params;
    const idempotencyKey = requireIdempotencyKey(req);
    const body = opsLeadContactSchema.parse(await req.json());
    const result = await recordOpsTelesalesContact({
      leadId: id,
      result: body.result,
      note: body.note,
      actorId: body.actorId,
      correlationId: body.correlationId,
      idempotencyKey,
    });
    return applyApiCors(ok(result), req);
  } catch (err) {
    if (err instanceof OpsLeadPatchError) {
      const status = err.code === "CALL_COOLDOWN" ? 409 : 422;
      return applyApiCors(fail(status, err.code, err.message), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
