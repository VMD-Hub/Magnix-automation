import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  mergeInboundOpsMeta,
  readInboundOpsMeta,
} from "../lib/inbound/ops-meta";

describe("inbound ops meta — Phase 3A", () => {
  it("reads and merges noxh case linkage", () => {
    const meta = readInboundOpsMeta({
      ops_status: "converted",
      platform_lead_id: "lead-1",
      noxh_case_id: "case-1",
      noxh_case_code: "HX-NOXH-000042",
    });

    assert.equal(meta.noxh_case_id, "case-1");
    assert.equal(meta.noxh_case_code, "HX-NOXH-000042");

    const merged = mergeInboundOpsMeta(meta, {
      noxh_case_id: "case-2",
      noxh_case_code: "HX-NOXH-000043",
    });
    assert.equal(merged.noxh_case_id, "case-2");
    assert.equal(merged.noxh_case_code, "HX-NOXH-000043");
    assert.equal(merged.platform_lead_id, "lead-1");
  });
});
