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
};

export async function executePromotionSpin(input: {
  campaignSlug: string;
  customerId: string;
  userAccountId: string;
  userName: string;
  userEmail: string;
  ipHash?: string;
  isPreview?: boolean;
}): Promise<SpinResult> {
  const campaign = await prisma.promotionCampaign.findUnique({
    where: { slug: input.campaignSlug },
    include: { prizes: true },
  });

  if (!campaign) {
    throw new PromotionSpinError("NOT_FOUND", "Không tìm thấy chương trình.", 404);
  }

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

  const redemptionCode = isRealWin ? generateRedemptionCode() : null;
  const displayName = maskWinnerDisplayName(input.userName);

  const result = await prisma.$transaction(async (tx) => {
    if (isRealWin && prize.totalQty > 0) {
      const updated = await tx.promotionPrize.updateMany({
        where: { id: prize.id, remainingQty: { gt: 0 } },
        data: { remainingQty: { decrement: 1 } },
      });
      if (updated.count === 0) {
        const fallback = campaign.prizes.find((p) => p.prizeType === "EMPTY");
        if (!fallback) throw new PromotionSpinError("OUT_OF_STOCK", "Quà đã hết.");
        return executeFallbackSpin(tx, {
          campaign,
          participant,
          customerId: input.customerId,
          wheelLayout,
          fallback,
          ipHash: input.ipHash,
          isPreview: false,
        });
      }
    }

    const spin = await tx.promotionSpin.create({
      data: {
        campaignId: campaign.id,
        customerId: input.customerId,
        participantId: participant.id,
        prizeId: prize.id,
        segmentIndex,
        isPreview: false,
        ipHash: input.ipHash,
      },
    });

    let winRecord = null;
    if (isRealWin && redemptionCode) {
      winRecord = await tx.promotionWin.create({
        data: {
          campaignId: campaign.id,
          customerId: input.customerId,
          participantId: participant.id,
          prizeId: prize.id,
          spinId: spin.id,
          redemptionCode,
          displayName,
        },
      });

      await enqueueEvent(
        tx,
        "promotion.spin_won",
        {
          campaignSlug: campaign.slug,
          campaignName: campaign.name,
          spinId: spin.id,
          winId: winRecord.id,
          prizeTier: prize.tier,
          prizeLabel: prize.label,
          prizeType: prize.prizeType,
          redemptionCode,
          displayName,
          normalizedPhoneHash: input.ipHash ?? "unknown",
          wonAt: new Date().toISOString(),
        },
        `promotion.spin_won:${winRecord.id}`,
      );
    }

    return { spin, winRecord, prize, segmentIndex };
  });

  if (result.winRecord) {
    await sendPromotionWinEmail({
      to: input.userEmail,
      name: input.userName,
      prizeLabel: result.prize.label,
      redemptionCode: result.winRecord.redemptionCode,
      campaignName: campaign.name,
    });
  }

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
