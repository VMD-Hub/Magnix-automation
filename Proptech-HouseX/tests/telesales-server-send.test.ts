import assert from "node:assert/strict";
import { describe, it, afterEach } from "node:test";
import { opsLeadServerSendSchema } from "../lib/validation/ops-lead.ts";
import {
  TELESALES_MISS_OA_BODY,
  TELESALES_MISS_SMS_BODY,
} from "../lib/messaging/copy.ts";
import {
  isTelesalesServerSendEnabled,
} from "../lib/messaging/telesales-server-send.ts";
import { isTelesalesSmsWebhookConfigured } from "../lib/messaging/sms-webhook-provider.ts";
import { isTelesalesOaSendEnabled } from "../lib/messaging/zalo-oa-provider.ts";
import {
  TELESALES_MISS_CALLBACK_SCRIPT_ID,
  getNurtureScript,
} from "../lib/leads/nurture-scripts.ts";

const ENV_KEYS = [
  "TELESALES_SERVER_SEND_ENABLED",
  "SMS_WEBHOOK_URL",
  "SMS_WEBHOOK_SECRET",
  "ZALO_OA_NOTIFY_ENABLED",
  "ZALO_APP_ID",
  "ZALO_APP_SECRET",
  "ZALO_OA_ACCESS_TOKEN",
  "ZALO_OA_REFRESH_TOKEN",
] as const;

const saved: Record<string, string | undefined> = {};

function stashEnv() {
  for (const k of ENV_KEYS) {
    saved[k] = process.env[k];
  }
}

function restoreEnv() {
  for (const k of ENV_KEYS) {
    const v = saved[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
}

afterEach(() => {
  restoreEnv();
});

describe("telesales Phase 2 — kill switch + providers", () => {
  it("isTelesalesServerSendEnabled defaults off", () => {
    stashEnv();
    delete process.env.TELESALES_SERVER_SEND_ENABLED;
    assert.equal(isTelesalesServerSendEnabled(), false);
    process.env.TELESALES_SERVER_SEND_ENABLED = "true";
    assert.equal(isTelesalesServerSendEnabled(), true);
    process.env.TELESALES_SERVER_SEND_ENABLED = "false";
    assert.equal(isTelesalesServerSendEnabled(), false);
  });

  it("SMS webhook missing → unconfigured", () => {
    stashEnv();
    delete process.env.SMS_WEBHOOK_URL;
    assert.equal(isTelesalesSmsWebhookConfigured(), false);
    process.env.SMS_WEBHOOK_URL = "https://n8n.example/webhook/sms";
    assert.equal(isTelesalesSmsWebhookConfigured(), true);
  });

  it("OA send disabled without notify + creds", () => {
    stashEnv();
    process.env.ZALO_OA_NOTIFY_ENABLED = "false";
    assert.equal(isTelesalesOaSendEnabled(), false);
  });
});

describe("telesales Phase 2 — copy + script + validation", () => {
  it("miss-call copy is non-empty value-first", () => {
    assert.ok(TELESALES_MISS_SMS_BODY.length > 40);
    assert.ok(TELESALES_MISS_OA_BODY.length > 20);
    assert.match(TELESALES_MISS_SMS_BODY, /House X/i);
    assert.match(TELESALES_MISS_OA_BODY, /checklist|NOXH/i);
  });

  it("catalog has telesales-miss-callback script", () => {
    const script = getNurtureScript(TELESALES_MISS_CALLBACK_SCRIPT_ID);
    assert.ok(script);
    assert.equal(script!.id, "telesales-miss-callback");
    assert.equal(script!.channel, "oa");
  });

  it("opsLeadServerSendSchema accepts oa/sms", () => {
    const parsed = opsLeadServerSendSchema.parse({
      channels: ["oa", "sms"],
      correlationId: "corr-1",
    });
    assert.deepEqual(parsed.channels, ["oa", "sms"]);
  });

  it("opsLeadServerSendSchema rejects empty channels", () => {
    assert.throws(() =>
      opsLeadServerSendSchema.parse({
        channels: [],
        correlationId: "corr-1",
      }),
    );
  });
});
