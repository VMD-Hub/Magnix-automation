import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import {
  BrokerTelesalesAccessError,
  requireBrokerTelesalesAccess,
} from "@/lib/broker/telesales-access";
import {
  getBrokerTelesalesContactBundle,
  recordBrokerTelesalesContact,
} from "@/lib/broker/telesales-board";
import { OpsLeadPatchError } from "@/lib/leads/ops-lead-board";
import { opsLeadContactSchema } from "@/lib/validation/ops-lead";
import {
  handleSalesCoreError,
  requireIdempotencyKey,
} from "@/lib/sales-core/http";
import { SalesCoreRuleError } from "@/lib/sales-core/domain";

type RouteCtx = { params: Promise<{ id: string }> };

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

export async function GET(req: NextRequest, ctx: RouteCtx) {
  try {
    const access = await requireBrokerTelesalesAccess(req);
    const { id } = await ctx.params;
    const bundle = await getBrokerTelesalesContactBundle(id, access);
    if (!bundle) {
      return applyApiCors(
        fail(404, "NOT_FOUND", "Không tìm thấy lead trong phạm vi."),
        req,
      );
    }
    return applyApiCors(ok(bundle), req);
  } catch (err) {
    if (err instanceof BrokerTelesalesAccessError) return accessFail(err, req);
    return applyApiCors(handleApiError(err), req);
  }
}

export async function POST(req: NextRequest, ctx: RouteCtx) {
  try {
    const access = await requireBrokerTelesalesAccess(req);
    const { id } = await ctx.params;
    const idempotencyKey = requireIdempotencyKey(req);
    const body = opsLeadContactSchema.parse(await req.json());

    const result = await recordBrokerTelesalesContact({
      leadId: id,
      result: body.result,
      note: body.note,
      actorId: body.actorId || access.actorId,
      correlationId: body.correlationId,
      idempotencyKey,
      access,
    });

    return applyApiCors(ok(result), req);
  } catch (err) {
    if (err instanceof BrokerTelesalesAccessError) return accessFail(err, req);
    if (err instanceof OpsLeadPatchError) {
      return applyApiCors(fail(422, err.code, err.message), req);
    }
    if (err instanceof SalesCoreRuleError) {
      return applyApiCors(handleSalesCoreError(err), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
