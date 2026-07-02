import type { Prisma } from "@prisma/client";

export const ATTRIBUTION_LOCK_DAYS = Number(
  process.env.ATTRIBUTION_LOCK_DAYS ?? "30",
);

type TxClient = Prisma.TransactionClient;

export type ReferralTouch = {
  id: string;
  brokerId: string;
  brokerNormalizedPhone: string;
} | null;

export type AttributionOutcome = {
  assignedBrokerId: string | null;
  referralId: string | null;
  reason:
    | "first_touch"
    | "conflict_kept"
    | "expired_reassign"
    | "self_referral_blocked"
    | "organic"
    | "extended";
};

/**
 * Rule P0 — Attribution lock (chống "lộn cò").
 *
 * Xác định broker sở hữu khách khi tạo lead, dựa trên định danh phía server
 * (không phụ thuộc cookie). Một khách trong cửa sổ khoá chỉ thuộc 1 broker.
 *
 * Phải gọi BÊN TRONG transaction (ghi lock + event nguyên tử cùng lead).
 */
export async function resolveAttribution(
  tx: TxClient,
  params: {
    customerId: string;
    customerNormalizedPhone: string;
    referral: ReferralTouch;
    lockDays?: number;
  },
): Promise<AttributionOutcome> {
  const { customerId, customerNormalizedPhone } = params;
  const lockDays = params.lockDays ?? ATTRIBUTION_LOCK_DAYS;
  const now = new Date();
  const nextExpiry = new Date(now.getTime() + lockDays * 24 * 3600 * 1000);

  let referral = params.referral;

  // Chống self-referral: CTV tự tạo khách ảo bằng chính SĐT của mình.
  if (referral && referral.brokerNormalizedPhone === customerNormalizedPhone) {
    await tx.attributionEvent.create({
      data: {
        customerId,
        toBroker: referral.brokerId,
        referralId: referral.id,
        reason: "self_referral_blocked",
      },
    });
    referral = null;
  }

  const existingLock = await tx.attributionLock.findUnique({
    where: { customerId },
  });
  const lockActive = !!existingLock && existingLock.expiresAt > now;

  if (lockActive && existingLock) {
    // Khách đã có chủ và còn hiệu lực.
    if (referral && referral.brokerId !== existingLock.brokerId) {
      // Broker khác chen ngang → GIỮ chủ cũ, chỉ ghi audit.
      await tx.attributionEvent.create({
        data: {
          customerId,
          fromBroker: existingLock.brokerId,
          toBroker: referral.brokerId,
          referralId: referral.id,
          reason: "conflict_kept",
        },
      });
      return {
        assignedBrokerId: existingLock.brokerId,
        referralId: existingLock.referralId,
        reason: "conflict_kept",
      };
    }

    if (referral && referral.brokerId === existingLock.brokerId) {
      // Cùng broker → gia hạn khoá.
      await tx.attributionLock.update({
        where: { customerId },
        data: { expiresAt: nextExpiry, referralId: referral.id },
      });
      return {
        assignedBrokerId: existingLock.brokerId,
        referralId: referral.id,
        reason: "extended",
      };
    }

    // Lead organic nhưng khách đã có chủ → vẫn về chủ cũ.
    return {
      assignedBrokerId: existingLock.brokerId,
      referralId: existingLock.referralId,
      reason: "conflict_kept",
    };
  }

  // Không có khoá hiệu lực.
  if (referral) {
    await tx.attributionLock.upsert({
      where: { customerId },
      create: {
        customerId,
        brokerId: referral.brokerId,
        referralId: referral.id,
        source: "referral",
        expiresAt: nextExpiry,
      },
      update: {
        brokerId: referral.brokerId,
        referralId: referral.id,
        source: "referral",
        lockedAt: now,
        expiresAt: nextExpiry,
      },
    });

    const reason = existingLock ? "expired_reassign" : "first_touch";
    await tx.attributionEvent.create({
      data: {
        customerId,
        fromBroker: existingLock?.brokerId ?? null,
        toBroker: referral.brokerId,
        referralId: referral.id,
        reason,
      },
    });

    return {
      assignedBrokerId: referral.brokerId,
      referralId: referral.id,
      reason,
    };
  }

  // Organic, không broker.
  return { assignedBrokerId: null, referralId: null, reason: "organic" };
}
