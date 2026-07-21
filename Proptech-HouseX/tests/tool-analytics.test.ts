import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  TOOL_LEAD_SOURCE,
  lastFourWeekStarts,
  resolveToolAnalyticsWindow,
} from "../lib/admin/tool-analytics.ts";
import { LEAD_SOURCE } from "../lib/leads/source.ts";

describe("tool analytics helpers", () => {
  it("map 2 tool NƠXH → lead source", () => {
    assert.equal(TOOL_LEAD_SOURCE["noxh-check"], LEAD_SOURCE.TOOL_NOXH_CHECK);
    assert.equal(
      TOOL_LEAD_SOURCE["noxh-loan-quick"],
      LEAD_SOURCE.TOOL_NOXH_LOAN_QUICK,
    );
    assert.equal(TOOL_LEAD_SOURCE["loan"], undefined);
  });

  it("window days chỉ 7|30|90", () => {
    assert.equal(resolveToolAnalyticsWindow("7"), 7);
    assert.equal(resolveToolAnalyticsWindow("90"), 90);
    assert.equal(resolveToolAnalyticsWindow("15"), 30);
    assert.equal(resolveToolAnalyticsWindow(null), 30);
  });

  it("lastFourWeekStarts trả 4 Monday UTC tăng dần", () => {
    const weeks = lastFourWeekStarts(new Date("2026-07-21T12:00:00Z"));
    assert.equal(weeks.length, 4);
    for (let i = 1; i < weeks.length; i += 1) {
      const diff =
        weeks[i]!.getTime() - weeks[i - 1]!.getTime();
      assert.equal(diff, 7 * 24 * 60 * 60 * 1000);
    }
    assert.equal(weeks[0]!.getUTCDay(), 1);
  });
});
