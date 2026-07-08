import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";
import { getNoxhCaseForBroker } from "@/lib/data/noxh-case";
import { serializeCaseForCtv } from "@/lib/noxh-case/serialize-ctv";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

export async function GET(
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
    const row = await getNoxhCaseForBroker(id, session.brokerId);
    if (!row) {
      return applyApiCors(
        fail(404, "NOT_FOUND", "Không tìm thấy hồ sơ."),
        req,
      );
    }

    return applyApiCors(ok(serializeCaseForCtv(row)), req);
  } catch (err) {
    return applyApiCors(handleApiError(err), req);
  }
}
