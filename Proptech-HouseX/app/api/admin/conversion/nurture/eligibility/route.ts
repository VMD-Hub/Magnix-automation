import type { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { checkNurtureEligibility } from "@/lib/sales-core/service";
import { handleSalesCoreError } from "@/lib/sales-core/http";
import { nurtureEligibilityQuerySchema } from "@/lib/validation/sales-core";

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền đọc nurture eligibility.");
    }
    const query = nurtureEligibilityQuerySchema.parse({
      leadId: req.nextUrl.searchParams.get("leadId") ?? undefined,
      purpose: req.nextUrl.searchParams.get("purpose") ?? undefined,
      channel: req.nextUrl.searchParams.get("channel") ?? undefined,
    });
    return ok(await checkNurtureEligibility(query));
  } catch (error) {
    return handleSalesCoreError(error);
  }
}
