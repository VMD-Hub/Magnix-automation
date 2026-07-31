import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import {
  getAdminSessionFromRequest,
  isAdminAuthorized,
} from "@/lib/admin/session";
import {
  AffiliateOpsError,
  recordHdmbBaseAmount,
} from "@/lib/data/noxh-case-affiliate-ops";
import { adminHdmbSchema } from "@/lib/validation/noxh-case";

/** Ops — nhập giá HĐMB → SoR + preview HH %×tier. */
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
    const body = adminHdmbSchema.parse(await req.json());

    const result = await recordHdmbBaseAmount({
      caseId: id,
      hdmbBaseAmount: body.hdmbBaseAmount,
      actor,
    });

    return ok({
      hdmbBaseAmount: Number(result.case.hdmbBaseAmount),
      hdmbRecordedAt: result.case.hdmbRecordedAt?.toISOString() ?? null,
      preview: result.preview,
      commissionUpdated: result.commissionUpdated,
    });
  } catch (err) {
    if (err instanceof AffiliateOpsError) {
      const status = err.code === "NOT_FOUND" ? 404 : 422;
      return fail(status, err.code, err.message);
    }
    return handleApiError(err);
  }
}
