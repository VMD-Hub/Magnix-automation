import { createHash } from "crypto";
import {
  enrollNurture,
  recordConsent,
  getEffectiveConsent,
} from "@/lib/sales-core/service";

/** ADR-017 — purpose/channel canonical cho marketing email nurture. */
export const MARKETING_PURPOSE = "marketing";
export const EMAIL_NURTURE_CHANNEL = "email";
export const EMAIL_NURTURE_POLICY_VERSION = "email-nurture-v1";

export type MarketingEmailGrantInput = {
  leadId: string;
  source: string;
  proofType?: string;
  proofRef?: string | null;
  actorId?: string;
  correlationId?: string;
  /** Optional customer subject instead of lead — rare for tool capture. */
  customerId?: string | null;
};

/**
 * Ghi ConsentRecord GRANTED cho purpose=marketing + channel=email.
 * Idempotent theo leadId + action grant.
 */
export async function grantMarketingEmailConsent(
  input: MarketingEmailGrantInput,
): Promise<{ granted: true; consentId: string } | { granted: false; reason: string }> {
  const leadId = input.leadId.trim();
  if (!leadId) return { granted: false, reason: "missing_lead_id" };

  const correlationId =
    input.correlationId?.trim() ||
    `email-consent-grant:${leadId}:${Date.now()}`;
  const idempotencyKey = `consent:marketing:email:grant:${leadId}`;

  try {
    const { record } = await recordConsent({
      subjectType: "LEAD",
      subjectId: leadId,
      leadId,
      customerId: null,
      purpose: MARKETING_PURPOSE,
      channel: EMAIL_NURTURE_CHANNEL,
      action: "GRANTED",
      proofType: input.proofType ?? "tool_opt_in",
      proofRef: input.proofRef ?? null,
      proofMetadata: { source: input.source },
      policyVersion: EMAIL_NURTURE_POLICY_VERSION,
      actorId: input.actorId ?? "system:lead-capture",
      source: input.source,
      occurredAt: new Date(),
      correlationId,
      idempotencyKey,
    });
    return { granted: true, consentId: record.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email-nurture] grant consent failed", {
      leadKey: createHash("sha256").update(leadId).digest("hex").slice(0, 12),
      message,
    });
    return { granted: false, reason: message };
  }
}

export type MarketingEmailWithdrawInput = {
  leadId: string;
  source?: string;
  proofType?: string;
  proofRef?: string | null;
  actorId?: string;
  correlationId?: string;
  /** Stable key for withdraw idempotency (e.g. token hash). */
  withdrawKey?: string;
};

/**
 * WITHDRAWN + cancel mọi NurtureEnrollment marketing/email đang active.
 * Fail-closed: luôn cố cancel enroll dù consent đã withdraw trước đó.
 */
export async function withdrawMarketingEmailConsent(
  input: MarketingEmailWithdrawInput,
): Promise<{
  withdrawn: boolean;
  enrollmentsCancelled: boolean;
  consentId?: string;
  reason?: string;
}> {
  const leadId = input.leadId.trim();
  if (!leadId) {
    return { withdrawn: false, enrollmentsCancelled: false, reason: "missing_lead_id" };
  }

  const withdrawKey =
    input.withdrawKey?.trim() ||
    createHash("sha256").update(`${leadId}:${Date.now()}`).digest("hex").slice(0, 24);
  const correlationId =
    input.correlationId?.trim() || `email-consent-withdraw:${leadId}:${withdrawKey}`;

  let consentId: string | undefined;
  let withdrawn = false;

  try {
    const { record } = await recordConsent({
      subjectType: "LEAD",
      subjectId: leadId,
      leadId,
      customerId: null,
      purpose: MARKETING_PURPOSE,
      channel: EMAIL_NURTURE_CHANNEL,
      action: "WITHDRAWN",
      proofType: input.proofType ?? "one_click_unsubscribe",
      proofRef: input.proofRef ?? null,
      proofMetadata: {},
      policyVersion: EMAIL_NURTURE_POLICY_VERSION,
      actorId: input.actorId ?? "system:email-unsubscribe",
      source: input.source ?? "email:unsubscribe",
      occurredAt: new Date(),
      correlationId,
      idempotencyKey: `consent:marketing:email:withdraw:${leadId}:${withdrawKey}`,
    });
    consentId = record.id;
    withdrawn = true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email-nurture] withdraw consent failed", {
      leadKey: createHash("sha256").update(leadId).digest("hex").slice(0, 12),
      message,
    });
    return {
      withdrawn: false,
      enrollmentsCancelled: false,
      reason: message,
    };
  }

  let enrollmentsCancelled = false;
  try {
    await enrollNurture({
      leadId,
      purpose: MARKETING_PURPOSE,
      channel: EMAIL_NURTURE_CHANNEL,
      actorId: input.actorId ?? "system:email-unsubscribe",
      correlationId: `${correlationId}:cancel`,
      idempotencyKey: `nurture:cancel:marketing:email:${leadId}:${withdrawKey}`,
      action: "cancel",
    });
    enrollmentsCancelled = true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email-nurture] cancel enrollments failed", {
      leadKey: createHash("sha256").update(leadId).digest("hex").slice(0, 12),
      message,
    });
  }

  return { withdrawn, enrollmentsCancelled, consentId };
}

export async function hasEffectiveMarketingEmailConsent(leadId: string) {
  return getEffectiveConsent({
    subjectType: "LEAD",
    subjectId: leadId,
    purpose: MARKETING_PURPOSE,
    channel: EMAIL_NURTURE_CHANNEL,
  });
}
