import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  convertInboundUidToPlatformLead,
  getInboundUidLeadForAdmin,
  updateInboundUidLeadOps,
} from "@/lib/data/inbound-uid-lead";
import {
  maskInboundUid,
  readInboundOpsMeta,
  sanitizeInboundMetaForAdmin,
} from "@/lib/inbound/ops-meta";
import { OPS_STATUS_LABEL, segmentLabel } from "@/lib/inbound/segment-labels";
import {
  inboundLeadConvertSchema,
  inboundLeadPatchSchema,
} from "@/lib/validation/inbound-lead";

function serializeInbound(row: NonNullable<Awaited<ReturnType<typeof getInboundUidLeadForAdmin>>>) {
  const ops = readInboundOpsMeta(row.meta);
  return {
    id: row.id,
    uidMasked: maskInboundUid(row.uid),
    uidSource: row.uidSource,
    normalizedKey: row.normalizedKey,
    segment: row.segment,
    segmentLabel: segmentLabel(row.segment),
    score: row.score,
    interestKey: row.interestKey,
    text: row.text,
    tags: row.tags,
    meta: sanitizeInboundMetaForAdmin(row.meta),
    classifyMethod: row.classifyMethod,
    consentBasis: row.consentBasis,
    magnixStatus: row.status,
    opsStatus: ops.ops_status,
    opsStatusLabel: OPS_STATUS_LABEL[ops.ops_status] ?? ops.ops_status,
    opsNote: ops.ops_note,
    platformLeadId: row.platformLeadId,
    noxhCaseId: ops.noxh_case_id,
    noxhCaseCode: ops.noxh_case_code,
    capturedAt: row.capturedAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }

    const { id } = await params;
    const row = await getInboundUidLeadForAdmin(id);
    if (!row) {
      return fail(404, "NOT_FOUND", "Không tìm thấy inbound lead.");
    }

    return ok(serializeInbound(row));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }

    const { id } = await params;
    const body = inboundLeadPatchSchema.parse(await req.json());
    const updated = await updateInboundUidLeadOps(id, {
      opsStatus: body.opsStatus,
      opsNote: body.opsNote,
    });
    if (!updated) {
      return fail(404, "NOT_FOUND", "Không tìm thấy inbound lead.");
    }

    return ok(serializeInbound(updated));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }

    const { id } = await params;
    const body = inboundLeadConvertSchema.parse(await req.json());
    const result = await convertInboundUidToPlatformLead(id, {
      message: body.message,
      projectId: body.projectId,
    });
    if (!result) {
      return fail(404, "NOT_FOUND", "Không tìm thấy inbound lead.");
    }

    if (!result.lead) {
      return fail(500, "LEAD_MISSING", "Không tạo được lead sàn.");
    }

    return ok({
      created: result.created,
      platformLeadId: result.lead.id,
      inbound: serializeInbound(result.inbound),
    });
  } catch (err) {
    return handleApiError(err);
  }
}
