import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { buyerProfileIdempotencyHash } from "../lib/sales-core/service";
import {
  activityCommandSchema,
  opportunityCommandSchema,
} from "../lib/validation/sales-core";

const root = new URL("../", import.meta.url);

test("state transitions lock rows and buyer profile updates use CAS", async () => {
  const service = await readFile(
    new URL("lib/sales-core/service.ts", root),
    "utf8",
  );

  assert.match(
    service,
    /FROM "opportunities"[\s\S]*?FOR UPDATE[\s\S]*?assertOpportunityTransition/,
  );
  assert.match(
    service,
    /FROM "appointments"[\s\S]*?FOR UPDATE[\s\S]*?assertAppointmentTransition/,
  );
  assert.match(
    service,
    /buyerProfile\.updateMany\(\{[\s\S]*?version: current\.version/,
  );
  assert.match(service, /updated\.count !== 1/);
});

test("cross-lead references and concurrent idempotent creates are guarded", async () => {
  const service = await readFile(
    new URL("lib/sales-core/service.ts", root),
    "utf8",
  );

  assert.match(service, /assertOpportunityBelongsToLead/);
  assert.match(service, /OPPORTUNITY_LEAD_MISMATCH/);
  for (const model of [
    "consentRecord",
    "opportunity",
    "salesActivity",
    "appointment",
    "buyerMatch",
  ]) {
    assert.match(
      service,
      new RegExp(
        `isUniqueConflict\\(error\\)[\\s\\S]*?prisma\\.${model}\\.findUnique`,
      ),
    );
  }
  assert.match(service, /IDEMPOTENCY_KEY_REUSED/);
});

test("assignment facts have fact-specific outbox dedupe keys", async () => {
  const service = await readFile(
    new URL("lib/sales-core/service.ts", root),
    "utf8",
  );
  assert.match(
    service,
    /lead\.assignment_changed:\$\{assignment\.id\}:\$\{fact\}:\$\{factIdempotencyKey\}/,
  );
  assert.match(service, /acceptedCorrelationId: input\.correlationId/);
  assert.match(service, /firstAttemptCorrelationId: input\.correlationId/);
  assert.match(service, /firstConnectedCorrelationId: input\.correlationId/);
});

test("commit transition accepts only stable typed evidence and audits reconciliation", async () => {
  const service = await readFile(
    new URL("lib/sales-core/service.ts", root),
    "utf8",
  );
  const base = {
    action: "transition" as const,
    opportunityId: "opportunity-1",
    toStage: "COMMITTED" as const,
    reason: "customer committed",
    actorId: "admin-1",
    occurredAt: "2026-07-17T10:00:00Z",
    correlationId: "corr-1",
  };
  assert.equal(
    opportunityCommandSchema.safeParse({
      ...base,
      commitEvidence: {
        referenceType: "UNIT_BOOKING",
        referenceId: "booking:confirmed/1",
      },
    }).success,
    true,
  );
  assert.equal(
    opportunityCommandSchema.safeParse({
      ...base,
      commitEvidence: {
        referenceType: "UNIT_BOOKING",
        referenceId: "not a stable reference",
      },
    }).success,
    false,
  );
  assert.match(service, /FROM "unit_bookings"[\s\S]*?FOR SHARE/);
  assert.match(service, /assertPrimaryCommitEvidenceRecord/);
  assert.match(service, /reconciliationStatus: "RECONCILED"/);
  assert.doesNotMatch(service, /PENDING_JOURNEY_RECONCILIATION/);
});

test("generic activity contract rejects reserved system activity types", () => {
  const base = {
    leadId: "lead-1",
    actorId: "admin-1",
    occurredAt: "2026-07-17T10:00:00Z",
    correlationId: "corr-1",
  };
  assert.equal(
    activityCommandSchema.safeParse({ ...base, type: "NOTE" }).success,
    true,
  );
  for (const type of [
    "STATE_TRANSITION",
    "APPOINTMENT_CREATED",
    "APPOINTMENT_UPDATED",
  ]) {
    assert.equal(
      activityCommandSchema.safeParse({ ...base, type }).success,
      false,
    );
  }
});

test("consent migration matches append-only Prisma behavior", async () => {
  const [schema, migration] = await Promise.all([
    readFile(new URL("prisma/schema.prisma", root), "utf8"),
    readFile(
      new URL(
        "prisma/migrations/20260717190000_sales_core_g1_foundation/migration.sql",
        root,
      ),
      "utf8",
    ),
  ]);

  const consentTable =
    migration.match(
      /CREATE TABLE "consent_records" \([\s\S]*?\n\);/,
    )?.[0] ?? "";
  const assignmentTable =
    migration.match(
      /CREATE TABLE "lead_assignments" \([\s\S]*?\n\);/,
    )?.[0] ?? "";
  for (const column of [
    "accepted_idempotency_key",
    "first_attempt_idempotency_key",
    "first_connected_idempotency_key",
  ]) {
    assert.doesNotMatch(consentTable, new RegExp(`"${column}" TEXT`));
    assert.match(assignmentTable, new RegExp(`"${column}" TEXT`));
  }
  assert.match(
    migration,
    /consent_records_lead_id_fkey[\s\S]*?ON DELETE RESTRICT/,
  );
  assert.match(
    migration,
    /consent_records_customer_id_fkey[\s\S]*?ON DELETE RESTRICT/,
  );
  assert.match(
    schema,
    /model ConsentRecord \{[\s\S]*?onDelete: Restrict[\s\S]*?onDelete: Restrict/,
  );
});

test("assignment and profile idempotency reject changed command input", async () => {
  const [service, migration] = await Promise.all([
    readFile(new URL("lib/sales-core/service.ts", root), "utf8"),
    readFile(
      new URL(
        "prisma/migrations/20260717190000_sales_core_g1_foundation/migration.sql",
        root,
      ),
      "utf8",
    ),
  ]);
  assert.match(
    service,
    /const sameInput = \(assignment:[\s\S]*?if \(!sameInput\(prior\)\) idempotencyConflict\(\)/,
  );
  const reassignmentClose =
    service.match(
      /if \(active\) \{[\s\S]*?await tx\.leadAssignment\.update\([\s\S]*?\n    \}/,
    )?.[0] ?? "";
  assert.doesNotMatch(reassignmentClose, /reason:/);
  assert.match(service, /buyerProfileMutation\.findUnique/);
  assert.match(service, /priorMutation\.inputHash !== inputHash/);
  assert.match(migration, /CREATE TABLE "buyer_profile_mutations"/);
  assert.match(
    migration,
    /buyer_profile_mutations_idempotency_key_key/,
  );

  const base = {
    leadId: "lead-1",
    budgetMax: "3000000000",
    locations: ["HCM"],
    updatedBy: "admin-1",
    correlationId: "corr-1",
    idempotencyKey: "profile-1",
  };
  assert.equal(
    buyerProfileIdempotencyHash(base),
    buyerProfileIdempotencyHash({ ...base }),
  );
  assert.notEqual(
    buyerProfileIdempotencyHash(base),
    buyerProfileIdempotencyHash({ ...base, budgetMax: "4000000000" }),
  );
});

test("assignment fact correlation migration is additive and sequential", async () => {
  const [schema, migration, service] = await Promise.all([
    readFile(new URL("prisma/schema.prisma", root), "utf8"),
    readFile(
      new URL(
        "prisma/migrations/20260717210000_sales_core_final_review_safety/migration.sql",
        root,
      ),
      "utf8",
    ),
    readFile(new URL("lib/sales-core/service.ts", root), "utf8"),
  ]);
  for (const field of [
    "acceptedCorrelationId",
    "firstAttemptCorrelationId",
    "firstConnectedCorrelationId",
  ]) {
    assert.match(schema, new RegExp(`${field}\\s+String\\?`));
  }
  assert.match(migration, /ALTER TABLE "lead_assignments"/);
  const assignmentAlter =
    migration.match(/ALTER TABLE "lead_assignments"[\s\S]*?;/)?.[0] ?? "";
  assert.doesNotMatch(assignmentAlter, /DROP|NOT NULL/);
  assert.match(schema, /model LeadAssignmentFact \{/);
  assert.match(
    migration,
    /CREATE UNIQUE INDEX "lead_assignment_facts_idempotency_key_key"/,
  );
  assert.match(migration, /duplicate legacy assignment fact idempotency keys/);
  assert.match(
    migration,
    /INSERT INTO "lead_assignment_facts"[\s\S]*?'accept'[\s\S]*?'first_attempt'[\s\S]*?'first_connected'/,
  );
  assert.match(
    migration,
    /"accepted_correlation_id"[\s\S]*?"correlation_id"/,
  );
  assert.match(service, /leadAssignmentFact\.findUnique/);
});

test("appointment events use fact keys and transition occurrence time", async () => {
  const service = await readFile(
    new URL("lib/sales-core/service.ts", root),
    "utf8",
  );
  assert.match(
    service,
    /`transition:\$\{input\.idempotencyKey\}`/,
  );
  assert.match(
    service,
    /`appointment\.updated:\$\{appointment\.id\}:\$\{factKey\}`/,
  );
  assert.match(
    service,
    /enqueueAppointmentEvent\(\s*tx,\s*appointment,\s*input\.occurredAt,/,
  );
  assert.match(
    service,
    /aggregateId: appointment\.id,[\s\S]*?occurredAt,/,
  );
  assert.doesNotMatch(
    service,
    /occurredAt: appointment\.scheduledAt/,
  );
});

test("opportunity events do not expose free-form reasons", async () => {
  const [service, eventTypes] = await Promise.all([
    readFile(new URL("lib/sales-core/service.ts", root), "utf8"),
    readFile(new URL("lib/events/types.ts", root), "utf8"),
  ]);
  const payload =
    service.match(
      /const payload = \{\s*opportunityId: opportunity\.id,[\s\S]*?assertMinimizedEventPayload\(payload\)/,
    )?.[0] ?? "";
  const eventContract =
    eventTypes.match(
      /"opportunity\.stage_changed": \{[\s\S]*?\n  \};/,
    )?.[0] ?? "";

  assert.doesNotMatch(payload, /reason:/);
  assert.doesNotMatch(eventContract, /reason:/);
});
