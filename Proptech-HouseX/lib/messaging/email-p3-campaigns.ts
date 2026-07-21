/**
 * ADR-017 P3 — ESP sync từ House X · inactive re-engage 1-shot · CCTM utility.
 */

import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { readLeadOpsMeta } from "@/lib/leads/ops-meta";
import {
  CCTM_UTILITY_EMAIL_SCRIPT_ID,
  INACTIVE_REENGAGE_SCRIPT_ID,
} from "@/lib/leads/nurture-scripts";
import {
  EMAIL_NURTURE_CHANNEL,
  MARKETING_PURPOSE,
  withdrawMarketingEmailConsent,
} from "@/lib/sales-core/marketing-email-consent";
import {
  checkNurtureEligibility,
  enrollNurture,
  getEffectiveConsent,
  recordNurtureDispatchResult,
} from "@/lib/sales-core/service";
import { SalesCoreRuleError } from "@/lib/sales-core/domain";
import { sendMarketingEmail } from "@/lib/email/marketing-send";
import { buildEmailUnsubscribeUrlForLead } from "@/lib/email/unsubscribe-token";
import { pickAbSubject } from "@/lib/email/ab-subject";
import {
  buildInactiveReengageEmail,
  INACTIVE_REENGAGE_SEQUENCE_ID,
  INACTIVE_REENGAGE_SUBJECTS,
} from "@/lib/email/inactive-reengage";
import {
  buildCctmUtilityEmail,
  CCTM_UTILITY_SEQUENCE_ID,
  CCTM_UTILITY_SUBJECTS,
} from "@/lib/email/cctm-utility";
import { getEspAdapter } from "@/lib/email/esp-adapters";
import type { EspContactSync } from "@/lib/email/esp-adapter";
import {
  EmailNurtureSendError,
  isEmailNurtureSendEnabled,
} from "@/lib/messaging/email-nurture-server-send";

export const INACTIVE_DAYS_DEFAULT = 90;
export const REENGAGE_GRACE_DAYS_DEFAULT = 14;

async function resolveLeadEmail(leadId: string): Promise<{
  email: string | null;
  name: string;
  segment: string | null;
}> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      segment: true,
      opsMeta: true,
      customer: { select: { email: true, name: true } },
    },
  });
  if (!lead) return { email: null, name: "", segment: null };
  const opsEmail = readLeadOpsMeta(lead.opsMeta).channels.email?.trim() || null;
  const email = opsEmail || lead.customer?.email?.trim() || null;
  return {
    email,
    name: lead.customer?.name?.trim() || "",
    segment: lead.segment,
  };
}

/** Sync consented marketing-email contacts → ESP (House X → ESP only). */
export async function syncEspAudienceFromHouseX(input: {
  limit?: number;
  actorId?: string;
}): Promise<{
  adapter: string | null;
  attempted: number;
  upserted: number;
  failed: number;
  skipped: number;
}> {
  const adapter = getEspAdapter();
  if (!adapter) {
    return {
      adapter: null,
      attempted: 0,
      upserted: 0,
      failed: 0,
      skipped: 0,
    };
  }

  const limit = Math.min(500, Math.max(1, input.limit ?? 100));
  const grants = await prisma.consentRecord.findMany({
    where: {
      purpose: MARKETING_PURPOSE,
      channel: EMAIL_NURTURE_CHANNEL,
      action: "GRANTED",
      subjectType: "LEAD",
    },
    select: { subjectId: true },
    orderBy: { occurredAt: "desc" },
    take: limit * 3,
  });

  const seen = new Set<string>();
  let attempted = 0;
  let upserted = 0;
  let failed = 0;
  let skipped = 0;

  for (const row of grants) {
    if (seen.has(row.subjectId)) continue;
    seen.add(row.subjectId);
    if (attempted >= limit) break;
    attempted += 1;

    const consent = await getEffectiveConsent({
      subjectType: "LEAD",
      subjectId: row.subjectId,
      purpose: MARKETING_PURPOSE,
      channel: EMAIL_NURTURE_CHANNEL,
    });
    if (!consent.granted) {
      skipped += 1;
      continue;
    }

    const { email, segment } = await resolveLeadEmail(row.subjectId);
    if (!email) {
      skipped += 1;
      continue;
    }

    const enrollments = await prisma.nurtureEnrollment.findMany({
      where: {
        leadId: row.subjectId,
        purpose: MARKETING_PURPOSE,
        channel: EMAIL_NURTURE_CHANNEL,
        status: "ENROLLED",
      },
      select: { scriptId: true },
      take: 10,
    });
    const tags = [
      "housx_marketing",
      ...enrollments
        .map((e) => e.scriptId)
        .filter((id): id is string => !!id)
        .slice(0, 5),
    ];

    const contact: EspContactSync = {
      leadId: row.subjectId,
      email,
      tags,
      consented: true,
      segment,
    };
    const result = await adapter.upsertContact(contact);
    if (result.ok) upserted += 1;
    else failed += 1;
  }

  return {
    adapter: adapter.name,
    attempted,
    upserted,
    failed,
    skipped,
  };
}

export type P3DispatchOutcome = {
  status: "SENT" | "FAILED" | "SKIPPED";
  reason: string | null;
  enrollmentId: string | null;
  dispatchId: string | null;
  provider: string | null;
  abVariant: "A" | "B" | null;
  kind: "inactive_reengage" | "cctm_utility";
};

async function dispatchP3Template(input: {
  leadId: string;
  kind: "inactive_reengage" | "cctm_utility";
  actorId: string;
  correlationId: string;
  skipEnabledCheck?: boolean;
}): Promise<P3DispatchOutcome> {
  if (!input.skipEnabledCheck && !isEmailNurtureSendEnabled()) {
    throw new EmailNurtureSendError(
      "EMAIL_NURTURE_DISABLED",
      "EMAIL_NURTURE_SEND_ENABLED chưa bật.",
    );
  }

  const leadId = input.leadId.trim();
  const scriptId =
    input.kind === "inactive_reengage"
      ? INACTIVE_REENGAGE_SCRIPT_ID
      : CCTM_UTILITY_EMAIL_SCRIPT_ID;
  const sequenceId =
    input.kind === "inactive_reengage"
      ? INACTIVE_REENGAGE_SEQUENCE_ID
      : CCTM_UTILITY_SEQUENCE_ID;
  const campaignKey = `${input.kind}:once`;
  const enrollKey = `email-p3:${input.kind}:${leadId}:enroll`;
  const dispatchKey = `email-p3:${input.kind}:${leadId}:once`;
  const now = new Date();

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
        kind: input.kind,
      };
    }
    throw err;
  }

  const prior = await prisma.nurtureDispatch.findUnique({
    where: { idempotencyKey: dispatchKey },
  });
  if (prior) {
    return {
      status: prior.status,
      reason: prior.status === "SENT" ? null : "PRIOR_DISPATCH",
      enrollmentId,
      dispatchId: prior.id,
      provider: null,
      abVariant: null,
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
      metadata: { kind: input.kind, reason: "NO_EMAIL" },
    });
    return {
      status: "SKIPPED",
      reason: "NO_EMAIL",
      enrollmentId,
      dispatchId: dispatch.id,
      provider: null,
      abVariant: null,
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
      kind: input.kind,
    };
  }

  const subjects =
    input.kind === "inactive_reengage"
      ? INACTIVE_REENGAGE_SUBJECTS
      : CCTM_UTILITY_SUBJECTS;
  const ab = pickAbSubject({
    leadId,
    campaignKey,
    subjectA: subjects.A,
    subjectB: subjects.B,
    testPercent: 15,
  });

  const built =
    input.kind === "inactive_reengage"
      ? buildInactiveReengageEmail({
          recipientName: name,
          subject: ab.subject,
          unsubscribeUrl,
        })
      : buildCctmUtilityEmail({
          recipientName: name,
          subject: ab.subject,
          unsubscribeUrl,
        });

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
      kind: input.kind,
      campaignKey,
      abVariant: ab.variant,
      subject: built.subject,
    },
  });

  return {
    status,
    reason: sendResult.ok ? null : sendResult.error,
    enrollmentId,
    dispatchId: dispatch.id,
    provider: sendResult.ok ? sendResult.provider : null,
    abVariant: ab.variant,
    kind: input.kind,
  };
}

export async function dispatchInactiveReengage(input: {
  leadId: string;
  actorId: string;
  correlationId: string;
  skipEnabledCheck?: boolean;
}) {
  return dispatchP3Template({ ...input, kind: "inactive_reengage" });
}

export async function dispatchCctmUtilityEmail(input: {
  leadId: string;
  actorId: string;
  correlationId: string;
  skipEnabledCheck?: boolean;
}) {
  return dispatchP3Template({ ...input, kind: "cctm_utility" });
}

export async function tryEnrollCctmUtilityAfterConsent(input: {
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
      scriptId: CCTM_UTILITY_EMAIL_SCRIPT_ID,
      cohortKey: "cctm_utility",
      actorId: input.actorId ?? "system:lead-capture",
      correlationId: input.correlationId ?? `cctm-utility-enroll:${leadId}`,
      idempotencyKey: `email-p3:cctm_utility:${leadId}:enroll`,
      action: "enroll",
    });
    return { enrolled: true };
  } catch (err) {
    const code = err instanceof SalesCoreRuleError ? err.code : "ENROLL_FAILED";
    return { enrolled: false, reason: code };
  }
}

/**
 * Candidates: last marketing email SENT older than inactiveDays, no open/click since,
 * and never received inactive-reengage.
 */
export async function findInactiveReengageCandidates(input: {
  inactiveDays?: number;
  limit?: number;
}): Promise<string[]> {
  const inactiveDays = input.inactiveDays ?? INACTIVE_DAYS_DEFAULT;
  const limit = Math.min(200, Math.max(1, input.limit ?? 50));
  const cutoff = new Date(Date.now() - inactiveDays * 86_400_000);

  const sent = await prisma.nurtureDispatch.findMany({
    where: {
      status: "SENT",
      occurredAt: { lt: cutoff },
      enrollment: {
        purpose: MARKETING_PURPOSE,
        channel: EMAIL_NURTURE_CHANNEL,
      },
    },
    select: {
      occurredAt: true,
      enrollment: { select: { leadId: true } },
    },
    orderBy: { occurredAt: "asc" },
    take: limit * 5,
  });

  const leadLastSent = new Map<string, Date>();
  for (const row of sent) {
    const leadId = row.enrollment.leadId;
    const prev = leadLastSent.get(leadId);
    if (!prev || row.occurredAt > prev) {
      leadLastSent.set(leadId, row.occurredAt);
    }
  }

  const candidates: string[] = [];
  for (const [leadId, lastSentAt] of leadLastSent) {
    if (candidates.length >= limit) break;

    const already = await prisma.nurtureDispatch.findFirst({
      where: {
        idempotencyKey: `email-p3:inactive_reengage:${leadId}:once`,
      },
      select: { id: true },
    });
    if (already) continue;

    const engaged = await prisma.emailEngagementEvent.findFirst({
      where: {
        leadId,
        type: { in: ["open", "click"] },
        occurredAt: { gte: lastSentAt },
      },
      select: { id: true },
    });
    if (engaged) continue;

    const consent = await getEffectiveConsent({
      subjectType: "LEAD",
      subjectId: leadId,
      purpose: MARKETING_PURPOSE,
      channel: EMAIL_NURTURE_CHANNEL,
    });
    if (!consent.granted) continue;

    candidates.push(leadId);
  }

  return candidates;
}

export async function runInactiveReengageBatch(input: {
  actorId: string;
  correlationId: string;
  inactiveDays?: number;
  limit?: number;
}): Promise<{ attempted: number; sent: number; skipped: number; failed: number }> {
  const leadIds = await findInactiveReengageCandidates({
    inactiveDays: input.inactiveDays,
    limit: input.limit,
  });
  let sent = 0;
  let skipped = 0;
  let failed = 0;
  for (const leadId of leadIds) {
    try {
      const out = await dispatchInactiveReengage({
        leadId,
        actorId: input.actorId,
        correlationId: `${input.correlationId}:${leadId}`,
      });
      if (out.status === "SENT") sent += 1;
      else if (out.status === "SKIPPED") skipped += 1;
      else failed += 1;
    } catch {
      failed += 1;
    }
  }
  return { attempted: leadIds.length, sent, skipped, failed };
}

/**
 * After re-engage SENT ≥ graceDays with no open/click → withdraw + suppress.
 */
export async function runInactiveSuppressAfterReengage(input: {
  graceDays?: number;
  limit?: number;
  actorId?: string;
}): Promise<{ checked: number; suppressed: number }> {
  const graceDays = input.graceDays ?? REENGAGE_GRACE_DAYS_DEFAULT;
  const limit = Math.min(200, Math.max(1, input.limit ?? 50));
  const cutoff = new Date(Date.now() - graceDays * 86_400_000);

  const reengages = await prisma.nurtureDispatch.findMany({
    where: {
      status: "SENT",
      occurredAt: { lt: cutoff },
      enrollment: {
        purpose: MARKETING_PURPOSE,
        channel: EMAIL_NURTURE_CHANNEL,
        scriptId: INACTIVE_REENGAGE_SCRIPT_ID,
      },
    },
    select: {
      id: true,
      occurredAt: true,
      enrollment: { select: { leadId: true } },
    },
    take: limit,
    orderBy: { occurredAt: "asc" },
  });

  let suppressed = 0;
  for (const row of reengages) {
    const leadId = row.enrollment.leadId;
    const engaged = await prisma.emailEngagementEvent.findFirst({
      where: {
        leadId,
        type: { in: ["open", "click"] },
        occurredAt: { gte: row.occurredAt },
      },
      select: { id: true },
    });
    if (engaged) continue;

    const result = await withdrawMarketingEmailConsent({
      leadId,
      source: "email:inactive-hygiene",
      proofType: "inactive_no_reengage",
      actorId: input.actorId ?? "system:email-hygiene",
      withdrawKey: createHash("sha256")
        .update(`inactive-suppress:${leadId}:${row.id}`)
        .digest("hex")
        .slice(0, 24),
    });
    if (result.withdrawn) {
      suppressed += 1;
      const adapter = getEspAdapter();
      if (adapter) {
        const { email } = await resolveLeadEmail(leadId);
        if (email) await adapter.suppressContact(email);
      }
    }
  }

  return { checked: reengages.length, suppressed };
}

export async function runCctmUtilityBatch(input: {
  actorId: string;
  correlationId: string;
  limit?: number;
}): Promise<{ attempted: number; sent: number; skipped: number; failed: number }> {
  const limit = Math.min(200, Math.max(1, input.limit ?? 50));
  const enrollments = await prisma.nurtureEnrollment.findMany({
    where: {
      purpose: MARKETING_PURPOSE,
      channel: EMAIL_NURTURE_CHANNEL,
      scriptId: CCTM_UTILITY_EMAIL_SCRIPT_ID,
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
      const out = await dispatchCctmUtilityEmail({
        leadId: row.leadId,
        actorId: input.actorId,
        correlationId: `${input.correlationId}:${row.leadId}`,
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
