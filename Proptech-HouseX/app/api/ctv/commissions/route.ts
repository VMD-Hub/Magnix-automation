import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";
import { getBrokerCommissions } from "@/lib/data/commission";

/** CTV — dashboard hoa hồng (session broker, không lộ id trong URL). */
export async function GET(req: NextRequest) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return fail(session.status, session.code, session.message);
    }

    const summary = await getBrokerCommissions(session.brokerId);
    return ok(summary);
  } catch (err) {
    return handleApiError(err);
  }
}
