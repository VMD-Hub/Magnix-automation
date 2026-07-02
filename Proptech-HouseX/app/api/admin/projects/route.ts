import type { NextRequest } from "next/server";
import { created, fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  createProjectFromAdmin,
  listProjectsForAdmin,
} from "@/lib/data/project-admin";
import { projectAdminSaveSchema } from "@/lib/validation/project-admin";

/** Admin: danh sách dự án / landing. */
export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const items = await listProjectsForAdmin();
    return ok({ items });
  } catch (err) {
    return handleApiError(err);
  }
}

/** Admin: tạo dự án mới (kèm landing template). */
export async function POST(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const body = projectAdminSaveSchema.parse(await req.json());
    const project = await createProjectFromAdmin(body);
    return created({ project });
  } catch (err) {
    return handleApiError(err);
  }
}
