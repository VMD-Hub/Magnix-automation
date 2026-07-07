import type { PromotionPrize } from "@prisma/client";

export type PrizeForSpin = Pick<
  PromotionPrize,
  | "id"
  | "tier"
  | "prizeType"
  | "label"
  | "shortLabel"
  | "weightPercent"
  | "remainingQty"
  | "totalQty"
  | "activeFrom"
  | "activeUntil"
>;

/** Giải còn trong khung thời gian và còn tồn kho (EMPTY = unlimited). */
export function isPrizeActive(prize: PrizeForSpin, now: Date): boolean {
  if (prize.activeFrom && now < prize.activeFrom) return false;
  if (prize.activeUntil && now > prize.activeUntil) return false;
  if (prize.prizeType === "EMPTY") return true;
  if (prize.totalQty <= 0) return true;
  return prize.remainingQty > 0;
}

/** Random có trọng số trong pool active. */
export function pickWeightedPrize(
  prizes: PrizeForSpin[],
  now: Date,
  random = Math.random,
): PrizeForSpin | null {
  const pool = prizes.filter((p) => isPrizeActive(p, now) && p.weightPercent > 0);
  if (pool.length === 0) return null;

  const totalWeight = pool.reduce((sum, p) => sum + p.weightPercent, 0);
  if (totalWeight <= 0) return null;

  let roll = random() * totalWeight;
  for (const prize of pool) {
    roll -= prize.weightPercent;
    if (roll <= 0) return prize;
  }
  return pool[pool.length - 1] ?? null;
}

/** Tìm segment index đầu tiên của prizeId trong wheel layout. */
export function segmentIndexForPrize(
  wheelLayout: string[],
  prizeId: string,
): number {
  const idx = wheelLayout.indexOf(prizeId);
  return idx >= 0 ? idx : 0;
}

/** Góc CSS (deg) để vòng dừng tại segment — 12 ô, pointer ở trên. */
export function spinTargetRotationDeg(
  segmentIndex: number,
  segmentCount: number,
  extraTurns = 5,
): number {
  const segmentAngle = 360 / segmentCount;
  const centerOffset = segmentAngle / 2;
  const target = 360 - (segmentIndex * segmentAngle + centerOffset);
  return extraTurns * 360 + target;
}

/** Tăng góc từ vị trí hiện tại — luôn quay thuận, animation CSS mượt hơn. */
export function spinDeltaDeg(
  currentRotationDeg: number,
  segmentIndex: number,
  segmentCount: number,
  extraTurns = 5,
): number {
  const segmentAngle = 360 / segmentCount;
  const centerOffset = segmentAngle / 2;
  const targetMod =
    (360 - (segmentIndex * segmentAngle + centerOffset) + 360) % 360;
  const currentMod = ((currentRotationDeg % 360) + 360) % 360;
  let diff = targetMod - currentMod;
  if (diff <= 0) diff += 360;
  return extraTurns * 360 + diff;
}
