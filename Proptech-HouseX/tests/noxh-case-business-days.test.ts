import { test } from "node:test";
import assert from "node:assert/strict";
import {
  addBusinessDays,
  isWithinBusinessDaysWindow,
} from "../lib/noxh-case/business-days";

test("addBusinessDays bỏ qua cuối tuần", () => {
  // Thứ Sáu 2026-07-10 + 1 ngày làm việc = Thứ Hai 2026-07-13
  const fri = new Date("2026-07-10T10:00:00+07:00");
  const result = addBusinessDays(fri, 1);
  assert.equal(result.getDay(), 1); // Monday
});

test("isWithinBusinessDaysWindow — trong cửa sổ", () => {
  const from = new Date("2026-07-01T10:00:00+07:00");
  const now = new Date("2026-07-08T10:00:00+07:00");
  assert.equal(isWithinBusinessDaysWindow(from, 20, now), true);
});
