import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CONFLICT_KIND_LABEL,
  CONFLICT_REJECT_LABEL,
  CONFLICT_RESOLUTION_LABEL,
  buildAttributionConflictNotifyPayload,
} from "../lib/attribution/conflict.ts";

describe("attribution-conflict labels", () => {
  it("has Vietnamese labels for conflict kinds", () => {
    assert.equal(CONFLICT_KIND_LABEL.CTV_CLAIM_BLOCKED, "CTV claim bị chặn");
    assert.equal(
      CONFLICT_KIND_LABEL.OPS_LEAD_CTV_LOCK,
      "Lead Ops trùng CTV đang lock",
    );
  });

  it("labels reject reasons R3/R4", () => {
    assert.equal(
      CONFLICT_REJECT_LABEL.PLATFORM_LEAD_ACTIVE,
      "Ops đang tư vấn (R4)",
    );
    assert.equal(
      CONFLICT_REJECT_LABEL.ACTIVE_CASE_OTHER_CTV,
      "CTV khác đang giữ hồ sơ (R3)",
    );
  });

  it("labels resolution actions", () => {
    assert.equal(CONFLICT_RESOLUTION_LABEL.KEEP_PLATFORM, "Giữ Ops");
    assert.equal(CONFLICT_RESOLUTION_LABEL.RELEASE_TO_CTV, "Chuyển CTV");
    assert.equal(CONFLICT_RESOLUTION_LABEL.SPLIT_LANE, "Chia lane");
    assert.equal(CONFLICT_RESOLUTION_LABEL.DISMISS_BOTH, "Đóng cả hai");
  });
});

describe("buildAttributionConflictNotifyPayload", () => {
  it("masks phone and maps reject label for opened conflict", () => {
    const payload = buildAttributionConflictNotifyPayload({
      phase: "opened",
      conflictId: "conf-1",
      kind: "CTV_CLAIM_BLOCKED",
      normalizedPhone: "84901234567",
      brokerId: "broker-1",
      rejectReason: "PLATFORM_LEAD_ACTIVE",
      customerName: "An",
    });
    assert.equal(payload.phase, "opened");
    assert.equal(payload.rejectLabel, "Ops đang tư vấn (R4)");
    assert.match(payload.normalizedPhoneMasked, /849\*\*\*67/);
    assert.equal(payload.customerName, "An");
  });

  it("includes resolution label when resolved", () => {
    const payload = buildAttributionConflictNotifyPayload({
      phase: "resolved",
      conflictId: "conf-2",
      kind: "OPS_LEAD_CTV_LOCK",
      normalizedPhone: "84909998888",
      brokerId: "broker-2",
      resolution: "KEEP_PLATFORM",
    });
    assert.equal(payload.resolutionLabel, "Giữ Ops");
  });
});
