import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import {
  OpsTelesalesAccessError,
  requireOpsTelesalesAccess,
} from "@/lib/admin/ops-telesales-access";
import {
  getOpsLeadForAdmin,
  OpsLeadPatchError,
  patchOpsLeadForAdmin,
  serializeOpsLeadDetail,
} from "@/lib/leads/ops-lead-board";
import { opsLeadPatchSchema } from "@/lib/validation/ops-lead";

type RouteCtx = { params: Promise<{ id: string }> };

export function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

function accessFail(err: OpsTelesalesAccessError, req: NextRequest) {
  const status = err.code === "UNAUTHORIZED" ? 401 : 403;
  return applyApiCors(fail(status, err.code, err.message), req);
}

export async function GET(req: NextRequest, ctx: RouteCtx) {
  try {
    await requireOpsTelesalesAccess(req);

    const { id } = await ctx.params;
    const row = await getOpsLeadForAdmin(id);
    if (!row) {
      return applyApiCors(
        fail(404, "NOT_FOUND", "Không tìm thấy lead Ops."),
        req,
      );
    }

    return applyApiCors(ok(serializeOpsLeadDetail(row)), req);
  } catch (err) {
    if (err instanceof OpsTelesalesAccessError) return accessFail(err, req);
    return applyApiCors(handleApiError(err), req);
  }
}

export async function PATCH(req: NextRequest, ctx: RouteCtx) {
  try {
    await requireOpsTelesalesAccess(req);

    const { id } = await ctx.params;
    const body = opsLeadPatchSchema.parse(await req.json());

    const updated = await patchOpsLeadForAdmin(id, body);
    if (!updated) {
      return applyApiCors(
        fail(404, "NOT_FOUND", "Không tìm thấy lead Ops."),
        req,
      );
    }

    return applyApiCors(ok(serializeOpsLeadDetail(updated)), req);
  } catch (err) {
    if (err instanceof OpsTelesalesAccessError) return accessFail(err, req);
    if (err instanceof OpsLeadPatchError) {
      return applyApiCors(fail(422, err.code, err.message), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
