import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  assertCommitEvidence,
  assertMinimizedEventPayload,
  assertProposalFresh,
  PROPOSAL_TERMS_VERSION,
} from "../lib/sales-core/domain";

test("Journey P G2 artifacts: proposal, outcome, flag and events", async () => {
  const root = new URL("../", import.meta.url);
  const [
    schema,
    migration,
    service,
    eventTypes,
    proposalsRoute,
    outcomesRoute,
    funnelRoute,
    validation,
  ] = await Promise.all([
    readFile(new URL("prisma/schema.prisma", root), "utf8"),
    readFile(
      new URL(
        "prisma/migrations/20260718100000_sales_conversion_g2_journey_p/migration.sql",
        root,
      ),
      "utf8",
    ),
    readFile(new URL("lib/sales-core/service.ts", root), "utf8"),
    readFile(new URL("lib/events/types.ts", root), "utf8"),
    readFile(
      new URL("app/api/admin/conversion/proposals/route.ts", root),
      "utf8",
    ),
    readFile(
      new URL("app/api/admin/conversion/outcomes/route.ts", root),
      "utf8",
    ),
    readFile(new URL("app/api/admin/conversion/funnel/route.ts", root), "utf8"),
    readFile(new URL("lib/validation/sales-core.ts", root), "utf8"),
  ]);

  assert.match(schema, /model ProposalSnapshot \{/);
  assert.match(schema, /model ConversionOutcome \{/);
  assert.match(schema, /enum ConversionResult/);
  assert.match(migration, /CREATE TABLE "proposal_snapshots"/);
  assert.match(migration, /CREATE TABLE "conversion_outcomes"/);
  assert.match(service, /HOUSEX_CONVERSION_G2_JOURNEY_P/);
  assert.match(service, /isJourneyPG2Enabled/);
  assert.match(service, /createProposalSnapshot/);
  assert.match(service, /recordConversionOutcome/);
  assert.match(service, /PROPOSAL_REQUIRED/);
  assert.match(service, /assertProposalFresh/);
  assert.match(eventTypes, /"conversion\.won"/);
  assert.match(eventTypes, /"conversion\.lost"/);
  assert.match(eventTypes, /hasValue: boolean/);
  assert.doesNotMatch(
    eventTypes.match(/"conversion\.won": \{[\s\S]*?\n  \};/)?.[0] ?? "",
    /reasonDetail|value:|phone:/,
  );
  assert.match(proposalsRoute, /isAdminAuthorized/);
  assert.match(proposalsRoute, /requireIdempotencyKey/);
  assert.match(outcomesRoute, /recordConversionOutcome/);
  assert.match(funnelRoute, /getConversionFunnel/);
  assert.match(validation, /proposalCommandSchema/);
  assert.match(validation, /outcomeCommandSchema/);
  assert.match(validation, /proposalId/);
  assert.equal(PROPOSAL_TERMS_VERSION, "p-proposal-v1");
});

test("A/S remain fail-closed for COMMITTED; P requires evidence", () => {
  assert.throws(
    () =>
      assertCommitEvidence({
        journey: "A",
        from: "ACTIVE",
        to: "COMMITTED",
        evidence: { referenceType: "UNIT_BOOKING", referenceId: "b1" },
      }),
    /not supported for journey A/,
  );
  assert.throws(
    () =>
      assertCommitEvidence({
        journey: "S",
        from: "ACTIVE",
        to: "COMMITTED",
      }),
    /not supported for journey S/,
  );
  assert.throws(
    () =>
      assertCommitEvidence({
        journey: "P",
        from: "ACTIVE",
        to: "COMMITTED",
      }),
    /requires journey-specific commit evidence/,
  );
  assert.doesNotThrow(() =>
    assertCommitEvidence({
      journey: "P",
      from: "ACTIVE",
      to: "COMMITTED",
      evidence: { referenceType: "DEPOSIT", referenceId: "booking-1" },
    }),
  );
});

test("stale proposal blocks; matching inventory passes", () => {
  const base = {
    projectId: "p1",
    unitId: "u1",
    unitCode: "B-02",
    unitStatus: "AVAILABLE",
    price: "2000000000",
    depositBookingId: null as string | null,
  };
  assert.doesNotThrow(() =>
    assertProposalFresh({ snapshot: base, current: { ...base } }),
  );
  assert.throws(
    () =>
      assertProposalFresh({
        snapshot: base,
        current: { ...base, unitStatus: "DEPOSITED" },
      }),
    /stale/,
  );
  assert.throws(
    () =>
      assertProposalFresh({
        snapshot: base,
        current: { ...base, depositBookingId: "other" },
      }),
    /stale/,
  );
});

test("conversion outcome events stay minimized", () => {
  assert.doesNotThrow(() =>
    assertMinimizedEventPayload({
      outcomeId: "out-1",
      opportunityId: "opp-1",
      leadId: "lead-1",
      journey: "P",
      reasonCode: "DEPOSIT_CONFIRMED",
      referenceType: "DEPOSIT",
      referenceId: "booking-1",
      hasValue: true,
      correlationId: "corr-1",
      schemaVersion: 1,
    }),
  );
  assert.throws(
    () =>
      assertMinimizedEventPayload({
        outcomeId: "out-1",
        reasonDetail: "customer said too expensive",
      }),
    /Forbidden event field/,
  );
});
