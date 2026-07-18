/**
 * Phase 2 telesales — gửi OA/SMS từ server + enroll SC-6 + NurtureDispatch.
 * Deep-link Phase 1 không đi qua đây.
 */

import { prisma } from "@/lib/prisma";
import { normalizeVnPhone, isValidVnPhone } from "@/lib/phone";
import { readLeadOpsMeta } from "@/lib/leads/ops-meta";
import { getOpsLeadContactBundle } from "@/lib/leads/ops-lead-board";
import {
  TELESALES_MISS_CALLBACK_SCRIPT_ID,
} from "@/lib/leads/nurture-scripts";
import {
  appendSalesActivity,
  enrollNurture,
  getEffectiveConsent,
  recordNurtureDispatchResult,
} from "@/lib/sales-core/service";
import { SalesCoreRuleError } from "@/lib/sales-core/domain";
import { TELESALES_MISS_OA_BODY, TELESALES_MISS_SMS_BODY } from "@/lib/messaging/copy";
import { sendTelesalesOaText } from "@/lib/messaging/zalo-oa-provider";
import {
  isTelesalesSmsWebhookConfigured,
  sendTelesalesSmsViaWebhook,
} from "@/lib/messaging/sms-webhook-provider";
import type {
  ChannelDispatchOutcome,
  TelesalesServerChannel,
} from "@/lib/messaging/types";

export class TelesalesServerSendError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "TelesalesServerSendError";
  }
}

export function isTelesalesServerSendEnabled(): boolean {
  const v = process.env.TELESALES_SERVER_SEND_ENABLED?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

function dayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

async function resolveLeadPhone(leadId: string): Promise<string | null> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      opsMeta: true,
      customer: { select: { phone: true, normalizedPhone: true } },
    },
  });
  if (!lead) return null;
  const opsPhone = readLeadOpsMeta(lead.opsMeta).channels.phone ?? null;
  const raw = opsPhone ?? lead.customer?.phone ?? null;
  if (!raw) return null;
  const normalized = normalizeVnPhone(raw);
  if (!isValidVnPhone(normalized)) return raw.trim() || null;
  return raw.trim();
}

async function resolveZaloUserId(leadId: string): Promise<string | null> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      opsMeta: true,
      customer: {
        select: {
          normalizedPhone: true,
          userAccount: { select: { zaloUserId: true } },
        },
      },
    },
  });
  if (!lead) return null;

  const fromCustomer = lead.customer?.userAccount?.zaloUserId?.trim();
  if (fromCustomer) return fromCustomer;

  const opsPhone = readLeadOpsMeta(lead.opsMeta).channels.phone ?? null;
  const phoneRaw =
    opsPhone ??
    (lead.customer?.normalizedPhone
      ? lead.customer.normalizedPhone
      : null);
  if (!phoneRaw) return null;
  const normalized = normalizeVnPhone(phoneRaw);
  if (!isValidVnPhone(normalized)) return null;

  const account = await prisma.userAccount.findUnique({
    where: { normalizedPhone: normalized },
    select: { zaloUserId: true },
  });
  return account?.zaloUserId?.trim() || null;
}

async function sendOneChannel(input: {
  leadId: string;
  channel: TelesalesServerChannel;
  actorId: string;
  correlationId: string;
  requestIdempotencyKey: string;
}): Promise<ChannelDispatchOutcome> {
  const { leadId, channel, actorId, correlationId } = input;
  const day = dayKey();
  const enrollKey = `telesales-send:${leadId}:${channel}:${day}`;
  const dispatchKey = `${input.requestIdempotencyKey}:dispatch:${channel}`;
  const activityKey = `${input.requestIdempotencyKey}:activity:${channel}`;
  const now = new Date();

  const consent = await getEffectiveConsent({
    subjectType: "LEAD",
    subjectId: leadId,
    purpose: "marketing",
    channel,
  });

  if (!consent.granted) {
    await appendSalesActivity({
      leadId,
      type: "CONTACT_ATTEMPT",
      channel,
      note: "Server send bỏ qua — chưa có marketing consent theo kênh.",
      reason: "SERVER_SEND_SKIPPED",
      actorId,
      occurredAt: now,
      correlationId: `${correlationId}:${channel}`,
      idempotencyKey: activityKey,
      metadata: {
        telesalesServer: true,
        status: "SKIPPED",
        skipReason: "CONSENT_DENIED",
      },
    });
    return {
      channel,
      status: "SKIPPED",
      reason: "CONSENT_DENIED",
      enrollmentId: null,
      dispatchId: null,
      created: true,
    };
  }

  let enrollmentId: string;
  try {
    const { enrollment } = await enrollNurture({
      leadId,
      purpose: "marketing",
      channel,
      scriptId: TELESALES_MISS_CALLBACK_SCRIPT_ID,
      actorId,
      correlationId: `${correlationId}:enroll:${channel}`,
      idempotencyKey: enrollKey,
      action: "enroll",
    });
    enrollmentId = enrollment.id;
  } catch (err) {
    if (err instanceof SalesCoreRuleError) {
      await appendSalesActivity({
        leadId,
        type: "CONTACT_ATTEMPT",
        channel,
        note: `Server send bỏ qua — ${err.message}`,
        reason: "SERVER_SEND_SKIPPED",
        actorId,
        occurredAt: now,
        correlationId: `${correlationId}:${channel}`,
        idempotencyKey: activityKey,
        metadata: {
          telesalesServer: true,
          status: "SKIPPED",
          skipReason: err.code,
        },
      });
      return {
        channel,
        status: "SKIPPED",
        reason: err.code,
        enrollmentId: null,
        dispatchId: null,
        created: true,
      };
    }
    throw err;
  }

  // Chống double-send trong ngày: đã có SENT trên enrollment → không gọi provider lại.
  const priorSent = await prisma.nurtureDispatch.findFirst({
    where: { enrollmentId, status: "SENT" },
    orderBy: { occurredAt: "desc" },
  });
  if (priorSent) {
    await appendSalesActivity({
      leadId,
      type: "CONTACT_ATTEMPT",
      channel,
      note: "Server send bỏ qua — đã gửi thành công trong ngày (idempotent).",
      reason: "SERVER_SEND_SKIPPED",
      actorId,
      occurredAt: now,
      correlationId: `${correlationId}:${channel}`,
      idempotencyKey: activityKey,
      metadata: {
        telesalesServer: true,
        status: "SKIPPED",
        skipReason: "ALREADY_SENT_TODAY",
        enrollmentId,
        dispatchId: priorSent.id,
      },
    });
    return {
      channel,
      status: "SKIPPED",
      reason: "ALREADY_SENT_TODAY",
      enrollmentId,
      dispatchId: priorSent.id,
      created: false,
    };
  }

  let skipReason: string | null = null;
  let sendFailed: string | null = null;
  let sent = false;

  if (channel === "oa") {
    const zaloUserId = await resolveZaloUserId(leadId);
    if (!zaloUserId) {
      skipReason = "NO_ZALO_USER_ID";
    } else {
      const result = await sendTelesalesOaText({
        zaloUserId,
        text: TELESALES_MISS_OA_BODY,
      });
      if (result.ok) {
        sent = true;
      } else if (result.skip) {
        skipReason = result.error;
      } else {
        sendFailed = result.error;
      }
    }
  } else {
    const phone = await resolveLeadPhone(leadId);
    if (!phone) {
      skipReason = "NO_PHONE";
    } else if (!isTelesalesSmsWebhookConfigured()) {
      skipReason = "SMS_WEBHOOK_UNCONFIGURED";
    } else {
      const result = await sendTelesalesSmsViaWebhook({
        leadId,
        phone,
        text: TELESALES_MISS_SMS_BODY,
        correlationId: `${correlationId}:sms`,
        idempotencyKey: dispatchKey,
      });
      if (result.ok) {
        sent = true;
      } else if (result.skip) {
        skipReason = result.error;
      } else {
        sendFailed = result.error;
      }
    }
  }

  const status: "SENT" | "FAILED" | "SKIPPED" = sent
    ? "SENT"
    : skipReason
      ? "SKIPPED"
      : "FAILED";
  const reason = sent ? null : skipReason ?? sendFailed ?? "UNKNOWN";

  const { dispatch, created } = await recordNurtureDispatchResult({
    enrollmentId,
    status,
    actorId,
    occurredAt: now,
    correlationId: `${correlationId}:dispatch:${channel}`,
    idempotencyKey: dispatchKey,
  });

  await appendSalesActivity({
    leadId,
    type: "CONTACT_ATTEMPT",
    channel,
    note:
      status === "SENT"
        ? channel === "oa"
          ? "Đã gửi OA từ server (miss-call)."
          : "Đã gửi SMS từ server (miss-call)."
        : `Server send ${status}: ${reason ?? "—"}`,
    reason:
      status === "SENT"
        ? channel === "oa"
          ? "OA_SENT"
          : "SMS_SENT"
        : "SERVER_SEND_SKIPPED",
    actorId,
    occurredAt: now,
    correlationId: `${correlationId}:${channel}`,
    idempotencyKey: activityKey,
    metadata: {
      telesalesServer: true,
      status,
      reason,
      enrollmentId,
      dispatchId: dispatch.id,
    },
  });

  return {
    channel,
    status,
    reason,
    enrollmentId,
    dispatchId: dispatch.id,
    created,
  };
}

export async function sendTelesalesServerChannels(input: {
  leadId: string;
  channels: TelesalesServerChannel[];
  actorId: string;
  correlationId: string;
  idempotencyKey: string;
}) {
  if (!isTelesalesServerSendEnabled()) {
    throw new TelesalesServerSendError(
      "SERVER_SEND_DISABLED",
      "TELESALES_SERVER_SEND_ENABLED chưa bật.",
    );
  }

  const unique = [...new Set(input.channels)];
  if (unique.length === 0) {
    throw new TelesalesServerSendError(
      "VALIDATION_ERROR",
      "Chọn ít nhất một kênh oa hoặc sms.",
    );
  }

  const lead = await prisma.lead.findUnique({
    where: { id: input.leadId },
    select: { id: true },
  });
  if (!lead) {
    throw new TelesalesServerSendError("NOT_FOUND", "Không tìm thấy lead.");
  }

  const results: ChannelDispatchOutcome[] = [];
  for (const channel of unique) {
    results.push(
      await sendOneChannel({
        leadId: input.leadId,
        channel,
        actorId: input.actorId,
        correlationId: input.correlationId,
        requestIdempotencyKey: input.idempotencyKey,
      }),
    );
  }

  const bundle = await getOpsLeadContactBundle(input.leadId);
  return { results, bundle };
}
