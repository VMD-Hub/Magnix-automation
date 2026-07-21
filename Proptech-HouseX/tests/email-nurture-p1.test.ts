import assert from "node:assert/strict";
import { describe, it, before } from "node:test";
import {
  NOXH_WELCOME_SEQUENCE_ID,
  NOXH_WELCOME_STEPS,
  buildNoxhWelcomeEmail,
  getNoxhWelcomeStep,
  resolveWelcomeCtaUrl,
} from "../lib/email/noxh-welcome-sequence.ts";
import { sendMarketingEmail, buildResendMarketingTags } from "../lib/email/marketing-send.ts";
import { NOXH_TOOL_EMAIL_WELCOME_SCRIPT_ID } from "../lib/leads/nurture-scripts.ts";

describe("ADR-017 P1 — Welcome sequence + marketing adapter", () => {
  before(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.test";
    delete process.env.EMAIL_WEBHOOK_URL;
    delete process.env.RESEND_API_KEY;
  });

  it("dedupes Resend marketing tag when mail.tags also has marketing", () => {
    const tags = buildResendMarketingTags({
      sequenceId: "noxh-tool-email-welcome",
      stepIndex: 1,
      tags: ["marketing", "noxh_welcome", "e1"],
    });
    const names = tags.map((t) => t.name);
    assert.equal(names.filter((n) => n === "marketing").length, 1);
    assert.ok(names.includes("noxh_welcome"));
    assert.ok(names.includes("e1"));
    assert.ok(names.includes("sequence"));
    assert.ok(names.includes("step"));
  });
  it("defines E1–E3 with delay metadata for n8n", () => {
    assert.equal(NOXH_WELCOME_SEQUENCE_ID, NOXH_TOOL_EMAIL_WELCOME_SCRIPT_ID);
    assert.equal(NOXH_WELCOME_STEPS.length, 3);
    assert.equal(NOXH_WELCOME_STEPS[0]?.delayDays, 0);
    assert.equal(NOXH_WELCOME_STEPS[1]?.delayDays, 1);
    assert.equal(NOXH_WELCOME_STEPS[2]?.delayDays, 3);
  });

  it("builds E1 with unsubscribe + single CTA", () => {
    const built = buildNoxhWelcomeEmail({
      stepIndex: 1,
      recipientName: "An",
      unsubscribeUrl: "https://example.test/huy-dang-ky-email?token=x",
    });
    assert.ok(built);
    assert.match(built!.html, /Hủy đăng ký email marketing/);
    assert.match(built!.html, /huy-dang-ky-email/);
    assert.match(built!.text, /Hủy đăng ký/);
    assert.ok(built!.subject.length > 10);
    assert.ok(getNoxhWelcomeStep(2));
    assert.equal(getNoxhWelcomeStep(9), null);
  });

  it("resolves CTA URL keys", () => {
    assert.equal(
      resolveWelcomeCtaUrl("tool_noxh"),
      "https://example.test/cong-cu/dieu-kien-noxh",
    );
    assert.equal(
      resolveWelcomeCtaUrl("projects_noxh"),
      "https://example.test/du-an/nha-o-xa-hoi",
    );
  });

  it("sendMarketingEmail uses marketing.email via dev_log", async () => {
    const result = await sendMarketingEmail({
      to: "an@example.test",
      subject: "Test marketing",
      html: "<p>hi</p>",
      text: "hi",
      unsubscribeUrl: "https://example.test/huy-dang-ky-email?token=t",
      enrollmentId: "enroll-1",
      sequenceId: NOXH_WELCOME_SEQUENCE_ID,
      stepIndex: 1,
      tags: ["test"],
    });
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.provider, "dev_log");
  });

  it("rejects marketing send without unsubscribe url", async () => {
    const result = await sendMarketingEmail({
      to: "an@example.test",
      subject: "Test",
      html: "<p>x</p>",
      text: "x",
      unsubscribeUrl: "  ",
      enrollmentId: "enroll-1",
      sequenceId: NOXH_WELCOME_SEQUENCE_ID,
      stepIndex: 1,
    });
    assert.equal(result.ok, false);
  });
});
