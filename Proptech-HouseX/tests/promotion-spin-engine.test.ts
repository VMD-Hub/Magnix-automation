import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isPrizeActive,
  pickWeightedPrize,
  segmentIndexForPrize,
  spinTargetRotationDeg,
} from "../lib/promotion/spin-engine";

test("pickWeightedPrize respects weights", () => {
  const now = new Date("2026-06-01T12:00:00Z");
  const prizes = [
    {
      id: "a",
      tier: "EMPTY" as const,
      prizeType: "EMPTY" as const,
      label: "Empty",
      shortLabel: "Empty",
      weightPercent: 10,
      remainingQty: 0,
      totalQty: 0,
      activeFrom: null,
      activeUntil: null,
    },
    {
      id: "b",
      tier: "CONSOLATION" as const,
      prizeType: "VOUCHER" as const,
      label: "Voucher",
      shortLabel: "Voucher",
      weightPercent: 90,
      remainingQty: 100,
      totalQty: 100,
      activeFrom: null,
      activeUntil: null,
    },
  ];

  let bCount = 0;
  for (let i = 0; i < 1000; i++) {
    const picked = pickWeightedPrize(prizes, now, () => i / 1000);
    if (picked?.id === "b") bCount++;
  }
  assert.ok(bCount > 800, `expected mostly b, got ${bCount}`);
});

test("isPrizeActive excludes expired window", () => {
  const prize = {
    id: "x",
    tier: "FIRST" as const,
    prizeType: "PHYSICAL" as const,
    label: "X",
    shortLabel: "X",
    weightPercent: 5,
    remainingQty: 1,
    totalQty: 1,
    activeFrom: new Date("2026-07-01"),
    activeUntil: new Date("2026-08-01"),
  };
  assert.equal(isPrizeActive(prize, new Date("2026-06-15")), false);
  assert.equal(isPrizeActive(prize, new Date("2026-07-15")), true);
});

test("segmentIndexForPrize finds layout index", () => {
  assert.equal(segmentIndexForPrize(["p1", "p2", "p1"], "p2"), 1);
});

test("spinTargetRotationDeg returns positive rotation", () => {
  const deg = spinTargetRotationDeg(3, 12, 4);
  assert.ok(deg > 360 * 4);
});
