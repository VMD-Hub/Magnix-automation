import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";
import { getBrokerCommissions } from "@/lib/data/commission";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/** CTV — dashboard hoa hồng (session broker, không lộ id trong URL). */
export async function GET(req: NextRequest) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return applyApiCors(
        fail(session.status, session.code, session.message),
        req,
      );
    }

    const summary = await getBrokerCommissions(session.brokerId);
    return applyApiCors(ok(summary), req);
  } catch (err) {
    return applyApiCors(handleApiError(err), req);
  }
}
