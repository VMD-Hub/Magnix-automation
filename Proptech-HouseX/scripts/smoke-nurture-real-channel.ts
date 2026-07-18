/**
 * SC-6 nurture real-channel smoke (Wave 3).
 *
 * Fail-closed unless both:
 *   TELESALES_SERVER_SEND_ENABLED=true
 *   SMOKE_NURTURE_REAL_CHANNEL=1
 *
 * SMS: set SMS_WEBHOOK_URL, OR leave it empty and the script auto-wires the
 * local smoke sink (Next.js must have SMOKE_SMS_SINK_ENABLED=true + pm2 restart).
 *
 * OA path: SMOKE_NURTURE_CHANNEL=oa SMOKE_ZALO_USER_ID=...
 *
 * Usage (sink path — recommended when no n8n SMS):
 *   # once in .env: SMOKE_SMS_SINK_ENABLED=true  then build + pm2 restart
 *   TELESALES_SERVER_SEND_ENABLED=true SMOKE_NURTURE_REAL_CHANNEL=1 \
 *     npm run go-live:smoke-nurture-real
 *
 * Output: reports/nurture-real-channel-smoke-<stamp>.json (IDs only).
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../lib/prisma";
import {
  checkNurtureEligibility,
  enrollNurture,
  recordConsent,
} from "../lib/sales-core/service";
import {
  isTelesalesServerSendEnabled,
  sendTelesalesServerChannels,
} from "../lib/messaging/telesales-server-send";
import { isTelesalesSmsWebhookConfigured } from "../lib/messaging/sms-webhook-provider";
import { isTelesalesOaSendEnabled } from "../lib/messaging/zalo-oa-provider";

const DEFAULT_SMS_SINK_URL =
  "http://127.0.0.1:3000/api/admin/smoke/sms-webhook-sink";

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

function realChannelArmed(): boolean {
  const v = process.env.SMOKE_NURTURE_REAL_CHANNEL?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

/** Empty SMS_WEBHOOK_URL in .env counts as unset — wire local sink for this process. */
function ensureSmsWebhookForSmoke(): void {
  const current = process.env.SMS_WEBHOOK_URL?.trim() ?? "";
  if (current) return;
  const sinkUrl =
    process.env.SMOKE_SMS_SINK_URL?.trim() || DEFAULT_SMS_SINK_URL;
  process.env.SMS_WEBHOOK_URL = sinkUrl;
  ok(`Auto-wired SMS_WEBHOOK_URL → ${sinkUrl} (smoke sink)`);
}

async function probeSmsSink(url: string): Promise<void> {
  if (!url.includes("/api/admin/smoke/sms-webhook-sink")) return;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "telesales.sms",
        leadId: "probe",
        phone: "000",
        text: "probe",
        correlationId: "smoke-probe",
        idempotencyKey: "smoke-probe",
        sentAt: new Date().toISOString(),
      }),
      cache: "no-store",
    });
    if (res.status === 403) {
      fail(
        "SMS smoke sink is DISABLED on the running housex process.\n" +
          "  In .env set: SMOKE_SMS_SINK_ENABLED=true\n" +
          "  Then: npm run build && pm2 restart housex\n" +
          "  Re-run this smoke. Disable SMOKE_SMS_SINK_ENABLED after PASS.",
      );
    }
    if (res.status === 404) {
      fail(
        "SMS smoke sink route 404 — pull latest (69fc0f7+) and rebuild:\n" +
          "  cd /opt/housex && git pull --ff-only && cd Proptech-HouseX\n" +
          "  npm run build && pm2 restart housex",
      );
    }
  } catch (err) {
    fail(
      `Cannot reach SMS webhook at ${url}: ${
        err instanceof Error ? err.message : String(err)
      }\n  Is pm2 housex online on :3000?`,
    );
  }
}

async function main() {
  if (!realChannelArmed()) {
    fail(
      "SMOKE_NURTURE_REAL_CHANNEL must be 1 (fail-closed). Refusing real channel send.",
    );
  }
  if (!isTelesalesServerSendEnabled()) {
    fail(
      "TELESALES_SERVER_SEND_ENABLED must be true. Enable only for this smoke, then disable.",
    );
  }

  const channelEnv = (process.env.SMOKE_NURTURE_CHANNEL ?? "sms")
    .trim()
    .toLowerCase();
  const channel = channelEnv === "oa" ? "oa" : "sms";

  if (channel === "sms") {
    ensureSmsWebhookForSmoke();
    if (!isTelesalesSmsWebhookConfigured()) {
      fail("SMS_WEBHOOK_URL still empty after auto-wire — unexpected.");
    }
    await probeSmsSink(process.env.SMS_WEBHOOK_URL!.trim());
  }
  if (channel === "oa" && !isTelesalesOaSendEnabled()) {
    fail(
      "OA notify/creds not enabled — cannot smoke real OA channel. Set ZALO_OA_NOTIFY_ENABLED + tokens.",
    );
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const actorId = "smoke-nurture-real";
  const correlationId = `smoke-nurture-real-${Date.now()}`;
  const phoneSuffix = String(Date.now()).slice(-7);
  const normalizedPhone = `8495${phoneSuffix.padStart(7, "0")}`.slice(0, 11);
  const displayPhone = `095${phoneSuffix.padStart(7, "0")}`.slice(0, 10);
  const zaloUserId = process.env.SMOKE_ZALO_USER_ID?.trim() || null;

  if (channel === "oa" && !zaloUserId) {
    fail("SMOKE_ZALO_USER_ID required for OA real-channel smoke.");
  }

  let customerUserId: string | null = null;
  if (channel === "oa" && zaloUserId) {
    const user = await prisma.userAccount.create({
      data: {
        role: "CUSTOMER",
        name: "Smoke Nurture Real",
        phone: displayPhone,
        normalizedPhone,
        email: `smoke-nurture-real-${phoneSuffix}@example.invalid`,
        emailVerified: true,
        emailVerifiedAt: new Date(),
        passwordHash: "smoke-nurture-real-not-a-real-hash",
        zaloUserId,
      },
    });
    customerUserId = user.id;
  }

  const customer = await prisma.customer.create({
    data: {
      name: "Smoke Nurture Real",
      phone: displayPhone,
      normalizedPhone,
      email: null,
      ...(customerUserId ? { userAccountId: customerUserId } : {}),
    },
  });

  const lead = await prisma.lead.create({
    data: {
      customerId: customer.id,
      source: "smoke_nurture_real",
      segment: "NOXH",
      status: "CONTACTED",
      message: "synthetic nurture real-channel smoke — safe to delete",
      opsMeta: {
        smoke: true,
        correlationId,
        channels: { phone: displayPhone },
      },
    },
  });

  await recordConsent({
    subjectType: "LEAD",
    subjectId: lead.id,
    leadId: lead.id,
    purpose: "marketing",
    channel,
    action: "GRANTED",
    proofType: "smoke",
    proofRef: null,
    proofMetadata: { smoke: true, realChannel: true },
    policyVersion: "nurture-real-v1",
    actorId,
    source: "smoke_nurture_real",
    occurredAt: new Date(),
    correlationId: `${correlationId}:consent`,
    idempotencyKey: `${correlationId}:consent`,
  });
  ok(`Consent GRANTED marketing/${channel}`);

  const eligible = await checkNurtureEligibility({
    leadId: lead.id,
    purpose: "marketing",
    channel,
  });
  assert(eligible.eligible, "Expected eligible after grant");

  const send = await sendTelesalesServerChannels({
    leadId: lead.id,
    channels: [channel],
    actorId,
    correlationId: `${correlationId}:send`,
    idempotencyKey: `${correlationId}:send`,
  });
  const outcome = send.results[0];
  assert(outcome, "Expected one channel result");
  assert(
    outcome.status === "SENT",
    `Expected SENT, got ${outcome.status} (${outcome.reason ?? "—"})`,
  );
  ok(`Real ${channel} SENT dispatch=${outcome.dispatchId}`);

  // Withdraw must block further enroll
  await recordConsent({
    subjectType: "LEAD",
    subjectId: lead.id,
    leadId: lead.id,
    purpose: "marketing",
    channel,
    action: "WITHDRAWN",
    proofType: "smoke",
    proofRef: null,
    proofMetadata: { smoke: true },
    policyVersion: "nurture-real-v1",
    actorId,
    source: "smoke_nurture_real",
    occurredAt: new Date(),
    correlationId: `${correlationId}:withdraw`,
    idempotencyKey: `${correlationId}:withdraw`,
  });

  let enrollBlocked = false;
  try {
    await enrollNurture({
      leadId: lead.id,
      purpose: "marketing",
      channel,
      scriptId: "telesales-miss-callback",
      actorId,
      correlationId: `${correlationId}:enroll-blocked`,
      idempotencyKey: `${correlationId}:enroll-blocked`,
      action: "enroll",
    });
  } catch {
    enrollBlocked = true;
  }
  assert(enrollBlocked, "Enroll must fail after withdraw");
  ok("Withdraw blocks further enroll");

  await prisma.lead.update({
    where: { id: lead.id },
    data: {
      status: "LOST",
      opsMeta: {
        smoke: true,
        correlationId,
        cleanup: "nurture_real_channel",
      },
    },
  });

  if (customerUserId) {
    await prisma.customer.update({
      where: { id: customer.id },
      data: { userAccountId: null },
    });
    await prisma.userAccount
      .delete({ where: { id: customerUserId } })
      .catch(() => undefined);
  }

  const evidence = {
    result: "passed",
    at: new Date().toISOString(),
    slice: "SC-6 real-channel",
    channel,
    ids: {
      correlationId,
      leadId: lead.id,
      enrollmentId: outcome.enrollmentId,
      dispatchId: outcome.dispatchId,
      dispatchStatus: outcome.status,
    },
    checks: [
      "kill_switch_armed",
      "consent_granted",
      "real_channel_sent",
      "withdraw_blocks_enroll",
    ],
    note: "One real provider send observed. Kill switch should be disabled after smoke if only enabled for this run. Phone/Zalo IDs not logged.",
  };

  const reportsDir = path.join(process.cwd(), "reports");
  await mkdir(reportsDir, { recursive: true });
  const reportPath = path.join(
    reportsDir,
    `nurture-real-channel-smoke-${stamp}.json`,
  );
  await writeFile(reportPath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");

  ok("Nurture real-channel smoke passed");
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
