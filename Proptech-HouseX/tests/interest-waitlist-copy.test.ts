import assert from "node:assert/strict";
import { test } from "node:test";
import {
  WAITLIST_NO_COLD_CALL,
  interestWaitlistFormCopy,
  leadCaptureIntentForProjectStatus,
} from "../lib/content/messaging/interest-waitlist-copy";

test("waitlist copy always states no cold call", () => {
  assert.match(WAITLIST_NO_COLD_CALL, /Không gọi điện/i);
  assert.match(interestWaitlistFormCopy.intro, /Không gọi điện/i);
  assert.match(interestWaitlistFormCopy.consentLabel, /Không gọi điện/i);
  assert.match(interestWaitlistFormCopy.successBody, /Không gọi điện/i);
  assert.match(interestWaitlistFormCopy.successBody, /Mini App/i);
});

test("SAP_MO_BAN maps to waitlist intent; DANG_BAN to consult", () => {
  assert.equal(leadCaptureIntentForProjectStatus("SAP_MO_BAN"), "waitlist");
  assert.equal(leadCaptureIntentForProjectStatus("DANG_BAN"), "consult");
  assert.equal(leadCaptureIntentForProjectStatus("DA_BAN_GIAO"), "consult");
  assert.equal(leadCaptureIntentForProjectStatus(null), "consult");
});
