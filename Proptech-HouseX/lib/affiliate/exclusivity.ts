/**
 * Affiliate SoT — độc quyền lead 60 / 30 / +15 (calendar days).
 * Thay cửa sổ ~20 ngày LV — không chạy song song.
 * @see docs/ops/AFFILIATE_NOXH_PROGRAM_OPS.md §5
 */

/** Trần độc quyền khi còn chăm sóc có bằng chứng. */
export const EXCLUSIVE_MAX_CALENDAR_DAYS = Number(
  process.env.AFFILIATE_EXCLUSIVE_MAX_DAYS ?? "60",
);

/** Im lặng không CS hợp lệ → nhả sớm. */
export const SILENT_RELEASE_CALENDAR_DAYS = Number(
  process.env.AFFILIATE_SILENT_RELEASE_DAYS ?? "30",
);

/** Gia hạn xin Admin — tối đa một lần +15. */
export const EXTEND_MAX_CALENDAR_DAYS = Number(
  process.env.AFFILIATE_EXTEND_MAX_DAYS ?? "15",
);

/** Cảnh báo sắp hết trần / sắp im (calendar days). */
export const EXCLUSIVE_WARNING_CALENDAR_DAYS = Number(
  process.env.AFFILIATE_EXCLUSIVE_WARNING_DAYS ?? "5",
);

export function addCalendarDays(start: Date, days: number): Date {
  const result = new Date(start);
  result.setDate(result.getDate() + days);
  return result;
}

export function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Số ngày dương lịch từ `from` (exclusive) đến `to` (inclusive), tối thiểu 0. */
export function calendarDaysBetween(from: Date, to: Date): number {
  const a = startOfLocalDay(from).getTime();
  const b = startOfLocalDay(to).getTime();
  if (b <= a) return 0;
  return Math.round((b - a) / 86_400_000);
}

export function calendarDaysUntil(deadline: Date, now: Date = new Date()): number {
  return calendarDaysBetween(now, deadline);
}

export function isWithinCalendarDaysWindow(
  from: Date,
  days: number,
  now: Date = new Date(),
): boolean {
  return now <= addCalendarDays(from, days);
}

/** Hết hạn độc quyền mặc định = bắt đầu + 60 ngày. */
export function computeExclusiveExpiry(
  exclusiveStartedAt: Date = new Date(),
): Date {
  return addCalendarDays(exclusiveStartedAt, EXCLUSIVE_MAX_CALENDAR_DAYS);
}

/** +15 từ mốc hết hạn hiện tại (chỉ khi Admin duyệt). */
export function computeExtendedExclusiveExpiry(
  currentExpiry: Date,
  now: Date = new Date(),
): Date {
  const baseline = currentExpiry > now ? currentExpiry : now;
  return addCalendarDays(baseline, EXTEND_MAX_CALENDAR_DAYS);
}

export type ExclusiveClockInput = {
  exclusiveStartedAt: Date;
  lockExpiresAt: Date | null;
  lastValidCareAt: Date | null;
  exclusiveStatus?: string | null;
  /** Đã được Admin duyệt +15 chưa. */
  alreadyExtended?: boolean;
  now?: Date;
};

export type ExclusiveClockResult = {
  exclusiveExpiry: Date;
  daysUntilExclusiveExpiry: number;
  daysSinceValidCare: number;
  isSilentViolation: boolean;
  isExpiredByCeiling: boolean;
  /** Nên nhả: im ≥30 hoặc quá trần 60 (chưa extended / hết extended). */
  shouldRelease: boolean;
  releaseReason: "silent" | "expired" | null;
  /** Gần trần 60 + còn CS hợp lệ → được request +15 (không tự gia hạn). */
  canRequestExtend: boolean;
  needsSilentWarning: boolean;
  needsExpiryWarning: boolean;
};

/**
 * Đánh giá đồng hồ độc quyền SoT.
 * CS hợp lệ cuối = `lastValidCareAt` (fallback: exclusiveStartedAt).
 */
export function evaluateExclusiveClock(
  input: ExclusiveClockInput,
): ExclusiveClockResult {
  const now = input.now ?? new Date();
  const exclusiveExpiry =
    input.lockExpiresAt ?? computeExclusiveExpiry(input.exclusiveStartedAt);
  const careBaseline = input.lastValidCareAt ?? input.exclusiveStartedAt;
  const daysUntilExclusiveExpiry = calendarDaysUntil(exclusiveExpiry, now);
  const daysSinceValidCare = calendarDaysBetween(careBaseline, now);

  const isSilentViolation = daysSinceValidCare >= SILENT_RELEASE_CALENDAR_DAYS;
  const isExpiredByCeiling = now > exclusiveExpiry;

  let shouldRelease = false;
  let releaseReason: "silent" | "expired" | null = null;
  if (isSilentViolation) {
    shouldRelease = true;
    releaseReason = "silent";
  } else if (isExpiredByCeiling) {
    shouldRelease = true;
    releaseReason = "expired";
  }

  const status = input.exclusiveStatus ?? "EXCLUSIVE";
  const activeExclusive =
    status === "EXCLUSIVE" ||
    status === "EXTENDED" ||
    status === "EXTEND_REQUESTED";

  const canRequestExtend =
    activeExclusive &&
    !input.alreadyExtended &&
    status !== "EXTEND_REQUESTED" &&
    !isSilentViolation &&
    daysUntilExclusiveExpiry <= EXCLUSIVE_WARNING_CALENDAR_DAYS &&
    daysUntilExclusiveExpiry >= 0 &&
    daysSinceValidCare < SILENT_RELEASE_CALENDAR_DAYS;

  return {
    exclusiveExpiry,
    daysUntilExclusiveExpiry,
    daysSinceValidCare,
    isSilentViolation,
    isExpiredByCeiling,
    shouldRelease: shouldRelease && activeExclusive,
    releaseReason: shouldRelease && activeExclusive ? releaseReason : null,
    canRequestExtend,
    needsSilentWarning:
      activeExclusive &&
      !isSilentViolation &&
      daysSinceValidCare >=
        SILENT_RELEASE_CALENDAR_DAYS - EXCLUSIVE_WARNING_CALENDAR_DAYS,
    needsExpiryWarning:
      activeExclusive &&
      !isExpiredByCeiling &&
      daysUntilExclusiveExpiry <= EXCLUSIVE_WARNING_CALENDAR_DAYS,
  };
}
