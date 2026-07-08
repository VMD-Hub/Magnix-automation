import { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { processCommissionPayoutBatch } from "@/lib/noxh-case/commission-accrual";
import { isPayBatchDay } from "@/lib/noxh-case/commission-pay-cycle";

export const dynamic = "force-dynamic";

/**
 * Cron — chi hoa hồng PAYABLE (chạy ngày 05 & 20, hoặc force bất kỳ ngày).
 * Query `?force=1` bỏ qua kiểm tra ngày batch.
 */
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.CRON_SECRET;
    if (secret) {
      const auth = req.headers.get("authorization");
      if (auth !== `Bearer ${secret}`) {
        return fail(401, "UNAUTHORIZED", "Cron secret không hợp lệ.");
      }
    }

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
