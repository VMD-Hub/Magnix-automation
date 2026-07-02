import type { NextRequest } from "next/server";
import { created, fail, handleApiError } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { cloneProjectForAdmin } from "@/lib/data/project-admin";
import { projectCloneSchema } from "@/lib/validation/project-admin";

type RouteContext = { params: Promise<{ id: string }> };

/** Admin: nhân bản dự án (landing + loại hình + pháp lý). */
export async function POST(req: NextRequest, ctx: RouteContext) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const { id } = await ctx.params;
    const body = projectCloneSchema.parse(await req.json());
    const project = await cloneProjectForAdmin(
      id,
      body.newSlug,
      body.newName,
    );
    if (!project) {
      return fail(404, "NOT_FOUND", "Không tìm thấy dự án nguồn.");
    }
    return created({ project });
  } catch (err) {
    return handleApiError(err);
  }
}
