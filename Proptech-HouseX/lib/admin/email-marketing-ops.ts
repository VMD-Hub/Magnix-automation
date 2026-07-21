import { prisma } from "@/lib/prisma";
import { readLeadOpsMeta } from "@/lib/leads/ops-meta";
import {
  getNurtureScript,
  NURTURE_SCRIPT_CATALOG,
  NOXH_TOOL_EMAIL_WELCOME_SCRIPT_ID,
  WAITLIST_EMAIL_DIGEST_SCRIPT_ID,
  WEEKLY_NEWSLETTER_SCRIPT_ID,
  CCTM_UTILITY_EMAIL_SCRIPT_ID,
  INACTIVE_REENGAGE_SCRIPT_ID,
} from "@/lib/leads/nurture-scripts";
import {
  EMAIL_NURTURE_CHANNEL,
  MARKETING_PURPOSE,
  grantMarketingEmailConsent,
  withdrawMarketingEmailConsent,
} from "@/lib/sales-core/marketing-email-consent";
import {
  checkNurtureEligibility,
  enrollNurture,
} from "@/lib/sales-core/service";
import { buildEmailNurtureKpi } from "@/lib/email/email-nurture-kpi";
import { resolveEspAdapterMode } from "@/lib/email/esp-adapter";
import {
  dispatchNoxhWelcomeEmailStep,
  EmailNurtureSendError,
  isEmailNurtureSendEnabled,
  tryEnrollNoxhWelcomeAfterConsent,
} from "@/lib/messaging/email-nurture-server-send";
import {
  dispatchEmailCampaign,
  tryEnrollWaitlistDigestAfterConsent,
  type CampaignKind,
} from "@/lib/messaging/email-campaign-send";
import {
  dispatchCctmUtilityEmail,
  dispatchInactiveReengage,
  syncEspAudienceFromHouseX,
  tryEnrollCctmUtilityAfterConsent,
} from "@/lib/messaging/email-p3-campaigns";

function maskEmail(email: string | null | undefined): string | null {
  if (!email?.trim()) return null;
  const [local, domain] = email.trim().split("@");
  if (!domain || !local) return "***";
  if (local.length <= 2) return `${local[0] ?? "*"}***@${domain}`;
  return `${local.slice(0, 2)}***@${domain}`;
}

export function listEmailNurtureScripts() {
  return NURTURE_SCRIPT_CATALOG.filter((s) => s.channel === "email").map(
    (s) => ({
      id: s.id,
      label: s.label,
      description: s.description,
      segment: s.segment ?? null,
    }),
  );
}

export async function getEmailMarketingOverview(windowDays = 30) {
  const kpi = await buildEmailNurtureKpi(windowDays);
  const enrollments = await prisma.nurtureEnrollment.findMany({
    where: {
      purpose: MARKETING_PURPOSE,
      channel: EMAIL_NURTURE_CHANNEL,
    },
    orderBy: { updatedAt: "desc" },
    take: 80,
    select: {
      id: true,
      leadId: true,
      status: true,
      scriptId: true,
      createdAt: true,
      updatedAt: true,
      lead: {
        select: {
          segment: true,
          source: true,
          status: true,
          opsMeta: true,
          customer: { select: { name: true, email: true } },
        },
      },
      dispatches: {
        orderBy: { occurredAt: "desc" },
        take: 1,
        select: {
          id: true,
          status: true,
          occurredAt: true,
          providerMessageId: true,
        },
      },
    },
  });

  const items = enrollments
    .map((row) => {
      const opsEmail = readLeadOpsMeta(row.lead.opsMeta).channels.email?.trim();
      const email = opsEmail || row.lead.customer?.email?.trim() || null;
      const script = getNurtureScript(row.scriptId);
      const last = row.dispatches[0] ?? null;
      return {
        enrollmentId: row.id,
        leadId: row.leadId,
        status: row.status,
        scriptId: row.scriptId,
        scriptLabel: script?.label ?? row.scriptId,
        segment: row.lead.segment,
        leadStatus: row.lead.status,
        source: row.lead.source,
        customerName: row.lead.customer?.name?.trim() || null,
        emailMasked: maskEmail(email),
        updatedAt: row.updatedAt.toISOString(),
        createdAt: row.createdAt.toISOString(),
        lastDispatch: last
          ? {
              id: last.id,
              status: last.status,
              occurredAt: last.occurredAt.toISOString(),
              providerMessageId: last.providerMessageId,
            }
          : null,
      };
    })
    .sort((a, b) => {
      const rank = (s: string) => (s === "ENROLLED" || s === "ELIGIBLE" ? 0 : 1);
      const d = rank(a.status) - rank(b.status);
      if (d !== 0) return d;
      return b.updatedAt.localeCompare(a.updatedAt);
    });

  return {
    flags: {
      sendEnabled: isEmailNurtureSendEnabled(),
      espAdapter: resolveEspAdapterMode(),
    },
    kpi,
    scripts: listEmailNurtureScripts(),
    items,
  };
}

export async function getEmailMarketingLeadDetail(leadId: string) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      id: true,
      segment: true,
      source: true,
      status: true,
      opsMeta: true,
      customer: { select: { name: true, email: true } },
    },
  });
  if (!lead) return null;

  const opsEmail = readLeadOpsMeta(lead.opsMeta).channels.email?.trim();
  const email = opsEmail || lead.customer?.email?.trim() || null;

  const eligibility = await checkNurtureEligibility({
    leadId,
    purpose: MARKETING_PURPOSE,
    channel: EMAIL_NURTURE_CHANNEL,
  });

  const enrollments = await prisma.nurtureEnrollment.findMany({
    where: {
      leadId,
      purpose: MARKETING_PURPOSE,
      channel: EMAIL_NURTURE_CHANNEL,
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
    select: {
      id: true,
      status: true,
      scriptId: true,
      createdAt: true,
      updatedAt: true,
      dispatches: {
        orderBy: { occurredAt: "desc" },
        take: 5,
        select: {
          id: true,
          status: true,
          occurredAt: true,
          providerMessageId: true,
          metadata: true,
        },
      },
    },
  });

  return {
    leadId: lead.id,
    segment: lead.segment,
    source: lead.source,
    leadStatus: lead.status,
    customerName: lead.customer?.name?.trim() || null,
    emailMasked: maskEmail(email),
    hasEmail: Boolean(email),
    eligibility: {
      eligible: eligibility.eligible,
      action: eligibility.action,
      suppressionReason: eligibility.suppressionReason,
      nextTouch: eligibility.nextTouch,
      enrollment: eligibility.enrollment
        ? {
            id: eligibility.enrollment.id,
            status: eligibility.enrollment.status,
            scriptId: eligibility.enrollment.scriptId,
          }
        : null,
      lastDispatch: eligibility.lastDispatch
        ? {
            status: eligibility.lastDispatch.status,
            occurredAt: String(eligibility.lastDispatch.occurredAt),
          }
        : null,
    },
    enrollments: enrollments.map((e) => ({
      id: e.id,
      status: e.status,
      scriptId: e.scriptId,
      scriptLabel: getNurtureScript(e.scriptId)?.label ?? e.scriptId,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
      dispatches: e.dispatches.map((d) => ({
        id: d.id,
        status: d.status,
        occurredAt: d.occurredAt.toISOString(),
        providerMessageId: d.providerMessageId,
      })),
    })),
    scripts: listEmailNurtureScripts(),
  };
}

export type EmailMarketingAction =
  | "grant"
  | "withdraw"
  | "enroll"
  | "stop"
  | "send_welcome"
  | "send_campaign"
  | "esp_sync";

function campaignKindForScript(scriptId: string): CampaignKind | null {
  if (scriptId === WEEKLY_NEWSLETTER_SCRIPT_ID) return "weekly_newsletter";
  if (scriptId === WAITLIST_EMAIL_DIGEST_SCRIPT_ID) return "waitlist_digest";
  return null;
}

async function wrapSend<T>(fn: () => Promise<T>): Promise<
  | { ok: true; result: T }
  | { ok: false; reason: string; code?: string }
> {
  try {
    return { ok: true, result: await fn() };
  } catch (err) {
    if (err instanceof EmailNurtureSendError) {
      return { ok: false, reason: err.message, code: err.code };
    }
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, reason: message };
  }
}

export async function runEmailMarketingAction(input: {
  action: EmailMarketingAction;
  leadId?: string | null;
  scriptId?: string | null;
  stepIndex?: number | null;
  actorId: string;
  correlationId: string;
  idempotencyKey: string;
}) {
  const leadId = input.leadId?.trim() || "";

  if (input.action === "esp_sync") {
    const sync = await syncEspAudienceFromHouseX({
      limit: 100,
      actorId: input.actorId,
    });
    return { action: input.action, sync };
  }

  if (!leadId) {
    throw new Error("leadId_required");
  }

  if (input.action === "grant") {
    const grant = await grantMarketingEmailConsent({
      leadId,
      source: "admin:email-marketing",
      proofType: "admin_grant",
      actorId: input.actorId,
      correlationId: input.correlationId,
    });
    return { action: input.action, grant };
  }

  if (input.action === "withdraw") {
    const withdraw = await withdrawMarketingEmailConsent({
      leadId,
      source: "admin:email-marketing",
      proofType: "admin_withdraw",
      actorId: input.actorId,
      correlationId: input.correlationId,
      withdrawKey: input.idempotencyKey.slice(0, 48),
    });
    return { action: input.action, withdraw };
  }

  if (input.action === "enroll") {
    const scriptId = input.scriptId?.trim() || "";
    const script = getNurtureScript(scriptId);
    if (!script || script.channel !== "email") {
      throw new Error("invalid_email_script");
    }

    if (scriptId === NOXH_TOOL_EMAIL_WELCOME_SCRIPT_ID) {
      const enroll = await tryEnrollNoxhWelcomeAfterConsent({ leadId });
      return { action: input.action, enroll };
    }
    if (scriptId === WAITLIST_EMAIL_DIGEST_SCRIPT_ID) {
      const enroll = await tryEnrollWaitlistDigestAfterConsent({ leadId });
      return { action: input.action, enroll };
    }
    if (scriptId === CCTM_UTILITY_EMAIL_SCRIPT_ID) {
      const enroll = await tryEnrollCctmUtilityAfterConsent({ leadId });
      return { action: input.action, enroll };
    }

    const enroll = await enrollNurture({
      leadId,
      purpose: MARKETING_PURPOSE,
      channel: EMAIL_NURTURE_CHANNEL,
      scriptId,
      actorId: input.actorId,
      correlationId: input.correlationId,
      idempotencyKey: input.idempotencyKey,
      action: "enroll",
    });
    return {
      action: input.action,
      enroll: {
        enrolled: enroll.enrollment.status === "ENROLLED",
        enrollmentId: enroll.enrollment.id,
        status: enroll.enrollment.status,
        created: enroll.created,
      },
    };
  }

  if (input.action === "stop") {
    const stop = await enrollNurture({
      leadId,
      purpose: MARKETING_PURPOSE,
      channel: EMAIL_NURTURE_CHANNEL,
      actorId: input.actorId,
      correlationId: input.correlationId,
      idempotencyKey: input.idempotencyKey,
      action: "cancel",
    });
    return {
      action: input.action,
      stop: {
        enrollmentId: stop.enrollment.id,
        status: stop.enrollment.status,
      },
    };
  }

  if (input.action === "send_welcome") {
    const stepIndex = input.stepIndex ?? 1;
    const sent = await wrapSend(() =>
      dispatchNoxhWelcomeEmailStep({
        leadId,
        stepIndex,
        actorId: input.actorId,
        correlationId: input.correlationId,
        idempotencyKey: input.idempotencyKey,
      }),
    );
    return { action: input.action, sent };
  }

  if (input.action === "send_campaign") {
    const scriptId = input.scriptId?.trim() || WEEKLY_NEWSLETTER_SCRIPT_ID;
    const kind = campaignKindForScript(scriptId);

    if (kind) {
      const sent = await wrapSend(() =>
        dispatchEmailCampaign({
          leadId,
          kind,
          actorId: input.actorId,
          correlationId: input.correlationId,
        }),
      );
      return { action: input.action, scriptId, sent };
    }

    if (scriptId === CCTM_UTILITY_EMAIL_SCRIPT_ID) {
      const sent = await wrapSend(() =>
        dispatchCctmUtilityEmail({
          leadId,
          actorId: input.actorId,
          correlationId: input.correlationId,
        }),
      );
      return { action: input.action, scriptId, sent };
    }

    if (scriptId === INACTIVE_REENGAGE_SCRIPT_ID) {
      const sent = await wrapSend(() =>
        dispatchInactiveReengage({
          leadId,
          actorId: input.actorId,
          correlationId: input.correlationId,
        }),
      );
      return { action: input.action, scriptId, sent };
    }

    if (scriptId === NOXH_TOOL_EMAIL_WELCOME_SCRIPT_ID) {
      const sent = await wrapSend(() =>
        dispatchNoxhWelcomeEmailStep({
          leadId,
          stepIndex: input.stepIndex ?? 1,
          actorId: input.actorId,
          correlationId: input.correlationId,
          idempotencyKey: input.idempotencyKey,
        }),
      );
      return { action: input.action, scriptId, sent };
    }

    throw new Error("unsupported_campaign_script");
  }

  throw new Error("unknown_action");
}
