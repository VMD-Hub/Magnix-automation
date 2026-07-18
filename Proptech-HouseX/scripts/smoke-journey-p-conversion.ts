/**
 * Journey P conversion smoke (SC-4/SC-5).
 *
 * Fail-closed unless HOUSEX_CONVERSION_G2_JOURNEY_P=true.
 * Uses Prisma + sales-core services (run on VPS / local with DATABASE_URL).
 *
 * Usage:
 *   HOUSEX_CONVERSION_G2_JOURNEY_P=true npm run go-live:smoke-journey-p
 *
 * Output: masked IDs only (no phone/email). Writes
 *   reports/journey-p-smoke-<stamp>.json
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../lib/prisma";
import {
  createOpportunity,
  createProposalSnapshot,
  isJourneyPG2Enabled,
  recordConversionOutcome,
  transitionOpportunity,
} from "../lib/sales-core/service";

function fail(msg: string): never {
  console.error(`FAIL — ${msg}`);
  process.exit(1);
}

function ok(msg: string) {
  console.log(`OK — ${msg}`);
}

async function main() {
  if (!isJourneyPG2Enabled()) {
    fail(
      "HOUSEX_CONVERSION_G2_JOURNEY_P must be true (fail-closed). Set in env then re-run.",
    );
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const actorId = "smoke-journey-p";
  const correlationId = `smoke-jp-${Date.now()}`;
  const phoneSuffix = String(Date.now()).slice(-7);
  const normalizedPhone = `8490${phoneSuffix.padStart(7, "0")}`.slice(0, 11);
  const displayPhone = `090${phoneSuffix.padStart(7, "0")}`.slice(0, 10);

  const unit = await prisma.projectUnit.findFirst({
    where: {
      deletedAt: null,
      status: "AVAILABLE",
      project: { status: "DANG_BAN", deletedAt: null },
    },
    select: {
      id: true,
      code: true,
      projectId: true,
      price: true,
      project: { select: { id: true, slug: true, name: true } },
    },
  });
  if (!unit) {
    fail("No AVAILABLE unit on a DANG_BAN project — seed inventory first.");
  }

  const customer = await prisma.customer.create({
    data: {
      name: "Smoke Journey P",
      phone: displayPhone,
      normalizedPhone,
      email: null,
    },
  });

  const lead = await prisma.lead.create({
    data: {
      customerId: customer.id,
      projectId: unit.projectId,
      source: "smoke_journey_p",
      segment: "NOXH",
      status: "QUALIFIED",
      message: "synthetic conversion smoke — safe to delete",
      opsMeta: { smoke: true, correlationId },
    },
  });

  const { opportunity } = await createOpportunity({
    leadId: lead.id,
    journey: "P",
    projectRef: unit.projectId,
    unitRef: unit.id,
    actorId,
    correlationId: `${correlationId}:opp`,
    idempotencyKey: `${correlationId}:opp`,
  });

  await transitionOpportunity({
    opportunityId: opportunity.id,
    toStage: "DISCOVERY",
    reason: "SMOKE_DISCOVERY",
    actorId,
    occurredAt: new Date(),
    correlationId: `${correlationId}:disc`,
    idempotencyKey: `${correlationId}:disc`,
  });
  await transitionOpportunity({
    opportunityId: opportunity.id,
    toStage: "ACTIVE",
    reason: "SMOKE_ACTIVE",
    actorId,
    occurredAt: new Date(),
    correlationId: `${correlationId}:active`,
    idempotencyKey: `${correlationId}:active`,
  });

  const { proposal } = await createProposalSnapshot({
    opportunityId: opportunity.id,
    unitRef: unit.id,
    actorId,
    correlationId: `${correlationId}:proposal`,
    idempotencyKey: `${correlationId}:proposal`,
  });

  const bookingCode = `SMK-JP-${Date.now().toString(36).toUpperCase()}`;
  const booking = await prisma.unitBooking.create({
    data: {
      code: bookingCode,
      projectId: unit.projectId,
      unitId: unit.id,
      customerId: customer.id,
      customerName: "Smoke Journey P",
      phone: displayPhone,
      normalizedPhone,
      status: "CONFIRMED",
    },
  });

  const committed = await transitionOpportunity({
    opportunityId: opportunity.id,
    toStage: "COMMITTED",
    reason: "SMOKE_COMMIT",
    actorId,
    occurredAt: new Date(),
    correlationId: `${correlationId}:commit`,
    idempotencyKey: `${correlationId}:commit`,
    commitEvidence: {
      referenceType: "UNIT_BOOKING",
      referenceId: booking.id,
    },
    proposalId: proposal.id,
  });

  const { outcome } = await recordConversionOutcome({
    opportunityId: opportunity.id,
    result: "LOST",
    reasonCode: "OTHER",
    reasonDetail: null,
    referenceType: "UNIT_BOOKING",
    referenceId: booking.id,
    actorId,
    occurredAt: new Date(),
    correlationId: `${correlationId}:outcome`,
    idempotencyKey: `${correlationId}:outcome`,
  });

  const outbox = await prisma.outboxEvent.findMany({
    where: {
      OR: [
        { dedupeKey: { startsWith: "opportunity.stage_changed:" } },
        { dedupeKey: { startsWith: "conversion." } },
      ],
      correlationId: {
        in: [
          `${correlationId}:commit`,
          `${correlationId}:outcome`,
          `${correlationId}:active`,
          `${correlationId}:disc`,
          `${correlationId}:opp`,
        ],
      },
    },
    select: { type: true, dedupeKey: true, correlationId: true },
    take: 20,
  });

  // Soft cleanup booking — do not delete audit rows used as evidence.
  await prisma.unitBooking.update({
    where: { id: booking.id },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
      cancelReason: "smoke_cleanup",
    },
  });

  const evidence = {
    result: "passed",
    at: new Date().toISOString(),
    flag: "HOUSEX_CONVERSION_G2_JOURNEY_P=true",
    journey: "P",
    ids: {
      correlationId,
      leadId: lead.id,
      opportunityId: opportunity.id,
      proposalId: proposal.id,
      bookingId: booking.id,
      outcomeId: outcome.id,
      projectId: unit.projectId,
      unitId: unit.id,
      opportunityStage: committed.opportunity.stage,
      outcomeResult: outcome.result,
    },
    outboxTypes: [...new Set(outbox.map((row) => row.type))],
    note: "Synthetic fixture; phone not logged. Booking cancelled after smoke.",
  };

  const reportsDir = path.join(process.cwd(), "reports");
  await mkdir(reportsDir, { recursive: true });
  const reportPath = path.join(reportsDir, `journey-p-smoke-${stamp}.json`);
  await writeFile(reportPath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");

  ok(`Journey P smoke passed`);
  console.log(JSON.stringify(evidence.ids, null, 2));
  ok(`evidence → ${reportPath}`);
  ok(`outbox types → ${evidence.outboxTypes.join(", ") || "(none matched)"}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => undefined);
  });
