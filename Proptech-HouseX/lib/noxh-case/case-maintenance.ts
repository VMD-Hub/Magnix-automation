import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { subtractBusinessDays } from "@/lib/noxh-case/business-days";
import { createBrokerNotification } from "@/lib/data/broker-notification";
import { MILESTONE_LABEL } from "@/lib/noxh-case/milestone-labels";

type Db = Prisma.TransactionClient | typeof prisma;

const M1_CONTACT_SLA_BUSINESS_HOURS = 48;

/**
 * Cron bảo trì NOXH case:
 * - Release lock hết hạn (20 ngày LV, chưa cọc)
 * - Cảnh báo SLA M1 chưa liên hệ 48h
 */
export async function runNoxhCaseMaintenance(now = new Date()) {
  let released = 0;
  let slaAlerts = 0;

  const expiredLocks = await prisma.noxhCase.findMany({
    where: {
      caseStatus: "ACTIVE",
      attributionLockedAt: null,
      lockExpiresAt: { lt: now },
    },
    select: { id: true, brokerId: true, code: true },
  });

  for (const c of expiredLocks) {
    await prisma.$transaction(async (tx) => {
      await tx.noxhCase.update({
        where: { id: c.id },
        data: { caseStatus: "RELEASED", lockExpiresAt: now },
      });
      if (c.brokerId) {
        await createBrokerNotification(tx, {
          brokerId: c.brokerId,
          type: "case.lock_released",
          title: "Hết thời gian giữ lead",
          body: `Hồ sơ ${c.code} đã hết hạn lock 20 ngày làm việc — có thể được claim lại nếu khách chưa chốt.`,
          caseId: c.id,
        });
      }
    });
    released += 1;
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

  return { released, slaAlerts };
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
