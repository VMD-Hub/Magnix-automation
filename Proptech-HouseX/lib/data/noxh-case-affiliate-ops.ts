import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  computeAffiliateCommission,
  parseAffiliateDealTier,
} from "@/lib/affiliate/commission-calc";
import { computeExtendedExclusiveExpiry } from "@/lib/affiliate/exclusivity";
import { evaluateCtvLockCompliance } from "@/lib/noxh-case/ctv-lock-compliance";
import { createBrokerNotification } from "@/lib/data/broker-notification";

export class AffiliateOpsError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "AffiliateOpsError";
  }
}

/** Ops nhập giá HĐMB (chưa VAT) → lưu SoR; cập nhật HH ACCRUED nếu đã có. */
export async function recordHdmbBaseAmount(params: {
  caseId: string;
  hdmbBaseAmount: number;
  actor: string;
}) {
  if (!(params.hdmbBaseAmount > 0)) {
    throw new AffiliateOpsError("HDMB_INVALID", "Giá HĐMB phải > 0.");
  }

  const now = new Date();
  return prisma.$transaction(async (tx) => {
    const row = await tx.noxhCase.findUnique({
      where: { id: params.caseId },
      include: {
        lead: { select: { id: true, commission: true } },
      },
    });
    if (!row) {
      throw new AffiliateOpsError("NOT_FOUND", "Không tìm thấy hồ sơ.");
    }

    const tier = parseAffiliateDealTier(row.dealTier) ?? "CONNECTOR";
    const breakdown = computeAffiliateCommission({
      dealTier: tier,
      hdmbBaseAmount: params.hdmbBaseAmount,
      siteVisitBonusVerified: row.siteVisitBonusVerified,
    });

    const updated = await tx.noxhCase.update({
      where: { id: params.caseId },
      data: {
        hdmbBaseAmount: new Prisma.Decimal(params.hdmbBaseAmount),
        hdmbRecordedAt: now,
        hdmbRecordedBy: params.actor,
        commissionModel: "PERCENT_HDMB",
        dealTier: row.dealTier ?? "CONNECTOR",
      },
    });

    let commissionUpdated = false;
    const existing = row.lead?.commission;
    if (existing && existing.status === "ACCRUED") {
      await tx.commission.update({
        where: { id: existing.id },
        data: {
          amount: new Prisma.Decimal(breakdown.totalAmount),
          rate: breakdown.rate,
          dealTier: tier,
          hdmbBaseAmount: new Prisma.Decimal(params.hdmbBaseAmount),
          siteVisitBonusAmount: new Prisma.Decimal(breakdown.siteVisitBonus),
          commissionModel: "PERCENT_HDMB",
        },
      });
      commissionUpdated = true;
    }

    return {
      case: updated,
      preview: breakdown,
      commissionUpdated,
    };
  });
}

/** Admin xác nhận thăm DA với CĐT → +500k khi tính HH. */
export async function verifySiteVisitBonus(params: {
  caseId: string;
  actor: string;
}) {
  const now = new Date();
  return prisma.$transaction(async (tx) => {
    const row = await tx.noxhCase.findUnique({
      where: { id: params.caseId },
      include: {
        lead: { select: { id: true, commission: true } },
      },
    });
    if (!row) {
      throw new AffiliateOpsError("NOT_FOUND", "Không tìm thấy hồ sơ.");
    }
    if (row.siteVisitBonusVerified) {
      return { case: row, alreadyVerified: true as const };
    }

    const updated = await tx.noxhCase.update({
      where: { id: params.caseId },
      data: {
        siteVisitBonusVerified: true,
        siteVisitBonusVerifiedAt: now,
        siteVisitBonusVerifiedBy: params.actor,
      },
    });

    const existing = row.lead?.commission;
    if (
      existing &&
      existing.status === "ACCRUED" &&
      row.hdmbBaseAmount &&
      Number(row.hdmbBaseAmount) > 0
    ) {
      const tier = parseAffiliateDealTier(row.dealTier) ?? "CONNECTOR";
      const breakdown = computeAffiliateCommission({
        dealTier: tier,
        hdmbBaseAmount: Number(row.hdmbBaseAmount),
        siteVisitBonusVerified: true,
      });
      await tx.commission.update({
        where: { id: existing.id },
        data: {
          amount: new Prisma.Decimal(breakdown.totalAmount),
          siteVisitBonusAmount: new Prisma.Decimal(breakdown.siteVisitBonus),
        },
      });
    }

    return { case: updated, alreadyVerified: false as const };
  });
}

/** CTV / hệ thống xin +15 — không tự gia hạn. */
export async function requestExclusiveExtend(params: {
  caseId: string;
  brokerId?: string;
}) {
  const row = await prisma.noxhCase.findFirst({
    where: {
      id: params.caseId,
      ...(params.brokerId ? { brokerId: params.brokerId } : {}),
      caseStatus: "ACTIVE",
    },
    include: {
      careActivities: { where: { status: "ACCEPTED" }, take: 1 },
      assistLogs: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
  if (!row) {
    throw new AffiliateOpsError("NOT_FOUND", "Không tìm thấy hồ sơ.");
  }
  if (row.exclusiveStatus === "EXTENDED") {
    throw new AffiliateOpsError(
      "ALREADY_EXTENDED",
      "Deal đã được gia hạn +15 trước đó.",
    );
  }
  if (row.exclusiveStatus === "EXTEND_REQUESTED") {
    return { case: row, alreadyRequested: true as const };
  }

  const compliance = evaluateCtvLockCompliance({
    consultScheduledAt: row.consultScheduledAt,
    lockExpiresAt: row.lockExpiresAt,
    attributionLockedAt: row.attributionLockedAt,
    caseStatus: row.caseStatus,
    assistLogs: row.assistLogs,
    exclusiveStartedAt: row.exclusiveStartedAt,
    lastValidCareAt: row.lastValidCareAt,
    exclusiveStatus: row.exclusiveStatus,
    alreadyExtended: false,
  });

  if (!compliance.canRequestExtend) {
    throw new AffiliateOpsError(
      "EXTEND_NOT_ALLOWED",
      "Chưa đủ điều kiện xin +15 (gần hết 60 ngày + còn CS hợp lệ).",
    );
  }

  const updated = await prisma.noxhCase.update({
    where: { id: params.caseId },
    data: {
      exclusiveStatus: "EXTEND_REQUESTED",
      extendRequestedAt: new Date(),
    },
  });
  return { case: updated, alreadyRequested: false as const };
}

/** Admin duyệt +15 calendar days. */
export async function approveExclusiveExtend(params: {
  caseId: string;
  actor: string;
}) {
  const now = new Date();
  return prisma.$transaction(async (tx) => {
    const row = await tx.noxhCase.findUnique({
      where: { id: params.caseId },
    });
    if (!row) {
      throw new AffiliateOpsError("NOT_FOUND", "Không tìm thấy hồ sơ.");
    }
    if (row.exclusiveStatus === "EXTENDED") {
      throw new AffiliateOpsError(
        "ALREADY_EXTENDED",
        "Deal đã được gia hạn +15.",
      );
    }
    if (
      row.exclusiveStatus !== "EXTEND_REQUESTED" &&
      row.exclusiveStatus !== "EXCLUSIVE"
    ) {
      throw new AffiliateOpsError(
        "EXTEND_NOT_PENDING",
        "Không có yêu cầu gia hạn hợp lệ.",
      );
    }

    const currentExpiry = row.lockExpiresAt ?? now;
    const nextExpiry = computeExtendedExclusiveExpiry(currentExpiry, now);

    const updated = await tx.noxhCase.update({
      where: { id: params.caseId },
      data: {
        exclusiveStatus: "EXTENDED",
        lockExpiresAt: nextExpiry,
      },
    });

    if (row.brokerId) {
      const customer = await tx.customer.findUnique({
        where: { normalizedPhone: row.normalizedPhone },
        select: { id: true },
      });
      if (customer) {
        await tx.attributionLock.updateMany({
          where: { customerId: customer.id },
          data: { expiresAt: nextExpiry },
        });
        await tx.attributionEvent.create({
          data: {
            customerId: customer.id,
            toBroker: row.brokerId,
            reason: "lock_extended",
          },
        });
      }
      await createBrokerNotification(tx, {
        brokerId: row.brokerId,
        type: "exclusive.extended",
        title: "Độc quyền +15 đã duyệt",
        body: `Hồ sơ ${row.code} được gia hạn đến ${nextExpiry.toLocaleDateString("vi-VN")}.`,
        caseId: row.id,
      });
    }

    return { case: updated, lockExpiresAt: nextExpiry, actor: params.actor };
  });
}

/** Admin từ chối yêu cầu +15. */
export async function denyExclusiveExtend(params: {
  caseId: string;
  actor: string;
  reason?: string;
}) {
  const row = await prisma.noxhCase.findUnique({
    where: { id: params.caseId },
  });
  if (!row) {
    throw new AffiliateOpsError("NOT_FOUND", "Không tìm thấy hồ sơ.");
  }
  if (row.exclusiveStatus !== "EXTEND_REQUESTED") {
    throw new AffiliateOpsError(
      "EXTEND_NOT_PENDING",
      "Không có yêu cầu +15 đang chờ.",
    );
  }

  const updated = await prisma.noxhCase.update({
    where: { id: params.caseId },
    data: {
      exclusiveStatus: "EXCLUSIVE",
      extendRequestedAt: null,
      opsNote: params.reason?.trim()
        ? `[Từ chối +15] ${params.reason.trim()}${row.opsNote ? `\n${row.opsNote}` : ""}`
        : row.opsNote,
    },
  });
  return { case: updated, actor: params.actor };
}
