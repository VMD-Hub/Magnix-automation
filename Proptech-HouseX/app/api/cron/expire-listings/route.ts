import { NextRequest } from "next/server";
import { handleApiError, ok } from "@/lib/api/http";
import { cronAuthError } from "@/lib/api/cron-auth";
import { expireListings } from "@/lib/rules/listing-rules";
import { reindexListingSafe } from "@/lib/search/reindex";

export const dynamic = "force-dynamic";

// POST /api/cron/expire-listings — rule #5. Gọi định kỳ (vd mỗi giờ) bởi
// scheduler (Vercel Cron / n8n / crontab). Bảo vệ bằng header Authorization:
//   Authorization: Bearer <CRON_SECRET>
export async function POST(req: NextRequest) {
  try {
    const authError = cronAuthError(req);
    if (authError) return authError;

    const result = await expireListings();
    for (const id of result.ids) {
      await reindexListingSafe(id); // gỡ tin hết hạn khỏi search index
    }
    return ok({ expired: result.expired });
  } catch (err) {
    return handleApiError(err);
  }
}
