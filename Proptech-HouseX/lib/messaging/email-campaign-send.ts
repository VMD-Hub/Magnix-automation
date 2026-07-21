/**
 * ADR-017 P2 — weekly newsletter + waitlist digest dispatch (SC-6 email).
 */

import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { readLeadOpsMeta } from "@/lib/leads/ops-meta";
import {
  WAITLIST_EMAIL_DIGEST_SCRIPT_ID,
  WEEKLY_NEWSLETTER_SCRIPT_ID,
} from "@/lib/leads/nurture-scripts";
import {
  EMAIL_NURTURE_CHANNEL,
  MARKETING_PURPOSE,
} from "@/lib/sales-core/marketing-email-consent";
import {
  checkNurtureEligibility,
  enrollNurture,
  recordNurtureDispatchResult,
} from "@/lib/sales-core/service";
import { SalesCoreRuleError } from "@/lib/sales-core/domain";
import { sendMarketingEmail } from "@/lib/email/marketing-send";
import { buildEmailUnsubscribeUrlForLead } from "@/lib/email/unsubscribe-token";
import { isoWeekCampaignKey, pickAbSubject } from "@/lib/email/ab-subject";
import {
  buildWeeklyNewsletterEmail,
  WEEKLY_NEWSLETTER_SEQUENCE_ID,
  WEEKLY_NEWSLETTER_SUBJECTS,
} from "@/lib/email/weekly-newsletter";
import {
  buildWaitlistDigestEmail,
  WAITLIST_DIGEST_SEQUENCE_ID,
  WAITLIST_DIGEST_SUBJECTS,
} from "@/lib/email/waitlist-digest";
import {
  EmailNurtureSendError,
  isEmailNurtureSendEnabled,
} from "@/lib/messaging/email-nurture-server-send";

export type CampaignKind = "weekly_newsletter" | "waitlist_digest";

export type CampaignDispatchOutcome = {
  status: "SENT" | "FAILED" | "SKIPPED";
  reason: string | null;
  enrollmentId: string | null;
  dispatchId: string | null;
  provider: string | null;
  abVariant: "A" | "B" | null;
  campaignKey: string;
  kind: CampaignKind;
};

async function resolveLeadEmail(leadId: string): Promise<{
  email: string | null;
  name: string;
}> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      opsMeta: true,
      customer: { select: { email: true, name: true } },
    },
  });
  if (!lead) return { email: null, name: "" };
  const opsEmail = readLeadOpsMeta(lead.opsMeta).channels.email?.trim() || null;
  const email = opsEmail || lead.customer?.email?.trim() || null;
  return { email, name: lead.customer?.name?.trim() || "" };
}

function scriptForKind(kind: CampaignKind): string {
  return kind === "weekly_newsletter"
    ? WEEKLY_NEWSLETTER_SCRIPT_ID
    : WAITLIST_EMAIL_DIGEST_SCRIPT_ID;
}

function sequenceForKind(kind: CampaignKind): string {
  return kind === "weekly_newsletter"
    ? WEEKLY_NEWSLETTER_SEQUENCE_ID
    : WAITLIST_DIGEST_SEQUENCE_ID;
}

/**
 * Gửi một campaign email (newsletter hoặc waitlist digest) cho 1 lead.
 * A/B subject ~15%. Idempotent theo lead + campaignKey + kind.
 */
export async function dispatchEmailCampaign(input: {
  leadId: string;
  kind: CampaignKind;
  actorId: string;
  correlationId: string;
  weekKey?: string;
  projectHint?: string | null;
  abTestPercent?: number;
  skipEnabledCheck?: boolean;
}): Promise<CampaignDispatchOutcome> {
  if (!input.skipEnabledCheck && !isEmailNurtureSendEnabled()) {
    throw new EmailNurtureSendError(
      "EMAIL_NURTURE_DISABLED",
      "EMAIL_NURTURE_SEND_ENABLED chưa bật.",
    );
  }

  const leadId = input.leadId.trim();
  const weekKey = input.weekKey?.trim() || isoWeekCampaignKey();
  const campaignKey = `${input.kind}:${weekKey}`;
  const now = new Date();
  const enrollKey = `email-campaign:${input.kind}:${leadId}:enroll`;
  const dispatchKey = `email-campaign:${campaignKey}:${leadId}`;
  const scriptId = scriptForKind(input.kind);
  const sequenceId = sequenceForKind(input.kind);

  const eligibility = await checkNurtureEligibility({
    leadId,
    purpose: MARKETING_PURPOSE,
    channel: EMAIL_NURTURE_CHANNEL,
    correlationId: `${input.correlationId}:elig`,
  });
  if (!eligibility.eligible) {
    return {
      status: "SKIPPED",
      reason: eligibility.suppressionReason ?? "NOT_ELIGIBLE",
      enrollmentId: eligibility.enrollment?.id ?? null,
      dispatchId: null,
      provider: null,
      abVariant: null,
      campaignKey,
      kind: input.kind,
    };
  }

  let enrollmentId: string;
  try {
    const { enrollment } = await enrollNurture({
      leadId,
      purpose: MARKETING_PURPOSE,
      channel: EMAIL_NURTURE_CHANNEL,
      scriptId,
      cohortKey: campaignKey,
      actorId: input.actorId,
      correlationId: `${input.correlationId}:enroll`,
      idempotencyKey: enrollKey,
      action: "enroll",
    });
    enrollmentId = enrollment.id;
  } catch (err) {
    if (err instanceof SalesCoreRuleError) {
      return {
        status: "SKIPPED",
        reason: err.code,
        enrollmentId: null,
        dispatchId: null,
        provider: null,
        abVariant: null,
        campaignKey,
        kind: input.kind,
      };
    }
    throw err;
  }

  const prior = await prisma.nurtureDispatch.findUnique({
    where: { idempotencyKey: dispatchKey },
  });
  if (prior) {
    const meta =
      prior.metadata && typeof prior.metadata === "object"
        ? (prior.metadata as Record<string, unknown>)
        : {};
    return {
      status: prior.status,
      reason: prior.status === "SENT" ? null : "PRIOR_DISPATCH",
      enrollmentId,
      dispatchId: prior.id,
      provider: null,
      abVariant: meta.abVariant === "A" || meta.abVariant === "B" ? meta.abVariant : null,
      campaignKey,
      kind: input.kind,
    };
  }

  const { email, name } = await resolveLeadEmail(leadId);
  if (!email) {
    const { dispatch } = await recordNurtureDispatchResult({
      enrollmentId,
      status: "SKIPPED",
      actorId: input.actorId,
      occurredAt: now,
      correlationId: `${input.correlationId}:dispatch`,
      idempotencyKey: dispatchKey,
      metadata: { campaignKey, reason: "NO_EMAIL" },
    });
    return {
      status: "SKIPPED",
      reason: "NO_EMAIL",
      enrollmentId,
      dispatchId: dispatch.id,
      provider: null,
      abVariant: null,
      campaignKey,
      kind: input.kind,
    };
  }

  let unsubscribeUrl: string;
  try {
    unsubscribeUrl = buildEmailUnsubscribeUrlForLead(leadId);
  } catch {
    const { dispatch } = await recordNurtureDispatchResult({
      enrollmentId,
      status: "FAILED",
      actorId: input.actorId,
      occurredAt: now,
      correlationId: `${input.correlationId}:dispatch`,
      idempotencyKey: dispatchKey,
    });
    return {
      status: "FAILED",
      reason: "UNSUBSCRIBE_TOKEN_FAILED",
      enrollmentId,
      dispatchId: dispatch.id,
      provider: null,
      abVariant: null,
      campaignKey,
      kind: input.kind,
    };
  }

  const subjects =
    input.kind === "weekly_newsletter"
      ? WEEKLY_NEWSLETTER_SUBJECTS
      : WAITLIST_DIGEST_SUBJECTS;
  const ab = pickAbSubject({
    leadId,
    campaignKey,
    subjectA: subjects.A,
    subjectB: subjects.B,
    testPercent: input.abTestPercent,
  });

  const built =
    input.kind === "weekly_newsletter"
      ? buildWeeklyNewsletterEmail({
          recipientName: name,
          weekKey,
          subject: ab.subject,
          unsubscribeUrl,
        })
      : buildWaitlistDigestEmail({
          recipientName: name,
          weekKey,
          subject: ab.subject,
          unsubscribeUrl,
          projectHint: input.projectHint,
        });

  const preSend = await checkNurtureEligibility({
    leadId,
    purpose: MARKETING_PURPOSE,
    channel: EMAIL_NURTURE_CHANNEL,
    correlationId: `${input.correlationId}:pre-send`,
  });
  if (!preSend.eligible) {
    const { dispatch } = await recordNurtureDispatchResult({
      enrollmentId,
      status: "SKIPPED",
      actorId: input.actorId,
      occurredAt: now,
      correlationId: `${input.correlationId}:dispatch`,
      idempotencyKey: dispatchKey,
      metadata: { campaignKey, abVariant: ab.variant },
    });
    return {
      status: "SKIPPED",
      reason: preSend.suppressionReason ?? "NOT_ELIGIBLE_PRE_SEND",
      enrollmentId,
      dispatchId: dispatch.id,
      provider: null,
      abVariant: ab.variant,
      campaignKey,
      kind: input.kind,
    };
  }

  const sendResult = await sendMarketingEmail({
    to: email,
    subject: built.subject,
    html: built.html,
    text: built.text,
    unsubscribeUrl,
    enrollmentId,
    sequenceId,
    stepIndex: 0,
    tags: built.tags,
    abVariant: ab.variant,
    campaignKey,
  });

  const status: "SENT" | "FAILED" = sendResult.ok ? "SENT" : "FAILED";
  const providerMessageId = sendResult.ok
    ? sendResult.providerMessageId ??
      `dev_${createHash("sha256").update(dispatchKey).digest("hex").slice(0, 16)}`
    : null;

  const { dispatch } = await recordNurtureDispatchResult({
    enrollmentId,
    status,
    actorId: input.actorId,
    occurredAt: now,
    correlationId: `${input.correlationId}:dispatch`,
    idempotencyKey: dispatchKey,
    providerMessageId,
    metadata: {
      campaignKey,
      sequenceId,
      abVariant: ab.variant,
      subject: built.subject,
      kind: input.kind,
      weekKey,
    },
  });

  return {
    status,
    reason: sendResult.ok ? null : sendResult.error,
    enrollmentId,
    dispatchId: dispatch.id,
    provider: sendResult.ok ? sendResult.provider : null,
    abVariant: ab.variant,
    campaignKey,
    kind: input.kind,
  };
}

/** Enroll waitlist digest after email opt-in (không gửi nếu kill switch tắt). */
export async function tryEnrollWaitlistDigestAfterConsent(input: {
  leadId: string;
  actorId?: string;
  correlationId?: string;
}): Promise<{ enrolled: boolean; reason?: string }> {
  const leadId = input.leadId.trim();
  if (!leadId) return { enrolled: false, reason: "missing_lead_id" };

  try {
    await enrollNurture({
      leadId,
      purpose: MARKETING_PURPOSE,
      channel: EMAIL_NURTURE_CHANNEL,
      scriptId: WAITLIST_EMAIL_DIGEST_SCRIPT_ID,
      cohortKey: "waitlist_digest",
      actorId: input.actorId ?? "system:lead-capture",
      correlationId:
        input.correlationId ?? `waitlist-digest-enroll:${leadId}`,
      idempotencyKey: `email-campaign:waitlist_digest:${leadId}:enroll`,
      action: "enroll",
    });
    return { enrolled: true };
  } catch (err) {
    const code = err instanceof SalesCoreRuleError ? err.code : "ENROLL_FAILED";
    return { enrolled: false, reason: code };
  }
}

/**
 * Cron/manual: gửi digest cho cohort waitlist đã enroll + consent còn hiệu lực.
 * Giới hạn batch để an toàn.
 */
export async function runWaitlistDigestBatch(input: {
  actorId: string;
  correlationId: string;
  limit?: number;
  weekKey?: string;
}): Promise<{ attempted: number; sent: number; skipped: number; failed: number }> {
  const limit = Math.min(200, Math.max(1, input.limit ?? 50));
  const enrollments = await prisma.nurtureEnrollment.findMany({
    where: {
      purpose: MARKETING_PURPOSE,
      channel: EMAIL_NURTURE_CHANNEL,
      scriptId: WAITLIST_EMAIL_DIGEST_SCRIPT_ID,
      status: "ENROLLED",
    },
    select: { leadId: true },
    take: limit,
    orderBy: { updatedAt: "asc" },
  });

  let sent = 0;
  let skipped = 0;
  let failed = 0;
  for (const row of enrollments) {
    try {
      const out = await dispatchEmailCampaign({
        leadId: row.leadId,
        kind: "waitlist_digest",
        actorId: input.actorId,
        correlationId: `${input.correlationId}:${row.leadId}`,
        weekKey: input.weekKey,
      });
      if (out.status === "SENT") sent += 1;
      else if (out.status === "SKIPPED") skipped += 1;
      else failed += 1;
    } catch {
      failed += 1;
    }
  }
  return { attempted: enrollments.length, sent, skipped, failed };
}

export async function runWeeklyNewsletterBatch(input: {
  actorId: string;
  correlationId: string;
  limit?: number;
  weekKey?: string;
}): Promise<{ attempted: number; sent: number; skipped: number; failed: number }> {
  const limit = Math.min(200, Math.max(1, input.limit ?? 50));
  const enrollments = await prisma.nurtureEnrollment.findMany({
    where: {
      purpose: MARKETING_PURPOSE,
      channel: EMAIL_NURTURE_CHANNEL,
      scriptId: WEEKLY_NEWSLETTER_SCRIPT_ID,
      status: "ENROLLED",
    },
    select: { leadId: true },
    take: limit,
    orderBy: { updatedAt: "asc" },
  });

  let sent = 0;
  let skipped = 0;
  let failed = 0;
  for (const row of enrollments) {
    try {
      const out = await dispatchEmailCampaign({
        leadId: row.leadId,
        kind: "weekly_newsletter",
        actorId: input.actorId,
        correlationId: `${input.correlationId}:${row.leadId}`,
        weekKey: input.weekKey,
      });
      if (out.status === "SENT") sent += 1;
      else if (out.status === "SKIPPED") skipped += 1;
      else failed += 1;
    } catch {
      failed += 1;
    }
  }
  return { attempted: enrollments.length, sent, skipped, failed };
}
