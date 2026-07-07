import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatPercentInput,
  isPartialPercentInput,
  parsePercentInput,
} from "@/lib/format/percent";

describe("percent input parsing", () => {
  it("parses Vietnamese decimal comma and percent sign", () => {
    assert.equal(parsePercentInput("6,5%"), 6.5);
    assert.equal(parsePercentInput("5.6"), 5.6);
    assert.equal(parsePercentInput("6.5%"), 6.5);
  });

  it("returns null for empty or partial-only input", () => {
    assert.equal(parsePercentInput(""), null);
    assert.equal(parsePercentInput("."), null);
    assert.ok(isPartialPercentInput("6."));
    assert.ok(isPartialPercentInput("6,"));
  });

  it("formats without trailing noise", () => {
    assert.equal(formatPercentInput(6.5), "6.5");
    assert.equal(formatPercentInput(6), "6");
  });
});
