import { NextRequest } from "next/server";
import { handleApiError, ok } from "@/lib/api/http";
import { cronAuthError } from "@/lib/api/cron-auth";
import { runNoxhCaseMaintenance } from "@/lib/noxh-case/case-maintenance";

export const dynamic = "force-dynamic";

/** Cron — release lock 20 ngày LV + SLA M1. */
export async function POST(req: NextRequest) {
  try {
    const authError = cronAuthError(req);
    if (authError) return authError;

    const result = await runNoxhCaseMaintenance();
    return ok(result);
  } catch (err) {
    return handleApiError(err);
  }
}
