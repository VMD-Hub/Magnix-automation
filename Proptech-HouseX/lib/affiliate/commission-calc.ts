/**
 * Affiliate SoT — hoa hồng % × giá HĐMB × dealTier (+ thưởng thăm DA).
 * @see docs/ops/AFFILIATE_NOXH_PROGRAM_OPS.md §1.3
 */

export type AffiliateDealTierCode =
  | "CONNECTOR"
  | "CONSULTANT"
  | "DEVELOPER_PARTNER"
  | "MASTER_BROKER";

/** % hoa hồng theo cấp deal (nội bộ — không public). */
export const DEAL_TIER_COMMISSION_RATE: Record<AffiliateDealTierCode, number> =
  {
    CONNECTOR: 0.005,
    CONSULTANT: 0.01,
    DEVELOPER_PARTNER: 0.015,
    MASTER_BROKER: 0.02,
  };

export const SITE_VISIT_BONUS_VND = Number(
  process.env.AFFILIATE_SITE_VISIT_BONUS_VND ?? "500000",
);

const TIER_ALIASES: Record<string, AffiliateDealTierCode> = {
  CONNECTOR: "CONNECTOR",
  CONSULTANT: "CONSULTANT",
  DEVELOPER_PARTNER: "DEVELOPER_PARTNER",
  MASTER_BROKER: "MASTER_BROKER",
  "1": "CONNECTOR",
  "2": "CONSULTANT",
  "3": "DEVELOPER_PARTNER",
  "4": "MASTER_BROKER",
};

export function parseAffiliateDealTier(
  raw: string | number | null | undefined,
): AffiliateDealTierCode | null {
  if (raw === null || raw === undefined) return null;
  const key = String(raw).trim().toUpperCase();
  return TIER_ALIASES[key] ?? null;
}

export type AffiliateCommissionInput = {
  dealTier: AffiliateDealTierCode;
  /** Giá căn HĐMB chưa VAT, không KTBT 2% — Ops nhập sau ký. */
  hdmbBaseAmount: number;
  siteVisitBonusVerified?: boolean;
};

export type AffiliateCommissionBreakdown = {
  rate: number;
  baseCommission: number;
  siteVisitBonus: number;
  totalAmount: number;
};

/**
 * Tính HH sau khi có HĐMB + giá base. Không gọi khi chưa có hdmbBaseAmount.
 */
export function computeAffiliateCommission(
  input: AffiliateCommissionInput,
): AffiliateCommissionBreakdown {
  if (!(input.hdmbBaseAmount > 0)) {
    throw new Error("HDMB_BASE_REQUIRED");
  }
  const rate = DEAL_TIER_COMMISSION_RATE[input.dealTier];
  const baseCommission = Math.round(input.hdmbBaseAmount * rate);
  const siteVisitBonus = input.siteVisitBonusVerified
    ? SITE_VISIT_BONUS_VND
    : 0;
  return {
    rate,
    baseCommission,
    siteVisitBonus,
    totalAmount: baseCommission + siteVisitBonus,
  };
}
