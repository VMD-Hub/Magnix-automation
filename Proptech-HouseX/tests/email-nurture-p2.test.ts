import assert from "node:assert/strict";
import { describe, it, before } from "node:test";
import {
  pickAbSubject,
  isoWeekCampaignKey,
} from "../lib/email/ab-subject.ts";
import { WEEKLY_NEWSLETTER_SUBJECTS } from "../lib/email/weekly-newsletter.ts";
import { WAITLIST_DIGEST_SUBJECTS } from "../lib/email/waitlist-digest.ts";
import { buildWeeklyNewsletterEmail } from "../lib/email/weekly-newsletter.ts";
import { buildWaitlistDigestEmail } from "../lib/email/waitlist-digest.ts";
import { normalizeInboundEmailProviderPayload } from "../lib/email/email-provider-events.ts";
import { getNurtureScript, WEEKLY_NEWSLETTER_SCRIPT_ID } from "../lib/leads/nurture-scripts.ts";
import { sendMarketingEmail } from "../lib/email/marketing-send.ts";

describe("ADR-017 P2 — newsletter / A/B / provider normalize", () => {
  before(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.test";
    delete process.env.EMAIL_WEBHOOK_URL;
    delete process.env.RESEND_API_KEY;
  });

  it("catalog includes weekly newsletter script", () => {
    const s = getNurtureScript(WEEKLY_NEWSLETTER_SCRIPT_ID);
    assert.ok(s);
    assert.equal(s?.channel, "email");
  });

  it("pickAbSubject is deterministic", () => {
    const a = pickAbSubject({
      leadId: "lead-stable-1",
      campaignKey: "weekly_newsletter:2026-W30",
      subjectA: WEEKLY_NEWSLETTER_SUBJECTS.A,
      subjectB: WEEKLY_NEWSLETTER_SUBJECTS.B,
      testPercent: 15,
    });
    const b = pickAbSubject({
      leadId: "lead-stable-1",
      campaignKey: "weekly_newsletter:2026-W30",
      subjectA: WEEKLY_NEWSLETTER_SUBJECTS.A,
      subjectB: WEEKLY_NEWSLETTER_SUBJECTS.B,
      testPercent: 15,
    });
    assert.equal(a.variant, b.variant);
    assert.equal(a.subject, b.subject);
  });

  it("isoWeekCampaignKey format", () => {
    assert.match(isoWeekCampaignKey(new Date("2026-07-21T00:00:00Z")), /^2026-W\d{2}$/);
  });

  it("builds newsletter + waitlist digest with unsubscribe", () => {
    const n = buildWeeklyNewsletterEmail({
      recipientName: "An",
      weekKey: "2026-W30",
      subject: WEEKLY_NEWSLETTER_SUBJECTS.B,
      unsubscribeUrl: "https://example.test/huy-dang-ky-email?token=t",
    });
    assert.match(n.html, /Hủy đăng ký/);
    const d = buildWaitlistDigestEmail({
      recipientName: "An",
      weekKey: "2026-W30",
      subject: WAITLIST_DIGEST_SUBJECTS.A,
      unsubscribeUrl: "https://example.test/huy-dang-ky-email?token=t",
      projectHint: "Dự án demo",
    });
    assert.match(d.html, /email phụ/);
    assert.match(d.html, /Dự án demo/);
  });

  it("normalizes bounce and open payloads", () => {
    const bounce = normalizeInboundEmailProviderPayload({
      type: "email.bounced",
      bounce_type: "hard",
      provider_message_id: "msg_1",
      lead_id: "lead-1",
    });
    assert.equal(bounce?.type, "bounce");
    assert.equal(bounce?.bounceClass, "hard");

    const open = normalizeInboundEmailProviderPayload({
      type: "email.opened",
      data: { email_id: "msg_2" },
    });
    assert.equal(open?.type, "open");
    assert.equal(open?.providerMessageId, "msg_2");
  });

  it("marketing send returns providerMessageId on dev_log", async () => {
    const result = await sendMarketingEmail({
      to: "a@example.test",
      subject: "S",
      html: "<p>x</p>",
      text: "x",
      unsubscribeUrl: "https://example.test/huy-dang-ky-email?token=t",
      enrollmentId: "e1",
      sequenceId: "weekly-newsletter",
      stepIndex: 0,
      abVariant: "B",
      campaignKey: "weekly_newsletter:2026-W30",
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.provider, "dev_log");
      assert.ok(result.providerMessageId);
    }
  });
});
