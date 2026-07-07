import type { NextRequest } from "next/server";
import { ok, fail, handleApiError } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { listPromotionsForAdmin } from "@/lib/data/promotion-admin";

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const items = await listPromotionsForAdmin();
    return ok({ items });
  } catch (err) {
    return handleApiError(err);
  }
}
