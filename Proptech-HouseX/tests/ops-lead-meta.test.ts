import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildInitialLeadOpsMeta,
  maskLeadPhone,
  mergeLeadOpsMeta,
  readLeadOpsMeta,
} from "../lib/leads/ops-meta.ts";
import {
  getNurtureScript,
  resolveNurtureScriptId,
} from "../lib/leads/nurture-scripts.ts";
import { LEAD_SOURCE } from "../lib/leads/source.ts";

describe("readLeadOpsMeta", () => {
  it("returns defaults for empty meta", () => {
    const m = readLeadOpsMeta(null);
    assert.equal(m.nurtureScriptId, null);
    assert.equal(m.opsNote, null);
    assert.deepEqual(m.channels, {});
  });

  it("reads channels and nurture script", () => {
    const m = readLeadOpsMeta({
      channels: { phone: "0901234567", zalo: "zalo.me/abc" },
      nurtureScriptId: "noxh-zalo-ads-checklist",
      opsNote: "Gọi lại chiều",
    });
    assert.equal(m.channels.phone, "0901234567");
    assert.equal(m.nurtureScriptId, "noxh-zalo-ads-checklist");
    assert.equal(m.opsNote, "Gọi lại chiều");
  });
});

describe("mergeLeadOpsMeta", () => {
  it("merges partial channel patch", () => {
    const merged = mergeLeadOpsMeta(
      { channels: { phone: "0901111111" }, nurtureScriptId: "a" },
      { channels: { zalo: "zalo-id" }, opsNote: "note" },
    );
    assert.deepEqual(merged.channels, {
      phone: "0901111111",
      zalo: "zalo-id",
    });
    assert.equal(merged.nurtureScriptId, "a");
    assert.equal(merged.opsNote, "note");
  });
});

describe("buildInitialLeadOpsMeta", () => {
  it("sets phone channel and suggested nurture script", () => {
    const meta = buildInitialLeadOpsMeta({
      phone: "0909999888",
      email: "a@b.com",
      segment: "NOXH",
      source: LEAD_SOURCE.ZALO_ADS,
    });
    assert.deepEqual(meta.channels, {
      phone: "0909999888",
      email: "a@b.com",
    });
    assert.equal(meta.nurtureScriptId, "noxh-zalo-ads-checklist");
  });
});

describe("resolveNurtureScriptId", () => {
  it("maps Zalo Ads NOXH to checklist script", () => {
    assert.equal(
      resolveNurtureScriptId({
        segment: "NOXH",
        source: LEAD_SOURCE.ZALO_ADS,
      }),
      "noxh-zalo-ads-checklist",
    );
  });

  it("maps CCTM fanpage to CCTM consult", () => {
    assert.equal(
      resolveNurtureScriptId({
        segment: "CCTM",
        source: LEAD_SOURCE.FANPAGE,
      }),
      "cctm-zalo-ads-consult",
    );
  });

  it("falls back to generic welcome", () => {
    assert.equal(
      resolveNurtureScriptId({
        segment: null,
        source: "unknown-source",
      }),
      "generic-welcome",
    );
  });
});

describe("getNurtureScript", () => {
  it("returns catalog entry by id", () => {
    const s = getNurtureScript("noxh-tool-followup");
    assert.ok(s?.label.includes("tool"));
  });
});

describe("maskLeadPhone", () => {
  it("masks middle digits", () => {
    assert.equal(maskLeadPhone("0901234567"), "090***67");
  });
});
