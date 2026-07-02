import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { listDevelopersForAdmin } from "@/lib/data/project-admin";

/** Admin: danh sách chủ đầu tư (dropdown form). */
export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const items = await listDevelopersForAdmin();
    return ok({ items });
  } catch (err) {
    return handleApiError(err);
  }
}
