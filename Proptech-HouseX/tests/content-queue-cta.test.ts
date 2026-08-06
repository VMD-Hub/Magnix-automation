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
  it("allowlist gồm NƠXH + legal-review", () => {
    assert.equal(NOXH_CTA_TOOLS.length, 3);
    assert.ok(isNoxhCtaToolId("noxh-check"));
    assert.ok(isNoxhCtaToolId("noxh-loan-quick"));
    assert.ok(isNoxhCtaToolId("legal-review"));
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
  const bodyWithCta = `Nội dung bài.

## Kiểm tra nhanh

[Kiểm tra miễn phí bạn có đủ điều kiện NƠXH không](/cong-cu/dieu-kien-noxh)
`;

  it("fail khi thiếu CTA tool", () => {
    const r = assertContentQueueReadyForL3({
      title: "Điều kiện NƠXH 2026",
      painPoint: "Không biết đủ điều kiện không",
      bodyPreview: bodyWithCta,
      ctaToolId: null,
      ctaLabel: "Kiểm tra ngay",
      l3Checklist: { pain: true, ctaTool: false, ctaCopy: true },
    });
    assert.equal(r.pass, false);
    assert.ok(r.errors.some((e) => /CTA/i.test(e)));
  });

  it("pass khi có CTA tool dù body chưa có khối Kiểm tra nhanh (publish sẽ chèn)", () => {
    const r = assertContentQueueReadyForL3({
      title: "Điều kiện NƠXH 2026",
      painPoint: "Không biết đủ điều kiện không",
      bodyPreview: "Chỉ có đoạn văn, không có CTA trong bài.",
      ctaToolId: "noxh-check",
      ctaLabel: "Kiểm tra miễn phí bạn có đủ điều kiện NƠXH không",
      l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
    });
    assert.equal(r.pass, true);
  });

  it("fail khi thiếu khối Kiểm tra nhanh và thiếu CTA tool", () => {
    const r = assertContentQueueReadyForL3({
      title: "Điều kiện NƠXH 2026",
      painPoint: "Không biết đủ điều kiện không",
      bodyPreview: "Chỉ có đoạn văn, không có CTA trong bài.",
      ctaToolId: null,
      ctaLabel: "Kiểm tra miễn phí",
      l3Checklist: { pain: true, ctaTool: false, ctaCopy: true },
    });
    assert.equal(r.pass, false);
    assert.ok(r.errors.some((e) => /Kiểm tra nhanh|CTA/i.test(e)));
  });

  it("pass khi đủ CTA + checklist", () => {
    const r = assertContentQueueReadyForL3({
      title: "Điều kiện NƠXH 2026",
      painPoint: "Không biết đủ điều kiện không",
      bodyPreview: bodyWithCta,
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
      bodyPreview: bodyWithCta,
      ctaToolId: "xem-huong-nha" as "noxh-check",
      ctaLabel: "Xem hướng",
      l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
    });
    assert.equal(r.pass, false);
  });

  it("pass với legal-review cho bài pháp lý chung", () => {
    const r = assertContentQueueReadyForL3({
      title: "Sổ đỏ điện tử theo dự thảo?",
      painPoint: "Sổ điện tử có giá trị như sổ giấy không?",
      bodyPreview: `Nội dung.

## Kiểm tra nhanh

[Đặt lịch rà soát pháp lý 15 phút miễn phí](/lien-he?goi=ra-soat-phap-ly-15-phut#tu-van)
`,
      ctaToolId: "legal-review",
      ctaLabel: "Đặt lịch rà soát pháp lý 15 phút miễn phí",
      l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
    });
    assert.equal(r.pass, true);
    assert.deepEqual(r.errors, []);
  });
});
