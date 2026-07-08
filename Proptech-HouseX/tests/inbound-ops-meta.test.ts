import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  maskInboundUid,
  mergeInboundOpsMeta,
  readInboundOpsMeta,
} from "../lib/inbound/ops-meta";

describe("inbound ops meta", () => {
  it("defaults ops_status to pending", () => {
    assert.equal(readInboundOpsMeta({}).ops_status, "pending");
  });

  it("merges ops patch", () => {
    const merged = mergeInboundOpsMeta({ campaign: "x" }, {
      ops_status: "contacted",
      ops_note: "đã nhắn",
    });
    assert.equal(merged.ops_status, "contacted");
    assert.equal(merged.ops_note, "đã nhắn");
    assert.equal(merged.campaign, "x");
  });

  it("masks uid", () => {
    assert.equal(maskInboundUid("123456789"), "123***89");
    assert.equal(maskInboundUid("abc"), "***");
  });
});
