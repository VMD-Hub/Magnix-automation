import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  countOpsLeadsByStatus,
  listOpsLeadsForAdmin,
  serializeOpsLeadListItem,
} from "@/lib/leads/ops-lead-board";
import { opsLeadListQuerySchema } from "@/lib/validation/ops-lead";

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }

    const parsed = opsLeadListQuerySchema.parse({
      status: req.nextUrl.searchParams.get("status") ?? undefined,
      source: req.nextUrl.searchParams.get("source") ?? undefined,
      segment: req.nextUrl.searchParams.get("segment") ?? undefined,
    });

    const rows = await listOpsLeadsForAdmin(parsed);

    return ok({
      items: rows.map(serializeOpsLeadListItem),
      counts: countOpsLeadsByStatus(rows),
      total: rows.length,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
