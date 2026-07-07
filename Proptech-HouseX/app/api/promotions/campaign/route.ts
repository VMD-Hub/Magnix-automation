import type { NextRequest } from "next/server";
import { ok, fail, handleApiError } from "@/lib/api/http";
import {
  getActiveCampaignBySlug,
  getParticipantState,
  isCampaignLive,
  listRecentWinners,
  toCampaignPublic,
} from "@/lib/data/promotion";
import { DEFAULT_PROMOTION_SLUG } from "@/lib/promotion/constants";
import { requireCustomerSessionFromRequest } from "@/lib/auth/require-customer";
import { prisma } from "@/lib/prisma";
import {
  allowPromotionDemoFallback,
  demoPromotionCampaignResponse,
  isPromotionPrismaReady,
  shouldUsePromotionDemo,
} from "@/lib/data/promotion-demo-fallback";

export async function GET(req: NextRequest) {
  if (!isPromotionPrismaReady() && allowPromotionDemoFallback()) {
    return ok(demoPromotionCampaignResponse());
  }

  try {
    const slug = req.nextUrl.searchParams.get("slug") ?? DEFAULT_PROMOTION_SLUG;
    const campaign = await getActiveCampaignBySlug(slug);
    if (!campaign) {
      if (allowPromotionDemoFallback()) {
        return ok(demoPromotionCampaignResponse());
      }
      return fail(404, "NOT_FOUND", "Không tìm thấy chương trình khuyến mãi.");
    }

    const publicCampaign = toCampaignPublic(campaign);
    const live = isCampaignLive(campaign);
    const winners = live
      ? await listRecentWinners(campaign.id, 15)
      : [];

    let participant = null;
    const session = await requireCustomerSessionFromRequest(req);
    if (session.ok && session.profile.emailVerified) {
      participant = await getParticipantState(
        campaign.id,
        session.customerId,
        session.profile.id,
        {
          maxSpinsPerAccount: campaign.maxSpinsPerAccount,
          maxSpinsPerDay: campaign.maxSpinsPerDay,
        },
      );
    }

    return ok({
      campaign: publicCampaign,
      live,
      winners,
      participant,
      auth: session.ok
        ? {
            loggedIn: true,
            emailVerified: session.profile.emailVerified,
            name: session.profile.name,
          }
        : { loggedIn: false, emailVerified: false },
    });
  } catch (err) {
    if (shouldUsePromotionDemo(err)) {
      return ok(demoPromotionCampaignResponse());
    }
    return handleApiError(err);
  }
}
