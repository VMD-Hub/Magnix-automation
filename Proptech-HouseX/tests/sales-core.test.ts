import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  appointmentTransitionDates,
  assertAppointmentTransition,
  assertCommitEvidence,
  assertGenericActivityType,
  assertMinimizedEventPayload,
  assertOpportunityTransition,
  assertPrimaryCommitEvidenceRecord,
  assignmentFactDecision,
  assignmentSla,
  calculateProfileCompleteness,
  resolveEffectiveConsent,
} from "../lib/sales-core/domain";
import type { ConsentFact } from "../lib/sales-core/domain";

test("consent withdrawal and denial beat an earlier grant", () => {
  const records: ConsentFact[] = [
    {
      purpose: "marketing",
      channel: "zalo",
      action: "GRANTED" as const,
      occurredAt: new Date("2026-07-17T01:00:00Z"),
    },
    {
      purpose: "marketing",
      channel: "zalo",
      action: "WITHDRAWN" as const,
      occurredAt: new Date("2026-07-17T02:00:00Z"),
    },
  ];
  assert.deepEqual(
    resolveEffectiveConsent(records, "marketing", "zalo"),
    {
      granted: false,
      action: "WITHDRAWN",
      occurredAt: new Date("2026-07-17T02:00:00Z"),
    },
  );

  records.push({
    purpose: "marketing",
    channel: "zalo",
    action: "GRANTED",
    occurredAt: new Date("2026-07-17T03:00:00Z"),
  });
  records.push({
    purpose: "marketing",
    channel: "zalo",
    action: "DENIED",
    occurredAt: new Date("2026-07-17T04:00:00Z"),
  });
  assert.equal(
    resolveEffectiveConsent(records, "marketing", "zalo").granted,
    false,
  );
});

test("consent is isolated by purpose/channel and defaults to denied", () => {
  const records = [
    {
      purpose: "appointment_service",
      channel: "zalo",
      action: "GRANTED" as const,
      occurredAt: new Date("2026-07-17T01:00:00Z"),
    },
  ];
  assert.equal(
    resolveEffectiveConsent(records, "appointment_service", "zalo").granted,
    true,
  );
  assert.deepEqual(resolveEffectiveConsent(records, "marketing", "zalo"), {
    granted: false,
    action: null,
    occurredAt: null,
  });
  assert.equal(
    resolveEffectiveConsent(records, "appointment_service", "email").granted,
    false,
  );
});

test("assignment SLA clocks are deterministic from assignedAt", () => {
  const assignedAt = new Date("2026-07-17T10:00:00Z");
  assert.deepEqual(assignmentSla(assignedAt, 15, 60), {
    acceptanceSlaDueAt: new Date("2026-07-17T10:15:00Z"),
    firstResponseSlaDueAt: new Date("2026-07-17T11:00:00Z"),
  });
  assert.throws(() => assignmentSla(assignedAt, 0, 60), /positive/);
});

test("assignment acceptance is owner-only and idempotent", () => {
  const occurredAt = new Date("2026-07-17T10:10:00Z");
  const base = {
    status: "ASSIGNED" as const,
    ownerId: "broker-1",
    actorId: "broker-1",
    fact: "accept" as const,
    occurredAt,
    correlationId: "corr-accept-1",
    idempotencyKey: "accept-1",
  };
  assert.equal(
    assignmentFactDecision({
      ...base,
      recordedFacts: [],
    }),
    "record",
  );
  assert.equal(
    assignmentFactDecision({
      ...base,
      recordedFacts: [
        {
          fact: "accept",
          idempotencyKey: "accept-1",
          occurredAt,
          correlationId: "corr-accept-1",
        },
      ],
    }),
    "retry",
  );
  for (const changed of [
    { fact: "first_attempt" as const },
    { occurredAt: new Date("2026-07-17T10:11:00Z") },
    { correlationId: "corr-changed" },
  ]) {
    assert.throws(
      () =>
        assignmentFactDecision({
          ...base,
          ...changed,
          recordedFacts: [
            {
              fact: "accept",
              idempotencyKey: "accept-1",
              occurredAt,
              correlationId: "corr-accept-1",
            },
          ],
        }),
      /different assignment fact/,
    );
  }
  assert.throws(
    () =>
      assignmentFactDecision({
        ...base,
        actorId: "broker-2",
        recordedFacts: [],
      }),
    /assigned owner/,
  );
  assert.throws(
    () =>
      assignmentFactDecision({
        ...base,
        status: "REASSIGNED",
        recordedFacts: [],
      }),
    /Closed assignments/,
  );
});

test("buyer profile completeness covers ten minimum-need groups", () => {
  assert.equal(calculateProfileCompleteness({}), 0);
  assert.equal(
    calculateProfileCompleteness({
      budgetMax: "3000000000",
      locations: ["HCM"],
      propertyTypes: ["APARTMENT"],
      purchasePurpose: "live",
      timeframe: "3_months",
    }),
    50,
  );
  assert.equal(
    calculateProfileCompleteness({
      budgetMin: "1000000000",
      availableCash: "500000000",
      paymentPreference: "mortgage",
      locations: ["HCM"],
      propertyTypes: ["APARTMENT"],
      bedroomsMin: 2,
      purchasePurpose: "live",
      timeframe: "3_months",
      readiness: "ready",
      mustHaves: ["legal_clear"],
    }),
    100,
  );
});

test("opportunity lifecycle rejects gate bypass and terminal reopen", () => {
  assert.doesNotThrow(() => assertOpportunityTransition("OPEN", "DISCOVERY"));
  assert.doesNotThrow(() => assertOpportunityTransition("ACTIVE", "COMMITTED"));
  assert.throws(
    () => assertOpportunityTransition("OPEN", "COMMITTED"),
    /Cannot transition/,
  );
  assert.throws(
    () => assertOpportunityTransition("WON", "ACTIVE"),
    /Cannot transition/,
  );
});

test("commit evidence is required and journey-specific", () => {
  assert.throws(
    () =>
      assertCommitEvidence({
        journey: "A",
        from: "ACTIVE",
        to: "COMMITTED",
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
    /requires journey-specific/,
  );
  assert.doesNotThrow(() =>
    assertCommitEvidence({
      journey: "P",
      from: "ACTIVE",
      to: "COMMITTED",
      evidence: {
        referenceType: "UNIT_BOOKING",
        referenceId: "booking-1",
      },
    }),
  );
});

test("primary commit evidence must reconcile subject, project, unit and status", () => {
  const base = {
    evidence: {
      referenceType: "UNIT_BOOKING" as const,
      referenceId: "booking-1",
    },
    leadCustomerId: "customer-1",
    leadProjectId: "project-1",
    opportunityProjectRef: "project-1",
    opportunityUnitRef: "unit-1",
    record: {
      id: "booking-1",
      status: "CONFIRMED",
      customerId: "customer-1",
      projectId: "project-1",
      unitId: "unit-1",
      unitDepositBookingId: null,
    },
  };
  assert.doesNotThrow(() => assertPrimaryCommitEvidenceRecord(base));

  for (const record of [
    { ...base.record, status: "PENDING" },
    { ...base.record, customerId: "customer-2" },
    { ...base.record, projectId: "project-2" },
    { ...base.record, unitId: "unit-2" },
  ]) {
    assert.throws(() =>
      assertPrimaryCommitEvidenceRecord({ ...base, record }),
    );
  }
  assert.throws(
    () =>
      assertPrimaryCommitEvidenceRecord({
        ...base,
        evidence: { referenceType: "DEPOSIT", referenceId: "booking-1" },
        record: {
          ...base.record,
          status: "CONVERTED_TO_DEPOSIT",
          unitDepositBookingId: null,
        },
      }),
    /does not prove/,
  );
  assert.doesNotThrow(() =>
    assertPrimaryCommitEvidenceRecord({
      ...base,
      evidence: { referenceType: "DEPOSIT", referenceId: "booking-1" },
      record: {
        ...base.record,
        status: "CONVERTED_TO_DEPOSIT",
        unitDepositBookingId: "booking-1",
      },
    }),
  );
});

test("generic activities reject domain-reserved types", () => {
  assert.doesNotThrow(() => assertGenericActivityType("NOTE"));
  for (const type of [
    "STATE_TRANSITION",
    "APPOINTMENT_CREATED",
    "APPOINTMENT_UPDATED",
  ]) {
    assert.throws(() => assertGenericActivityType(type), /Reserved system/);
  }
});

test("appointment state rules set attendance/no-show facts", () => {
  const at = new Date("2026-07-17T10:00:00Z");
  assert.doesNotThrow(() =>
    assertAppointmentTransition("SCHEDULED", "NO_SHOW"),
  );
  assert.throws(
    () => assertAppointmentTransition("COMPLETED", "RESCHEDULED"),
    /Cannot transition/,
  );
  assert.deepEqual(appointmentTransitionDates("COMPLETED", at), {
    attendedAt: at,
    noShowAt: undefined,
    cancelledAt: undefined,
  });
  assert.equal(appointmentTransitionDates("NO_SHOW", at).noShowAt, at);
});

test("event minimization rejects identity, proof and financial fields", () => {
  assert.doesNotThrow(() =>
    assertMinimizedEventPayload({
      leadId: "lead-1",
      journey: "P",
      stage: "DISCOVERY",
    }),
  );
  for (const key of [
    "phone",
    "email",
    "uid",
    "availableCash",
    "budgetMax",
    "proofMetadata",
    "note",
  ]) {
    assert.throws(
      () => assertMinimizedEventPayload({ nested: { [key]: "secret" } }),
      /Forbidden event field/,
    );
  }
});

test("migration and services enforce idempotency without consent inference", async () => {
  const root = new URL("../", import.meta.url);
  const [migration, service] = await Promise.all([
    readFile(
      new URL(
        "prisma/migrations/20260717190000_sales_core_g1_foundation/migration.sql",
        root,
      ),
      "utf8",
    ),
    readFile(new URL("lib/sales-core/service.ts", root), "utf8"),
  ]);
  assert.match(migration, /consent_records_idempotency_key_key/);
  assert.match(migration, /lead_assignments_one_active_per_lead_key/);
  assert.match(service, /findUnique\(\{\s*where: \{ idempotencyKey:/);
  assert.doesNotMatch(service, /consentBasis|consent_basis/);
  assert.doesNotMatch(service, /buyer\.profile_changed/);
});
