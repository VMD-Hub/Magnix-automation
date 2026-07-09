import { test } from "node:test";
import assert from "node:assert/strict";
import { formatMilestoneOaMessage } from "../lib/zalo/broker-oa-notify";
import { isZaloOaNotifyEnabled, clearOaTokenCacheForTests } from "../lib/zalo/oa";

test("formatMilestoneOaMessage — gồm mã hồ sơ và milestone", () => {
  const prev = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "https://timnhaxahoi.com";

  const msg = formatMilestoneOaMessage({
    caseId: "case-1",
    caseCode: "HX-NOXH-000099",
    brokerId: "broker-1",
    fromMilestone: "M1_RECEIVED",
    toMilestone: "M2_DOCUMENTS",
    milestoneSub: null,
    opsNote: "Thu CMND",
  });

  assert.match(msg, /HX-NOXH-000099/);
  assert.match(msg, /Hoàn thiện hồ sơ/);
  assert.match(msg, /Thu CMND/);
  assert.match(msg, /moi-gioi\/ho-so/);

  if (prev === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = prev;
});

test("isZaloOaNotifyEnabled — cần app creds + refresh hoặc access token", () => {
  clearOaTokenCacheForTests();
  const keys = [
    "ZALO_OA_NOTIFY_ENABLED",
    "ZALO_APP_ID",
    "ZALO_APP_SECRET",
    "ZALO_OA_REFRESH_TOKEN",
    "ZALO_OA_ACCESS_TOKEN",
  ] as const;
  const saved: Record<string, string | undefined> = {};
  for (const k of keys) saved[k] = process.env[k];

  delete process.env.ZALO_OA_NOTIFY_ENABLED;
  delete process.env.ZALO_APP_ID;
  delete process.env.ZALO_APP_SECRET;
  delete process.env.ZALO_OA_REFRESH_TOKEN;
  delete process.env.ZALO_OA_ACCESS_TOKEN;
  assert.equal(isZaloOaNotifyEnabled(), false);

  process.env.ZALO_APP_ID = "app";
  process.env.ZALO_APP_SECRET = "secret";
  process.env.ZALO_OA_REFRESH_TOKEN = "refresh";
  assert.equal(isZaloOaNotifyEnabled(), true);

  process.env.ZALO_OA_NOTIFY_ENABLED = "false";
  assert.equal(isZaloOaNotifyEnabled(), false);

  for (const k of keys) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});
