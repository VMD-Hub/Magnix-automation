/**
 * ADR-017 P1 — dispatch Welcome email E1–E3 (SC-6 email channel).
 * Mirror telesales-server-send: eligibility → enroll → send → dispatch audit.
 * Delay E2/E3 production = n8n Wait; runner này gửi ngay khi được gọi.
 */

import { prisma } from "@/lib/prisma";
import { readLeadOpsMeta } from "@/lib/leads/ops-meta";
import { NOXH_TOOL_EMAIL_WELCOME_SCRIPT_ID } from "@/lib/leads/nurture-scripts";
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
import {
  buildNoxhWelcomeEmail,
  NOXH_WELCOME_SEQUENCE_ID,
  type WelcomeStepIndex,
} from "@/lib/email/noxh-welcome-sequence";

export class EmailNurtureSendError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "EmailNurtureSendError";
  }
}

export function isEmailNurtureSendEnabled(): boolean {
  const v = process.env.EMAIL_NURTURE_SEND_ENABLED?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

export type WelcomeDispatchOutcome = {
  status: "SENT" | "FAILED" | "SKIPPED";
  reason: string | null;
  enrollmentId: string | null;
  dispatchId: string | null;
  stepIndex: WelcomeStepIndex;
  provider: string | null;
};

function isWelcomeStep(n: number): n is WelcomeStepIndex {
  return n === 1 || n === 2 || n === 3;
}

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

/**
 * Gửi một bước Welcome. Idempotent theo lead + step.
 * Yêu cầu EMAIL_NURTURE_SEND_ENABLED (trừ khi skipCheckEnabled cho unit test nội bộ).
 */
export async function dispatchNoxhWelcomeEmailStep(input: {
  leadId: string;
  stepIndex: number;
  actorId: string;
  correlationId: string;
  /** Override default enroll/dispatch keys (smoke). */
  idempotencyKey?: string;
  skipEnabledCheck?: boolean;
}): Promise<WelcomeDispatchOutcome> {
  if (!input.skipEnabledCheck && !isEmailNurtureSendEnabled()) {
    throw new EmailNurtureSendError(
      "EMAIL_NURTURE_DISABLED",
      "EMAIL_NURTURE_SEND_ENABLED chưa bật.",
    );
  }

  if (!isWelcomeStep(input.stepIndex)) {
    throw new EmailNurtureSendError(
      "INVALID_STEP",
      "stepIndex phải là 1, 2 hoặc 3.",
    );
  }

  const stepIndex = input.stepIndex;
  const leadId = input.leadId.trim();
  const now = new Date();
  const baseKey =
    input.idempotencyKey?.trim() ||
    `email-welcome:${leadId}`;
  const enrollKey = `${baseKey}:enroll`;
  const dispatchKey = `${baseKey}:step:${stepIndex}`;

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
      stepIndex,
      provider: null,
    };
  }

  let enrollmentId: string;
  try {
    const { enrollment } = await enrollNurture({
      leadId,
      purpose: MARKETING_PURPOSE,
      channel: EMAIL_NURTURE_CHANNEL,
      scriptId: NOXH_TOOL_EMAIL_WELCOME_SCRIPT_ID,
      cohortKey: "noxh_tool_welcome",
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
        stepIndex,
        provider: null,
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
      stepIndex,
      provider: null,
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
    });
    return {
      status: "SKIPPED",
      reason: "NO_EMAIL",
      enrollmentId,
      dispatchId: dispatch.id,
      stepIndex,
      provider: null,
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
      stepIndex,
      provider: null,
    };
  }

  const built = buildNoxhWelcomeEmail({
    stepIndex,
    recipientName: name,
    unsubscribeUrl,
  });
  if (!built) {
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
      reason: "TEMPLATE_BUILD_FAILED",
      enrollmentId,
      dispatchId: dispatch.id,
      stepIndex,
      provider: null,
    };
  }

  // Re-check eligibility immediately before send (withdraw race).
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
    });
    return {
      status: "SKIPPED",
      reason: preSend.suppressionReason ?? "NOT_ELIGIBLE_PRE_SEND",
      enrollmentId,
      dispatchId: dispatch.id,
      stepIndex,
      provider: null,
    };
  }

  const sendResult = await sendMarketingEmail({
    to: email,
    subject: built.subject,
    html: built.html,
    text: built.text,
    unsubscribeUrl,
    enrollmentId,
    sequenceId: NOXH_WELCOME_SEQUENCE_ID,
    stepIndex,
    tags: built.tags,
  });

  const status: "SENT" | "FAILED" | "SKIPPED" = sendResult.ok
    ? "SENT"
    : "FAILED";
  const reason = sendResult.ok ? null : sendResult.error;
  const providerMessageId = sendResult.ok
    ? sendResult.providerMessageId
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
      sequenceId: NOXH_WELCOME_SEQUENCE_ID,
      stepIndex,
      kind: "noxh_welcome",
    },
  });

  return {
    status,
    reason,
    enrollmentId,
    dispatchId: dispatch.id,
    stepIndex,
    provider: sendResult.ok ? sendResult.provider : null,
  };
}

/**
 * Sau tool opt-in + ConsentRecord: enroll Welcome (không gửi nếu kill switch tắt).
 * Khi EMAIL_NURTURE_SEND_ENABLED — gửi E1 ngay.
 */
export async function tryEnrollNoxhWelcomeAfterConsent(input: {
  leadId: string;
  actorId?: string;
  correlationId?: string;
}): Promise<{
  enrolled: boolean;
  e1?: WelcomeDispatchOutcome;
  reason?: string;
}> {
  const leadId = input.leadId.trim();
  if (!leadId) return { enrolled: false, reason: "missing_lead_id" };

  const actorId = input.actorId ?? "system:lead-capture";
  const correlationId =
    input.correlationId ?? `email-welcome-auto:${leadId}:${Date.now()}`;
  const enrollKey = `email-welcome:${leadId}:enroll`;

  try {
    await enrollNurture({
      leadId,
      purpose: MARKETING_PURPOSE,
      channel: EMAIL_NURTURE_CHANNEL,
      scriptId: NOXH_TOOL_EMAIL_WELCOME_SCRIPT_ID,
      cohortKey: "noxh_tool_welcome",
      actorId,
      correlationId: `${correlationId}:enroll`,
      idempotencyKey: enrollKey,
      action: "enroll",
    });
  } catch (err) {
    const code = err instanceof SalesCoreRuleError ? err.code : "ENROLL_FAILED";
    return { enrolled: false, reason: code };
  }

  if (!isEmailNurtureSendEnabled()) {
    return { enrolled: true, reason: "SEND_DISABLED" };
  }

  try {
    const e1 = await dispatchNoxhWelcomeEmailStep({
      leadId,
      stepIndex: 1,
      actorId,
      correlationId: `${correlationId}:e1`,
    });
    return { enrolled: true, e1 };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email-nurture] auto E1 failed", { message });
    return { enrolled: true, reason: message };
  }
}
