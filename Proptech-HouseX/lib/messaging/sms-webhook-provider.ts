import type { MessagingSendResult } from "@/lib/messaging/types";

export function isTelesalesSmsWebhookConfigured(): boolean {
  return Boolean(process.env.SMS_WEBHOOK_URL?.trim());
}

/**
 * Gửi SMS qua n8n webhook. Payload có phone (cần để gửi) — không log body.
 * Thiếu SMS_WEBHOOK_URL → skip (caller ghi NurtureDispatch SKIPPED).
 */
export async function sendTelesalesSmsViaWebhook(params: {
  leadId: string;
  phone: string;
  text: string;
  correlationId: string;
  idempotencyKey: string;
}): Promise<MessagingSendResult> {
  const url = process.env.SMS_WEBHOOK_URL?.trim();
  if (!url) {
    return { ok: false, error: "SMS_WEBHOOK_UNCONFIGURED", skip: true };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.SMS_WEBHOOK_SECRET?.trim()
          ? { "x-sms-webhook-secret": process.env.SMS_WEBHOOK_SECRET.trim() }
          : {}),
      },
      body: JSON.stringify({
        type: "telesales.sms",
        leadId: params.leadId,
        phone: params.phone,
        text: params.text,
        correlationId: params.correlationId,
        idempotencyKey: params.idempotencyKey,
        sentAt: new Date().toISOString(),
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return {
        ok: false,
        error: `SMS_WEBHOOK_${res.status}${detail ? `:${detail.slice(0, 120)}` : ""}`,
      };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
