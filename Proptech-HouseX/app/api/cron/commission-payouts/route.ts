import { NextRequest } from "next/server";
import { handleApiError, ok } from "@/lib/api/http";
import { cronAuthError } from "@/lib/api/cron-auth";
import { processCommissionPayoutBatch } from "@/lib/noxh-case/commission-accrual";
import { isPayBatchDay } from "@/lib/noxh-case/commission-pay-cycle";

export const dynamic = "force-dynamic";

/**
 * Cron — chi hoa hồng PAYABLE (chạy ngày 05 & 20, hoặc force bất kỳ ngày).
 * Query `?force=1` bỏ qua kiểm tra ngày batch.
 */
export async function POST(req: NextRequest) {
  try {
    const authError = cronAuthError(req);
    if (authError) return authError;

    const force = req.nextUrl.searchParams.get("force") === "1";
    if (!force && !isPayBatchDay()) {
      return ok({ paid: 0, skipped: true, reason: "not_pay_batch_day" });
    }

    const result = await processCommissionPayoutBatch();
    return ok(result);
  } catch (err) {
    return handleApiError(err);
  }
}
