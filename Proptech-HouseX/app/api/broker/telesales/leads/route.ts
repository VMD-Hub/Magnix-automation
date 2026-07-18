import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import {
  BrokerTelesalesAccessError,
  requireBrokerTelesalesAccess,
} from "@/lib/broker/telesales-access";
import {
  listBrokerTelesalesLeads,
  serializeBrokerTelesalesListItem,
} from "@/lib/broker/telesales-board";
import { leadStatusEnum } from "@/lib/validation/lead";
import { z } from "zod";

export function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

function accessFail(err: BrokerTelesalesAccessError, req: NextRequest) {
  const status =
    err.code === "UNAUTHORIZED"
      ? 401
      : err.code === "NOT_FOUND"
        ? 404
        : 403;
  return applyApiCors(fail(status, err.code, err.message), req);
}

const querySchema = z.object({
  status: leadStatusEnum.optional(),
});

export async function GET(req: NextRequest) {
  try {
    const access = await requireBrokerTelesalesAccess(req);
    const parsed = querySchema.parse({
      status: req.nextUrl.searchParams.get("status") ?? undefined,
    });
    const rows = await listBrokerTelesalesLeads(access, parsed);
    return applyApiCors(
      ok({
        brokerType: access.brokerType,
        items: rows.map(serializeBrokerTelesalesListItem),
        total: rows.length,
      }),
      req,
    );
  } catch (err) {
    if (err instanceof BrokerTelesalesAccessError) return accessFail(err, req);
    return applyApiCors(handleApiError(err), req);
  }
}
