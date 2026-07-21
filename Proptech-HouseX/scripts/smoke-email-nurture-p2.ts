/**
 * ADR-017 P2 smoke: newsletter/digest A/B + hard bounce suppress.
 *
 * Usage:
 *   EMAIL_NURTURE_SEND_ENABLED=1 npm run go-live:smoke-email-nurture-p2
 *
 * Requires migrate: email_engagement_events + nurture_dispatches metadata.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../lib/prisma";
import { grantMarketingEmailConsent } from "../lib/sales-core/marketing-email-consent";
import { checkNurtureEligibility } from "../lib/sales-core/service";
import {
  EMAIL_NURTURE_CHANNEL,
  MARKETING_PURPOSE,
} from "../lib/sales-core/marketing-email-consent";
import { dispatchEmailCampaign } from "../lib/messaging/email-campaign-send";
import { isEmailNurtureSendEnabled } from "../lib/messaging/email-nurture-server-send";
import { handleProviderEmailEvent } from "../lib/email/email-provider-events";
import { pickAbSubject, isoWeekCampaignKey } from "../lib/email/ab-subject";
import { WEEKLY_NEWSLETTER_SUBJECTS } from "../lib/email/weekly-newsletter";

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
    process.env.AUTH_SECRET = "smoke-email-nurture-p2-secret";
  }
  assert(isEmailNurtureSendEnabled(), "EMAIL_NURTURE_SEND_ENABLED required");

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const correlationId = `smoke-email-p2-${Date.now()}`;
  const weekKey = isoWeekCampaignKey();
  const phoneSuffix = String(Date.now()).slice(-7);
  const normalizedPhone = `8493${phoneSuffix.padStart(7, "0")}`.slice(0, 11);
  const displayPhone = `093${phoneSuffix.padStart(7, "0")}`.slice(0, 10);
  const email = `smoke.p2.${Date.now()}@example.test`;

  const ab = pickAbSubject({
    leadId: "00000000-0000-4000-8000-000000000001",
    campaignKey: `weekly_newsletter:${weekKey}`,
    subjectA: WEEKLY_NEWSLETTER_SUBJECTS.A,
    subjectB: WEEKLY_NEWSLETTER_SUBJECTS.B,
    testPercent: 15,
  });
  assert(ab.variant === "A" || ab.variant === "B", "AB variant");
  ok(`A/B helper ok variant=${ab.variant}`);

  const customer = await prisma.customer.create({
    data: {
      name: "Smoke Email Nurture P2",
      phone: displayPhone,
      normalizedPhone,
      email,
    },
  });
  const lead = await prisma.lead.create({
    data: {
      customerId: customer.id,
      source: "smoke_email_nurture_p2",
      segment: "NOXH",
      status: "NEW",
      message: "synthetic ADR-017 P2 smoke",
      opsMeta: {
        smoke: true,
        channels: { email, phone: displayPhone },
      },
    },
  });

  const grant = await grantMarketingEmailConsent({
    leadId: lead.id,
    source: "smoke_email_nurture_p2",
    proofType: "smoke",
  });
  assert(grant.granted, "grant failed");

  const sent = await dispatchEmailCampaign({
    leadId: lead.id,
    kind: "weekly_newsletter",
    actorId: "smoke-p2",
    correlationId: `${correlationId}:weekly`,
    weekKey,
  });
  assert(sent.status === "SENT", `newsletter expected SENT got ${sent.status}:${sent.reason}`);
  assert(sent.dispatchId, "missing dispatchId");
  assert(sent.abVariant, "missing abVariant");
  ok(`Newsletter SENT ab=${sent.abVariant} provider=${sent.provider}`);

  const dispatch = await prisma.nurtureDispatch.findUniqueOrThrow({
    where: { id: sent.dispatchId! },
  });
  assert(dispatch.providerMessageId, "providerMessageId missing on dispatch");

  const bounce = await handleProviderEmailEvent({
    type: "bounce",
    bounceClass: "hard",
    providerMessageId: dispatch.providerMessageId,
    leadId: lead.id,
    dispatchId: dispatch.id,
    campaignKey: sent.campaignKey,
    rawType: "smoke.bounced",
  });
  assert(bounce.suppressed, `bounce should suppress: ${bounce.reason}`);
  ok("Hard bounce suppressed marketing email");

  const after = await checkNurtureEligibility({
    leadId: lead.id,
    purpose: MARKETING_PURPOSE,
    channel: EMAIL_NURTURE_CHANNEL,
  });
  assert(!after.eligible, "expected ineligible after bounce");

  const digest = await dispatchEmailCampaign({
    leadId: lead.id,
    kind: "waitlist_digest",
    actorId: "smoke-p2",
    correlationId: `${correlationId}:digest`,
    weekKey,
  });
  assert(
    digest.status === "SKIPPED",
    `digest after bounce expected SKIPPED got ${digest.status}`,
  );
  ok(`Digest skipped after suppress (${digest.reason})`);

  const report = {
    stamp,
    correlationId,
    weekKey,
    leadId: lead.id,
    newsletter: {
      status: sent.status,
      abVariant: sent.abVariant,
      dispatchId: sent.dispatchId,
      providerMessageId: dispatch.providerMessageId,
    },
    bounce,
    postEligibility: after.suppressionReason,
    digest: { status: digest.status, reason: digest.reason },
  };

  const dir = path.join(process.cwd(), "reports");
  await mkdir(dir, { recursive: true });
  const out = path.join(dir, `email-nurture-p2-smoke-${stamp}.json`);
  await writeFile(out, JSON.stringify(report, null, 2), "utf8");
  ok(`Wrote ${out}`);

  await prisma.lead.delete({ where: { id: lead.id } }).catch(() => undefined);
  await prisma.customer
    .delete({ where: { id: customer.id } })
    .catch(() => undefined);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
