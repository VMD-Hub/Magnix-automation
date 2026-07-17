import { NextRequest } from "next/server";
import { handleApiError, ok } from "@/lib/api/http";
import { cronAuthError } from "@/lib/api/cron-auth";
import { runOpsSheetMirror } from "@/lib/mirror/ops-sheet-mirror";

export const dynamic = "force-dynamic";

/** Cron — export Postgres ops snapshot → Google Sheet tab `ops_mirror` (ADR-013 P2). */
export async function POST(req: NextRequest) {
  try {
    const authError = cronAuthError(req);
    if (authError) return authError;

    const result = await runOpsSheetMirror();
    return ok(result);
  } catch (err) {
    return handleApiError(err);
  }
}
