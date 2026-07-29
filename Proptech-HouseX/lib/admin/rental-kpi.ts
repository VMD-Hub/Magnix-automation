/**
 * ADR-018 Wave 2 — KPI P1–P3 thuê (admin read-only).
 */

import type { PrismaClient, RentalLeadIntent } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { countRentalCommissionWon } from "@/lib/leads/rental-commission-deal";
import { countPartnerReferralsHanded } from "@/lib/leads/rental-partner-referral";
import {
  LANDLORD_CONTACT_SLA_HOURS,
  landlordSlaState,
} from "@/lib/leads/ops-lead-board";

export type RentalKpiWindowDays = 7 | 30 | 90;

export function resolveRentalKpiWindow(
  raw: string | null | undefined,
): RentalKpiWindowDays {
  const n = Number(raw);
  if (n === 7 || n === 30 || n === 90) return n;
  return 30;
}

function windowStart(days: RentalKpiWindowDays, now = new Date()): Date {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

async function countByRentalIntent(
  db: PrismaClient,
  from: Date,
  to: Date,
): Promise<Record<RentalLeadIntent, number>> {
  const groups = await db.lead.groupBy({
    by: ["rentalIntent"],
    where: {
      rentalIntent: { not: null },
      createdAt: { gte: from, lte: to },
    },
    _count: { _all: true },
  });
  const out: Record<RentalLeadIntent, number> = {
    LANDLORD: 0,
    TENANT: 0,
    TAX_HELP: 0,
    NEED_PM: 0,
  };
  for (const g of groups) {
    if (g.rentalIntent) out[g.rentalIntent] = g._count._all;
  }
  return out;
}

/** P1 — tin RENT đã review trong cửa sổ: % bị từ chối. */
async function rentListingQa(db: PrismaClient, from: Date, to: Date) {
  const [reviewed, rejected] = await Promise.all([
    db.listing.count({
      where: {
        transactionType: "RENT",
        deletedAt: null,
        reviewedAt: { gte: from, lte: to },
        status: { in: ["ACTIVE", "REJECTED", "EXPIRED", "SOLD"] },
      },
    }),
    db.listing.count({
      where: {
        transactionType: "RENT",
        deletedAt: null,
        status: "REJECTED",
        reviewedAt: { gte: from, lte: to },
      },
    }),
  ]);
  const rejectPct =
    reviewed > 0 ? Math.round((rejected / reviewed) * 1000) / 10 : null;
  return { reviewed, rejected, rejectPct };
}

/** P2 — SLA landlord hiện tại + median giờ đến lần contact đầu (nếu có). */
async function landlordContactMetrics(db: PrismaClient, from: Date, to: Date) {
  const openLandlords = await db.lead.findMany({
    where: {
      rentalIntent: "LANDLORD",
      status: "NEW",
    },
    select: { rentalIntent: true, status: true, createdAt: true },
    take: 500,
  });

  const sla = { ok: 0, due: 0, overdue: 0 };
  for (const row of openLandlords) {
    const state = landlordSlaState(row);
    if (state === "ok") sla.ok += 1;
    else if (state === "due") sla.due += 1;
    else if (state === "overdue") sla.overdue += 1;
  }

  const landlordIds = await db.lead.findMany({
    where: {
      rentalIntent: "LANDLORD",
      createdAt: { gte: from, lte: to },
    },
    select: { id: true, createdAt: true },
    take: 400,
  });

  let medianHoursToContact: number | null = null;
  let contactedSample = 0;
  if (landlordIds.length > 0) {
    const activities = await db.salesActivity.findMany({
      where: {
        leadId: { in: landlordIds.map((l) => l.id) },
        type: { in: ["CONTACT_ATTEMPT", "CONNECTED"] },
      },
      select: { leadId: true, occurredAt: true },
      orderBy: { occurredAt: "asc" },
      take: 2000,
    });
    const firstByLead = new Map<string, Date>();
    for (const a of activities) {
      if (!firstByLead.has(a.leadId)) firstByLead.set(a.leadId, a.occurredAt);
    }
    const hours: number[] = [];
    for (const lead of landlordIds) {
      const first = firstByLead.get(lead.id);
      if (!first) continue;
      const h = (first.getTime() - lead.createdAt.getTime()) / (1000 * 60 * 60);
      if (h >= 0 && Number.isFinite(h)) hours.push(h);
    }
    contactedSample = hours.length;
    if (hours.length > 0) {
      hours.sort((a, b) => a - b);
      const mid = Math.floor(hours.length / 2);
      medianHoursToContact =
        hours.length % 2 === 0
          ? Math.round(((hours[mid - 1]! + hours[mid]!) / 2) * 10) / 10
          : Math.round(hours[mid]! * 10) / 10;
    }
  }

  return {
    slaHours: LANDLORD_CONTACT_SLA_HOURS,
    openNew: openLandlords.length,
    sla,
    contactedSample,
    medianHoursToContact,
  };
}

export async function getRentalKpi(days: RentalKpiWindowDays) {
  const now = new Date();
  const since = windowStart(days, now);
  const db = prisma;

  const [
    byIntent,
    listingQa,
    landlord,
    commissionWon,
    partnerHanded,
    needPmOpen,
    taxHelpOpen,
  ] = await Promise.all([
    countByRentalIntent(db, since, now),
    rentListingQa(db, since, now),
    landlordContactMetrics(db, since, now),
    countRentalCommissionWon(db, since, now),
    countPartnerReferralsHanded(db, since, now),
    db.lead.count({
      where: {
        rentalIntent: "NEED_PM",
        status: { in: ["NEW", "CONTACTED", "QUALIFIED"] },
      },
    }),
    db.lead.count({
      where: {
        rentalIntent: "TAX_HELP",
        status: { in: ["NEW", "CONTACTED", "QUALIFIED"] },
      },
    }),
  ]);

  return {
    summary: {
      windowDays: days,
      since: since.toISOString(),
      until: now.toISOString(),
      note:
        "KPI Sense P1–P3 — tin RENT QA, SLA/landlord contact, hoa hồng thuê, TAX_HELP referral, NEED_PM waitlist. Không đo doanh thu Lớp 3.",
    },
    p1ListingQa: listingQa,
    p2Leasing: {
      landlordLeadsInWindow: byIntent.LANDLORD,
      tenantLeadsInWindow: byIntent.TENANT,
      commissionWonInWindow: commissionWon,
      landlordContact: landlord,
    },
    p3TaxReferral: {
      taxHelpLeadsInWindow: byIntent.TAX_HELP,
      taxHelpOpenQueue: taxHelpOpen,
      partnerHandedInWindow: partnerHanded,
    },
    p4NeedPmSense: {
      needPmLeadsInWindow: byIntent.NEED_PM,
      needPmOpenWaitlist: needPmOpen,
      note: "Chỉ Sense — không bán / không KPI doanh thu QL.",
    },
    byIntent,
  };
}

export type RentalKpiPayload = Awaited<ReturnType<typeof getRentalKpi>>;
