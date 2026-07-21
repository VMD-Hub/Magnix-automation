import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertContentQueueReadyForL3,
} from "../lib/content/content-queue-gates.ts";
import {
  EMPTY_L3_CHECKLIST,
  isNoxhCtaToolId,
  NOXH_CTA_TOOLS,
  isL3ChecklistComplete,
} from "../lib/content/noxh-cta-tools.ts";

describe("noxh CTA tools", () => {
  it("allowlist chỉ 2 tool NƠXH", () => {
    assert.equal(NOXH_CTA_TOOLS.length, 2);
    assert.ok(isNoxhCtaToolId("noxh-check"));
    assert.ok(isNoxhCtaToolId("noxh-loan-quick"));
    assert.equal(isNoxhCtaToolId("loan"), false);
  });

  it("checklist complete chỉ khi đủ 3 mục", () => {
    assert.equal(isL3ChecklistComplete(EMPTY_L3_CHECKLIST), false);
    assert.equal(
      isL3ChecklistComplete({ pain: true, ctaTool: true, ctaCopy: true }),
      true,
    );
  });
});

describe("content queue L3 gate", () => {
  it("fail khi thiếu CTA tool", () => {
    const r = assertContentQueueReadyForL3({
      title: "Điều kiện NƠXH 2026",
      painPoint: "Không biết đủ điều kiện không",
      ctaToolId: null,
      ctaLabel: "Kiểm tra ngay",
      l3Checklist: { pain: true, ctaTool: false, ctaCopy: true },
    });
    assert.equal(r.pass, false);
    assert.ok(r.errors.some((e) => /CTA tool/i.test(e)));
  });

  it("pass khi đủ CTA + checklist", () => {
    const r = assertContentQueueReadyForL3({
      title: "Điều kiện NƠXH 2026",
      painPoint: "Không biết đủ điều kiện không",
      ctaToolId: "noxh-check",
      ctaLabel: "Kiểm tra miễn phí bạn có đủ điều kiện NƠXH không",
      l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
    });
    assert.equal(r.pass, true);
    assert.deepEqual(r.errors, []);
  });

  it("reject tool ngoài allowlist", () => {
    const r = assertContentQueueReadyForL3({
      title: "Bài phong thủy",
      painPoint: "Hướng nhà",
      ctaToolId: "xem-huong-nha" as "noxh-check",
      ctaLabel: "Xem hướng",
      l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
    });
    assert.equal(r.pass, false);
  });
});
