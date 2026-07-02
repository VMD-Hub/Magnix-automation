import { Prisma } from "@prisma/client";
import type { CommissionOverride } from "@/lib/validation/lead";

/** Hoa hồng mặc định nếu không truyền rate (có thể chỉnh qua env). */
export const DEFAULT_COMMISSION_RATE = Number(
  process.env.DEFAULT_COMMISSION_RATE ?? "0.01",
);

type TxClient = Prisma.TransactionClient;

type LeadForCommission = {
  id: string;
  status: string;
  referralId: string | null;
  assignedBrokerId: string | null;
  referral: { brokerId: string } | null;
  listing: { price: Prisma.Decimal } | null;
  commission: { id: string } | null;
};

export type CommissionTriggerResult =
  | {
      created: true;
      commissionId: string;
      brokerId: string;
      amount: number;
      rate: number | null;
    }
  | { created: false; reason: string };

/**
 * Rule #4 — Commission chỉ được tạo khi Lead chuyển sang WON.
 *
 * Gọi bên trong transaction khi PATCH lead status. Ràng buộc 1-1 với Lead qua
 * `leadId @unique` nên không tạo Commission thủ công độc lập.
 *
 * - broker nhận hoa hồng: override.brokerId ?? referral.brokerId ?? assignedBrokerId
 * - amount: override.amount ?? (dealValue * rate)
 *     dealValue = override.dealValue ?? listing.price
 *     rate      = override.rate ?? DEFAULT_COMMISSION_RATE
 */
export async function createCommissionOnWon(
  tx: TxClient,
  lead: LeadForCommission,
  override: CommissionOverride = {},
): Promise<CommissionTriggerResult> {
  if (lead.commission) {
    return { created: false, reason: "ALREADY_EXISTS" };
  }

  const brokerId =
    override.brokerId ?? lead.referral?.brokerId ?? lead.assignedBrokerId;
  if (!brokerId) {
    return { created: false, reason: "NO_BROKER_ATTRIBUTION" };
  }

  let amount = override.amount;
  let rate = override.rate ?? null;

  if (amount == null) {
    const dealValue =
      override.dealValue ??
      (lead.listing ? Number(lead.listing.price.toString()) : undefined);
    if (dealValue == null) {
      return { created: false, reason: "NO_AMOUNT_OR_DEAL_VALUE" };
    }
    rate = override.rate ?? DEFAULT_COMMISSION_RATE;
    amount = dealValue * rate;
  }

  const commission = await tx.commission.create({
    data: {
      leadId: lead.id,
      brokerId,
      referralId: lead.referralId,
      amount: new Prisma.Decimal(amount),
      rate,
      status: "PENDING",
    },
  });

  return {
    created: true,
    commissionId: commission.id,
    brokerId,
    amount,
    rate,
  };
}
