import { NextRequest } from "next/server";
import { handleApiError, ok } from "@/lib/api/http";
import { cronAuthError } from "@/lib/api/cron-auth";
import { recomputeActiveRankings } from "@/lib/data/ranking";

export const dynamic = "force-dynamic";

// POST /api/cron/recompute-ranking — P2. Gọi định kỳ (vd mỗi 6h) để cập nhật
// rankScore khi freshness suy giảm theo thời gian. Bảo vệ bằng CRON_SECRET.
export async function POST(req: NextRequest) {
  try {
    const authError = cronAuthError(req);
    if (authError) return authError;

    const result = await recomputeActiveRankings();
    return ok(result);
  } catch (err) {
    return handleApiError(err);
  }
}
