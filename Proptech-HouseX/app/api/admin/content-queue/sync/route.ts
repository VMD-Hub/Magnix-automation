import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isSuperAdminAuthorized } from "@/lib/admin/session";
import { syncContentQueueFromSheet } from "@/lib/content/content-queue-sheet-sync";
import { contentQueueSyncSchema } from "@/lib/validation/content-queue";

/** Super: sync Sheet content_queue → Postgres (P4 slice 1). */
export async function POST(req: NextRequest) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản sync content queue.");
    }

    const body = contentQueueSyncSchema.parse(
      await req.json().catch(() => ({})),
    );
    const result = await syncContentQueueFromSheet(body);

    if (result.skipped) {
      return fail(503, "SYNC_NOT_CONFIGURED", result.reason ?? "Sync skipped.", result);
    }

    return ok(result);
  } catch (err) {
    return handleApiError(err);
  }
}
