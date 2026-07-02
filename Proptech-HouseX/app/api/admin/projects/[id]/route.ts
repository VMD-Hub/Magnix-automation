import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  getProjectForAdmin,
  updateProjectFromAdmin,
} from "@/lib/data/project-admin";
import { projectAdminSaveSchema } from "@/lib/validation/project-admin";

type RouteContext = { params: Promise<{ id: string }> };

/** Admin: chi tiết dự án để chỉnh landing. */
export async function GET(req: NextRequest, ctx: RouteContext) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const { id } = await ctx.params;
    const project = await getProjectForAdmin(id);
    if (!project) {
      return fail(404, "NOT_FOUND", "Không tìm thấy dự án.");
    }
    return ok({ project });
  } catch (err) {
    return handleApiError(err);
  }
}

/** Admin: cập nhật dự án + landing. */
export async function PATCH(req: NextRequest, ctx: RouteContext) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const { id } = await ctx.params;
    const body = projectAdminSaveSchema.parse(await req.json());
    const project = await updateProjectFromAdmin(id, body);
    if (!project) {
      return fail(404, "NOT_FOUND", "Không tìm thấy dự án.");
    }
    return ok({ project });
  } catch (err) {
    return handleApiError(err);
  }
}
