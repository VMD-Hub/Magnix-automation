import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertEarlySignalReadyForL3,
  DEFAULT_T1_READER_DISCLAIMER,
} from "@/lib/leads/early-signal-gates";

describe("early-signal L0 gates", () => {
  it("requires T1 disclaimer and source", () => {
    const r = assertEarlySignalReadyForL3({
      tier: "T1_PRESS",
      readerTitle: "Tin sớm dự án A",
      readerBody: "Theo báo chí dự án đang được đề cập.",
      readerDisclaimer: "",
      pressUrl: null,
      sxdUrl: null,
    });
    assert.equal(r.pass, false);
    assert.ok(r.errors.some((e) => /disclaimer/i.test(e)));
    assert.ok(r.errors.some((e) => /nguồn/i.test(e)));
  });

  it("blocks FOMO when not T4", () => {
    const r = assertEarlySignalReadyForL3({
      tier: "T1_PRESS",
      readerTitle: "Sắp hết suất",
      readerBody: "Dự án đang mở bán tuần này.",
      readerDisclaimer: DEFAULT_T1_READER_DISCLAIMER,
      pressUrl: "https://vnexpress.net/example",
    });
    assert.equal(r.pass, false);
    assert.ok(r.errors.some((e) => /FOMO|tầng/i.test(e)));
  });

  it("passes packaged T1 with disclaimer and press", () => {
    const r = assertEarlySignalReadyForL3({
      tier: "T1_PRESS",
      readerTitle: "Tin sớm khu vực Thủ Đức",
      readerBody: "Dự án đang được đề cập trên báo.",
      readerDisclaimer: DEFAULT_T1_READER_DISCLAIMER,
      pressUrl: "https://vnexpress.net/example",
    });
    assert.equal(r.pass, true);
  });
});
