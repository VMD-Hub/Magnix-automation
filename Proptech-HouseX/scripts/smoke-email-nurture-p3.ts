/**
 * ADR-017 P3 smoke: CCTM utility + inactive re-engage + ESP dry_run sync.
 *
 * Usage:
 *   EMAIL_NURTURE_SEND_ENABLED=1 EMAIL_ESP_ADAPTER=dry_run npm run go-live:smoke-email-nurture-p3
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../lib/prisma";
import { grantMarketingEmailConsent } from "../lib/sales-core/marketing-email-consent";
import {
  dispatchCctmUtilityEmail,
  dispatchInactiveReengage,
  syncEspAudienceFromHouseX,
  tryEnrollCctmUtilityAfterConsent,
} from "../lib/messaging/email-p3-campaigns";
import { isEmailNurtureSendEnabled } from "../lib/messaging/email-nurture-server-send";
import { resolveEspAdapterMode } from "../lib/email/esp-adapter";
import {
  getNurtureScript,
  CCTM_UTILITY_EMAIL_SCRIPT_ID,
  INACTIVE_REENGAGE_SCRIPT_ID,
} from "../lib/leads/nurture-scripts";
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
  process.env.EMAIL_ESP_ADAPTER =
    process.env.EMAIL_ESP_ADAPTER?.trim() || "dry_run";
  if (!process.env.AUTH_SECRET?.trim()) {
    process.env.AUTH_SECRET = "smoke-email-nurture-p3-secret";
  }
  assert(isEmailNurtureSendEnabled(), "send kill switch");
  assert(resolveEspAdapterMode() !== "none", "ESP adapter");
  assert(getNurtureScript(CCTM_UTILITY_EMAIL_SCRIPT_ID)?.channel === "email");
  assert(getNurtureScript(INACTIVE_REENGAGE_SCRIPT_ID)?.channel === "email");

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const correlationId = `smoke-email-p3-${Date.now()}`;
  const phoneSuffix = String(Date.now()).slice(-7);
  const normalizedPhone = `8494${phoneSuffix.padStart(7, "0")}`.slice(0, 11);
  const displayPhone = `094${phoneSuffix.padStart(7, "0")}`.slice(0, 10);
  const email = `smoke.p3.${Date.now()}@example.test`;

  const customer = await prisma.customer.create({
    data: {
      name: "Smoke Email Nurture P3",
      phone: displayPhone,
      normalizedPhone,
      email,
    },
  });
  const lead = await prisma.lead.create({
    data: {
      customerId: customer.id,
      source: "smoke_email_nurture_p3",
      segment: "CCTM",
      status: "NEW",
      message: "synthetic ADR-017 P3 smoke",
      opsMeta: { smoke: true, channels: { email, phone: displayPhone } },
    },
  });

  const grant = await grantMarketingEmailConsent({
    leadId: lead.id,
    source: "smoke_email_nurture_p3",
    proofType: "smoke",
  });
  assert(grant.granted, "grant");

  const enroll = await tryEnrollCctmUtilityAfterConsent({ leadId: lead.id });
  assert(enroll.enrolled, `cctm enroll: ${enroll.reason}`);

  const cctm = await dispatchCctmUtilityEmail({
    leadId: lead.id,
    actorId: "smoke-p3",
    correlationId: `${correlationId}:cctm`,
  });
  assert(cctm.status === "SENT", `cctm ${cctm.status}:${cctm.reason}`);
  ok(`CCTM utility SENT ab=${cctm.abVariant}`);

  const reengage = await dispatchInactiveReengage({
    leadId: lead.id,
    actorId: "smoke-p3",
    correlationId: `${correlationId}:reengage`,
  });
  assert(
    reengage.status === "SENT",
    `reengage ${reengage.status}:${reengage.reason}`,
  );
  ok(`Inactive reengage SENT ab=${reengage.abVariant}`);

  const sync = await syncEspAudienceFromHouseX({ limit: 20 });
  assert(sync.adapter === "dry_run", `adapter=${sync.adapter}`);
  assert(sync.upserted >= 1, "expected at least one ESP upsert");
  ok(`ESP dry_run upserted=${sync.upserted}`);

  const report = {
    stamp,
    correlationId,
    leadId: lead.id,
    cctm,
    reengage,
    sync,
  };
  const dir = path.join(process.cwd(), "reports");
  await mkdir(dir, { recursive: true });
  const out = path.join(dir, `email-nurture-p3-smoke-${stamp}.json`);
  await writeFile(out, JSON.stringify(report, null, 2), "utf8");
  ok(`Wrote ${out}`);

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
