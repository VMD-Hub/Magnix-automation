import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  ConflictResolveError,
  getAttributionConflictForAdmin,
  resolveAttributionConflict,
  serializeConflictDetail,
} from "@/lib/attribution/conflict";
import { attributionConflictResolveSchema } from "@/lib/validation/attribution-conflict";

type RouteCtx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: RouteCtx) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }

    const { id } = await ctx.params;
    const row = await getAttributionConflictForAdmin(id);
    if (!row) {
      return fail(404, "NOT_FOUND", "Không tìm thấy xung đột.");
    }

    return ok(serializeConflictDetail(row));
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
    const body = attributionConflictResolveSchema.parse(await req.json());

    const updated = await resolveAttributionConflict(id, {
      resolution: body.resolution,
      note: body.note,
      resolvedBy: "admin",
    });

    if (!updated) {
      return fail(404, "NOT_FOUND", "Không tìm thấy xung đột.");
    }

    return ok(serializeConflictDetail(updated));
  } catch (err) {
    if (err instanceof ConflictResolveError) {
      return fail(409, err.code, err.message);
    }
    return handleApiError(err);
  }
}
