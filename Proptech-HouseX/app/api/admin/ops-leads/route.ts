import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import {
  OpsTelesalesAccessError,
  requireOpsTelesalesAccess,
} from "@/lib/admin/ops-telesales-access";
import {
  countOpsLeadsByStatus,
  createOpsHotLead,
  listOpsLeadsForAdmin,
  OpsLeadPatchError,
  serializeOpsLeadListItem,
} from "@/lib/leads/ops-lead-board";
import {
  opsLeadCreateSchema,
  opsLeadListQuerySchema,
} from "@/lib/validation/ops-lead";

export function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

function accessFail(err: OpsTelesalesAccessError, req: NextRequest) {
  const status = err.code === "UNAUTHORIZED" ? 401 : 403;
  return applyApiCors(fail(status, err.code, err.message), req);
}

export async function GET(req: NextRequest) {
  try {
    await requireOpsTelesalesAccess(req);

    const parsed = opsLeadListQuerySchema.parse({
      status: req.nextUrl.searchParams.get("status") ?? undefined,
      source: req.nextUrl.searchParams.get("source") ?? undefined,
      segment: req.nextUrl.searchParams.get("segment") ?? undefined,
    });

    const rows = await listOpsLeadsForAdmin(parsed);

    return applyApiCors(
      ok({
        items: rows.map(serializeOpsLeadListItem),
        counts: countOpsLeadsByStatus(rows),
        total: rows.length,
      }),
      req,
    );
  } catch (err) {
    if (err instanceof OpsTelesalesAccessError) return accessFail(err, req);
    return applyApiCors(handleApiError(err), req);
  }
}

export async function POST(req: NextRequest) {
  try {
    const access = await requireOpsTelesalesAccess(req);
    const body = opsLeadCreateSchema.parse(await req.json());
    const created = await createOpsHotLead({
      ...body,
      actorId: body.actorId === "ops-ui" ? access.actorId : body.actorId,
    });
    if (!created.lead) {
      return applyApiCors(
        fail(500, "CREATE_FAILED", "Không đọc lại được lead vừa tạo."),
        req,
      );
    }
    return applyApiCors(
      ok({
        created: created.created,
        leadId: created.leadId,
        lead: serializeOpsLeadListItem(created.lead),
      }),
      req,
    );
  } catch (err) {
    if (err instanceof OpsTelesalesAccessError) return accessFail(err, req);
    if (err instanceof OpsLeadPatchError) {
      return applyApiCors(fail(422, err.code, err.message), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
