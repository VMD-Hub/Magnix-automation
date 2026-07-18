import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { isAdminAuthorized } from "@/lib/admin/session";
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

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return applyApiCors(
        fail(403, "FORBIDDEN", "Không có quyền truy cập admin."),
        req,
      );
    }

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
    return applyApiCors(handleApiError(err), req);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return applyApiCors(
        fail(403, "FORBIDDEN", "Không có quyền tạo lead Ops."),
        req,
      );
    }
    const body = opsLeadCreateSchema.parse(await req.json());
    const created = await createOpsHotLead(body);
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
    if (err instanceof OpsLeadPatchError) {
      return applyApiCors(fail(422, err.code, err.message), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
