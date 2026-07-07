import { prisma } from "@/lib/prisma";
import type { promotionCampaignAdminSchema } from "@/lib/validation/promotion-admin";
import type { z } from "zod";

export async function listPromotionsForAdmin() {
  return prisma.promotionCampaign.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      prizes: { orderBy: { sortOrder: "asc" } },
      _count: { select: { wins: true, spins: true } },
    },
  });
}

export async function getPromotionForAdmin(id: string) {
  return prisma.promotionCampaign.findUnique({
    where: { id },
    include: {
      prizes: { orderBy: { sortOrder: "asc" } },
      wins: {
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { prize: { select: { label: true, tier: true } } },
      },
    },
  });
}

type CampaignInput = z.infer<typeof promotionCampaignAdminSchema>;

export async function updatePromotionCampaign(id: string, input: CampaignInput) {
  return prisma.$transaction(async (tx) => {
    const campaign = await tx.promotionCampaign.update({
      where: { id },
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        termsMarkdown: input.termsMarkdown,
        status: input.status,
        startAt: new Date(input.startAt),
        endAt: new Date(input.endAt),
        maxSpinsPerAccount: input.maxSpinsPerAccount,
        maxSpinsPerDay: input.maxSpinsPerDay,
        spinDurationMs: input.spinDurationMs,
        wheelLayout: input.wheelLayout,
      },
    });

    if (input.prizes) {
      for (const prize of input.prizes) {
        if (prize.id) {
          await tx.promotionPrize.update({
            where: { id: prize.id },
            data: {
              tier: prize.tier,
              prizeType: prize.prizeType,
              label: prize.label,
              shortLabel: prize.shortLabel,
              description: prize.description,
              imageUrl: prize.imageUrl,
              weightPercent: prize.weightPercent,
              totalQty: prize.totalQty,
              remainingQty: prize.remainingQty ?? undefined,
              activeFrom: prize.activeFrom ? new Date(prize.activeFrom) : null,
              activeUntil: prize.activeUntil ? new Date(prize.activeUntil) : null,
              sortOrder: prize.sortOrder,
            },
          });
        }
      }
    }

    return campaign;
  });
}

export async function updatePromotionWinFulfillment(
  winId: string,
  status: "PENDING_CONTRACT" | "CONTRACT_SIGNED" | "DELIVERED" | "EXPIRED" | "VOID",
) {
  return prisma.promotionWin.update({
    where: { id: winId },
    data: {
      fulfillmentStatus: status,
      fulfilledAt: status === "DELIVERED" ? new Date() : undefined,
    },
  });
}

export async function updatePromotionTermsMarkdown(id: string, termsMarkdown: string) {
  return prisma.promotionCampaign.update({
    where: { id },
    data: { termsMarkdown },
    select: { id: true, slug: true, termsMarkdown: true, updatedAt: true },
  });
}
