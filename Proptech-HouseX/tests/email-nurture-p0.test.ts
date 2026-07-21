import assert from "node:assert/strict";
import { describe, it, before } from "node:test";
import {
  isAutoNurtureChannel,
  buildLeadNurturePayload,
} from "../lib/leads/nurture-auto.ts";
import {
  getNurtureScript,
  resolveNurtureScriptId,
  NOXH_TOOL_EMAIL_WELCOME_SCRIPT_ID,
  WAITLIST_EMAIL_DIGEST_SCRIPT_ID,
} from "../lib/leads/nurture-scripts.ts";
import { LEAD_SOURCE } from "../lib/leads/source.ts";
import {
  issueEmailUnsubscribeToken,
  verifyEmailUnsubscribeToken,
  buildEmailUnsubscribeUrl,
} from "../lib/email/unsubscribe-token.ts";
import {
  EMAIL_NURTURE_CHANNEL,
  MARKETING_PURPOSE,
  EMAIL_NURTURE_POLICY_VERSION,
} from "../lib/sales-core/marketing-email-consent.ts";

describe("ADR-017 P0 — email nurture channel", () => {
  before(() => {
    if (!process.env.AUTH_SECRET) {
      process.env.AUTH_SECRET = "test-auth-secret-email-nurture-p0";
    }
  });

  it("treats email as auto nurture channel", () => {
    assert.equal(isAutoNurtureChannel("email"), true);
    assert.equal(isAutoNurtureChannel("manual"), false);
  });

  it("catalog includes email welcome + waitlist digest scripts", () => {
    const welcome = getNurtureScript(NOXH_TOOL_EMAIL_WELCOME_SCRIPT_ID);
    assert.ok(welcome);
    assert.equal(welcome?.channel, "email");
    assert.deepEqual(welcome?.sources, [
      LEAD_SOURCE.TOOL_NOXH_CHECK,
      LEAD_SOURCE.TOOL_NOXH_LOAN_QUICK,
    ]);

    const digest = getNurtureScript(WAITLIST_EMAIL_DIGEST_SCRIPT_ID);
    assert.ok(digest);
    assert.equal(digest?.channel, "email");
  });

  it("auto-resolve still prefers OA tool followup over email script", () => {
    assert.equal(
      resolveNurtureScriptId({
        segment: "NOXH",
        source: LEAD_SOURCE.TOOL_NOXH_CHECK,
      }),
      "noxh-tool-followup",
    );
  });

  it("builds lead.nurture payload for email welcome script", () => {
    const payload = buildLeadNurturePayload({
      leadId: "lead-email-1",
      nurtureScriptId: NOXH_TOOL_EMAIL_WELCOME_SCRIPT_ID,
      trigger: "on_create",
      segment: "NOXH",
      source: LEAD_SOURCE.TOOL_NOXH_CHECK,
      contact: { name: "An", phone: "0901234567", email: "an@example.com" },
      channels: { email: "an@example.com" },
      opsNote: null,
    });
    assert.ok(payload);
    assert.equal(payload?.channel, "email");
    assert.equal(payload?.nurtureScriptId, NOXH_TOOL_EMAIL_WELCOME_SCRIPT_ID);
  });

  it("issues and verifies unsubscribe token", () => {
    const leadId = "11111111-1111-4111-8111-111111111111";
    const token = issueEmailUnsubscribeToken(leadId, 3600);
    const verified = verifyEmailUnsubscribeToken(token);
    assert.ok(verified);
    assert.equal(verified?.leadId, leadId);
    assert.equal(verified?.purpose, MARKETING_PURPOSE);
    assert.equal(verified?.channel, EMAIL_NURTURE_CHANNEL);
    assert.ok(verified?.tokenKey);

    assert.equal(verifyEmailUnsubscribeToken("tampered." + token), null);
    assert.equal(verifyEmailUnsubscribeToken(""), null);
  });

  it("builds unsubscribe URL path", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.test";
    const url = buildEmailUnsubscribeUrl("abc.token");
    assert.equal(
      url,
      "https://example.test/huy-dang-ky-email?token=abc.token",
    );
  });

  it("exports stable policy version for ConsentRecord", () => {
    assert.equal(EMAIL_NURTURE_POLICY_VERSION, "email-nurture-v1");
  });
});
