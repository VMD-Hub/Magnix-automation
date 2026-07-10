import {
  addBusinessDays,
  CTV_CLAIM_LOCK_BUSINESS_DAYS,
  subtractBusinessDays,
} from "@/lib/noxh-case/business-days";

/** CTV phải ghi tiến độ ít nhất mỗi N ngày làm việc để được gia hạn lock. */
export const CTV_PROGRESS_INTERVAL_BUSINESS_DAYS = Number(
  process.env.CTV_PROGRESS_INTERVAL_BUSINESS_DAYS ?? "7",
);

/** Cảnh báo trước khi hết lock (ngày làm việc). */
export const CTV_LOCK_WARNING_BUSINESS_DAYS = Number(
  process.env.CTV_LOCK_WARNING_BUSINESS_DAYS ?? "3",
);

export type CtvLockCompliance = {
  hasConsultSchedule: boolean;
  hasRecentProgress: boolean;
  lockExpiresAt: Date | null;
  consultScheduledAt: Date | null;
  /** Ngày làm việc còn lại đến hết lock (0 = hôm nay hoặc đã quá). */
  businessDaysUntilLockExpiry: number | null;
  needsProgressWarning: boolean;
  needsScheduleWarning: boolean;
  canExtendLock: boolean;
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
  now?: Date;
}): CtvLockCompliance {
  const now = input.now ?? new Date();
  const hasConsultSchedule = !!input.consultScheduledAt;
  const hasRecentProgress = hasAssistLogWithinBusinessDays(
    input.assistLogs,
    CTV_PROGRESS_INTERVAL_BUSINESS_DAYS,
    now,
  );

  const lockActive =
    input.caseStatus === "ACTIVE" &&
    !input.attributionLockedAt &&
    !!input.lockExpiresAt &&
    input.lockExpiresAt > now;

  const businessDaysUntilLockExpiry = input.lockExpiresAt
    ? businessDaysUntil(input.lockExpiresAt, now)
    : null;

  const needsProgressWarning =
    lockActive &&
    businessDaysUntilLockExpiry !== null &&
    businessDaysUntilLockExpiry <= CTV_LOCK_WARNING_BUSINESS_DAYS &&
    !hasRecentProgress;

  const needsScheduleWarning = lockActive && !hasConsultSchedule;

  const canExtendLock =
    lockActive && hasConsultSchedule && hasRecentProgress;

  return {
    hasConsultSchedule,
    hasRecentProgress,
    lockExpiresAt: input.lockExpiresAt,
    consultScheduledAt: input.consultScheduledAt,
    businessDaysUntilLockExpiry,
    needsProgressWarning,
    needsScheduleWarning,
    canExtendLock,
  };
}

/** Gia hạn lock khi CTV đủ lịch + tiến độ — tối đa thêm một chu kỳ 20 ngày LV. */
export function computeExtendedLockExpiry(
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
