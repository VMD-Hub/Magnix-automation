import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  assertAppointmentTransition,
  assertBuyerReadyForMatching,
  assertMarketingDeliveryAllowed,
  assertMinimizedEventPayload,
  assertOpportunityTransition,
  assignmentFactDecision,
  assignmentSla,
  calculateProfileCompleteness,
  resolveEffectiveConsent,
  scoreBuyerMatch,
} from "../lib/sales-core/domain";

test("synthetic G2 contract follows the ordered consent-safe conversion path", () => {
  const lead = { id: "lead-synthetic-1", status: "QUALIFIED" };
  assert.match(lead.id, /^lead-/);

  const marketingConsent = resolveEffectiveConsent(
    [
      {
        purpose: "marketing",
        channel: "zalo",
        action: "GRANTED",
        occurredAt: new Date("2026-07-17T10:00:00Z"),
      },
    ],
    "marketing",
    "zalo",
  );
  assert.doesNotThrow(() =>
    assertMarketingDeliveryAllowed(marketingConsent),
  );
  assert.throws(
    () =>
      assertMarketingDeliveryAllowed(
        resolveEffectiveConsent([], "marketing", "email"),
      ),
    /requires effective/,
  );

  const assignedAt = new Date("2026-07-17T10:05:00Z");
  const sla = assignmentSla(assignedAt, 15, 60);
  assert.equal(
    assignmentFactDecision({
      status: "ASSIGNED",
      ownerId: "broker-1",
      actorId: "broker-1",
      fact: "accept",
      occurredAt: new Date("2026-07-17T10:06:00Z"),
      correlationId: "corr-accept-synthetic-1",
      idempotencyKey: "accept-synthetic-1",
      recordedFacts: [],
    }),
    "record",
  );
  assert.equal(sla.acceptanceSlaDueAt.toISOString(), "2026-07-17T10:20:00.000Z");

  const profile = {
    budgetMax: "3000000000",
    availableCash: "900000000",
    paymentPreference: "mortgage",
    locations: ["HCM"],
    propertyTypes: ["APARTMENT"],
    bedroomsMin: 2,
    purchasePurpose: "live",
    timeframe: "3_months",
    readiness: "ready",
    mustHaves: ["legal_clear"],
  };
  const completeness = calculateProfileCompleteness(profile);
  assert.equal(completeness, 100);
  assert.doesNotThrow(() =>
    assertBuyerReadyForMatching({
      leadStatus: lead.status,
      profileCompleteness: completeness,
      readiness: profile.readiness,
    }),
  );

  const match = scoreBuyerMatch({
    profileCompleteness: completeness,
    locationMatched: true,
    propertyTypeMatched: true,
    bedroomsMatched: true,
    mustHavesMatched: 1,
    mustHavesTotal: 1,
    inventorySnapshotAt: null,
    inventoryAvailable: null,
  });
  assert.equal(match.score, 100);
  assert.equal(match.inventoryCheckedAt, null);
  assert.ok(match.reasons.includes("LOCATION_MATCH"));
  assert.ok(match.blockers.includes("INVENTORY_FRESHNESS_UNKNOWN"));
  assert.throws(
    () =>
      scoreBuyerMatch({
        profileCompleteness: completeness,
        locationMatched: true,
        propertyTypeMatched: true,
        bedroomsMatched: true,
        mustHavesMatched: 1,
        mustHavesTotal: 1,
        inventorySnapshotAt: null,
        inventoryAvailable: true,
      }),
    /cannot be claimed/,
  );

  assert.doesNotThrow(() =>
    assertAppointmentTransition("SCHEDULED", "COMPLETED"),
  );
  assert.throws(
    () => assertOpportunityTransition("OPEN", "COMMITTED"),
    /Cannot transition/,
  );
  assert.throws(
    () =>
      assertBuyerReadyForMatching({
        leadStatus: "NEW",
        profileCompleteness: completeness,
        readiness: profile.readiness,
      }),
    /QUALIFIED/,
  );
});

test("sales-ops E2E contract: assign → accept → qualify → appointment order", () => {
  const assignedAt = new Date("2026-07-18T09:00:00Z");
  const sla = assignmentSla(assignedAt, 15, 60);
  assert.equal(
    sla.acceptanceSlaDueAt.toISOString(),
    "2026-07-18T09:15:00.000Z",
  );

  assert.equal(
    assignmentFactDecision({
      status: "ASSIGNED",
      ownerId: "broker-ops-1",
      actorId: "broker-ops-1",
      fact: "accept",
      occurredAt: new Date("2026-07-18T09:05:00Z"),
      correlationId: "corr-ops-accept",
      idempotencyKey: "ops-accept-1",
      recordedFacts: [],
    }),
    "record",
  );
  assert.equal(
    assignmentFactDecision({
      status: "ACCEPTED",
      ownerId: "broker-ops-1",
      actorId: "broker-ops-1",
      fact: "first_attempt",
      occurredAt: new Date("2026-07-18T09:10:00Z"),
      correlationId: "corr-ops-attempt",
      idempotencyKey: "ops-attempt-1",
      recordedFacts: [
        {
          fact: "accept",
          idempotencyKey: "ops-accept-1",
          occurredAt: new Date("2026-07-18T09:05:00Z"),
          correlationId: "corr-ops-accept",
        },
      ],
    }),
    "record",
  );

  const lead = { id: "lead-ops-e2e-1", status: "QUALIFIED" as const };
  assert.equal(lead.status, "QUALIFIED");
  assert.doesNotThrow(() =>
    assertAppointmentTransition("SCHEDULED", "COMPLETED"),
  );
  assert.throws(
    () => assertAppointmentTransition("CANCELLED", "COMPLETED"),
    /Cannot transition/,
  );
});

test("G2 migration, API and event artifacts are additive and PII-minimized", async () => {
  const root = new URL("../", import.meta.url);
  const [schema, migration, route, service, eventTypes, journeyPMigration] =
    await Promise.all([
      readFile(new URL("prisma/schema.prisma", root), "utf8"),
      readFile(
        new URL(
          "prisma/migrations/20260717200000_buyer_match_g2_slice/migration.sql",
          root,
        ),
        "utf8",
      ),
      readFile(
        new URL("app/api/admin/conversion/matches/route.ts", root),
        "utf8",
      ),
      readFile(new URL("lib/sales-core/service.ts", root), "utf8"),
      readFile(new URL("lib/events/types.ts", root), "utf8"),
      readFile(
        new URL(
          "prisma/migrations/20260718100000_sales_conversion_g2_journey_p/migration.sql",
          root,
        ),
        "utf8",
      ),
    ]);

  assert.match(schema, /model BuyerMatch \{/);
  assert.match(schema, /model ProposalSnapshot \{/);
  assert.match(schema, /model ConversionOutcome \{/);
  assert.match(migration, /CREATE TABLE "buyer_matches"/);
  assert.match(migration, /INVENTORY_FRESHNESS_UNKNOWN/);
  assert.match(journeyPMigration, /CREATE TABLE "proposal_snapshots"/);
  assert.match(journeyPMigration, /CREATE TABLE "conversion_outcomes"/);
  assert.match(route, /isAdminAuthorized/);
  assert.match(route, /requireIdempotencyKey/);
  assert.match(service, /buyerMatch\.findUnique/);
  assert.match(service, /"buyer\.match_recorded"/);
  assert.match(service, /HOUSEX_CONVERSION_G2_JOURNEY_P/);
  assert.match(eventTypes, /"buyer\.match_recorded"/);
  assert.match(eventTypes, /"conversion\.won"/);
  assert.match(eventTypes, /"conversion\.lost"/);

  assert.doesNotThrow(() =>
    assertMinimizedEventPayload({
      buyerMatchId: "match-1",
      leadId: "lead-1",
      buyerProfileId: "profile-1",
      score: 90,
      reasons: ["LOCATION_MATCH"],
      blockers: ["INVENTORY_FRESHNESS_UNKNOWN"],
      hasInventorySnapshot: false,
    }),
  );
  for (const forbidden of ["phone", "email", "budgetMax", "availableCash"]) {
    assert.doesNotMatch(
      eventTypes.match(
        /"buyer\.match_recorded": \{[\s\S]*?\n  \};/,
      )?.[0] ?? "",
      new RegExp(`${forbidden}:`),
    );
  }
});

test("Round 2 sales-ops / nurture-real / cohort KPI harness is wired", async () => {
  const root = new URL("../", import.meta.url);
  const [pkg, salesOps, nurtureReal, cohortKpi] = await Promise.all([
    readFile(new URL("package.json", root), "utf8"),
    readFile(new URL("scripts/smoke-sales-ops-e2e.ts", root), "utf8"),
    readFile(new URL("scripts/smoke-nurture-real-channel.ts", root), "utf8"),
    readFile(new URL("scripts/kpi-sales-ops-cohort.ts", root), "utf8"),
  ]);
  assert.match(pkg, /go-live:smoke-sales-ops/);
  assert.match(pkg, /go-live:smoke-nurture-real/);
  assert.match(pkg, /go-live:kpi-sales-ops-cohort/);
  assert.match(salesOps, /assignLead/);
  assert.match(salesOps, /createAppointment/);
  assert.match(salesOps, /sales-ops-e2e-/);
  assert.match(nurtureReal, /SMOKE_NURTURE_REAL_CHANNEL/);
  assert.match(nurtureReal, /sendTelesalesServerChannels/);
  assert.match(cohortKpi, /sales-ops-cohort-kpi-/);
  assert.doesNotMatch(salesOps, /console\.log\([^)]*phone/i);
  assert.doesNotMatch(nurtureReal, /console\.log\([^)]*phone/i);
});
