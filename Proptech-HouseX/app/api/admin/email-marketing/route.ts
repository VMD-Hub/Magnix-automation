import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isSuperAdminAuthorized } from "@/lib/admin/session";
import { getEmailMarketingOverview } from "@/lib/admin/email-marketing-ops";

/** Super: KPI + flags + enrollment queue (email nurture ADR-017). */
export async function GET(req: NextRequest) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản xem Email marketing.");
    }
    const days = Number(req.nextUrl.searchParams.get("days") ?? "30");
    return ok(await getEmailMarketingOverview(days));
  } catch (err) {
    return handleApiError(err);
  }
}
