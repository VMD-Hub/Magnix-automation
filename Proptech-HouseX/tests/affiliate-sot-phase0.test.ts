import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addCalendarDays,
  computeExclusiveExpiry,
  evaluateExclusiveClock,
  EXCLUSIVE_MAX_CALENDAR_DAYS,
  SILENT_RELEASE_CALENDAR_DAYS,
} from "../lib/affiliate/exclusivity.ts";
import {
  computeAffiliateCommission,
  parseAffiliateDealTier,
} from "../lib/affiliate/commission-calc.ts";
import { validateCareActivityInput } from "../lib/affiliate/care-activity.ts";
import { computeClaimLockExpiry } from "../lib/noxh-case/attribution-claim.ts";

describe("affiliate exclusivity 60/30/+15", () => {
  const started = new Date("2026-06-01T10:00:00");

  it("computeExclusiveExpiry = start + 60 calendar days", () => {
    const expiry = computeExclusiveExpiry(started);
    assert.equal(expiry.toISOString().slice(0, 10), "2026-07-31");
    assert.equal(EXCLUSIVE_MAX_CALENDAR_DAYS, 60);
  });

  it("computeClaimLockExpiry uses calendar 60 (not 20 LV)", () => {
    const expiry = computeClaimLockExpiry(started);
    assert.deepEqual(expiry, computeExclusiveExpiry(started));
  });

  it("releases early when silent ≥ 30 days without valid care", () => {
    const now = addCalendarDays(started, SILENT_RELEASE_CALENDAR_DAYS);
    const clock = evaluateExclusiveClock({
      exclusiveStartedAt: started,
      lockExpiresAt: computeExclusiveExpiry(started),
      lastValidCareAt: started,
      exclusiveStatus: "EXCLUSIVE",
      now,
    });
    assert.equal(clock.shouldRelease, true);
    assert.equal(clock.releaseReason, "silent");
  });

  it("releases at ceiling 60 when care is fresh", () => {
    const expiry = computeExclusiveExpiry(started);
    const now = addCalendarDays(expiry, 1);
    const clock = evaluateExclusiveClock({
      exclusiveStartedAt: started,
      lockExpiresAt: expiry,
      lastValidCareAt: addCalendarDays(now, -5),
      exclusiveStatus: "EXCLUSIVE",
      now,
    });
    assert.equal(clock.shouldRelease, true);
    assert.equal(clock.releaseReason, "expired");
  });

  it("allows request extend near day 60 with fresh care", () => {
    const expiry = computeExclusiveExpiry(started);
    const now = addCalendarDays(expiry, -3);
    const clock = evaluateExclusiveClock({
      exclusiveStartedAt: started,
      lockExpiresAt: expiry,
      lastValidCareAt: addCalendarDays(now, -2),
      exclusiveStatus: "EXCLUSIVE",
      alreadyExtended: false,
      now,
    });
    assert.equal(clock.canRequestExtend, true);
    assert.equal(clock.shouldRelease, false);
  });
});

describe("affiliate commission % × HDMB × tier", () => {
  it("parses tier aliases", () => {
    assert.equal(parseAffiliateDealTier(1), "CONNECTOR");
    assert.equal(parseAffiliateDealTier("4"), "MASTER_BROKER");
    assert.equal(parseAffiliateDealTier("CONSULTANT"), "CONSULTANT");
  });

  it("computes Connector 0.5% without bonus", () => {
    const r = computeAffiliateCommission({
      dealTier: "CONNECTOR",
      hdmbBaseAmount: 1_000_000_000,
      siteVisitBonusVerified: false,
    });
    assert.equal(r.rate, 0.005);
    assert.equal(r.baseCommission, 5_000_000);
    assert.equal(r.siteVisitBonus, 0);
    assert.equal(r.totalAmount, 5_000_000);
  });

  it("adds 500k site-visit bonus when verified", () => {
    const r = computeAffiliateCommission({
      dealTier: "MASTER_BROKER",
      hdmbBaseAmount: 1_000_000_000,
      siteVisitBonusVerified: true,
    });
    assert.equal(r.baseCommission, 20_000_000);
    assert.equal(r.siteVisitBonus, 500_000);
    assert.equal(r.totalAmount, 20_500_000);
  });
});

describe("care activity validation", () => {
  it("requires note + image", () => {
    const bad = validateCareActivityInput({
      activityType: "CALL",
      occurredAt: new Date(),
      note: "",
      imageUrls: [],
    });
    assert.equal(bad.ok, false);

    const ok = validateCareActivityInput({
      activityType: "SITE_VISIT",
      occurredAt: new Date(),
      note: "Thăm DA mẫu",
      imageUrls: ["https://example.com/a.jpg"],
    });
    assert.equal(ok.ok, true);
  });
});
