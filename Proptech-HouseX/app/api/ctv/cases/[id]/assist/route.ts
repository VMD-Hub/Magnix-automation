import type { NextRequest } from "next/server";
import { fail, handleApiError, created } from "@/lib/api/http";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";
import { createCaseAssistLog, getNoxhCaseForBroker } from "@/lib/data/noxh-case";
import { assistLogSchema } from "@/lib/validation/noxh-case";

/** CTV — ghi nhận đã hỗ trợ khách ngoài đời. */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return fail(session.status, session.code, session.message);
    }

    const { id } = await params;
    const body = assistLogSchema.parse(await req.json());

    const row = await getNoxhCaseForBroker(id, session.brokerId);
    if (!row) {
      return fail(404, "NOT_FOUND", "Không tìm thấy hồ sơ.");
    }

    const log = await createCaseAssistLog({
      caseId: id,
      brokerId: session.brokerId,
      assistType: body.assistType,
      message: body.message,
    });

    return created({ id: log.id });
  } catch (err) {
    return handleApiError(err);
  }
}
