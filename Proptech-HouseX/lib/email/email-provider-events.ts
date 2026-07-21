import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { withdrawMarketingEmailConsent } from "@/lib/sales-core/marketing-email-consent";
import { recordEmailEngagementEvent } from "@/lib/email/email-engagement";

export type ProviderEmailEventType =
  | "bounce"
  | "complaint"
  | "open"
  | "click"
  | "delivered";

export type NormalizedProviderEmailEvent = {
  type: ProviderEmailEventType;
  providerMessageId?: string | null;
  leadId?: string | null;
  enrollmentId?: string | null;
  dispatchId?: string | null;
  campaignKey?: string | null;
  /** hard | soft — only hard bounce suppresses. */
  bounceClass?: "hard" | "soft" | null;
  occurredAt?: Date;
  rawType?: string;
};

function eventIdemKey(ev: NormalizedProviderEmailEvent): string {
  const base =
    ev.providerMessageId?.trim() ||
    ev.dispatchId?.trim() ||
    ev.leadId?.trim() ||
    "unknown";
  return `email-provider:${ev.type}:${base}:${ev.rawType ?? ""}`.slice(0, 200);
}

async function resolveLeadFromEvent(
  ev: NormalizedProviderEmailEvent,
): Promise<{
  leadId: string | null;
  enrollmentId: string | null;
  dispatchId: string | null;
}> {
  if (ev.leadId) {
    return {
      leadId: ev.leadId,
      enrollmentId: ev.enrollmentId ?? null,
      dispatchId: ev.dispatchId ?? null,
    };
  }

  if (ev.dispatchId) {
    const d = await prisma.nurtureDispatch.findUnique({
      where: { id: ev.dispatchId },
      select: {
        id: true,
        enrollmentId: true,
        enrollment: { select: { leadId: true } },
      },
    });
    if (d) {
      return {
        leadId: d.enrollment.leadId,
        enrollmentId: d.enrollmentId,
        dispatchId: d.id,
      };
    }
  }

  if (ev.providerMessageId) {
    const d = await prisma.nurtureDispatch.findFirst({
      where: { providerMessageId: ev.providerMessageId },
      select: {
        id: true,
        enrollmentId: true,
        enrollment: { select: { leadId: true } },
      },
      orderBy: { occurredAt: "desc" },
    });
    if (d) {
      return {
        leadId: d.enrollment.leadId,
        enrollmentId: d.enrollmentId,
        dispatchId: d.id,
      };
    }
  }

  return {
    leadId: null,
    enrollmentId: ev.enrollmentId ?? null,
    dispatchId: ev.dispatchId ?? null,
  };
}

/**
 * Handle inbound ESP/n8n events. Bounce(hard)/complaint → withdraw + cancel.
 * Open/click → engagement only (no consent change).
 */
export async function handleProviderEmailEvent(
  ev: NormalizedProviderEmailEvent,
): Promise<{
  ok: boolean;
  suppressed: boolean;
  engagementRecorded: boolean;
  reason?: string;
}> {
  const resolved = await resolveLeadFromEvent(ev);
  const idempotencyKey = eventIdemKey({
    ...ev,
    leadId: resolved.leadId,
    dispatchId: resolved.dispatchId,
  });

  const engagementType =
    ev.type === "bounce" ||
    ev.type === "complaint" ||
    ev.type === "open" ||
    ev.type === "click" ||
    ev.type === "delivered"
      ? ev.type
      : null;
  if (!engagementType) {
    return {
      ok: false,
      suppressed: false,
      engagementRecorded: false,
      reason: "UNSUPPORTED_TYPE",
    };
  }

  const { created } = await recordEmailEngagementEvent({
    type: engagementType,
    leadId: resolved.leadId,
    enrollmentId: resolved.enrollmentId,
    dispatchId: resolved.dispatchId,
    providerMessageId: ev.providerMessageId ?? null,
    campaignKey: ev.campaignKey ?? null,
    payload: {
      rawType: ev.rawType ?? null,
      bounceClass: ev.bounceClass ?? null,
    },
    occurredAt: ev.occurredAt,
    idempotencyKey,
  });

  const shouldSuppress =
    ev.type === "complaint" ||
    (ev.type === "bounce" && (ev.bounceClass ?? "hard") === "hard");

  if (!shouldSuppress) {
    return {
      ok: true,
      suppressed: false,
      engagementRecorded: created,
    };
  }

  if (!resolved.leadId) {
    return {
      ok: true,
      suppressed: false,
      engagementRecorded: created,
      reason: "NO_LEAD_FOR_SUPPRESS",
    };
  }

  const withdrawKey = createHash("sha256")
    .update(idempotencyKey)
    .digest("hex")
    .slice(0, 24);

  const result = await withdrawMarketingEmailConsent({
    leadId: resolved.leadId,
    source: "email:provider-event",
    proofType: ev.type === "complaint" ? "complaint" : "hard_bounce",
    proofRef: ev.providerMessageId ?? resolved.dispatchId,
    actorId: "system:email-provider",
    withdrawKey,
  });

  return {
    ok: result.withdrawn,
    suppressed: result.withdrawn,
    engagementRecorded: created,
    reason: result.withdrawn ? undefined : result.reason,
  };
}

/** Map Resend-ish or n8n-normalized JSON into NormalizedProviderEmailEvent. */
export function normalizeInboundEmailProviderPayload(
  body: Record<string, unknown>,
): NormalizedProviderEmailEvent | null {
  const typeRaw = String(
    body.type ?? body.event ?? body.event_type ?? "",
  )
    .trim()
    .toLowerCase();

  let type: ProviderEmailEventType | null = null;
  let bounceClass: "hard" | "soft" | null = null;

  if (
    typeRaw.includes("complaint") ||
    typeRaw === "email.complained" ||
    typeRaw === "complained"
  ) {
    type = "complaint";
  } else if (
    typeRaw.includes("bounce") ||
    typeRaw === "email.bounced" ||
    typeRaw === "bounced"
  ) {
    type = "bounce";
    const cls = String(body.bounce_type ?? body.bounceType ?? "hard")
      .toLowerCase()
      .trim();
    bounceClass = cls.includes("soft") ? "soft" : "hard";
  } else if (typeRaw.includes("open") || typeRaw === "email.opened") {
    type = "open";
  } else if (typeRaw.includes("click") || typeRaw === "email.clicked") {
    type = "click";
  } else if (
    typeRaw.includes("delivered") ||
    typeRaw === "email.delivered"
  ) {
    type = "delivered";
  }

  if (!type) return null;

  const data =
    body.data && typeof body.data === "object" && !Array.isArray(body.data)
      ? (body.data as Record<string, unknown>)
      : body;

  const providerMessageId =
    (typeof data.email_id === "string" && data.email_id) ||
    (typeof data.message_id === "string" && data.message_id) ||
    (typeof body.provider_message_id === "string" &&
      body.provider_message_id) ||
    (typeof body.providerMessageId === "string" && body.providerMessageId) ||
    null;

  return {
    type,
    bounceClass,
    providerMessageId,
    leadId:
      (typeof body.lead_id === "string" && body.lead_id) ||
      (typeof body.leadId === "string" && body.leadId) ||
      null,
    enrollmentId:
      (typeof body.enrollment_id === "string" && body.enrollment_id) ||
      (typeof body.enrollmentId === "string" && body.enrollmentId) ||
      null,
    dispatchId:
      (typeof body.dispatch_id === "string" && body.dispatch_id) ||
      (typeof body.dispatchId === "string" && body.dispatchId) ||
      null,
    campaignKey:
      (typeof body.campaign_key === "string" && body.campaign_key) ||
      (typeof body.campaignKey === "string" && body.campaignKey) ||
      null,
    rawType: typeRaw,
    occurredAt: new Date(),
  };
}
