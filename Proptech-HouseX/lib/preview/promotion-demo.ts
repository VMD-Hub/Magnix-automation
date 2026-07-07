import type { PromotionCampaignPublic, WinnerBoardItem } from "@/lib/data/promotion";
import { DEFAULT_PROMOTION_SLUG, PROMOTION_LIMITS } from "@/lib/promotion/constants";
import { buildPromotionTermsMarkdown } from "@/lib/content/promotion-terms";
import {
  pickWeightedPrize,
  segmentIndexForPrize,
  type PrizeForSpin,
} from "@/lib/promotion/spin-engine";
import type { SpinResult } from "@/lib/promotion/spin-service";

/** ID cố định — demo local, không cần Postgres. */
export const DEMO_PRIZE_IDS = {
  empty: "demo-prize-empty",
  voucher: "demo-prize-voucher",
  support: "demo-prize-support",
  airFryer: "demo-prize-air-fryer",
  cooktop: "demo-prize-cooktop",
  fridge: "demo-prize-fridge",
} as const;

const startAt = new Date("2026-01-01T00:00:00+07:00");
const endAt = new Date("2026-07-01T23:59:59+07:00");

const DEMO_WHEEL_LAYOUT = [
  DEMO_PRIZE_IDS.empty,
  DEMO_PRIZE_IDS.voucher,
  DEMO_PRIZE_IDS.empty,
  DEMO_PRIZE_IDS.support,
  DEMO_PRIZE_IDS.voucher,
  DEMO_PRIZE_IDS.airFryer,
  DEMO_PRIZE_IDS.empty,
  DEMO_PRIZE_IDS.support,
  DEMO_PRIZE_IDS.voucher,
  DEMO_PRIZE_IDS.cooktop,
  DEMO_PRIZE_IDS.support,
  DEMO_PRIZE_IDS.fridge,
];

const DEMO_PRIZES_SPIN: (PrizeForSpin & {
  label: string;
  shortLabel: string;
  tier: string;
  prizeType: string;
})[] = [
  {
    id: DEMO_PRIZE_IDS.fridge,
    tier: "SPECIAL",
    prizeType: "PHYSICAL",
    label: "Tủ lạnh",
    shortLabel: "Tủ lạnh",
    weightPercent: 1,
    remainingQty: 1,
    totalQty: 1,
    activeFrom: null,
    activeUntil: null,
  },
  {
    id: DEMO_PRIZE_IDS.cooktop,
    tier: "FIRST",
    prizeType: "PHYSICAL",
    label: "Bếp điện từ đôi",
    shortLabel: "Bếp điện từ",
    weightPercent: 2,
    remainingQty: 3,
    totalQty: 3,
    activeFrom: null,
    activeUntil: null,
  },
  {
    id: DEMO_PRIZE_IDS.airFryer,
    tier: "SECOND",
    prizeType: "PHYSICAL",
    label: "Nồi chiên không dầu",
    shortLabel: "Nồi chiên",
    weightPercent: 15,
    remainingQty: 20,
    totalQty: 20,
    activeFrom: null,
    activeUntil: null,
  },
  {
    id: DEMO_PRIZE_IDS.support,
    tier: "THIRD",
    prizeType: "SERVICE",
    label: "3 gói hỗ trợ hồ sơ NOXH 1:1 (trị giá 1,5 triệu)",
    shortLabel: "Hỗ trợ 1:1",
    weightPercent: 80,
    remainingQty: 100,
    totalQty: 100,
    activeFrom: null,
    activeUntil: null,
  },
  {
    id: DEMO_PRIZE_IDS.voucher,
    tier: "CONSOLATION",
    prizeType: "VOUCHER",
    label: "Voucher 500.000đ khấu trừ khi ký HĐMB",
    shortLabel: "Voucher 500k",
    weightPercent: 90,
    remainingQty: 500,
    totalQty: 500,
    activeFrom: null,
    activeUntil: null,
  },
  {
    id: DEMO_PRIZE_IDS.empty,
    tier: "EMPTY",
    prizeType: "EMPTY",
    label: "Chúc may mắn lần sau",
    shortLabel: "May mắn",
    weightPercent: 10,
    remainingQty: 0,
    totalQty: 0,
    activeFrom: null,
    activeUntil: null,
  },
];

export function getDemoPromotionCampaignPublic(): PromotionCampaignPublic {
  const prizes = DEMO_PRIZES_SPIN.map((p) => {
    const segmentIndices: number[] = [];
    DEMO_WHEEL_LAYOUT.forEach((id, idx) => {
      if (id === p.id) segmentIndices.push(idx);
    });
    return {
      id: p.id,
      tier: p.tier as PromotionCampaignPublic["prizes"][0]["tier"],
      prizeType: p.prizeType as PromotionCampaignPublic["prizes"][0]["prizeType"],
      label: p.label,
      shortLabel: p.shortLabel,
      description: null,
      imageUrl: null,
      segmentIndices,
    };
  });

  return {
    id: "demo-campaign",
    slug: DEFAULT_PROMOTION_SLUG,
    name: "Khai xuân HouseX 2026",
    description:
      "Vòng quay may mắn dành cho khách hàng đủ điều kiện mua nhà ở xã hội trên HouseX. Quà tặng có giá trị khi giao dịch trực tiếp qua HouseX.vn.",
    termsMarkdown: buildPromotionTermsMarkdown({
      campaignName: "Khai xuân HouseX 2026",
      startAt,
      endAt,
    }),
    status: "ACTIVE",
    startAt: startAt.toISOString(),
    endAt: endAt.toISOString(),
    maxSpinsPerAccount: PROMOTION_LIMITS.maxSpinsPerAccount,
    maxSpinsPerDay: PROMOTION_LIMITS.maxSpinsPerDay,
    spinDurationMs: PROMOTION_LIMITS.spinDurationMs,
    wheelLayout: [...DEMO_WHEEL_LAYOUT],
    prizes,
  };
}

export function getDemoPromotionWinners(): WinnerBoardItem[] {
  return [
    {
      id: "demo-win-1",
      displayName: "Nguyễn V***",
      prizeLabel: "Voucher 500.000đ khấu trừ khi ký HĐMB",
      prizeTier: "CONSOLATION",
      wonAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "demo-win-2",
      displayName: "Trần T***",
      prizeLabel: "3 gói hỗ trợ hồ sơ NOXH 1:1 (trị giá 1,5 triệu)",
      prizeTier: "THIRD",
      wonAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ];
}

export function executeDemoPromotionSpin(isPreview: boolean): SpinResult {
  const now = new Date();
  const picked = pickWeightedPrize(DEMO_PRIZES_SPIN, now);
  const empty = DEMO_PRIZES_SPIN.find((p) => p.prizeType === "EMPTY")!;
  const prize = picked ?? empty;
  const segmentIndex = segmentIndexForPrize(DEMO_WHEEL_LAYOUT, prize.id);
  const isRealWin = prize.prizeType !== "EMPTY";

  return {
    spinId: isPreview ? "preview" : "demo-spin",
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

export function isPrismaConnectionError(err: unknown): boolean {
  if (err && typeof err === "object" && "code" in err) {
    const code = String((err as { code: string }).code);
    if (code === "P1001" || code === "P1017") return true;
  }
  if (err instanceof Error) {
    return (
      err.message.includes("Can't reach database server") ||
      err.message.includes("P1001") ||
      err.message.includes("ECONNREFUSED") ||
      err.message.includes("Connection terminated")
    );
  }
  return false;
}
