import type { Prisma } from "@prisma/client";
import {
  addBusinessDays,
  CTV_CLAIM_LOCK_BUSINESS_DAYS,
  isWithinBusinessDaysWindow,
  PLATFORM_LEAD_ACTIVE_BUSINESS_DAYS,
} from "@/lib/noxh-case/business-days";

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
      isWithinBusinessDaysWindow(
        platformLead.updatedAt,
        PLATFORM_LEAD_ACTIVE_BUSINESS_DAYS,
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

export function computeClaimLockExpiry(from: Date = new Date()): Date {
  return addBusinessDays(from, CTV_CLAIM_LOCK_BUSINESS_DAYS);
}
