import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  appendNurtureDispatch,
  buildLeadNurturePayload,
  hasNurtureBeenEnqueued,
  isAutoNurtureChannel,
} from "../lib/leads/nurture-auto.ts";
import { LEAD_SOURCE } from "../lib/leads/source.ts";

describe("isAutoNurtureChannel", () => {
  it("skips manual channel", () => {
    assert.equal(isAutoNurtureChannel("manual"), false);
    assert.equal(isAutoNurtureChannel("zalo"), true);
    assert.equal(isAutoNurtureChannel("oa"), true);
  });
});

describe("hasNurtureBeenEnqueued", () => {
  it("detects prior dispatch for trigger", () => {
    const meta = appendNurtureDispatch(null, {
      scriptId: "noxh-zalo-ads-checklist",
      trigger: "on_create",
      enqueuedAt: "2026-07-10T00:00:00.000Z",
      channel: "zalo",
    });
    assert.equal(
      hasNurtureBeenEnqueued(meta, "noxh-zalo-ads-checklist", "on_create"),
      true,
    );
    assert.equal(
      hasNurtureBeenEnqueued(meta, "noxh-zalo-ads-checklist", "status_contacted"),
      false,
    );
  });
});

describe("buildLeadNurturePayload", () => {
  it("builds payload for zalo ads NOXH script", () => {
    const payload = buildLeadNurturePayload({
      leadId: "lead-1",
      nurtureScriptId: "noxh-zalo-ads-checklist",
      trigger: "on_create",
      segment: "NOXH",
      source: LEAD_SOURCE.ZALO_ADS,
      contact: { name: "An", phone: "0901234567", email: null },
      channels: { phone: "0901234567" },
      opsNote: null,
    });
    assert.ok(payload);
    assert.equal(payload?.channel, "zalo");
    assert.equal(payload?.nurtureScriptId, "noxh-zalo-ads-checklist");
    assert.equal(payload?.segment, "noxh");
  });

  it("returns null for manual web script", () => {
    const payload = buildLeadNurturePayload({
      leadId: "lead-2",
      nurtureScriptId: "web-lead-generic",
      trigger: "on_create",
      segment: null,
      source: LEAD_SOURCE.WEB_LEAD,
      contact: { name: "B", phone: "0909999888" },
      channels: {},
      opsNote: null,
    });
    assert.equal(payload, null);
  });
});
