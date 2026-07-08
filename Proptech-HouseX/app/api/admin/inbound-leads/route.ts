import type { NextRequest } from "next/server";
import type { InboundUidLead } from "@prisma/client";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { listInboundUidLeadsForAdmin } from "@/lib/data/inbound-uid-lead";
import { maskInboundUid, readInboundOpsMeta } from "@/lib/inbound/ops-meta";
import { OPS_STATUS_LABEL, segmentLabel } from "@/lib/inbound/segment-labels";
import { inboundLeadListQuerySchema } from "@/lib/validation/inbound-lead";

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }

    const parsed = inboundLeadListQuerySchema.parse({
      segment: req.nextUrl.searchParams.get("segment") ?? undefined,
      opsStatus: req.nextUrl.searchParams.get("opsStatus") ?? undefined,
      queue: req.nextUrl.searchParams.get("queue") ?? undefined,
    });

    const rows = await listInboundUidLeadsForAdmin({
      segment: parsed.segment,
      opsStatus: parsed.opsStatus,
      queue: parsed.queue,
    });

    return ok({
      items: rows.map((row: InboundUidLead) => {
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
          textPreview: row.text ? row.text.slice(0, 160) : null,
          classifyMethod: row.classifyMethod,
          magnixStatus: row.status,
          opsStatus: ops.ops_status,
          opsStatusLabel: OPS_STATUS_LABEL[ops.ops_status] ?? ops.ops_status,
          opsNote: ops.ops_note,
          platformLeadId: ops.platform_lead_id,
          capturedAt: row.capturedAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
        };
      }),
      counts: {
        total: rows.length,
        hot: rows.filter((r: InboundUidLead) => r.score >= 70).length,
        review: rows.filter((r: InboundUidLead) => r.status === "review").length,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
