import { Prisma } from "@prisma/client";
import type { Prisma as PrismaNS } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  CDT_SETTLEMENT_DAYS,
  computeExpectedPayDate,
} from "@/lib/noxh-case/commission-pay-cycle";
import { enqueueEvent } from "@/lib/events/outbox";
import { createBrokerNotification } from "@/lib/data/broker-notification";
import {
  computeAffiliateCommission,
  parseAffiliateDealTier,
  type AffiliateDealTierCode,
} from "@/lib/affiliate/commission-calc";

export const DEFAULT_NOXH_CTV_COMMISSION_AMOUNT = Number(
  process.env.DEFAULT_NOXH_CTV_COMMISSION_AMOUNT ?? "15000000",
);

type Tx = PrismaNS.TransactionClient;

type CaseForCommission = {
  id: string;
  code: string;
  leadId: string | null;
  brokerId: string | null;
  referralId?: string | null;
  dealTier?: string | null;
  hdmbBaseAmount?: Prisma.Decimal | number | null;
  commissionModel?: string | null;
  siteVisitBonusVerified?: boolean | null;
};

function resolvePercentAmount(noxhCase: CaseForCommission): {
  amount: number;
  rate: number;
  dealTier: AffiliateDealTierCode;
  hdmbBase: number;
  siteVisitBonus: number;
} | null {
  if (noxhCase.commissionModel === "FLAT") return null;
  const tier = parseAffiliateDealTier(noxhCase.dealTier);
  const hdmb =
    noxhCase.hdmbBaseAmount == null
      ? null
      : Number(noxhCase.hdmbBaseAmount);
  if (!tier || hdmb == null || !(hdmb > 0)) return null;
  const breakdown = computeAffiliateCommission({
    dealTier: tier,
    hdmbBaseAmount: hdmb,
    siteVisitBonusVerified: !!noxhCase.siteVisitBonusVerified,
  });
  return {
    amount: breakdown.totalAmount,
    rate: breakdown.rate,
    dealTier: tier,
    hdmbBase: hdmb,
    siteVisitBonus: breakdown.siteVisitBonus,
  };
}

/**
 * Mốc M5 — ghi nhận hoa hồng ACCRUED.
 * Ưu tiên PERCENT_HDMB khi có dealTier + hdmbBaseAmount; không thì flat mặc định
 * (deal cũ / chưa nhập giá — Ops nên nhập giá trước khi chốt HH %).
 */
export async function accrueNoxhCommissionOnSigned(
  tx: Tx,
  noxhCase: CaseForCommission,
  signedAt: Date = new Date(),
  amountOverride?: number,
): Promise<{ created: boolean; commissionId?: string }> {
  if (!noxhCase.brokerId || !noxhCase.leadId) {
    return { created: false };
  }

  const existing = await tx.commission.findUnique({
    where: { leadId: noxhCase.leadId },
  });
  if (existing) {
    return { created: false, commissionId: existing.id };
  }

  const percent = resolvePercentAmount(noxhCase);
  const usePercent = percent && amountOverride === undefined;
  const amount = amountOverride ?? percent?.amount ?? DEFAULT_NOXH_CTV_COMMISSION_AMOUNT;
  const rate = usePercent ? percent!.rate : null;
  const model = usePercent
    ? "PERCENT_HDMB"
    : noxhCase.commissionModel === "FLAT" || !percent
      ? "FLAT"
      : "PERCENT_HDMB";

  const expectedPayDate = computeExpectedPayDate(signedAt, CDT_SETTLEMENT_DAYS);

  const commission = await tx.commission.create({
    data: {
      leadId: noxhCase.leadId,
      brokerId: noxhCase.brokerId,
      referralId: noxhCase.referralId ?? undefined,
      amount: new Prisma.Decimal(amount),
      rate: rate ?? undefined,
      status: "ACCRUED",
      signedAt,
      accruedAt: signedAt,
      expectedPayDate,
      dealTier: usePercent ? percent!.dealTier : undefined,
      hdmbBaseAmount: usePercent
        ? new Prisma.Decimal(percent!.hdmbBase)
        : undefined,
      siteVisitBonusAmount: usePercent
        ? new Prisma.Decimal(percent!.siteVisitBonus)
        : undefined,
      commissionModel: model,
    },
  });

  await tx.lead.update({
    where: { id: noxhCase.leadId },
    data: { status: "WON" },
  });

  await enqueueEvent(
    tx,
    "commission.created",
    {
      commissionId: commission.id,
      leadId: noxhCase.leadId,
      brokerId: noxhCase.brokerId,
      amount: amount.toString(),
      rate,
      model,
    },
    `commission.created:${commission.id}`,
  );

  await createBrokerNotification(tx, {
    brokerId: noxhCase.brokerId,
    type: "commission.accrued",
    title: "Hoa hồng chờ chi",
    body: `Hồ sơ ${noxhCase.code} đã ký HĐMB. Hoa hồng ${amount.toLocaleString("vi-VN")} ₫ — dự kiến kỳ ${expectedPayDate.getDate()}/${expectedPayDate.getMonth() + 1}.`,
    caseId: noxhCase.id,
  });

  return { created: true, commissionId: commission.id };
}

/** Admin xác nhận CĐT đủ điều kiện → PAYABLE. */
export async function markCommissionPayable(commissionId: string) {
  const now = new Date();
  const updated = await prisma.commission.update({
    where: { id: commissionId, status: "ACCRUED" },
    data: { status: "PAYABLE", payableAt: now },
  });

  await createBrokerNotification(prisma, {
    brokerId: updated.brokerId,
    type: "commission.payable",
    title: "Hoa hồng sắp chi",
    body: `Khoản ${Number(updated.amount).toLocaleString("vi-VN")} ₫ chờ kỳ chi ${updated.expectedPayDate ? new Date(updated.expectedPayDate).getDate() : "05/20"}.`,
  });

  return updated;
}

/** Cron — chuyển PAYABLE có expectedPayDate ≤ hôm nay → PAID. */
export async function processCommissionPayoutBatch(now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const due = await prisma.commission.findMany({
    where: {
      status: "PAYABLE",
      expectedPayDate: { lte: today },
    },
  });

  let paid = 0;
  for (const c of due) {
    await prisma.$transaction(async (tx) => {
      await tx.commission.update({
        where: { id: c.id },
        data: { status: "PAID", paidAt: now },
      });
      await createBrokerNotification(tx, {
        brokerId: c.brokerId,
        type: "commission.paid",
        title: "Đã chi hoa hồng",
        body: `Khoản ${Number(c.amount).toLocaleString("vi-VN")} ₫ đã chi trong kỳ ${today.getDate()}/${today.getMonth() + 1}.`,
      });
    });
    paid += 1;
  }

  return { paid, checked: due.length };
}
