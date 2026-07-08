import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";
import { listAgentServicesForBroker } from "@/lib/data/agent-services";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/** GET /api/ctv/services — catalog + entitlement status của CTV đăng nhập. */
export async function GET(req: NextRequest) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return applyApiCors(
        fail(session.status, session.code, session.message),
        req,
      );
    }

    const items = await listAgentServicesForBroker(session.brokerId);
    const byCategory = {
      TRAINING: items.filter((i) => i.category === "TRAINING"),
      LEGAL: items.filter((i) => i.category === "LEGAL"),
      PRODUCT: items.filter((i) => i.category === "PRODUCT"),
    };

    return applyApiCors(ok({ items, byCategory }), req);
  } catch (err) {
    return applyApiCors(handleApiError(err), req);
  }
}
