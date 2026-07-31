import type { Prisma } from "@prisma/client";
import {
  computeExclusiveExpiry,
  EXCLUSIVE_MAX_CALENDAR_DAYS,
  isWithinCalendarDaysWindow,
} from "@/lib/affiliate/exclusivity";

type Tx = Prisma.TransactionClient;

export type ClaimRejectReason =
  | "ACTIVE_CASE_OTHER_CTV"
  | "PLATFORM_LEAD_ACTIVE"
  | "SELF_REFERRAL"
  | "INVALID_BROKER"
  | "BROKER_NOT_CTV";

export type ClaimEvaluation =
  | { ok: true }
  | { ok: false; reason: ClaimRejectReason; message: string };

const PLATFORM_ACTIVE_STATUSES = ["CONTACTED", "QUALIFIED"] as const;

/**
 * Fairplay — đánh giá CTV có được claim SĐT không (trước khi ghi DB).
 * Độc quyền / platform block: trần 60 ngày calendar (SoT affiliate).
 */
export async function evaluateCtvClaim(
  tx: Tx,
  params: {
    normalizedPhone: string;
    brokerId: string;
    brokerNormalizedPhone: string;
  },
): Promise<ClaimEvaluation> {
  if (params.brokerNormalizedPhone === params.normalizedPhone) {
    return {
      ok: false,
      reason: "SELF_REFERRAL",
      message: "Không thể giới thiệu chính số điện thoại của bạn.",
    };
  }

  const broker = await tx.broker.findUnique({
    where: { id: params.brokerId },
    select: { brokerType: true, ctvCode: true },
  });
  if (!broker?.ctvCode && broker?.brokerType !== "CTV") {
    return {
      ok: false,
      reason: "BROKER_NOT_CTV",
      message: "Chỉ CTV đã được duyệt mới thả lead. Vui lòng đăng ký CTV.",
    };
  }

  const now = new Date();

  const activeCase = await tx.noxhCase.findFirst({
    where: {
      normalizedPhone: params.normalizedPhone,
      caseStatus: "ACTIVE",
      OR: [
        { attributionLockedAt: { not: null } },
        { lockExpiresAt: { gt: now } },
        {
          exclusiveStatus: {
            in: ["EXCLUSIVE", "EXTENDED", "EXTEND_REQUESTED"],
          },
        },
      ],
    },
    select: { brokerId: true, code: true },
  });

  if (activeCase && activeCase.brokerId !== params.brokerId) {
    return {
      ok: false,
      reason: "ACTIVE_CASE_OTHER_CTV",
      message: "Khách đang trong pipeline của người giới thiệu khác.",
    };
  }

  const customer = await tx.customer.findUnique({
    where: { normalizedPhone: params.normalizedPhone },
    select: { id: true },
  });

  const platformCase = await tx.noxhCase.findFirst({
    where: {
      normalizedPhone: params.normalizedPhone,
      caseStatus: "ACTIVE",
      brokerId: null,
    },
    orderBy: { createdAt: "desc" },
    select: { code: true, createdAt: true },
  });

  if (
    platformCase &&
    isWithinCalendarDaysWindow(
      platformCase.createdAt,
      EXCLUSIVE_MAX_CALENDAR_DAYS,
      now,
    )
  ) {
    return {
      ok: false,
      reason: "PLATFORM_LEAD_ACTIVE",
      message:
        "Khách đang được HouseX tư vấn. Thử lại sau khi hết thời gian chờ.",
    };
  }

  if (customer) {
    const platformLead = await tx.lead.findFirst({
      where: {
        customerId: customer.id,
        assignedBrokerId: null,
        status: { in: [...PLATFORM_ACTIVE_STATUSES] },
      },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    });

    if (
      platformLead &&
      isWithinCalendarDaysWindow(
        platformLead.updatedAt,
        EXCLUSIVE_MAX_CALENDAR_DAYS,
        now,
      )
    ) {
      return {
        ok: false,
        reason: "PLATFORM_LEAD_ACTIVE",
        message:
          "Khách đang được HouseX tư vấn. Thử lại sau khi hết thời gian chờ.",
      };
    }
  }

  return { ok: true };
}

/** Lock claim mới = độc quyền 60 ngày calendar (SoT). */
export function computeClaimLockExpiry(from: Date = new Date()): Date {
  return computeExclusiveExpiry(from);
}
