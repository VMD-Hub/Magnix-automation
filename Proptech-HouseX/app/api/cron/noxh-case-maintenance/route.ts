import { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { runNoxhCaseMaintenance } from "@/lib/noxh-case/case-maintenance";

export const dynamic = "force-dynamic";

/** Cron — release lock 20 ngày LV + SLA M1. */
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.CRON_SECRET;
    if (secret) {
      const auth = req.headers.get("authorization");
      if (auth !== `Bearer ${secret}`) {
        return fail(401, "UNAUTHORIZED", "Cron secret không hợp lệ.");
      }
    }

    const result = await runNoxhCaseMaintenance();
    return ok(result);
  } catch (err) {
    return handleApiError(err);
  }
}
