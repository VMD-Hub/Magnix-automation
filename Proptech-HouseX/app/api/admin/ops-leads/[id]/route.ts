import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  getOpsLeadForAdmin,
  OpsLeadPatchError,
  patchOpsLeadForAdmin,
  serializeOpsLeadDetail,
} from "@/lib/leads/ops-lead-board";
import { opsLeadPatchSchema } from "@/lib/validation/ops-lead";

type RouteCtx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: RouteCtx) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }

    const { id } = await ctx.params;
    const row = await getOpsLeadForAdmin(id);
    if (!row) {
      return fail(404, "NOT_FOUND", "Không tìm thấy lead Ops.");
    }

    return ok(serializeOpsLeadDetail(row));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest, ctx: RouteCtx) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }

    const { id } = await ctx.params;
    const body = opsLeadPatchSchema.parse(await req.json());

    const updated = await patchOpsLeadForAdmin(id, body);
    if (!updated) {
      return fail(404, "NOT_FOUND", "Không tìm thấy lead Ops.");
    }

    return ok(serializeOpsLeadDetail(updated));
  } catch (err) {
    if (err instanceof OpsLeadPatchError) {
      return fail(422, err.code, err.message);
    }
    return handleApiError(err);
  }
}
