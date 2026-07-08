import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";
import { getNoxhCaseForBroker } from "@/lib/data/noxh-case";
import { serializeCaseForCtv } from "@/lib/noxh-case/serialize-ctv";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return fail(session.status, session.code, session.message);
    }

    const { id } = await params;
    const row = await getNoxhCaseForBroker(id, session.brokerId);
    if (!row) {
      return fail(404, "NOT_FOUND", "Không tìm thấy hồ sơ.");
    }

    return ok(serializeCaseForCtv(row));
  } catch (err) {
    return handleApiError(err);
  }
}
