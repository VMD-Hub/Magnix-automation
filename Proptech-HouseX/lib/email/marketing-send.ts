import { createHash } from "crypto";
import { getNoreplyFrom } from "@/lib/site-config";

export type MarketingEmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
  unsubscribeUrl: string;
  enrollmentId: string;
  sequenceId: string;
  stepIndex: number;
  /** Optional — filled after audit when known. */
  dispatchId?: string | null;
  tags?: string[];
  abVariant?: "A" | "B" | null;
  campaignKey?: string | null;
};

export type SendMarketingEmailResult =
  | { ok: true; provider: string; providerMessageId: string | null }
  | { ok: false; error: string };

function maskTo(to: string): string {
  return to.replace(/(.{2}).*(@.*)/, "$1***$2");
}

/**
 * ADR-017 — DeliveryAdapter marketing (tách khỏi transactional sendEmail).
 * Provider order: EMAIL_WEBHOOK_URL → Resend → dev_log.
 */
export async function sendMarketingEmail(
  mail: MarketingEmailPayload,
): Promise<SendMarketingEmailResult> {
  const to = mail.to.trim();
  if (!to) return { ok: false, error: "missing_recipient" };
  if (!mail.unsubscribeUrl.trim()) {
    return { ok: false, error: "missing_unsubscribe_url" };
  }

  const body = {
    type: "marketing.email" as const,
    to,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    unsubscribe_url: mail.unsubscribeUrl,
    enrollment_id: mail.enrollmentId,
    dispatch_id: mail.dispatchId ?? null,
    sequence_id: mail.sequenceId,
    step_index: mail.stepIndex,
    ab_variant: mail.abVariant ?? null,
    campaign_key: mail.campaignKey ?? null,
    tags: mail.tags ?? [],
    sentAt: new Date().toISOString(),
  };

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
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        return { ok: false, error: `webhook_${res.status}` };
      }
      let providerMessageId: string | null = null;
      try {
        const json = (await res.json()) as { id?: string; messageId?: string };
        providerMessageId = json.id ?? json.messageId ?? null;
      } catch {
        providerMessageId = null;
      }
      return { ok: true, provider: "webhook", providerMessageId };
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
          headers: [
            { name: "List-Unsubscribe", value: `<${mail.unsubscribeUrl}>` },
            { name: "List-Unsubscribe-Post", value: "List-Unsubscribe=One-Click" },
          ],
          tags: [
            { name: "marketing", value: "1" },
            { name: "sequence", value: mail.sequenceId.slice(0, 40) },
            { name: "step", value: String(mail.stepIndex) },
            ...(mail.abVariant
              ? [{ name: "ab", value: mail.abVariant }]
              : []),
            ...(mail.tags ?? []).slice(0, 2).map((name) => ({
              name: name.slice(0, 40),
              value: "1",
            })),
          ],
        }),
      });
      if (!res.ok) {
        const errBody = (await res.text().catch(() => "")).slice(0, 240);
        return {
          ok: false,
          error: errBody
            ? `resend_${res.status}:${errBody}`
            : `resend_${res.status}`,
        };
      }
      let providerMessageId: string | null = null;
      try {
        const json = (await res.json()) as { id?: string };
        providerMessageId = json.id ?? null;
      } catch {
        providerMessageId = null;
      }
      return { ok: true, provider: "resend", providerMessageId };
    } catch {
      return { ok: false, error: "resend_failed" };
    }
  }

  const providerMessageId = `dev_${createHash("sha256")
    .update(`${mail.enrollmentId}:${mail.sequenceId}:${mail.stepIndex}:${mail.subject}`)
    .digest("hex")
    .slice(0, 16)}`;

  console.log("[email:marketing:dev]", {
    to: maskTo(to),
    subject: mail.subject,
    sequenceId: mail.sequenceId,
    stepIndex: mail.stepIndex,
    abVariant: mail.abVariant,
    campaignKey: mail.campaignKey,
    providerMessageId,
    enrollmentKey: createHash("sha256")
      .update(mail.enrollmentId)
      .digest("hex")
      .slice(0, 12),
  });
  return { ok: true, provider: "dev_log", providerMessageId };
}
