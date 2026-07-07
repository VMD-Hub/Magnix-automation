import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { enqueueEvent } from "@/lib/events/outbox";
import { maskWinnerDisplayName } from "@/lib/promotion/display-name";
import { generateRedemptionCode } from "@/lib/promotion/redemption-code";
import {
  pickWeightedPrize,
  segmentIndexForPrize,
  type PrizeForSpin,
} from "@/lib/promotion/spin-engine";
import { sendPromotionWinEmail } from "@/lib/email/promotion-mailer";
import {
  ensureParticipant,
  getParticipantState,
  isCampaignLive,
} from "@/lib/data/promotion";
import { PROMOTION_GUEST_LIMITS } from "@/lib/promotion/constants";
import { storePendingClaim, consumePendingClaim } from "@/lib/promotion/pending-claim";
import { isRateLimited } from "@/lib/redis";
import { PROMOTION_CLAIM_REQUIREMENTS } from "@/lib/promotion/scope";

export class PromotionSpinError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 422,
  ) {
    super(message);
  }
}

function parseWheelLayout(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string");
}

async function assertCanSpin(
  campaignId: string,
  customerId: string,
  userAccountId: string,
  limits: { maxSpinsPerAccount: number; maxSpinsPerDay: number },
) {
  const state = await getParticipantState(
    campaignId,
    customerId,
    userAccountId,
    limits,
  );
  if (!state.canSpin) {
    throw new PromotionSpinError(
      "CANNOT_SPIN",
      state.blockReason ?? "Không thể quay lúc này.",
    );
  }
  return state;
}

export type SpinResult = {
  spinId: string;
  segmentIndex: number;
  prize: {
    id: string;
    tier: string;
    prizeType: string;
    label: string;
    shortLabel: string;
  };
  won: boolean;
  redemptionCode: string | null;
  spinsRemaining: number;
  claimToken?: string | null;
  requiresClaim?: boolean;
};

async function loadCampaignForSpin(slug: string) {
  const campaign = await prisma.promotionCampaign.findUnique({
    where: { slug },
    include: { prizes: true },
  });
  if (!campaign) {
    throw new PromotionSpinError("NOT_FOUND", "Không tìm thấy chương trình.", 404);
  }
  return campaign;
}

function pickSpinPrize(campaign: Awaited<ReturnType<typeof loadCampaignForSpin>>) {
  const wheelLayout = parseWheelLayout(campaign.wheelLayout);
  const now = new Date();
  const picked = pickWeightedPrize(campaign.prizes as PrizeForSpin[], now);
  const emptyPrize = campaign.prizes.find((p) => p.prizeType === "EMPTY") ?? picked;
  const prize = picked ?? emptyPrize;
  if (!prize) {
    throw new PromotionSpinError(
      "NO_PRIZES",
      "Chương trình chưa cấu hình quà tặng.",
    );
  }
  const segmentIndex = segmentIndexForPrize(wheelLayout, prize.id);
  const isRealWin = prize.prizeType !== "EMPTY";
  return { wheelLayout, prize, segmentIndex, isRealWin };
}

async function commitPrizeSpin(input: {
  campaign: Awaited<ReturnType<typeof loadCampaignForSpin>>;
  participant: { id: string };
  customerId: string;
  userName: string;
  userEmail: string;
  prize: PrizeForSpin & { label: string; shortLabel: string; tier: string; prizeType: string };
  segmentIndex: number;
  wheelLayout: string[];
  ipHash?: string;
}) {
  const isRealWin = input.prize.prizeType !== "EMPTY";
  const redemptionCode = isRealWin ? generateRedemptionCode() : null;
  const displayName = maskWinnerDisplayName(input.userName);

  const result = await prisma.$transaction(async (tx) => {
    if (isRealWin && input.prize.totalQty > 0) {
      const updated = await tx.promotionPrize.updateMany({
        where: { id: input.prize.id, remainingQty: { gt: 0 } },
        data: { remainingQty: { decrement: 1 } },
      });
      if (updated.count === 0) {
        const fallback = input.campaign.prizes.find((p) => p.prizeType === "EMPTY");
        if (!fallback) throw new PromotionSpinError("OUT_OF_STOCK", "Quà đã hết.");
        return executeFallbackSpin(tx, {
          campaign: input.campaign,
          participant: input.participant,
          customerId: input.customerId,
          wheelLayout: input.wheelLayout,
          fallback,
          ipHash: input.ipHash,
          isPreview: false,
        });
      }
    }

    const spin = await tx.promotionSpin.create({
      data: {
        campaignId: input.campaign.id,
        customerId: input.customerId,
        participantId: input.participant.id,
        prizeId: input.prize.id,
        segmentIndex: input.segmentIndex,
        isPreview: false,
        ipHash: input.ipHash,
      },
    });

    let winRecord = null;
    if (isRealWin && redemptionCode) {
      winRecord = await tx.promotionWin.create({
        data: {
          campaignId: input.campaign.id,
          customerId: input.customerId,
          participantId: input.participant.id,
          prizeId: input.prize.id,
          spinId: spin.id,
          redemptionCode,
          displayName,
        },
      });

      await enqueueEvent(
        tx,
        "promotion.spin_won",
        {
          campaignSlug: input.campaign.slug,
          campaignName: input.campaign.name,
          spinId: spin.id,
          winId: winRecord.id,
          prizeTier: input.prize.tier,
          prizeLabel: input.prize.label,
          prizeType: input.prize.prizeType,
          redemptionCode,
          displayName,
          normalizedPhoneHash: input.ipHash ?? "unknown",
          wonAt: new Date().toISOString(),
        },
        `promotion.spin_won:${winRecord.id}`,
      );
    }

    return { spin, winRecord, prize: input.prize, segmentIndex: input.segmentIndex };
  });

  if (result.winRecord) {
    await sendPromotionWinEmail({
      to: input.userEmail,
      name: input.userName,
      prizeLabel: result.prize.label,
      redemptionCode: result.winRecord.redemptionCode,
      campaignName: input.campaign.name,
    });
  }

  return { result, isRealWin, redemptionCode };
}

export async function executePromotionSpin(input: {
  campaignSlug: string;
  customerId: string;
  userAccountId: string;
  userName: string;
  userEmail: string;
  ipHash?: string;
  isPreview?: boolean;
}): Promise<SpinResult> {
  const campaign = await loadCampaignForSpin(input.campaignSlug);
  const { wheelLayout, prize, segmentIndex, isRealWin } = pickSpinPrize(campaign);

  if (input.isPreview) {
    return {
      spinId: "preview",
      segmentIndex,
      prize: {
        id: prize.id,
        tier: prize.tier,
        prizeType: prize.prizeType,
        label: prize.label,
        shortLabel: prize.shortLabel,
      },
      won: isRealWin,
      redemptionCode: isRealWin ? "HX-PREVIEW" : null,
      spinsRemaining: 3,
    };
  }

  if (!isCampaignLive(campaign)) {
    throw new PromotionSpinError(
      "CAMPAIGN_INACTIVE",
      "Chương trình khuyến mãi đã tạm kết thúc hoặc chưa mở.",
    );
  }

  const limits = {
    maxSpinsPerAccount: campaign.maxSpinsPerAccount,
    maxSpinsPerDay: campaign.maxSpinsPerDay,
  };

  await assertCanSpin(
    campaign.id,
    input.customerId,
    input.userAccountId,
    limits,
  );

  const participant = await ensureParticipant(
    campaign.id,
    input.customerId,
    input.userAccountId,
  );

  if (!participant.noxhEligibleAt) {
    throw new PromotionSpinError(
      "NOXH_REQUIRED",
      "Vui lòng hoàn thành kiểm tra điều kiện NOXH (kết quả Đủ điều kiện).",
    );
  }

  const { result, isRealWin: won, redemptionCode } = await commitPrizeSpin({
    campaign,
    participant,
    customerId: input.customerId,
    userName: input.userName,
    userEmail: input.userEmail,
    prize,
    segmentIndex,
    wheelLayout,
    ipHash: input.ipHash,
  });

  const state = await getParticipantState(
    campaign.id,
    input.customerId,
    input.userAccountId,
    limits,
  );

  return {
    spinId: result.spin.id,
    segmentIndex: result.segmentIndex,
    prize: {
      id: result.prize.id,
      tier: result.prize.tier,
      prizeType: result.prize.prizeType,
      label: result.prize.label,
      shortLabel: result.prize.shortLabel,
    },
    won,
    redemptionCode,
    spinsRemaining: state.spinsRemaining,
    requiresClaim: false,
  };
}

/** Khách chưa đủ điều kiện lưu — quay server-side, giữ kết quả tạm đến khi claim. */
export async function executeGuestPromotionSpin(input: {
  campaignSlug: string;
  ipHash: string;
}): Promise<SpinResult> {
  const dayKey = new Date().toISOString().slice(0, 10);
  if (
    await isRateLimited(
      `promo:guest:${input.ipHash}:${dayKey}`,
      PROMOTION_GUEST_LIMITS.maxSpinsPerDay,
      86400,
    )
  ) {
    throw new PromotionSpinError(
      "GUEST_LIMIT",
      "Bạn đã dùng hết lượt quay thử hôm nay. Đăng nhập và đủ điều kiện NOXH để tiếp tục.",
      429,
    );
  }

  const campaign = await loadCampaignForSpin(input.campaignSlug);
  if (!isCampaignLive(campaign)) {
    throw new PromotionSpinError(
      "CAMPAIGN_INACTIVE",
      "Chương trình khuyến mãi đã tạm kết thúc hoặc chưa mở.",
    );
  }

  const { prize, segmentIndex, isRealWin } = pickSpinPrize(campaign);
  let claimToken: string | null = null;

  if (isRealWin) {
    claimToken = await storePendingClaim({
      campaignSlug: input.campaignSlug,
      prizeId: prize.id,
      segmentIndex,
      won: true,
      ipHash: input.ipHash,
      createdAt: new Date().toISOString(),
    });
  }

  return {
    spinId: "guest",
    segmentIndex,
    prize: {
      id: prize.id,
      tier: prize.tier,
      prizeType: prize.prizeType,
      label: prize.label,
      shortLabel: prize.shortLabel,
    },
    won: isRealWin,
    redemptionCode: null,
    spinsRemaining: 0,
    claimToken,
    requiresClaim: isRealWin,
  };
}

export async function claimPendingPromotionSpin(input: {
  claimToken: string;
  customerId: string;
  userAccountId: string;
  userName: string;
  userEmail: string;
  ipHash?: string;
}): Promise<SpinResult> {
  const pending = await consumePendingClaim(input.claimToken);
  if (!pending || !pending.won) {
    throw new PromotionSpinError(
      "CLAIM_EXPIRED",
      "Kết quả đã hết hạn hoặc không hợp lệ. Vui lòng quay lại.",
      410,
    );
  }

  const campaign = await loadCampaignForSpin(pending.campaignSlug);
  if (!isCampaignLive(campaign)) {
    throw new PromotionSpinError(
      "CAMPAIGN_INACTIVE",
      "Chương trình khuyến mãi đã tạm kết thúc hoặc chưa mở.",
    );
  }

  const limits = {
    maxSpinsPerAccount: campaign.maxSpinsPerAccount,
    maxSpinsPerDay: campaign.maxSpinsPerDay,
  };

  await assertCanSpin(campaign.id, input.customerId, input.userAccountId, limits);

  const participant = await ensureParticipant(
    campaign.id,
    input.customerId,
    input.userAccountId,
  );

  if (!participant.noxhEligibleAt) {
    throw new PromotionSpinError("NOXH_REQUIRED", PROMOTION_CLAIM_REQUIREMENTS, 403);
  }

  const prize = campaign.prizes.find((p) => p.id === pending.prizeId);
  if (!prize) {
    throw new PromotionSpinError("CLAIM_INVALID", "Phần quà không còn hợp lệ.", 410);
  }

  const wheelLayout = parseWheelLayout(campaign.wheelLayout);
  const segmentIndex =
    pending.segmentIndex >= 0
      ? pending.segmentIndex
      : segmentIndexForPrize(wheelLayout, prize.id);

  const { result, isRealWin, redemptionCode } = await commitPrizeSpin({
    campaign,
    participant,
    customerId: input.customerId,
    userName: input.userName,
    userEmail: input.userEmail,
    prize,
    segmentIndex,
    wheelLayout,
    ipHash: input.ipHash ?? pending.ipHash,
  });

  const state = await getParticipantState(
    campaign.id,
    input.customerId,
    input.userAccountId,
    limits,
  );

  return {
    spinId: result.spin.id,
    segmentIndex: result.segmentIndex,
    prize: {
      id: result.prize.id,
      tier: result.prize.tier,
      prizeType: result.prize.prizeType,
      label: result.prize.label,
      shortLabel: result.prize.shortLabel,
    },
    won: isRealWin,
    redemptionCode,
    spinsRemaining: state.spinsRemaining,
    requiresClaim: false,
  };
}

async function executeFallbackSpin(
  tx: Prisma.TransactionClient,
  input: {
    campaign: { id: string; slug: string; name: string };
    participant: { id: string };
    customerId: string;
    wheelLayout: string[];
    fallback: PrizeForSpin & { label: string; shortLabel: string; tier: string; prizeType: string };
    ipHash?: string;
    isPreview: boolean;
  },
) {
  const segmentIndex = segmentIndexForPrize(input.wheelLayout, input.fallback.id);
  const spin = await tx.promotionSpin.create({
    data: {
      campaignId: input.campaign.id,
      customerId: input.customerId,
      participantId: input.participant.id,
      prizeId: input.fallback.id,
      segmentIndex,
      isPreview: input.isPreview,
      ipHash: input.ipHash,
    },
  });
  return {
    spin,
    winRecord: null,
    prize: input.fallback,
    segmentIndex,
  };
}

export async function recordNoxhEligibility(input: {
  campaignSlug: string;
  customerId: string;
  userAccountId: string;
}) {
  const campaign = await prisma.promotionCampaign.findUnique({
    where: { slug: input.campaignSlug },
    select: { id: true },
  });
  if (!campaign) {
    throw new PromotionSpinError("NOT_FOUND", "Không tìm thấy chương trình.", 404);
  }

  const participant = await ensureParticipant(
    campaign.id,
    input.customerId,
    input.userAccountId,
  );

  if (participant.noxhEligibleAt) {
    return { alreadyRecorded: true, eligibleAt: participant.noxhEligibleAt.toISOString() };
  }

  const updated = await prisma.promotionParticipant.update({
    where: { id: participant.id },
    data: { noxhEligibleAt: new Date() },
  });

  return { alreadyRecorded: false, eligibleAt: updated.noxhEligibleAt!.toISOString() };
}

export async function grantShareBonus(input: {
  campaignSlug: string;
  customerId: string;
  userAccountId: string;
}) {
  const campaign = await prisma.promotionCampaign.findUnique({
    where: { slug: input.campaignSlug },
    select: { id: true, maxSpinsPerAccount: true, maxSpinsPerDay: true },
  });
  if (!campaign) {
    throw new PromotionSpinError("NOT_FOUND", "Không tìm thấy chương trình.", 404);
  }

  const participant = await ensureParticipant(
    campaign.id,
    input.customerId,
    input.userAccountId,
  );

  if (participant.shareBonusGranted) {
    return { granted: false, message: "Bạn đã nhận lượt quay bonus chia sẻ." };
  }

  await prisma.promotionParticipant.update({
    where: { id: participant.id },
    data: { shareBonusGranted: true },
  });

  const state = await getParticipantState(
    campaign.id,
    input.customerId,
    input.userAccountId,
    {
      maxSpinsPerAccount: campaign.maxSpinsPerAccount,
      maxSpinsPerDay: campaign.maxSpinsPerDay,
    },
  );

  return { granted: true, spinsRemaining: state.spinsRemaining };
}
