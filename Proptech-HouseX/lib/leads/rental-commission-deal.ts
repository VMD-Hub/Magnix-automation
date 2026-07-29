/**
 * ADR-018 Wave 1 — ghi nhận deal hoa hồng thuê qua SalesActivity (Cách A).
 * Prefix note + metadata để đếm KPI P2.
 */

import type { PrismaClient } from "@prisma/client";
import { appendSalesActivity } from "@/lib/sales-core/service";

export const RENTAL_COMMISSION_META_KIND = "RENTAL_COMMISSION" as const;

export type RentalPlacementOutcome = "WON" | "LOST";

export type RecordRentalPlacementInput = {
  leadId: string;
  actorId: string;
  outcome: RentalPlacementOutcome;
  feeVnd?: number;
  /** Số tháng thuê làm cơ sở hoa hồng (vd. 0.5–1). */
  monthsFee?: number;
  listingCode?: string;
  lostReason?: string;
  correlationId?: string;
};

export function formatRentalCommissionNote(
  input: Omit<RecordRentalPlacementInput, "leadId" | "actorId" | "correlationId">,
): string {
  const parts = [
    RENTAL_COMMISSION_META_KIND,
    `status=${input.outcome}`,
  ];
  if (input.feeVnd != null && Number.isFinite(input.feeVnd)) {
    parts.push(`fee=${Math.round(input.feeVnd)}`);
  }
  if (input.monthsFee != null && Number.isFinite(input.monthsFee)) {
    parts.push(`months=${input.monthsFee}`);
  }
  if (input.listingCode?.trim()) {
    parts.push(`listing=${input.listingCode.trim()}`);
  }
  if (input.outcome === "LOST" && input.lostReason?.trim()) {
    parts.push(`reason=${input.lostReason.trim()}`);
  }
  return parts.join("|");
}

export async function recordRentalPlacementDeal(
  input: RecordRentalPlacementInput,
) {
  const occurredAt = new Date();
  const correlationId =
    input.correlationId ?? `rental-placement:${input.leadId}:${occurredAt.toISOString()}`;
  const note = formatRentalCommissionNote(input);
  const idempotencyKey = `rental-commission:${input.leadId}:${input.outcome}:${occurredAt.getTime()}`;

  return appendSalesActivity({
    leadId: input.leadId,
    type: "NOTE",
    channel: "ops",
    note,
    reason:
      input.outcome === "LOST"
        ? input.lostReason?.trim() || "rental_lost"
        : "rental_commission_won",
    actorId: input.actorId,
    occurredAt,
    correlationId,
    idempotencyKey,
    metadata: {
      kind: RENTAL_COMMISSION_META_KIND,
      outcome: input.outcome,
      feeVnd: input.feeVnd ?? null,
      monthsFee: input.monthsFee ?? null,
      listingCode: input.listingCode ?? null,
      lostReason: input.lostReason ?? null,
    },
  });
}

/** Đếm deal hoa hồng WON trong khoảng thời gian (metadata.kind). */
export async function countRentalCommissionWon(
  db: PrismaClient,
  from: Date,
  to: Date = new Date(),
): Promise<number> {
  const rows = await db.salesActivity.findMany({
    where: {
      type: "NOTE",
      occurredAt: { gte: from, lte: to },
      OR: [
        { note: { startsWith: `${RENTAL_COMMISSION_META_KIND}|status=WON` } },
        {
          note: { startsWith: RENTAL_COMMISSION_META_KIND },
          reason: "rental_commission_won",
        },
      ],
    },
    select: { id: true, note: true, metadata: true },
  });
  return rows.filter((r) => {
    const meta = r.metadata as { kind?: string; outcome?: string } | null;
    if (meta?.kind === RENTAL_COMMISSION_META_KIND && meta.outcome === "WON") {
      return true;
    }
    return (r.note ?? "").includes("status=WON");
  }).length;
}
