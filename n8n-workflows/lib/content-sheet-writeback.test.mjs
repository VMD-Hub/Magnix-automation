import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  contentMetricsSheetWriteEnabled,
  contentScorecardSheetWriteEnabled,
  contentSheetWritebackEnabled,
} from "../lib/content-sheet-writeback.mjs";

describe("P4.4 content Sheet writeback flags", () => {
  it("default true khi thiếu env", () => {
    assert.equal(contentSheetWritebackEnabled({}), true);
    assert.equal(contentMetricsSheetWriteEnabled({}), true);
    assert.equal(contentScorecardSheetWriteEnabled({}), true);
  });

  it("umbrella false tắt metrics + scorecard", () => {
    const env = { CONTENT_SHEET_WRITEBACK_ENABLED: "false" };
    assert.equal(contentSheetWritebackEnabled(env), false);
    assert.equal(contentMetricsSheetWriteEnabled(env), false);
    assert.equal(contentScorecardSheetWriteEnabled(env), false);
  });

  it("override metrics bật khi umbrella tắt", () => {
    const env = {
      CONTENT_SHEET_WRITEBACK_ENABLED: "false",
      CONTENT_METRICS_SHEET_WRITE_ENABLED: "true",
    };
    assert.equal(contentMetricsSheetWriteEnabled(env), true);
    assert.equal(contentScorecardSheetWriteEnabled(env), false);
  });
});
