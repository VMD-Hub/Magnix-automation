import { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { runOpsSheetMirror } from "@/lib/mirror/ops-sheet-mirror";

export const dynamic = "force-dynamic";

/** Cron — export Postgres ops snapshot → Google Sheet tab `ops_mirror` (ADR-013 P2). */
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.CRON_SECRET;
    if (secret) {
      const auth = req.headers.get("authorization");
      if (auth !== `Bearer ${secret}`) {
        return fail(401, "UNAUTHORIZED", "Cron secret không hợp lệ.");
      }
    }

    const result = await runOpsSheetMirror();
    return ok(result);
  } catch (err) {
    return handleApiError(err);
  }
}
