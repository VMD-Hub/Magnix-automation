/**
 * Kỳ chi hoa hồng NOXH — ngày 05 và 20 hàng tháng.
 * eligibleDate = signedAt + settlementDays (mặc định 14 ngày chờ CĐT).
 */

export const CDT_SETTLEMENT_DAYS = Number(
  process.env.CDT_SETTLEMENT_DAYS ?? "14",
);

export const PAY_BATCH_DAYS = [5, 20] as const;

/** Ngày chi trả đầu tiên (05 hoặc 20) on or after `date`. */
export function nextPayBatchOnOrAfter(date: Date): Date {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  for (let monthOffset = 0; monthOffset < 4; monthOffset++) {
    const y = start.getFullYear();
    const m = start.getMonth() + monthOffset;
    for (const day of PAY_BATCH_DAYS) {
      const candidate = new Date(y, m, day);
      if (candidate.getTime() >= start.getTime()) {
        return candidate;
      }
    }
  }
  const fallback = new Date(start);
  fallback.setMonth(fallback.getMonth() + 1);
  fallback.setDate(5);
  return fallback;
}

export function computeExpectedPayDate(
  signedAt: Date,
  settlementDays = CDT_SETTLEMENT_DAYS,
): Date {
  const eligible = new Date(signedAt);
  eligible.setDate(eligible.getDate() + settlementDays);
  return nextPayBatchOnOrAfter(eligible);
}

/** Hôm nay có phải ngày chi batch (05 hoặc 20)? */
export function isPayBatchDay(now = new Date()): boolean {
  const d = now.getDate();
  return d === 5 || d === 20;
}
