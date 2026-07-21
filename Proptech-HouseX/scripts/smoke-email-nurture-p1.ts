/**
 * ADR-017 P1 — email nurture smoke: grant → enroll → E1 SENT → withdraw blocks.
 *
 * Uses DeliveryAdapter (webhook / Resend / dev_log). Does not require real ESP
 * when RESEND/EMAIL_WEBHOOK unset (dev_log counts as SENT for audit path).
 *
 * Usage:
 *   EMAIL_NURTURE_SEND_ENABLED=1 npm run go-live:smoke-email-nurture
 *
 * Optional real send: set RESEND_API_KEY or EMAIL_WEBHOOK_URL.
 * Output: reports/email-nurture-p1-smoke-<stamp>.json (IDs only).
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../lib/prisma";
import { checkNurtureEligibility } from "../lib/sales-core/service";
import {
  grantMarketingEmailConsent,
  withdrawMarketingEmailConsent,
  EMAIL_NURTURE_CHANNEL,
  MARKETING_PURPOSE,
} from "../lib/sales-core/marketing-email-consent";
import {
  dispatchNoxhWelcomeEmailStep,
  isEmailNurtureSendEnabled,
} from "../lib/messaging/email-nurture-server-send";
import { cleanupSmokeEmailFixture } from "./cleanup-smoke-email-fixture";

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
  process.env.EMAIL_NURTURE_SEND_ENABLED =
    process.env.EMAIL_NURTURE_SEND_ENABLED?.trim() || "1";
  if (!process.env.AUTH_SECRET?.trim()) {
    process.env.AUTH_SECRET = "smoke-email-nurture-auth-secret";
  }

  assert(
    isEmailNurtureSendEnabled(),
    "EMAIL_NURTURE_SEND_ENABLED must be on for this smoke",
  );

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const correlationId = `smoke-email-nurture-${Date.now()}`;
  const actorId = "smoke-email-nurture-p1";
  const phoneSuffix = String(Date.now()).slice(-7);
  const normalizedPhone = `8492${phoneSuffix.padStart(7, "0")}`.slice(0, 11);
  const displayPhone = `092${phoneSuffix.padStart(7, "0")}`.slice(0, 10);
  const email = `smoke.p1.${Date.now()}@example.test`;

  const customer = await prisma.customer.create({
    data: {
      name: "Smoke Email Nurture P1",
      phone: displayPhone,
      normalizedPhone,
      email,
    },
  });

  const lead = await prisma.lead.create({
    data: {
      customerId: customer.id,
      source: "smoke_email_nurture_p1",
      segment: "NOXH",
      status: "NEW",
      message: "synthetic ADR-017 P1 smoke — safe to delete",
      opsMeta: {
        smoke: true,
        correlationId,
        channels: { email, phone: displayPhone },
      },
    },
  });

  const blocked = await checkNurtureEligibility({
    leadId: lead.id,
    purpose: MARKETING_PURPOSE,
    channel: EMAIL_NURTURE_CHANNEL,
  });
  assert(!blocked.eligible, "Expected ineligible before consent");
  ok("Blocked without marketing email consent");

  const grant = await grantMarketingEmailConsent({
    leadId: lead.id,
    source: "smoke_email_nurture_p1",
    proofType: "smoke",
    actorId,
    correlationId: `${correlationId}:grant`,
  });
  assert(grant.granted, `Grant failed: ${"reason" in grant ? grant.reason : ""}`);
  ok("Granted marketing email consent");

  const e1 = await dispatchNoxhWelcomeEmailStep({
    leadId: lead.id,
    stepIndex: 1,
    actorId,
    correlationId: `${correlationId}:e1`,
  });
  assert(e1.status === "SENT", `E1 expected SENT, got ${e1.status}:${e1.reason}`);
  assert(e1.enrollmentId, "E1 missing enrollmentId");
  assert(e1.dispatchId, "E1 missing dispatchId");
  ok(`E1 SENT via ${e1.provider ?? "unknown"}`);

  const e1Again = await dispatchNoxhWelcomeEmailStep({
    leadId: lead.id,
    stepIndex: 1,
    actorId,
    correlationId: `${correlationId}:e1-idem`,
  });
  assert(
    e1Again.status === "SENT" && e1Again.dispatchId === e1.dispatchId,
    "E1 re-dispatch should be idempotent",
  );
  ok("E1 idempotent re-dispatch");

  const e2 = await dispatchNoxhWelcomeEmailStep({
    leadId: lead.id,
    stepIndex: 2,
    actorId,
    correlationId: `${correlationId}:e2`,
  });
  assert(e2.status === "SENT", `E2 expected SENT, got ${e2.status}:${e2.reason}`);
  ok(`E2 SENT via ${e2.provider ?? "unknown"}`);

  const withdraw = await withdrawMarketingEmailConsent({
    leadId: lead.id,
    source: "smoke_email_nurture_p1",
    actorId,
    correlationId: `${correlationId}:withdraw`,
    withdrawKey: `smoke-${stamp}`,
  });
  assert(withdraw.withdrawn, `Withdraw failed: ${withdraw.reason}`);
  ok("Withdrawn + enrollments cancelled");

  const after = await checkNurtureEligibility({
    leadId: lead.id,
    purpose: MARKETING_PURPOSE,
    channel: EMAIL_NURTURE_CHANNEL,
  });
  assert(!after.eligible, "Expected ineligible after withdraw");
  ok(`Post-withdraw blocked (${after.suppressionReason})`);

  const e3 = await dispatchNoxhWelcomeEmailStep({
    leadId: lead.id,
    stepIndex: 3,
    actorId,
    correlationId: `${correlationId}:e3`,
  });
  assert(
    e3.status === "SKIPPED",
    `E3 after withdraw expected SKIPPED, got ${e3.status}`,
  );
  ok(`E3 skipped after withdraw (${e3.reason})`);

  const report = {
    stamp,
    correlationId,
    leadId: lead.id,
    customerId: customer.id,
    e1: {
      status: e1.status,
      enrollmentId: e1.enrollmentId,
      dispatchId: e1.dispatchId,
      provider: e1.provider,
    },
    e2: {
      status: e2.status,
      dispatchId: e2.dispatchId,
      provider: e2.provider,
    },
    withdraw: {
      withdrawn: withdraw.withdrawn,
      enrollmentsCancelled: withdraw.enrollmentsCancelled,
    },
    postWithdrawReason: after.suppressionReason,
    e3: { status: e3.status, reason: e3.reason },
  };

  const reportsDir = path.join(process.cwd(), "reports");
  await mkdir(reportsDir, { recursive: true });
  const outPath = path.join(
    reportsDir,
    `email-nurture-p1-smoke-${stamp}.json`,
  );
  await writeFile(outPath, JSON.stringify(report, null, 2), "utf8");
  ok(`Wrote ${outPath}`);

  await cleanupSmokeEmailFixture({ leadId: lead.id, customerId: customer.id });
  ok("Cleaned synthetic lead/customer");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
