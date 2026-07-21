import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isSuperAdminAuthorized } from "@/lib/admin/session";
import { getEmailMarketingLeadDetail } from "@/lib/admin/email-marketing-ops";

/** Super: chi tiết eligibility + enrollments email theo leadId. */
export async function GET(req: NextRequest) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản xem chi tiết Email marketing.");
    }
    const leadId = req.nextUrl.searchParams.get("leadId")?.trim();
    if (!leadId) {
      return fail(400, "VALIDATION", "Thiếu leadId.");
    }
    const detail = await getEmailMarketingLeadDetail(leadId);
    if (!detail) {
      return fail(404, "NOT_FOUND", "Không tìm thấy lead.");
    }
    return ok(detail);
  } catch (err) {
    return handleApiError(err);
  }
}
