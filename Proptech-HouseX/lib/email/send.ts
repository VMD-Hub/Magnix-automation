import type { OutboundEmail } from "@/lib/email/templates";
import { getNoreplyFrom } from "@/lib/site-config";

export type SendEmailResult = { ok: true; provider: string } | { ok: false; error: string };

/**
 * Gửi email transactional.
 * Thứ tự provider: n8n webhook (Magnix) → Resend API → log dev.
 * Không log nội dung PII đầy đủ — chỉ log `to` đã hash ngắn.
 */
export async function sendEmail(
  mail: OutboundEmail,
): Promise<SendEmailResult> {
  const to = mail.to.trim();
  if (!to) return { ok: false, error: "missing_recipient" };

  const webhook = process.env.EMAIL_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(process.env.EMAIL_WEBHOOK_SECRET
            ? { "x-email-secret": process.env.EMAIL_WEBHOOK_SECRET }
            : {}),
        },
        body: JSON.stringify({
          type: "transactional.email",
          to,
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
          tags: mail.tags ?? [],
          sentAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        return { ok: false, error: `webhook_${res.status}` };
      }
      return { ok: true, provider: "webhook" };
    } catch {
      return { ok: false, error: "webhook_failed" };
    }
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const from = getNoreplyFrom();
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${resendKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
          tags: mail.tags?.map((name) => ({ name, value: "1" })),
        }),
      });
      if (!res.ok) {
        const body = (await res.text().catch(() => "")).slice(0, 240);
        return {
          ok: false,
          error: body
            ? `resend_${res.status}:${body}`
            : `resend_${res.status}`,
        };
      }
      return { ok: true, provider: "resend" };
    } catch {
      return { ok: false, error: "resend_failed" };
    }
  }

  // Dev: không có provider — log tóm tắt (không log HTML đầy đủ).
  console.log("[email:dev]", {
    to: to.replace(/(.{2}).*(@.*)/, "$1***$2"),
    subject: mail.subject,
    tags: mail.tags,
  });
  return { ok: true, provider: "dev_log" };
}
