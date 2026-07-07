import { allowDemoProjectFallback } from "@/lib/deploy/demo-fallback";
import { prisma } from "@/lib/prisma";
import {
  getDemoPromotionCampaignPublic,
  getDemoPromotionWinners,
  isPrismaConnectionError,
} from "@/lib/preview/promotion-demo";

/** Dev/local: cho phép dùng dữ liệu demo khi Postgres chưa chạy. */
export function allowPromotionDemoFallback(): boolean {
  return allowDemoProjectFallback();
}

export function shouldUsePromotionDemo(err: unknown): boolean {
  if (!allowPromotionDemoFallback()) return false;
  if (isPrismaConnectionError(err)) return true;
  if (err instanceof TypeError && String(err.message).includes("findUnique")) {
    return true;
  }
  return false;
}

/** Prisma client chưa generate model promotion — thường do chưa chạy db:generate. */
export function isPromotionPrismaReady(): boolean {
  const client = prisma as { promotionCampaign?: { findUnique?: unknown } };
  return typeof client.promotionCampaign?.findUnique === "function";
}

export function demoPromotionCampaignResponse() {
  return {
    campaign: getDemoPromotionCampaignPublic(),
    live: true,
    winners: getDemoPromotionWinners(),
    participant: null,
    auth: { loggedIn: false, emailVerified: false },
    isDemo: true as const,
  };
}

export function demoPromotionWinnersResponse() {
  return { winners: getDemoPromotionWinners(), isDemo: true as const };
}
