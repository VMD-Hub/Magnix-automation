import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizeSeoDescription,
  normalizeSeoTitle,
  stripSeoBrandSuffix,
} from "../lib/seo/meta-text.ts";

describe("seo meta-text", () => {
  it("strip brand suffix", () => {
    assert.equal(
      stripSeoBrandSuffix("Tin tức BĐS | HouseX"),
      "Tin tức BĐS",
    );
    assert.equal(
      stripSeoBrandSuffix("Công cụ | House X"),
      "Công cụ",
    );
  });

  it("title segment ≤50 sau normalize", () => {
    const long =
      "Thẩm định khoản vay mua nhà ở xã hội: Tự kiểm tra trước khi nộp hồ sơ | HouseX";
    const t = normalizeSeoTitle(long);
    assert.ok([...t].length <= 50);
    assert.ok(!/House\s*X/i.test(t));
  });

  it("description ≤160", () => {
    const long = "A".repeat(200);
    const d = normalizeSeoDescription(long);
    assert.ok([...d].length <= 160);
  });
});
