import type { NextRequest } from "next/server";
import { ok, fail, handleApiError } from "@/lib/api/http";
import {
  getActiveCampaignBySlug,
  listRecentWinners,
} from "@/lib/data/promotion";
import { DEFAULT_PROMOTION_SLUG } from "@/lib/promotion/constants";
import {
  allowPromotionPreviewData,
  demoPromotionWinnersResponse,
  isPromotionPrismaReady,
  shouldUsePromotionDemo,
} from "@/lib/data/promotion-demo-fallback";

export async function GET(req: NextRequest) {
  if (!isPromotionPrismaReady() && allowPromotionPreviewData(req)) {
    return ok(demoPromotionWinnersResponse());
  }

  try {
    const slug = req.nextUrl.searchParams.get("slug") ?? DEFAULT_PROMOTION_SLUG;
    const limit = Math.min(
      50,
      Number(req.nextUrl.searchParams.get("limit") ?? "20") || 20,
    );

    const campaign = await getActiveCampaignBySlug(slug);
    if (!campaign) {
      if (allowPromotionPreviewData(req)) {
        return ok(demoPromotionWinnersResponse());
      }
      return fail(404, "NOT_FOUND", "Không tìm thấy chương trình.");
    }

    const winners = await listRecentWinners(campaign.id, limit);
    return ok({ winners });
  } catch (err) {
    if (shouldUsePromotionDemo(err)) {
      return ok(demoPromotionWinnersResponse());
    }
    return handleApiError(err);
  }
}
