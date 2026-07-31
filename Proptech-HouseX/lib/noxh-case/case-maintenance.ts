import { subtractBusinessDays } from "@/lib/noxh-case/business-days";
import { evaluateCtvLockCompliance } from "@/lib/noxh-case/ctv-lock-compliance";
import { evaluateExclusiveClock } from "@/lib/affiliate/exclusivity";
import { createBrokerNotification } from "@/lib/data/broker-notification";
import { MILESTONE_LABEL } from "@/lib/noxh-case/milestone-labels";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type Db = Prisma.TransactionClient | typeof prisma;

const M1_CONTACT_SLA_BUSINESS_HOURS = 48;

/**
 * Cron bảo trì NOXH case:
 * - Release độc quyền: im ≥30 ngày calendar HOẶC quá trần 60 (+15 nếu có)
 * - Cảnh báo SLA M1 / sắp im / sắp hết trần
 */
export async function runNoxhCaseMaintenance(now = new Date()) {
  let released = 0;
  let releasedSilent = 0;
  let releasedExpired = 0;
  let slaAlerts = 0;
  let lockWarnings = 0;

  const candidates = await prisma.noxhCase.findMany({
    where: {
      caseStatus: "ACTIVE",
      attributionLockedAt: null,
      brokerId: { not: null },
      OR: [
        { lockExpiresAt: { not: null } },
        {
          exclusiveStatus: {
            in: ["EXCLUSIVE", "EXTENDED", "EXTEND_REQUESTED"],
          },
        },
      ],
    },
    select: {
      id: true,
      brokerId: true,
      code: true,
      claimedAt: true,
      exclusiveStartedAt: true,
      lastValidCareAt: true,
      lockExpiresAt: true,
      exclusiveStatus: true,
    },
    take: 200,
  });

  for (const c of candidates) {
    const started = c.exclusiveStartedAt ?? c.claimedAt;
    const clock = evaluateExclusiveClock({
      exclusiveStartedAt: started,
      lockExpiresAt: c.lockExpiresAt,
      lastValidCareAt: c.lastValidCareAt ?? started,
      exclusiveStatus: c.exclusiveStatus ?? "EXCLUSIVE",
      alreadyExtended: c.exclusiveStatus === "EXTENDED",
      now,
    });

    if (!clock.shouldRelease || !clock.releaseReason) continue;

    const exclusiveStatus =
      clock.releaseReason === "silent"
        ? "RELEASED_SILENT"
        : "RELEASED_EXPIRED";

    await prisma.$transaction(async (tx) => {
      await tx.noxhCase.update({
        where: { id: c.id },
        data: {
          caseStatus: "RELEASED",
          lockExpiresAt: now,
          exclusiveStatus,
        },
      });
      if (c.brokerId) {
        await createBrokerNotification(tx, {
          brokerId: c.brokerId,
          type: "case.lock_released",
          title: "Hết độc quyền lead",
          body:
            clock.releaseReason === "silent"
              ? `Hồ sơ ${c.code} nhả sớm — im ≥30 ngày không có CS hợp lệ.`
              : `Hồ sơ ${c.code} hết trần độc quyền 60 ngày (hoặc +15 đã hết).`,
          caseId: c.id,
        });
      }
    });
    released += 1;
    if (clock.releaseReason === "silent") releasedSilent += 1;
    else releasedExpired += 1;
  }

  const staleM1 = await prisma.noxhCase.findMany({
    where: {
      caseStatus: "ACTIVE",
      milestone: "M1_RECEIVED",
      firstContactedAt: null,
      claimedAt: { lt: subtractBusinessDays(now, 2) },
    },
    select: { id: true, code: true, brokerId: true },
    take: 50,
  });

  for (const c of staleM1) {
    if (!c.brokerId) continue;
    const exists = await prisma.brokerNotification.findFirst({
      where: {
        brokerId: c.brokerId,
        caseId: c.id,
        type: "case.sla_m1",
        createdAt: { gte: subtractBusinessDays(now, 1) },
      },
    });
    if (exists) continue;

    await createBrokerNotification(prisma, {
      brokerId: c.brokerId,
      type: "case.sla_m1",
      title: "SLA: cần liên hệ khách",
      body: `Hồ sơ ${c.code} chưa được Ops liên hệ sau ${M1_CONTACT_SLA_BUSINESS_HOURS}h làm việc.`,
      caseId: c.id,
    });
    slaAlerts += 1;
  }

  const lockRisk = await prisma.noxhCase.findMany({
    where: {
      caseStatus: "ACTIVE",
      brokerId: { not: null },
      attributionLockedAt: null,
      lockExpiresAt: { gt: now },
    },
    select: {
      id: true,
      code: true,
      brokerId: true,
      consultScheduledAt: true,
      lockExpiresAt: true,
      attributionLockedAt: true,
      caseStatus: true,
      exclusiveStartedAt: true,
      lastValidCareAt: true,
      exclusiveStatus: true,
      claimedAt: true,
      assistLogs: { orderBy: { createdAt: "desc" }, take: 10 },
    },
    take: 80,
  });

  for (const c of lockRisk) {
    if (!c.brokerId || !c.lockExpiresAt) continue;
    const compliance = evaluateCtvLockCompliance({
      consultScheduledAt: c.consultScheduledAt,
      lockExpiresAt: c.lockExpiresAt,
      attributionLockedAt: c.attributionLockedAt,
      caseStatus: c.caseStatus,
      assistLogs: c.assistLogs,
      exclusiveStartedAt: c.exclusiveStartedAt ?? c.claimedAt,
      lastValidCareAt: c.lastValidCareAt,
      exclusiveStatus: c.exclusiveStatus,
      alreadyExtended: c.exclusiveStatus === "EXTENDED",
      now,
    });
    if (
      !compliance.needsProgressWarning &&
      !compliance.needsScheduleWarning &&
      !compliance.canRequestExtend &&
      !(
        compliance.calendarDaysUntilLockExpiry !== null &&
        compliance.calendarDaysUntilLockExpiry <= 5
      )
    ) {
      continue;
    }

    const exists = await prisma.brokerNotification.findFirst({
      where: {
        brokerId: c.brokerId,
        caseId: c.id,
        type: "case.lock_expiring",
        createdAt: { gte: subtractBusinessDays(now, 1) },
      },
    });
    if (exists) continue;

    const daysLeft =
      compliance.calendarDaysUntilLockExpiry ??
      compliance.businessDaysUntilLockExpiry;
    const body = compliance.needsScheduleWarning
      ? `Hồ sơ ${c.code}: chưa có lịch tư vấn — còn ~${daysLeft} ngày trước khi hết độc quyền.`
      : compliance.canRequestExtend
        ? `Hồ sơ ${c.code}: gần hết 60 ngày — có thể xin Admin gia hạn +15 nếu còn CS hợp lệ.`
        : `Hồ sơ ${c.code}: cần cập nhật CS (note + ảnh) — tránh nhả sớm sau 30 ngày im.`;

    await createBrokerNotification(prisma, {
      brokerId: c.brokerId,
      type: "case.lock_expiring",
      title: "Sắp hết / rủi ro độc quyền lead",
      body,
      caseId: c.id,
    });
    lockWarnings += 1;
  }

  return {
    released,
    releasedSilent,
    releasedExpired,
    slaAlerts,
    lockWarnings,
  };
}

/** Tạo notification khi đổi milestone (gọi từ noxh-case update). */
export async function notifyBrokerMilestoneChange(
  db: Db,
  params: {
    brokerId: string;
    caseId: string;
    caseCode: string;
    toMilestone: string;
    opsNote?: string | null;
  },
) {
  const label =
    MILESTONE_LABEL[params.toMilestone as keyof typeof MILESTONE_LABEL] ??
    params.toMilestone;

  await createBrokerNotification(db, {
    brokerId: params.brokerId,
    type: "noxh_case.milestone",
    title: `Cập nhật: ${params.caseCode}`,
    body: params.opsNote
      ? `${label}. ${params.opsNote}`
      : `Hồ sơ chuyển sang: ${label}.`,
    caseId: params.caseId,
  });
}
