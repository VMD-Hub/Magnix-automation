import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import {
  getAdminSessionFromRequest,
  isAdminAuthorized,
} from "@/lib/admin/session";
import {
  AffiliateOpsError,
  verifySiteVisitBonus,
} from "@/lib/data/noxh-case-affiliate-ops";

/** Ops — xác minh thăm DA với CĐT → +500k khi tính HH. */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const session = getAdminSessionFromRequest(req);
    const actor = session?.role === "ops" ? "ops" : "admin";
    const { id } = await params;

    const result = await verifySiteVisitBonus({ caseId: id, actor });
    return ok({
      siteVisitBonusVerified: result.case.siteVisitBonusVerified,
      alreadyVerified: result.alreadyVerified,
      verifiedAt: result.case.siteVisitBonusVerifiedAt?.toISOString() ?? null,
    });
  } catch (err) {
    if (err instanceof AffiliateOpsError) {
      const status = err.code === "NOT_FOUND" ? 404 : 422;
      return fail(status, err.code, err.message);
    }
    return handleApiError(err);
  }
}
