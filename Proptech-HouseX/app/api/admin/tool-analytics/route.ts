import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isSuperAdminAuthorized } from "@/lib/admin/session";
import {
  getToolAnalytics,
  resolveToolAnalyticsWindow,
} from "@/lib/admin/tool-analytics";

/** Super: KPI tool funnel — content CTA → lead → status. */
export async function GET(req: NextRequest) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản xem tool analytics.");
    }

    const days = resolveToolAnalyticsWindow(
      req.nextUrl.searchParams.get("days"),
    );
    const data = await getToolAnalytics(days);
    return ok(data);
  } catch (err) {
    return handleApiError(err);
  }
}
