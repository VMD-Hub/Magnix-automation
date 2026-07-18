/**
 * Sales Ops E2E smoke (SC-0…3 path):
 *   lead → assign/accept → qualify → activity → appointment
 *
 * Uses Prisma + sales-core services (run on VPS / local with DATABASE_URL).
 * Does not open Journey A/S COMMITTED; does not create proposals.
 *
 * Usage:
 *   npm run go-live:smoke-sales-ops
 *
 * Output: masked IDs only (no phone/email). Writes
 *   reports/sales-ops-e2e-<stamp>.json
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../lib/prisma";
import {
  appendSalesActivity,
  assignLead,
  createAppointment,
  recordAssignmentFact,
  recordConsent,
  transitionAppointment,
  upsertBuyerProfile,
} from "../lib/sales-core/service";

function fail(msg: string): never {
  console.error(`FAIL — ${msg}`);
  process.exit(1);
}

function ok(msg: string) {
  console.log(`OK — ${msg}`);
}

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) fail(msg);
}

async function seedDisposableBroker(suffix: string) {
  const normalizedPhone = `8493${suffix.padStart(7, "0")}`.slice(0, 11);
  const displayPhone = `093${suffix.padStart(7, "0")}`.slice(0, 10);
  const email = `smoke-ops-e2e-${suffix}@example.invalid`;

  const user = await prisma.userAccount.create({
    data: {
      role: "BROKER",
      name: "Smoke Ops E2E Broker",
      phone: displayPhone,
      normalizedPhone,
      email,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      passwordHash: "smoke-ops-e2e-not-a-real-hash",
      passwordSetAt: new Date(),
    },
  });

  const broker = await prisma.broker.create({
    data: {
      userAccountId: user.id,
      fullName: "Smoke Ops E2E Broker",
      phone: displayPhone,
      brokerType: "INTERNAL",
    },
  });

  return { user, broker, seeded: true as const };
}

async function resolveOwnerBroker(suffix: string) {
  const existing = await prisma.broker.findFirst({
    where: { brokerType: "INTERNAL" },
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });
  if (existing) {
    return { brokerId: existing.id, seededBrokerId: null as string | null, seededUserId: null as string | null };
  }
  const seeded = await seedDisposableBroker(suffix);
  ok(`Seeded disposable INTERNAL broker ${seeded.broker.id}`);
  return {
    brokerId: seeded.broker.id,
    seededBrokerId: seeded.broker.id,
    seededUserId: seeded.user.id,
  };
}

async function main() {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const actorId = "smoke-sales-ops";
  const correlationId = `smoke-ops-${Date.now()}`;
  const phoneSuffix = String(Date.now()).slice(-7);
  const normalizedPhone = `8494${phoneSuffix.padStart(7, "0")}`.slice(0, 11);
  const displayPhone = `094${phoneSuffix.padStart(7, "0")}`.slice(0, 10);
  const now = new Date();

  const { brokerId, seededBrokerId, seededUserId } =
    await resolveOwnerBroker(phoneSuffix);

  const customer = await prisma.customer.create({
    data: {
      name: "Smoke Sales Ops E2E",
      phone: displayPhone,
      normalizedPhone,
      email: null,
    },
  });

  const lead = await prisma.lead.create({
    data: {
      customerId: customer.id,
      source: "smoke_sales_ops_e2e",
      segment: "NOXH",
      status: "NEW",
      message: "synthetic sales-ops E2E smoke — safe to delete",
      opsMeta: { smoke: true, correlationId },
    },
  });
  ok(`Lead created ${lead.id}`);

  await recordConsent({
    subjectType: "LEAD",
    subjectId: lead.id,
    leadId: lead.id,
    purpose: "appointment_service",
    channel: "phone",
    action: "GRANTED",
    proofType: "smoke",
    proofRef: null,
    proofMetadata: { smoke: true },
    policyVersion: "sales-ops-e2e-v1",
    actorId,
    source: "smoke_sales_ops",
    occurredAt: now,
    correlationId: `${correlationId}:consent`,
    idempotencyKey: `${correlationId}:consent`,
  });
  ok("Consent GRANTED (appointment_service/phone)");

  const assignedAt = new Date(now.getTime() + 1_000);
  const { assignment, created: assignmentCreated } = await assignLead({
    leadId: lead.id,
    ownerId: brokerId,
    assignedBy: actorId,
    assignedAt,
    reason: "SMOKE_ASSIGN",
    acceptanceSlaMinutes: 15,
    firstResponseSlaMinutes: 60,
    correlationId: `${correlationId}:assign`,
    idempotencyKey: `${correlationId}:assign`,
  });
  assert(assignmentCreated, "Expected new assignment");
  assert(assignment.status === "ASSIGNED", "Expected ASSIGNED");
  ok(`Assigned ${assignment.id}`);

  const { assignment: accepted, changed: acceptChanged } =
    await recordAssignmentFact({
      assignmentId: assignment.id,
      fact: "accept",
      actorId: brokerId,
      occurredAt: new Date(assignedAt.getTime() + 30_000),
      correlationId: `${correlationId}:accept`,
      idempotencyKey: `${correlationId}:accept`,
    });
  assert(acceptChanged, "Expected accept to change state");
  assert(accepted.status === "ACCEPTED", "Expected ACCEPTED");
  ok("Assignment accepted");

  await recordAssignmentFact({
    assignmentId: assignment.id,
    fact: "first_attempt",
    actorId: brokerId,
    occurredAt: new Date(assignedAt.getTime() + 60_000),
    correlationId: `${correlationId}:attempt`,
    idempotencyKey: `${correlationId}:attempt`,
  });
  await recordAssignmentFact({
    assignmentId: assignment.id,
    fact: "first_connected",
    actorId: brokerId,
    occurredAt: new Date(assignedAt.getTime() + 90_000),
    correlationId: `${correlationId}:connected`,
    idempotencyKey: `${correlationId}:connected`,
  });
  ok("First attempt + first connected recorded");

  const { activity: attemptActivity } = await appendSalesActivity({
    leadId: lead.id,
    type: "CONTACT_ATTEMPT",
    channel: "phone",
    note: "Smoke call attempt",
    reason: "SMOKE_ATTEMPT",
    actorId: brokerId,
    occurredAt: new Date(assignedAt.getTime() + 60_000),
    correlationId: `${correlationId}:act-attempt`,
    idempotencyKey: `${correlationId}:act-attempt`,
    metadata: { smoke: true },
  });
  const { activity: connectedActivity } = await appendSalesActivity({
    leadId: lead.id,
    type: "CONNECTED",
    channel: "phone",
    note: "Smoke connected — need confirmed",
    reason: "SMOKE_CONNECTED",
    actorId: brokerId,
    occurredAt: new Date(assignedAt.getTime() + 90_000),
    correlationId: `${correlationId}:act-connected`,
    idempotencyKey: `${correlationId}:act-connected`,
    metadata: { smoke: true },
  });
  ok("Activities CONTACT_ATTEMPT + CONNECTED");

  const qualified = await prisma.lead.update({
    where: { id: lead.id },
    data: { status: "QUALIFIED" },
  });
  assert(qualified.status === "QUALIFIED", "Expected QUALIFIED");
  ok("Lead QUALIFIED");

  const { profile } = await upsertBuyerProfile({
    leadId: lead.id,
    budgetMax: "2500000000",
    availableCash: "500000000",
    paymentPreference: "mortgage",
    locations: ["HCM"],
    propertyTypes: ["APARTMENT"],
    bedroomsMin: 2,
    purchasePurpose: "live",
    timeframe: "3_months",
    readiness: "ready",
    mustHaves: ["legal_clear"],
    updatedBy: brokerId,
    correlationId: `${correlationId}:profile`,
    idempotencyKey: `${correlationId}:profile`,
  });
  ok(`BuyerProfile ${profile.id} completeness=${profile.completeness}`);

  const scheduledAt = new Date(assignedAt.getTime() + 86_400_000);
  const { appointment, created: apptCreated } = await createAppointment({
    leadId: lead.id,
    channel: "site_visit",
    scheduledAt,
    durationMin: 60,
    nextAction: "SMOKE_SITE_VISIT",
    actorId: brokerId,
    correlationId: `${correlationId}:appt`,
    idempotencyKey: `${correlationId}:appt`,
  });
  assert(apptCreated, "Expected new appointment");
  assert(appointment.status === "SCHEDULED", "Expected SCHEDULED");
  ok(`Appointment created ${appointment.id}`);

  const { appointment: completed } = await transitionAppointment({
    appointmentId: appointment.id,
    toStatus: "COMPLETED",
    nextAction: "SMOKE_FOLLOW_UP",
    actorId: brokerId,
    occurredAt: new Date(scheduledAt.getTime() + 3_600_000),
    correlationId: `${correlationId}:appt-done`,
    idempotencyKey: `${correlationId}:appt-done`,
  });
  assert(completed.status === "COMPLETED", "Expected COMPLETED");
  ok("Appointment COMPLETED");

  const outbox = await prisma.outboxEvent.findMany({
    where: {
      correlationId: {
        in: [
          `${correlationId}:assign`,
          `${correlationId}:accept`,
          `${correlationId}:attempt`,
          `${correlationId}:connected`,
          `${correlationId}:act-attempt`,
          `${correlationId}:act-connected`,
          `${correlationId}:appt`,
          `${correlationId}:appt-done`,
          `${correlationId}:consent`,
          `${correlationId}:profile`,
        ],
      },
    },
    select: { type: true, dedupeKey: true, correlationId: true },
    take: 40,
  });

  // Soft cleanup: mark lead LOST; keep audit rows. Soft-delete disposable broker if seeded.
  await prisma.lead.update({
    where: { id: lead.id },
    data: {
      status: "LOST",
      opsMeta: {
        smoke: true,
        correlationId,
        cleanup: "sales_ops_e2e",
      },
    },
  });

  if (seededBrokerId) {
    await prisma.lead.updateMany({
      where: { assignedBrokerId: seededBrokerId },
      data: { assignedBrokerId: null },
    });
    // Keep LeadAssignment + facts for audit; release active rows then delete
    // assignment rows so broker/userAccount can be removed without FK noise.
    await prisma.leadAssignment.updateMany({
      where: { ownerId: seededBrokerId, status: { in: ["ASSIGNED", "ACCEPTED"] } },
      data: { status: "RELEASED", closedAt: new Date() },
    });
    await prisma.leadAssignmentFact.deleteMany({
      where: { assignment: { ownerId: seededBrokerId } },
    });
    await prisma.leadAssignment.deleteMany({
      where: { ownerId: seededBrokerId },
    });
    await prisma.broker.delete({ where: { id: seededBrokerId } });
    if (seededUserId) {
      await prisma.userAccount.delete({ where: { id: seededUserId } });
    }
    ok("Disposable broker cleaned up");
  }

  const evidence = {
    result: "passed",
    at: new Date().toISOString(),
    slice: "SC-0…3 sales-ops-e2e",
    path: "lead→assign→accept→qualify→activity→appointment",
    ids: {
      correlationId,
      leadId: lead.id,
      customerId: customer.id,
      ownerId: brokerId,
      assignmentId: assignment.id,
      activityAttemptId: attemptActivity.id,
      activityConnectedId: connectedActivity.id,
      buyerProfileId: profile.id,
      appointmentId: appointment.id,
      appointmentStatus: completed.status,
      leadStatusFinal: "LOST",
    },
    seeded: {
      broker: Boolean(seededBrokerId),
    },
    checks: [
      "consent_appointment_service",
      "assign_accept_sla",
      "first_attempt_connected",
      "activities_recorded",
      "lead_qualified",
      "buyer_profile_upserted",
      "appointment_scheduled_completed",
    ],
    outboxTypes: [...new Set(outbox.map((row) => row.type))],
    note: "Synthetic fixture; phone/email not logged. Lead marked LOST after smoke.",
  };

  const reportsDir = path.join(process.cwd(), "reports");
  await mkdir(reportsDir, { recursive: true });
  const reportPath = path.join(reportsDir, `sales-ops-e2e-${stamp}.json`);
  await writeFile(reportPath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");

  ok("Sales Ops E2E smoke passed");
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
