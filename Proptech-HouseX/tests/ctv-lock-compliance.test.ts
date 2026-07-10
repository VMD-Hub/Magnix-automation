import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  businessDaysUntil,
  evaluateCtvLockCompliance,
  hasAssistLogWithinBusinessDays,
} from "../lib/noxh-case/ctv-lock-compliance.ts";
import { addBusinessDays } from "../lib/noxh-case/business-days.ts";

describe("ctv-lock-compliance", () => {
  const now = new Date("2026-07-10T10:00:00");

  it("detects recent assist within 7 business days", () => {
    const logs = [{ createdAt: new Date("2026-07-09T12:00:00") }];
    assert.equal(hasAssistLogWithinBusinessDays(logs, 7, now), true);
  });

  it("flags missing progress near lock expiry", () => {
    const lockExpiresAt = addBusinessDays(now, 2);
    const compliance = evaluateCtvLockCompliance({
      consultScheduledAt: new Date("2026-07-12T09:00:00"),
      lockExpiresAt,
      attributionLockedAt: null,
      caseStatus: "ACTIVE",
      assistLogs: [],
      now,
    });
    assert.equal(compliance.needsProgressWarning, true);
    assert.equal(compliance.canExtendLock, false);
  });

  it("allows lock extension when schedule + progress exist", () => {
    const lockExpiresAt = addBusinessDays(now, 10);
    const compliance = evaluateCtvLockCompliance({
      consultScheduledAt: new Date("2026-07-12T09:00:00"),
      lockExpiresAt,
      attributionLockedAt: null,
      caseStatus: "ACTIVE",
      assistLogs: [{ createdAt: new Date("2026-07-09T08:00:00") }],
      now,
    });
    assert.equal(compliance.canExtendLock, true);
    assert.equal(compliance.needsProgressWarning, false);
  });

  it("counts business days until deadline", () => {
    const deadline = addBusinessDays(now, 3);
    assert.equal(businessDaysUntil(deadline, now), 3);
  });
});
