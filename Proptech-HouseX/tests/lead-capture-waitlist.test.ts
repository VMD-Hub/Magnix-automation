import assert from "node:assert/strict";
import { test } from "node:test";
import {
  WAITLIST_LEAD_SOURCE,
  defaultChannelPreferencesForCapture,
  isWaitlistCapture,
  parseLeadCaptureType,
  voiceCallAllowedForCapture,
} from "../lib/leads/capture-type";
import { LEAD_SOURCE } from "../lib/leads/source";
import { resolveNurtureScriptId } from "../lib/leads/nurture-scripts";
import { buildInitialLeadOpsMeta, readLeadOpsMeta } from "../lib/leads/ops-meta";
import { isExcludedFromTelesalesCallQueue } from "../lib/leads/ops-lead-board";

test("waitlist capture defaults to in_app and blocks voice", () => {
  assert.equal(parseLeadCaptureType("waitlist"), "waitlist");
  assert.deepEqual(defaultChannelPreferencesForCapture("waitlist"), ["in_app"]);
  assert.equal(isWaitlistCapture("waitlist"), true);
  assert.equal(isWaitlistCapture(null, WAITLIST_LEAD_SOURCE), true);
  assert.equal(voiceCallAllowedForCapture("waitlist"), false);
  assert.equal(voiceCallAllowedForCapture("consult_request"), true);
  assert.equal(LEAD_SOURCE.WAITLIST_PROJECT, WAITLIST_LEAD_SOURCE);
});

test("opsMeta stores captureType + channelPreference", () => {
  const meta = buildInitialLeadOpsMeta({
    phone: "0901234567",
    segment: "NOXH",
    source: WAITLIST_LEAD_SOURCE,
    captureType: "waitlist",
  });
  const read = readLeadOpsMeta(meta);
  assert.equal(read.captureType, "waitlist");
  assert.deepEqual(read.channelPreference, ["in_app"]);
  assert.equal(read.nurtureScriptId, "waitlist-progress-updates");
});

test("waitlist nurture script resolves for waitlist source", () => {
  assert.equal(
    resolveNurtureScriptId({
      segment: "NOXH",
      source: WAITLIST_LEAD_SOURCE,
    }),
    "waitlist-progress-updates",
  );
});

test("telesales call queue excludes waitlist", () => {
  assert.equal(
    isExcludedFromTelesalesCallQueue({
      source: WAITLIST_LEAD_SOURCE,
      opsMeta: { captureType: "waitlist" },
    }),
    true,
  );
  assert.equal(
    isExcludedFromTelesalesCallQueue({
      source: LEAD_SOURCE.WEB_LEAD,
      opsMeta: { captureType: "consult_request" },
    }),
    false,
  );
});
