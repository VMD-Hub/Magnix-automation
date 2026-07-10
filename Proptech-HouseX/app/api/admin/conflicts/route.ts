import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  listAttributionConflictsForAdmin,
  serializeConflictListItem,
} from "@/lib/attribution/conflict";
import { attributionConflictListQuerySchema } from "@/lib/validation/attribution-conflict";

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }

    const parsed = attributionConflictListQuerySchema.parse({
      status: req.nextUrl.searchParams.get("status") ?? undefined,
    });

    const rows = await listAttributionConflictsForAdmin({
      status: parsed.status,
    });

    return ok({
      items: rows.map(serializeConflictListItem),
      counts: {
        open: rows.filter((r) => r.status === "OPEN").length,
        total: rows.length,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
