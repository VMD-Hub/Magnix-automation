import type { NextRequest } from "next/server";
import { fail, handleApiError, created } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";
import { createCaseAssistLog, getNoxhCaseForBroker } from "@/lib/data/noxh-case";
import { assistLogSchema } from "@/lib/validation/noxh-case";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/** CTV — ghi nhận đã hỗ trợ khách ngoài đời. */
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
    const body = assistLogSchema.parse(await req.json());

    const row = await getNoxhCaseForBroker(id, session.brokerId);
    if (!row) {
      return applyApiCors(
        fail(404, "NOT_FOUND", "Không tìm thấy hồ sơ."),
        req,
      );
    }

    const log = await createCaseAssistLog({
      caseId: id,
      brokerId: session.brokerId,
      assistType: body.assistType,
      message: body.message,
    });

    return applyApiCors(created({ id: log.id }), req);
  } catch (err) {
    return applyApiCors(handleApiError(err), req);
  }
}
