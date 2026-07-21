import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isSuperAdminAuthorized } from "@/lib/admin/session";
import { syncContentDraftsFromSheet } from "@/lib/content/content-draft-sheet-sync";
import { contentDraftSyncSchema } from "@/lib/validation/content-draft";

/** Super: sync Sheet content_drafts → Postgres (P4.2). */
export async function POST(req: NextRequest) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản sync content drafts.");
    }
    const body = contentDraftSyncSchema.parse(
      await req.json().catch(() => ({})),
    );
    const result = await syncContentDraftsFromSheet(body);
    if (result.skipped) {
      return fail(
        503,
        "SYNC_NOT_CONFIGURED",
        result.reason ?? "Sync skipped.",
        result,
      );
    }
    return ok(result);
  } catch (err) {
    return handleApiError(err);
  }
}
