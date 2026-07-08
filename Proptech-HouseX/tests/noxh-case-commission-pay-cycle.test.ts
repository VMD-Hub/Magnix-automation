import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeExpectedPayDate,
  isPayBatchDay,
  nextPayBatchOnOrAfter,
} from "../lib/noxh-case/commission-pay-cycle";

test("nextPayBatchOnOrAfter — sau ngày 20 → 05 tháng sau", () => {
  const d = new Date(2026, 5, 25); // 25/06
  const pay = nextPayBatchOnOrAfter(d);
  assert.equal(pay.getDate(), 5);
  assert.equal(pay.getMonth(), 6); // July
});

test("computeExpectedPayDate — ký + 14 ngày rồi chọn batch", () => {
  const signed = new Date(2026, 5, 1); // 01/06
  const pay = computeExpectedPayDate(signed, 14);
  assert.ok(pay.getDate() === 5 || pay.getDate() === 20);
});

test("isPayBatchDay", () => {
  assert.equal(isPayBatchDay(new Date(2026, 0, 5)), true);
  assert.equal(isPayBatchDay(new Date(2026, 0, 6)), false);
});
