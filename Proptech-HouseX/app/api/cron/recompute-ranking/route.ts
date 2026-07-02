import { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { recomputeActiveRankings } from "@/lib/data/ranking";

export const dynamic = "force-dynamic";

// POST /api/cron/recompute-ranking — P2. Gọi định kỳ (vd mỗi 6h) để cập nhật
// rankScore khi freshness suy giảm theo thời gian. Bảo vệ bằng CRON_SECRET.
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.CRON_SECRET;
    if (secret) {
      const auth = req.headers.get("authorization");
      if (auth !== `Bearer ${secret}`) {
        return fail(401, "UNAUTHORIZED", "Cron secret không hợp lệ.");
      }
    }

    const result = await recomputeActiveRankings();
    return ok(result);
  } catch (err) {
    return handleApiError(err);
  }
}
