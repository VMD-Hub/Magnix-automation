import type { CareActivityType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  validateCareActivityInput,
  type CareActivityTypeCode,
} from "@/lib/affiliate/care-activity";

type Tx = Prisma.TransactionClient;

/**
 * CTV ghi CS hợp lệ → ACCEPTED + cập nhật lastValidCareAt (reset im 30 ngày).
 */
export async function createCareActivity(params: {
  caseId: string;
  brokerId: string;
  activityType: CareActivityTypeCode;
  occurredAt: Date;
  note: string;
  imageUrls: string[];
}) {
  const validation = validateCareActivityInput(params);
  if (!validation.ok) {
    throw new CareActivityError(validation.code, validation.message);
  }

  return prisma.$transaction(async (tx) => {
    const row = await tx.noxhCase.findFirst({
      where: {
        id: params.caseId,
        brokerId: params.brokerId,
        caseStatus: "ACTIVE",
      },
      select: { id: true },
    });
    if (!row) {
      throw new CareActivityError("NOT_FOUND", "Không tìm thấy hồ sơ.");
    }

    const activity = await tx.careActivity.create({
      data: {
        caseId: params.caseId,
        brokerId: params.brokerId,
        activityType: params.activityType as CareActivityType,
        occurredAt: params.occurredAt,
        note: params.note.trim(),
        imageUrls: params.imageUrls,
        status: "ACCEPTED",
      },
    });

    await tx.noxhCase.update({
      where: { id: params.caseId },
      data: { lastValidCareAt: params.occurredAt },
    });

    return activity;
  });
}

/** Super reject CS gian dối — không còn tính vào đồng hồ 30 ngày. */
export async function rejectCareActivity(
  activityId: string,
  actor: string,
  reason: string,
) {
  return prisma.$transaction(async (tx) => {
    const activity = await tx.careActivity.update({
      where: { id: activityId },
      data: {
        status: "REJECTED",
        rejectedBy: actor,
        rejectedAt: new Date(),
        rejectedReason: reason.trim(),
      },
    });

    await refreshLastValidCareAt(tx, activity.caseId);
    return activity;
  });
}

async function refreshLastValidCareAt(tx: Tx, caseId: string) {
  const last = await tx.careActivity.findFirst({
    where: { caseId, status: "ACCEPTED" },
    orderBy: { occurredAt: "desc" },
    select: { occurredAt: true },
  });
  const caseRow = await tx.noxhCase.findUnique({
    where: { id: caseId },
    select: { claimedAt: true, exclusiveStartedAt: true },
  });
  await tx.noxhCase.update({
    where: { id: caseId },
    data: {
      lastValidCareAt:
        last?.occurredAt ??
        caseRow?.exclusiveStartedAt ??
        caseRow?.claimedAt ??
        new Date(),
    },
  });
}

export class CareActivityError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "CareActivityError";
  }
}
