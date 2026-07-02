/**
 * P2 — Quality & Ranking (ADR-006). Toàn bộ hàm ở đây là PURE (deterministic,
 * không chạm DB/clock) để test được và để precompute bằng cron/hook.
 *
 *   rankScore = tierBoost + w·quality + freshness + verifiedBonus + engagement
 *             − penalty(lowQuality)
 *
 * Nguyên tắc: tier trả phí chỉ là MỘT trọng số. PREMIUM được boost nhưng tin
 * chất lượng thấp vẫn bị phạt → tiền không mua được top nếu nội dung rác.
 */

export type ListingTier = "FREE" | "VIP" | "PREMIUM";

export const QUALITY_WEIGHTS = {
  photosMax: 40, // 10 ảnh = trần điểm ảnh
  photosCap: 10,
  video: 20,
  descMax: 20,
  descCap: 300, // ký tự để đạt trần điểm mô tả
  verified: 10,
  structured: 5, // gắn dự án (có structured data)
  geo: 5, // có toạ độ
} as const;

export interface QualityInput {
  photoCount: number;
  hasVideo: boolean;
  descriptionLength: number;
  verified: boolean;
  hasProject: boolean;
  hasGeo: boolean;
}

/** Điểm chất lượng 0–100. */
export function computeQualityScore(i: QualityInput): number {
  const w = QUALITY_WEIGHTS;
  let s = 0;
  s += (Math.min(i.photoCount, w.photosCap) / w.photosCap) * w.photosMax;
  s += i.hasVideo ? w.video : 0;
  s += (Math.min(i.descriptionLength, w.descCap) / w.descCap) * w.descMax;
  s += i.verified ? w.verified : 0;
  s += i.hasProject ? w.structured : 0;
  s += i.hasGeo ? w.geo : 0;
  return Math.round(Math.max(0, Math.min(100, s)));
}

export const RANK_WEIGHTS = {
  tierBoost: { FREE: 0, VIP: 15, PREMIUM: 30 } as Record<ListingTier, number>,
  qualityWeight: 0.4, // quality(0..100) → 0..40
  freshnessMax: 20,
  freshnessHalfLifeDays: 14,
  verifiedBonus: 10,
  engagementPerLead: 0.5,
  engagementCap: 10,
  lowQualityThreshold: 40,
  lowQualityPenalty: 15,
} as const;

export interface RankInput {
  tier: ListingTier;
  qualityScore: number;
  verified: boolean;
  ageDays: number; // tuổi tin tính bằng ngày (>= 0)
  leadCount: number;
}

/** Điểm xếp hạng feed/search (càng cao càng ưu tiên). */
export function computeRankScore(i: RankInput): number {
  const w = RANK_WEIGHTS;
  const freshness =
    w.freshnessMax *
    Math.exp((-Math.max(0, i.ageDays) * Math.LN2) / w.freshnessHalfLifeDays);
  const engagement = Math.min(
    i.leadCount * w.engagementPerLead,
    w.engagementCap,
  );
  const penalty =
    i.qualityScore < w.lowQualityThreshold ? w.lowQualityPenalty : 0;

  const score =
    w.tierBoost[i.tier] +
    i.qualityScore * w.qualityWeight +
    freshness +
    (i.verified ? w.verifiedBonus : 0) +
    engagement -
    penalty;

  return Math.round(Math.max(0, score) * 100) / 100;
}

export function ageInDays(createdAt: Date, now: Date = new Date()): number {
  return Math.max(0, (now.getTime() - createdAt.getTime()) / 86_400_000);
}
