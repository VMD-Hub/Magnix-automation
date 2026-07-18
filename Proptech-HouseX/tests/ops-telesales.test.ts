import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CALL_COOLDOWN_HOURS,
  callBlockedUntil,
  mapResultToActivity,
  smsDeepLink,
  telDeepLink,
  WARM_OTHER_PROJECTS_SCRIPT_ID,
} from "../lib/leads/telesales";

test("telesales deep links use local VN digits", () => {
  assert.equal(telDeepLink("+84901234567"), "tel:0901234567");
  assert.match(smsDeepLink("0901234567"), /^sms:0901234567\?body=/);
});

test("NO_ANSWER maps to CONTACT_ATTEMPT + callback task", () => {
  const m = mapResultToActivity("NO_ANSWER");
  assert.equal(m.type, "CONTACT_ATTEMPT");
  assert.equal(m.createCallbackTask, true);
  assert.equal(m.channel, "phone");
});

test("NOT_THIS_PROJECT assigns warm script path", () => {
  const m = mapResultToActivity("NOT_THIS_PROJECT");
  assert.equal(m.assignWarmScript, true);
  assert.equal(WARM_OTHER_PROJECTS_SCRIPT_ID, "warm-other-projects");
});

test("call cooldown only after NO_ANSWER within window", () => {
  const now = new Date("2026-07-18T12:00:00Z");
  const recent = new Date("2026-07-18T10:00:00Z");
  const blocked = callBlockedUntil(recent, "NO_ANSWER", now);
  assert.ok(blocked);
  assert.equal(
    blocked!.getTime(),
    recent.getTime() + CALL_COOLDOWN_HOURS * 3_600_000,
  );
  assert.equal(callBlockedUntil(recent, "CONNECTED", now), null);
});
