import type { NextRequest } from "next/server";
import { created, fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";
import {
  AffiliateOpsError,
  requestExclusiveExtend,
} from "@/lib/data/noxh-case-affiliate-ops";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/** CTV — xin Admin gia hạn độc quyền +15 (không tự cộng ngày). */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return applyApiCors(
        fail(session.status, session.code, session.message),
        req,
      );
    }

    const { id } = await params;
    const result = await requestExclusiveExtend({
      caseId: id,
      brokerId: session.brokerId,
    });

    const payload = {
      exclusiveStatus: result.case.exclusiveStatus,
      extendRequestedAt: result.case.extendRequestedAt?.toISOString() ?? null,
      alreadyRequested: result.alreadyRequested,
    };
    return applyApiCors(
      result.alreadyRequested ? ok(payload) : created(payload),
      req,
    );
  } catch (err) {
    if (err instanceof AffiliateOpsError) {
      const status = err.code === "NOT_FOUND" ? 404 : 422;
      return applyApiCors(fail(status, err.code, err.message), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
