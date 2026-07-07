import type { PrismaClient } from "@prisma/client";
import { DEFAULT_PROMOTION_SLUG, PROMOTION_LIMITS } from "@/lib/promotion/constants";
import {
  PROMOTION_TERMS_VERSION,
  buildPromotionTermsMarkdown,
} from "@/lib/content/promotion-terms";

export async function seedPromotionCampaign(prisma: PrismaClient) {
  const startAt = new Date();
  const endAt = new Date(startAt);
  endAt.setMonth(endAt.getMonth() + 6);

  const campaignName = "Khai xuân HouseX 2026";
  const termsMarkdown = buildPromotionTermsMarkdown({
    campaignName,
    startAt,
    endAt,
    maxSpinsPerAccount: PROMOTION_LIMITS.maxSpinsPerAccount,
    maxSpinsPerDay: PROMOTION_LIMITS.maxSpinsPerDay,
  });

  const existing = await prisma.promotionCampaign.findUnique({
    where: { slug: DEFAULT_PROMOTION_SLUG },
    include: { prizes: true },
  });

  if (existing) {
    await prisma.promotionCampaign.update({
      where: { id: existing.id },
      data: {
        termsMarkdown,
        description:
          "Vòng quay may mắn dành cho khách hàng đủ điều kiện mua nhà ở xã hội trên HouseX. Quà tặng có giá trị khi giao dịch trực tiếp qua HouseX.vn.",
      },
    });
    console.log(
      "[seed] promotion terms updated:",
      DEFAULT_PROMOTION_SLUG,
      PROMOTION_TERMS_VERSION,
    );
    return existing;
  }

  const campaign = await prisma.promotionCampaign.create({
    data: {
      slug: DEFAULT_PROMOTION_SLUG,
      name: campaignName,
      description:
        "Vòng quay may mắn dành cho khách hàng đủ điều kiện mua nhà ở xã hội trên HouseX. Quà tặng có giá trị khi giao dịch trực tiếp qua HouseX.vn.",
      termsMarkdown,
      status: "ACTIVE",
      startAt,
      endAt,
      maxSpinsPerAccount: PROMOTION_LIMITS.maxSpinsPerAccount,
      maxSpinsPerDay: PROMOTION_LIMITS.maxSpinsPerDay,
      spinDurationMs: PROMOTION_LIMITS.spinDurationMs,
      wheelLayout: [],
      prizes: {
        create: [
          {
            tier: "SPECIAL",
            prizeType: "PHYSICAL",
            label: "Tủ lạnh",
            shortLabel: "Tủ lạnh",
            description: "Giải đặc biệt — 1 tủ lạnh",
            weightPercent: 1,
            totalQty: 1,
            remainingQty: 1,
            activeFrom: startAt,
            activeUntil: new Date(startAt.getTime() + 14 * 86400000),
            sortOrder: 1,
          },
          {
            tier: "FIRST",
            prizeType: "PHYSICAL",
            label: "Bếp điện từ đôi",
            shortLabel: "Bếp điện từ",
            description: "Giải nhất — bếp điện từ đôi",
            weightPercent: 2,
            totalQty: 3,
            remainingQty: 3,
            activeFrom: startAt,
            activeUntil: new Date(startAt.getTime() + 60 * 86400000),
            sortOrder: 2,
          },
          {
            tier: "SECOND",
            prizeType: "PHYSICAL",
            label: "Nồi chiên không dầu",
            shortLabel: "Nồi chiên",
            description: "Giải nhì — nồi chiên không dầu",
            weightPercent: 15,
            totalQty: 20,
            remainingQty: 20,
            sortOrder: 3,
          },
          {
            tier: "THIRD",
            prizeType: "SERVICE",
            label: "3 gói hỗ trợ hồ sơ NOXH 1:1 (trị giá 1,5 triệu)",
            shortLabel: "Hỗ trợ 1:1",
            description: "Tư vấn hồ sơ NOXH 1:1 miễn phí",
            weightPercent: 80,
            totalQty: 100,
            remainingQty: 100,
            sortOrder: 4,
          },
          {
            tier: "CONSOLATION",
            prizeType: "VOUCHER",
            label: "Voucher 500.000đ khấu trừ khi ký HĐMB",
            shortLabel: "Voucher 500k",
            description: "Voucher khấu trừ trực tiếp hợp đồng",
            weightPercent: 90,
            totalQty: 500,
            remainingQty: 500,
            sortOrder: 5,
          },
          {
            tier: "EMPTY",
            prizeType: "EMPTY",
            label: "Chúc may mắn lần sau",
            shortLabel: "May mắn",
            description: "Không trúng quà lần này",
            weightPercent: 10,
            totalQty: 0,
            remainingQty: 0,
            sortOrder: 6,
          },
        ],
      },
    },
    include: { prizes: true },
  });

  const prizeByShort: Record<string, string> = {};
  for (const p of campaign.prizes) {
    prizeByShort[p.shortLabel] = p.id;
  }

  const layout = [
    prizeByShort["May mắn"],
    prizeByShort["Voucher 500k"],
    prizeByShort["May mắn"],
    prizeByShort["Hỗ trợ 1:1"],
    prizeByShort["Voucher 500k"],
    prizeByShort["Nồi chiên"],
    prizeByShort["May mắn"],
    prizeByShort["Hỗ trợ 1:1"],
    prizeByShort["Voucher 500k"],
    prizeByShort["Bếp điện từ"],
    prizeByShort["Hỗ trợ 1:1"],
    prizeByShort["Tủ lạnh"],
  ].filter(Boolean) as string[];

  await prisma.promotionCampaign.update({
    where: { id: campaign.id },
    data: { wheelLayout: layout },
  });

  console.log("[seed] promotion campaign created:", DEFAULT_PROMOTION_SLUG);
  return campaign;
}
