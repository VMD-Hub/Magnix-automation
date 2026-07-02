import { test } from "node:test";
import assert from "node:assert/strict";
import {
  assertProjectAcceptsBookings,
  assertUnitAcceptsBookings,
} from "../lib/rules/sale-eligibility-gate";
import { ACTIVE_UNIT_BOOKING_STATUSES } from "../lib/rules/unit-booking-rules";

test("assertUnitAcceptsBookings: chỉ AVAILABLE nhận giữ suất", () => {
  assert.equal(assertUnitAcceptsBookings("AVAILABLE").ok, true);
  assert.equal(assertUnitAcceptsBookings("DEPOSITED").ok, false);
  assert.equal(assertUnitAcceptsBookings("SOLD").ok, false);
});

test("assertProjectAcceptsBookings: dự án phải DANG_BAN", () => {
  assert.equal(
    assertProjectAcceptsBookings({
      projectStatus: "DANG_BAN",
      projectType: "THUONG_MAI",
    }).ok,
    true,
  );
  assert.equal(
    assertProjectAcceptsBookings({
      projectStatus: "SAP_MO_BAN",
      projectType: "THUONG_MAI",
    }).ok,
    false,
  );
});

test("ACTIVE_UNIT_BOOKING_STATUSES: nhiều suất/căn — PENDING + CONFIRMED", () => {
  assert.deepEqual(ACTIVE_UNIT_BOOKING_STATUSES, ["PENDING", "CONFIRMED"]);
});
