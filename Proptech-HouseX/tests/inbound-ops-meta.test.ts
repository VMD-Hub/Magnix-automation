import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  mergeInboundOpsMeta,
  readInboundOpsMeta,
  sanitizeInboundMetaForAdmin,
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

  it("removes server-only ops fields from admin meta", () => {
    assert.deepEqual(
      sanitizeInboundMetaForAdmin({
        campaign: "campaign-1",
        ops_status: "converted",
        ops_note: "internal",
        platform_lead_id: "lead-legacy",
        noxh_case_id: "case-1",
        noxh_case_code: "HX-1",
      }),
      { campaign: "campaign-1" },
    );
  });
});
