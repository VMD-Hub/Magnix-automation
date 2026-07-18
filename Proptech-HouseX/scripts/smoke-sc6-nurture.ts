/**
 * SC-6 nurture dry-run smoke (eligibility → enroll → dispatch → cancel → withdraw).
 *
 * Uses Prisma + sales-core services (run on VPS / local with DATABASE_URL).
 * Does not send real Zalo/OA/Telegram — records dispatch result only.
 *
 * Usage:
 *   npm run go-live:smoke-sc6
 *
 * Output: masked IDs only (no phone/email). Writes
 *   reports/sc6-nurture-smoke-<stamp>.json
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../lib/prisma";
import {
  checkNurtureEligibility,
  enrollNurture,
  recordConsent,
  recordNurtureDispatchResult,
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

async function main() {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const actorId = "smoke-sc6";
  const correlationId = `smoke-sc6-${Date.now()}`;
  const purpose = "marketing";
  const channel = "zalo";
  const scriptId = "noxh-zalo-ads-checklist";
  const phoneSuffix = String(Date.now()).slice(-7);
  const normalizedPhone = `8491${phoneSuffix.padStart(7, "0")}`.slice(0, 11);
  const displayPhone = `091${phoneSuffix.padStart(7, "0")}`.slice(0, 10);

  const customer = await prisma.customer.create({
    data: {
      name: "Smoke SC6 Nurture",
      phone: displayPhone,
      normalizedPhone,
      email: null,
    },
  });

  const lead = await prisma.lead.create({
    data: {
      customerId: customer.id,
      source: "smoke_sc6_nurture",
      segment: "NOXH",
      status: "NEW",
      message: "synthetic SC-6 smoke — safe to delete",
      opsMeta: { smoke: true, correlationId },
    },
  });

  const blocked = await checkNurtureEligibility({
    leadId: lead.id,
    purpose,
    channel,
    correlationId: `${correlationId}:elig-block`,
  });
  assert(!blocked.eligible, "Expected ineligible before consent grant");
  assert(
    blocked.suppressionReason === "CONSENT_NOT_GRANTED",
    `Expected CONSENT_NOT_GRANTED, got ${blocked.suppressionReason}`,
  );
  ok("Blocked without marketing consent");

  await recordConsent({
    subjectType: "LEAD",
    subjectId: lead.id,
    leadId: lead.id,
    purpose,
    channel,
    action: "GRANTED",
    proofType: "smoke",
    proofRef: null,
    proofMetadata: { smoke: true },
    policyVersion: "sc6-smoke-v1",
    actorId,
    source: "smoke_sc6",
    occurredAt: new Date(),
    correlationId: `${correlationId}:consent-grant`,
    idempotencyKey: `${correlationId}:consent-grant`,
  });

  const eligible = await checkNurtureEligibility({
    leadId: lead.id,
    purpose,
    channel,
    correlationId: `${correlationId}:elig-ok`,
  });
  assert(eligible.eligible, "Expected eligible after consent grant");
  assert(
    eligible.nextTouch === "ready_to_enroll",
    `Expected ready_to_enroll, got ${eligible.nextTouch}`,
  );
  ok("Eligible after consent grant");

  const { enrollment, created } = await enrollNurture({
    leadId: lead.id,
    purpose,
    channel,
    scriptId,
    cohortKey: "smoke-sc6",
    actorId,
    correlationId: `${correlationId}:enroll`,
    idempotencyKey: `${correlationId}:enroll`,
    action: "enroll",
  });
  assert(created, "Expected new enrollment");
  assert(enrollment.status === "ENROLLED", "Expected ENROLLED status");
  ok(`Enrolled ${enrollment.id}`);

  const { enrollment: again, created: dup } = await enrollNurture({
    leadId: lead.id,
    purpose,
    channel,
    scriptId,
    cohortKey: "smoke-sc6",
    actorId,
    correlationId: `${correlationId}:enroll`,
    idempotencyKey: `${correlationId}:enroll`,
    action: "enroll",
  });
  assert(!dup && again.id === enrollment.id, "Enroll must be idempotent");
  ok("Enroll idempotent");

  const { dispatch } = await recordNurtureDispatchResult({
    enrollmentId: enrollment.id,
    status: "SENT",
    actorId,
    occurredAt: new Date(),
    correlationId: `${correlationId}:dispatch`,
    idempotencyKey: `${correlationId}:dispatch`,
  });
  assert(dispatch.status === "SENT", "Expected SENT dispatch");
  ok(`Dispatch recorded ${dispatch.id}`);

  const afterDispatch = await checkNurtureEligibility({
    leadId: lead.id,
    purpose,
    channel,
  });
  assert(
    afterDispatch.nextTouch === "dispatch:SENT",
    `Expected dispatch:SENT, got ${afterDispatch.nextTouch}`,
  );
  assert(afterDispatch.enrollment?.id === enrollment.id, "Active enrollment");

  const { enrollment: cancelled } = await enrollNurture({
    leadId: lead.id,
    purpose,
    channel,
    scriptId,
    actorId,
    correlationId: `${correlationId}:cancel`,
    idempotencyKey: `${correlationId}:cancel`,
    action: "cancel",
  });
  assert(cancelled.status === "CANCELLED", "Expected CANCELLED");
  ok("Enrollment cancelled (stop)");

  const afterCancel = await checkNurtureEligibility({
    leadId: lead.id,
    purpose,
    channel,
  });
  assert(!afterCancel.eligible, "Expected ineligible after cancel");
  assert(
    afterCancel.suppressionReason === "ENROLLMENT_CANCELLED",
    `Expected ENROLLMENT_CANCELLED, got ${afterCancel.suppressionReason}`,
  );
  ok("Suppressed after cancel");

  // Second lead: grant then withdraw — enqueue/enroll blocked
  const phone2 = String(Date.now() + 1).slice(-7);
  const customer2 = await prisma.customer.create({
    data: {
      name: "Smoke SC6 Withdraw",
      phone: `092${phone2.padStart(7, "0")}`.slice(0, 10),
      normalizedPhone: `8492${phone2.padStart(7, "0")}`.slice(0, 11),
    },
  });
  const lead2 = await prisma.lead.create({
    data: {
      customerId: customer2.id,
      source: "smoke_sc6_nurture",
      segment: "NOXH",
      status: "NEW",
      message: "synthetic SC-6 withdraw smoke",
      opsMeta: { smoke: true, correlationId },
    },
  });
  await recordConsent({
    subjectType: "LEAD",
    subjectId: lead2.id,
    leadId: lead2.id,
    purpose,
    channel,
    action: "GRANTED",
    proofType: "smoke",
    proofRef: null,
    proofMetadata: { smoke: true },
    policyVersion: "sc6-smoke-v1",
    actorId,
    source: "smoke_sc6",
    occurredAt: new Date(Date.now() - 60_000),
    correlationId: `${correlationId}:grant2`,
    idempotencyKey: `${correlationId}:grant2`,
  });
  await recordConsent({
    subjectType: "LEAD",
    subjectId: lead2.id,
    leadId: lead2.id,
    purpose,
    channel,
    action: "WITHDRAWN",
    proofType: "smoke",
    proofRef: null,
    proofMetadata: { smoke: true },
    policyVersion: "sc6-smoke-v1",
    actorId,
    source: "smoke_sc6",
    occurredAt: new Date(),
    correlationId: `${correlationId}:withdraw2`,
    idempotencyKey: `${correlationId}:withdraw2`,
  });
  const afterWithdraw = await checkNurtureEligibility({
    leadId: lead2.id,
    purpose,
    channel,
  });
  assert(!afterWithdraw.eligible, "Expected ineligible after withdraw");
  assert(
    afterWithdraw.suppressionReason === "CONSENT_NOT_GRANTED",
    `Expected CONSENT_NOT_GRANTED after withdraw, got ${afterWithdraw.suppressionReason}`,
  );
  let enrollBlocked = false;
  try {
    await enrollNurture({
      leadId: lead2.id,
      purpose,
      channel,
      scriptId,
      actorId,
      correlationId: `${correlationId}:enroll-blocked`,
      idempotencyKey: `${correlationId}:enroll-blocked`,
      action: "enroll",
    });
  } catch {
    enrollBlocked = true;
  }
  assert(enrollBlocked, "Enroll must fail after consent withdraw");
  ok("Withdraw blocks enroll");

  const evidence = {
    result: "passed",
    at: new Date().toISOString(),
    slice: "SC-6",
    ids: {
      correlationId,
      leadId: lead.id,
      leadIdWithdraw: lead2.id,
      enrollmentId: enrollment.id,
      dispatchId: dispatch.id,
      cancelledEnrollmentId: cancelled.id,
      opportunityStage: null,
    },
    checks: [
      "blocked_without_consent",
      "eligible_after_grant",
      "enroll_idempotent",
      "dispatch_sent",
      "cancel_suppresses",
      "withdraw_blocks_enroll",
    ],
    note: "Dry-run only — no channel delivery. Phone not logged.",
  };

  const reportsDir = path.join(process.cwd(), "reports");
  await mkdir(reportsDir, { recursive: true });
  const reportPath = path.join(reportsDir, `sc6-nurture-smoke-${stamp}.json`);
  await writeFile(reportPath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");

  ok("SC-6 nurture smoke passed");
  console.log(JSON.stringify(evidence.ids, null, 2));
  ok(`evidence → ${reportPath}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => undefined);
  });
