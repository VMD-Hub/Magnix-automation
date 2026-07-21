import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PARTNER_TARGET_ACTIVE_SOFT_CAP,
  PARTNER_TARGET_KIND_LABEL,
  PARTNER_TARGET_STATUS_LABEL,
} from "../lib/admin/partner-target-labels.ts";
import { partnerTargetWriteSchema } from "../lib/validation/partner-target.ts";

describe("partner target P3", () => {
  it("soft cap giữ list ngắn", () => {
    assert.equal(PARTNER_TARGET_ACTIVE_SOFT_CAP, 40);
  });

  it("kind/status labels đủ cho B2B NƠXH", () => {
    assert.ok(PARTNER_TARGET_KIND_LABEL.UNION.includes("Công đoàn"));
    assert.ok(PARTNER_TARGET_KIND_LABEL.HR.includes("HR"));
    assert.ok(PARTNER_TARGET_KIND_LABEL.KCN.includes("KCN"));
    assert.equal(PARTNER_TARGET_STATUS_LABEL.TARGET, "Đang target");
  });

  it("write schema chấp nhận target tối thiểu", () => {
    const parsed = partnerTargetWriteSchema.parse({
      orgName: "Công đoàn KCN A",
      kind: "UNION",
    });
    assert.equal(parsed.status, "TARGET");
    assert.equal(parsed.kind, "UNION");
  });

  it("reject orgName quá ngắn", () => {
    assert.throws(() =>
      partnerTargetWriteSchema.parse({ orgName: "A", kind: "HR" }),
    );
  });
});
