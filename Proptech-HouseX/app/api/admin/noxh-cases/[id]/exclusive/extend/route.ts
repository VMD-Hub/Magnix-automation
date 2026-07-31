import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import {
  getAdminSessionFromRequest,
  isAdminAuthorized,
} from "@/lib/admin/session";
import {
  AffiliateOpsError,
  approveExclusiveExtend,
  denyExclusiveExtend,
} from "@/lib/data/noxh-case-affiliate-ops";
import { adminExclusiveExtendSchema } from "@/lib/validation/noxh-case";

/** Ops — duyệt / từ chối gia hạn độc quyền +15. */
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
    const body = adminExclusiveExtendSchema.parse(await req.json());

    if (body.action === "approve") {
      const result = await approveExclusiveExtend({ caseId: id, actor });
      return ok({
        exclusiveStatus: result.case.exclusiveStatus,
        lockExpiresAt: result.lockExpiresAt.toISOString(),
      });
    }

    const result = await denyExclusiveExtend({
      caseId: id,
      actor,
      reason: body.reason,
    });
    return ok({
      exclusiveStatus: result.case.exclusiveStatus,
      denied: true,
    });
  } catch (err) {
    if (err instanceof AffiliateOpsError) {
      const status = err.code === "NOT_FOUND" ? 404 : 422;
      return fail(status, err.code, err.message);
    }
    return handleApiError(err);
  }
}
