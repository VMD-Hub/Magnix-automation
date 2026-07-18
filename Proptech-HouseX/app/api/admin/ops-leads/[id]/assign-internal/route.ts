import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import {
  OpsTelesalesAccessError,
  requireOpsTelesalesAccess,
} from "@/lib/admin/ops-telesales-access";
import {
  assignOpsLeadToInternalBroker,
} from "@/lib/broker/telesales-board";
import { OpsLeadPatchError } from "@/lib/leads/ops-lead-board";
import { adminAssignLeadToInternalSchema } from "@/lib/validation/broker-admin";
import {
  handleSalesCoreError,
  requireIdempotencyKey,
} from "@/lib/sales-core/http";
import { SalesCoreRuleError } from "@/lib/sales-core/domain";

type RouteCtx = { params: Promise<{ id: string }> };

export function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

function accessFail(err: OpsTelesalesAccessError, req: NextRequest) {
  const status = err.code === "UNAUTHORIZED" ? 401 : 403;
  return applyApiCors(fail(status, err.code, err.message), req);
}

/** Super/Ops telesales: gán lead pool → môi giới INTERNAL. */
export async function POST(req: NextRequest, ctx: RouteCtx) {
  try {
    const access = await requireOpsTelesalesAccess(req);
    const { id } = await ctx.params;
    const idempotencyKey = requireIdempotencyKey(req);
    const body = adminAssignLeadToInternalSchema.parse(await req.json());

    const result = await assignOpsLeadToInternalBroker({
      leadId: id,
      brokerId: body.brokerId,
      assignedBy: body.actorId || access.actorId,
      reason: body.reason,
      correlationId: body.correlationId,
      idempotencyKey,
    });

    return applyApiCors(
      ok({
        assignment: result.assignment,
        created: result.created,
        broker: result.broker,
      }),
      req,
    );
  } catch (err) {
    if (err instanceof OpsTelesalesAccessError) return accessFail(err, req);
    if (err instanceof OpsLeadPatchError) {
      return applyApiCors(fail(422, err.code, err.message), req);
    }
    if (err instanceof SalesCoreRuleError) {
      return applyApiCors(handleSalesCoreError(err), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
