import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";
import { getAgentServiceDetail } from "@/lib/data/agent-services";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/** GET /api/ctv/services/:code — nội dung học + câu hỏi (không lộ đáp án). */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return applyApiCors(
        fail(session.status, session.code, session.message),
        req,
      );
    }

    const { code } = await params;
    const detail = await getAgentServiceDetail(session.brokerId, code);
    if (!detail) {
      return applyApiCors(
        fail(404, "NOT_FOUND", "Không tìm thấy dịch vụ / khóa học."),
        req,
      );
    }

    return applyApiCors(ok(detail), req);
  } catch (err) {
    return applyApiCors(handleApiError(err), req);
  }
}
