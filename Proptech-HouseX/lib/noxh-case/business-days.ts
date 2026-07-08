/** Ngày làm việc (T2–T6) — dùng cho lock 20 ngày & dormant lead. */

export const CTV_CLAIM_LOCK_BUSINESS_DAYS = Number(
  process.env.CTV_CLAIM_LOCK_BUSINESS_DAYS ?? "20",
);

export const PLATFORM_LEAD_ACTIVE_BUSINESS_DAYS = Number(
  process.env.PLATFORM_LEAD_ACTIVE_BUSINESS_DAYS ?? "20",
);

function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

/** Cộng N ngày làm việc kể từ `start` (không tính ngày start). */
export function addBusinessDays(start: Date, businessDays: number): Date {
  const result = new Date(start);
  let added = 0;
  while (added < businessDays) {
    result.setDate(result.getDate() + 1);
    if (!isWeekend(result)) added += 1;
  }
  return result;
}

/** Trừ N ngày làm việc từ `start`. */
export function subtractBusinessDays(start: Date, businessDays: number): Date {
  const result = new Date(start);
  let removed = 0;
  while (removed < businessDays) {
    result.setDate(result.getDate() - 1);
    if (!isWeekend(result)) removed += 1;
  }
  return result;
}

/** `from` còn trong cửa sổ N ngày làm việc tính đến `now`? */
export function isWithinBusinessDaysWindow(
  from: Date,
  businessDays: number,
  now: Date = new Date(),
): boolean {
  const deadline = addBusinessDays(from, businessDays);
  return now <= deadline;
}
