import type { NextRequest } from "next/server";
import { ok, handleApiError } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { prisma } from "@/lib/prisma";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";

export function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/** Mini App / web: broker session → CTV or INTERNAL telesales lane. */
export async function GET(req: NextRequest) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return applyApiCors(
        ok({
          allowed: false,
          brokerType: null,
          brokerId: null,
          lane: null,
          reason: session.status === 401 ? "NOT_AUTHENTICATED" : "BROKER_ONLY",
        }),
        req,
      );
    }

    const broker = await prisma.broker.findUnique({
      where: { id: session.brokerId },
      select: { id: true, brokerType: true },
    });

    const allowed =
      broker?.brokerType === "INTERNAL" || broker?.brokerType === "CTV";

    return applyApiCors(
      ok({
        allowed,
        brokerType: allowed ? broker!.brokerType : broker?.brokerType ?? null,
        brokerId: broker?.id ?? null,
        lane: allowed
          ? broker!.brokerType === "INTERNAL"
            ? "noi_san"
            : "ctv_own"
          : null,
        reason: allowed ? null : "NOT_TELESALES_BROKER_TYPE",
      }),
      req,
    );
  } catch (err) {
    return applyApiCors(handleApiError(err), req);
  }
}
