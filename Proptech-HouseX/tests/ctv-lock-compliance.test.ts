import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  businessDaysUntil,
  evaluateCtvLockCompliance,
  hasAssistLogWithinBusinessDays,
} from "../lib/noxh-case/ctv-lock-compliance.ts";
import { addBusinessDays } from "../lib/noxh-case/business-days.ts";
import { addCalendarDays, computeExclusiveExpiry } from "../lib/affiliate/exclusivity.ts";

describe("ctv-lock-compliance (SoT calendar)", () => {
  const now = new Date("2026-07-10T10:00:00");

  it("detects recent assist within business days helper", () => {
    const logs = [{ createdAt: new Date("2026-07-09T12:00:00") }];
    assert.equal(hasAssistLogWithinBusinessDays(logs, 7, now), true);
  });

  it("flags missing progress / silent risk near expiry", () => {
    const exclusiveStartedAt = addCalendarDays(now, -55);
    const lockExpiresAt = computeExclusiveExpiry(exclusiveStartedAt);
    const compliance = evaluateCtvLockCompliance({
      consultScheduledAt: new Date("2026-07-12T09:00:00"),
      lockExpiresAt,
      attributionLockedAt: null,
      caseStatus: "ACTIVE",
      assistLogs: [],
      exclusiveStartedAt,
      lastValidCareAt: exclusiveStartedAt,
      exclusiveStatus: "EXCLUSIVE",
      now,
    });
    assert.equal(compliance.needsProgressWarning, true);
    assert.equal(compliance.canExtendLock, compliance.canRequestExtend);
  });

  it("canRequestExtend near ceiling with fresh care", () => {
    const exclusiveStartedAt = addCalendarDays(now, -57);
    const lockExpiresAt = computeExclusiveExpiry(exclusiveStartedAt);
    const compliance = evaluateCtvLockCompliance({
      consultScheduledAt: new Date("2026-07-12T09:00:00"),
      lockExpiresAt,
      attributionLockedAt: null,
      caseStatus: "ACTIVE",
      assistLogs: [{ createdAt: now }],
      exclusiveStartedAt,
      lastValidCareAt: now,
      exclusiveStatus: "EXCLUSIVE",
      alreadyExtended: false,
      now,
    });
    assert.equal(compliance.canRequestExtend, true);
  });

  it("counts business days until deadline", () => {
    const deadline = addBusinessDays(now, 3);
    assert.equal(businessDaysUntil(deadline, now), 3);
  });
});
