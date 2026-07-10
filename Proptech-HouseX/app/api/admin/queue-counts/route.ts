import type { NextRequest } from "next/server";
import { getAdminQueueCounts } from "@/lib/admin/queue-counts";
import { isAdminAuthorized } from "@/lib/admin/session";
import { fail, handleApiError, ok } from "@/lib/api/http";

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }

    return ok(await getAdminQueueCounts());
  } catch (err) {
    return handleApiError(err);
  }
}
