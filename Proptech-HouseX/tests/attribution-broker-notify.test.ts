import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatAttributionConflictNotification } from "../lib/attribution/broker-in-app-notify.ts";

describe("formatAttributionConflictNotification", () => {
  it("formats claim blocked (R4)", () => {
    const n = formatAttributionConflictNotification({
      brokerId: "b1",
      phase: "opened",
      conflictId: "conf-abc",
      kind: "CTV_CLAIM_BLOCKED",
      rejectReason: "PLATFORM_LEAD_ACTIVE",
      customerName: "An",
      phoneMasked: "090***67",
    });
    assert.equal(n.type, "attribution.claim_blocked");
    assert.match(n.title, /Không thể giữ lead/);
    assert.match(n.body, /Ops đang tư vấn/);
  });

  it("formats conflict resolved KEEP_PLATFORM", () => {
    const n = formatAttributionConflictNotification({
      brokerId: "b1",
      phase: "resolved",
      conflictId: "conf-xyz",
      kind: "OPS_LEAD_CTV_LOCK",
      resolution: "KEEP_PLATFORM",
      phoneMasked: "090***88",
    });
    assert.equal(n.type, "attribution.conflict_resolved");
    assert.match(n.body, /Giữ Ops/);
  });
});
