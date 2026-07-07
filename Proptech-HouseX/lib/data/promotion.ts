import type {
  PromotionCampaign,
  PromotionCampaignStatus,
  PromotionFulfillmentStatus,
  PromotionPrize,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DEFAULT_PROMOTION_SLUG } from "@/lib/promotion/constants";

export type PromotionCampaignPublic = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  termsMarkdown: string | null;
  status: PromotionCampaignStatus;
  startAt: string;
  endAt: string;
  maxSpinsPerAccount: number;
  maxSpinsPerDay: number;
  spinDurationMs: number;
  wheelLayout: string[];
  prizes: PromotionPrizePublic[];
};

export type PromotionPrizePublic = {
  id: string;
  tier: PromotionPrize["tier"];
  prizeType: PromotionPrize["prizeType"];
  label: string;
  shortLabel: string;
  description: string | null;
  imageUrl: string | null;
  segmentIndices: number[];
};

function parseWheelLayout(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string");
}

function prizeWithSegments(
  prize: PromotionPrize,
  wheelLayout: string[],
): PromotionPrizePublic {
  const segmentIndices: number[] = [];
  wheelLayout.forEach((id, idx) => {
    if (id === prize.id) segmentIndices.push(idx);
  });
  return {
    id: prize.id,
    tier: prize.tier,
    prizeType: prize.prizeType,
    label: prize.label,
    shortLabel: prize.shortLabel,
    description: prize.description,
    imageUrl: prize.imageUrl,
    segmentIndices,
  };
}

export function toCampaignPublic(
  campaign: PromotionCampaign & { prizes: PromotionPrize[] },
): PromotionCampaignPublic {
  const wheelLayout = parseWheelLayout(campaign.wheelLayout);
  return {
    id: campaign.id,
    slug: campaign.slug,
    name: campaign.name,
    description: campaign.description,
    termsMarkdown: campaign.termsMarkdown,
    status: campaign.status,
    startAt: campaign.startAt.toISOString(),
    endAt: campaign.endAt.toISOString(),
    maxSpinsPerAccount: campaign.maxSpinsPerAccount,
    maxSpinsPerDay: campaign.maxSpinsPerDay,
    spinDurationMs: campaign.spinDurationMs,
    wheelLayout,
    prizes: campaign.prizes
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((p) => prizeWithSegments(p, wheelLayout)),
  };
}

export async function getActiveCampaignBySlug(slug: string) {
  const campaign = await prisma.promotionCampaign.findUnique({
    where: { slug },
    include: { prizes: { orderBy: { sortOrder: "asc" } } },
  });
  return campaign;
}

export async function getDefaultCampaign() {
  return getActiveCampaignBySlug(DEFAULT_PROMOTION_SLUG);
}

export function isCampaignLive(
  campaign: Pick<PromotionCampaign, "status" | "startAt" | "endAt">,
  now = new Date(),
): boolean {
  if (campaign.status !== "ACTIVE") return false;
  return now >= campaign.startAt && now <= campaign.endAt;
}

export type WinnerBoardItem = {
  id: string;
  displayName: string;
  prizeLabel: string;
  prizeTier: PromotionPrize["tier"];
  wonAt: string;
};

export async function listRecentWinners(
  campaignId: string,
  limit = 20,
): Promise<WinnerBoardItem[]> {
  const wins = await prisma.promotionWin.findMany({
    where: {
      campaignId,
      prize: { prizeType: { not: "EMPTY" } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { prize: { select: { label: true, tier: true } } },
  });

  return wins.map((w) => ({
    id: w.id,
    displayName: w.displayName,
    prizeLabel: w.prize.label,
    prizeTier: w.prize.tier,
    wonAt: w.createdAt.toISOString(),
  }));
}

export type ParticipantState = {
  participantId: string;
  noxhEligible: boolean;
  noxhEligibleAt: string | null;
  shareBonusGranted: boolean;
  hasWon: boolean;
  win: {
    prizeLabel: string;
    prizeTier: PromotionPrize["tier"];
    redemptionCode: string;
    fulfillmentStatus: PromotionFulfillmentStatus;
  } | null;
  spinsUsedTotal: number;
  spinsUsedToday: number;
  spinsRemaining: number;
  canSpin: boolean;
  blockReason: string | null;
};

export async function getParticipantState(
  campaignId: string,
  customerId: string,
  userAccountId: string,
  limits: { maxSpinsPerAccount: number; maxSpinsPerDay: number },
): Promise<ParticipantState> {
  const participant = await prisma.promotionParticipant.findUnique({
    where: { campaignId_customerId: { campaignId, customerId } },
    include: {
      win: {
        include: { prize: { select: { label: true, tier: true } } },
      },
    },
  });

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [spinsUsedTotal, spinsUsedToday] = await Promise.all([
    prisma.promotionSpin.count({
      where: { campaignId, customerId, isPreview: false },
    }),
    prisma.promotionSpin.count({
      where: {
        campaignId,
        customerId,
        isPreview: false,
        createdAt: { gte: startOfDay },
      },
    }),
  ]);

  const bonusSpins = participant?.shareBonusGranted ? 1 : 0;
  const maxAllowed = limits.maxSpinsPerAccount + bonusSpins;
  const spinsRemaining = Math.max(0, maxAllowed - spinsUsedTotal);
  const dailyRemaining = Math.max(0, limits.maxSpinsPerDay - spinsUsedToday);
  const hasWon = Boolean(participant?.win);

  let canSpin = false;
  let blockReason: string | null = null;

  if (hasWon) {
    blockReason = "Bạn đã trúng phần quà của chương trình.";
  } else if (!participant?.noxhEligibleAt) {
    blockReason = "Vui lòng hoàn thành kiểm tra điều kiện NOXH (kết quả Đủ điều kiện).";
  } else if (spinsRemaining <= 0) {
    blockReason = "Bạn đã dùng hết lượt quay của chương trình.";
  } else if (dailyRemaining <= 0) {
    blockReason = "Bạn đã dùng hết 3 lượt quay hôm nay. Quay lại vào ngày mai.";
  } else {
    canSpin = true;
  }

  return {
    participantId: participant?.id ?? "",
    noxhEligible: Boolean(participant?.noxhEligibleAt),
    noxhEligibleAt: participant?.noxhEligibleAt?.toISOString() ?? null,
    shareBonusGranted: participant?.shareBonusGranted ?? false,
    hasWon,
    win: participant?.win
      ? {
          prizeLabel: participant.win.prize.label,
          prizeTier: participant.win.prize.tier,
          redemptionCode: participant.win.redemptionCode,
          fulfillmentStatus: participant.win.fulfillmentStatus,
        }
      : null,
    spinsUsedTotal,
    spinsUsedToday,
    spinsRemaining: hasWon ? 0 : Math.min(spinsRemaining, dailyRemaining),
    canSpin,
    blockReason,
  };
}

export async function ensureParticipant(
  campaignId: string,
  customerId: string,
  userAccountId: string,
) {
  return prisma.promotionParticipant.upsert({
    where: { campaignId_customerId: { campaignId, customerId } },
    create: { campaignId, customerId, userAccountId },
    update: {},
  });
}
