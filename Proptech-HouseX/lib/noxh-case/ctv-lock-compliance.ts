import {
  addBusinessDays,
  CTV_CLAIM_LOCK_BUSINESS_DAYS,
  subtractBusinessDays,
} from "@/lib/noxh-case/business-days";
import {
  computeExtendedExclusiveExpiry,
  evaluateExclusiveClock,
  SILENT_RELEASE_CALENDAR_DAYS,
} from "@/lib/affiliate/exclusivity";

/** @deprecated Dùng SILENT_RELEASE_CALENDAR_DAYS — giữ alias cho test cũ. */
export const CTV_PROGRESS_INTERVAL_BUSINESS_DAYS = Number(
  process.env.CTV_PROGRESS_INTERVAL_BUSINESS_DAYS ?? "7",
);

/** Cảnh báo trước khi hết lock (ngày làm việc) — UI cũ; SoT dùng calendar. */
export const CTV_LOCK_WARNING_BUSINESS_DAYS = Number(
  process.env.CTV_LOCK_WARNING_BUSINESS_DAYS ?? "3",
);

/** Fallback khi thiếu exclusiveStartedAt: ước ≈ 60 ngày trước expiry. */
const EXCLUSIVE_FALLBACK_MS = 60 * 86_400_000;

export type CtvLockCompliance = {
  hasConsultSchedule: boolean;
  hasRecentProgress: boolean;
  lockExpiresAt: Date | null;
  consultScheduledAt: Date | null;
  /** Ngày làm việc còn lại đến hết lock (0 = hôm nay hoặc đã quá). */
  businessDaysUntilLockExpiry: number | null;
  /** Calendar days còn lại (SoT 60). */
  calendarDaysUntilLockExpiry: number | null;
  daysSinceValidCare: number | null;
  needsProgressWarning: boolean;
  needsScheduleWarning: boolean;
  /** Xin Admin +15 — không tự gia hạn chu kỳ 20 LV. */
  canRequestExtend: boolean;
  /** @deprecated Alias canRequestExtend — UI cũ. */
  canExtendLock: boolean;
  shouldReleaseSilent: boolean;
  shouldReleaseExpired: boolean;
};

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Đếm ngày làm việc từ `from` (exclusive) đến `to` (inclusive). */
export function countBusinessDaysBetween(from: Date, to: Date): number {
  const start = startOfLocalDay(from);
  const end = startOfLocalDay(to);
  if (end <= start) return 0;

  let cursor = new Date(start);
  let count = 0;
  while (cursor < end) {
    cursor.setDate(cursor.getDate() + 1);
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) count += 1;
  }
  return count;
}

export function businessDaysUntil(
  deadline: Date,
  now: Date = new Date(),
): number {
  const today = startOfLocalDay(now);
  const end = startOfLocalDay(deadline);
  if (end <= today) return 0;

  let cursor = new Date(today);
  let count = 0;
  while (cursor < end) {
    cursor.setDate(cursor.getDate() + 1);
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) count += 1;
  }
  return count;
}

export function hasAssistLogWithinBusinessDays(
  logs: { createdAt: Date }[],
  businessDays: number,
  now: Date = new Date(),
): boolean {
  const since = subtractBusinessDays(now, businessDays);
  return logs.some((l) => l.createdAt >= since);
}

export function evaluateCtvLockCompliance(input: {
  consultScheduledAt: Date | null;
  lockExpiresAt: Date | null;
  attributionLockedAt: Date | null;
  caseStatus: string;
  assistLogs: { createdAt: Date }[];
  exclusiveStartedAt?: Date | null;
  lastValidCareAt?: Date | null;
  exclusiveStatus?: string | null;
  alreadyExtended?: boolean;
  now?: Date;
}): CtvLockCompliance {
  const now = input.now ?? new Date();
  const hasConsultSchedule = !!input.consultScheduledAt;

  const exclusiveStartedAt =
    input.exclusiveStartedAt ??
    (input.lockExpiresAt
      ? new Date(
          input.lockExpiresAt.getTime() -
            EXCLUSIVE_FALLBACK_MS,
        )
      : now);

  const lastValidCareAt =
    input.lastValidCareAt ??
    (input.assistLogs[0]?.createdAt ?? exclusiveStartedAt);

  const clock = evaluateExclusiveClock({
    exclusiveStartedAt,
    lockExpiresAt: input.lockExpiresAt,
    lastValidCareAt,
    exclusiveStatus: input.exclusiveStatus ?? "EXCLUSIVE",
    alreadyExtended: input.alreadyExtended ?? false,
    now,
  });

  const hasRecentProgress =
    clock.daysSinceValidCare < SILENT_RELEASE_CALENDAR_DAYS;

  const lockActive =
    input.caseStatus === "ACTIVE" &&
    !input.attributionLockedAt &&
    !!input.lockExpiresAt &&
    input.lockExpiresAt > now;

  const businessDaysUntilLockExpiry = input.lockExpiresAt
    ? businessDaysUntil(input.lockExpiresAt, now)
    : null;

  const needsProgressWarning =
    lockActive && (clock.needsSilentWarning || !hasRecentProgress);

  const needsScheduleWarning = lockActive && !hasConsultSchedule;

  const canRequestExtend = lockActive && clock.canRequestExtend;

  return {
    hasConsultSchedule,
    hasRecentProgress,
    lockExpiresAt: input.lockExpiresAt,
    consultScheduledAt: input.consultScheduledAt,
    businessDaysUntilLockExpiry,
    calendarDaysUntilLockExpiry: clock.daysUntilExclusiveExpiry,
    daysSinceValidCare: clock.daysSinceValidCare,
    needsProgressWarning,
    needsScheduleWarning,
    canRequestExtend,
    canExtendLock: canRequestExtend,
    shouldReleaseSilent: clock.releaseReason === "silent",
    shouldReleaseExpired: clock.releaseReason === "expired",
  };
}

/**
 * Gia hạn +15 calendar khi Admin duyệt (SoT).
 * Không còn cộng thêm chu kỳ 20 LV.
 */
export function computeExtendedLockExpiry(
  currentExpiry: Date,
  now: Date = new Date(),
): Date {
  return computeExtendedExclusiveExpiry(currentExpiry, now);
}

/** @deprecated Giữ export cho call site cũ — map sang +15. */
export function computeLegacyBusinessDayExtension(
  currentExpiry: Date,
  now: Date = new Date(),
): Date {
  const baseline = currentExpiry > now ? currentExpiry : now;
  return addBusinessDays(baseline, CTV_CLAIM_LOCK_BUSINESS_DAYS);
}

export function parseConsultScheduleInput(value: string): Date {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error("INVALID_CONSULT_SCHEDULE");
  }
  if (d.getTime() < Date.now() - 60_000) {
    throw new Error("CONSULT_SCHEDULE_PAST");
  }
  return d;
}
