import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isSuperAdminAuthorized } from "@/lib/admin/session";
import {
  getRentalKpi,
  resolveRentalKpiWindow,
} from "@/lib/admin/rental-kpi";

/** Super: KPI thuê P1–P3 + Sense NEED_PM (ADR-018 Wave 2). */
export async function GET(req: NextRequest) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản xem KPI thuê.");
    }

    const days = resolveRentalKpiWindow(req.nextUrl.searchParams.get("days"));
    const data = await getRentalKpi(days);
    return ok(data);
  } catch (err) {
    return handleApiError(err);
  }
}
