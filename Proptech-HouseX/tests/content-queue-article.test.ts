import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildArticleBodyFromQueue,
  dedupeReaderCtaSections,
  normalizeQueueBodyForReader,
  queueBodyHasCtaSection,
  slugifyArticleTitle,
} from "../lib/content/content-queue-article.ts";

describe("content-queue article seed", () => {
  it("slugify bỏ dấu tiếng Việt", () => {
    assert.equal(
      slugifyArticleTitle("Điều kiện NƠXH 2026 tại TP.HCM"),
      "dieu-kien-noxh-2026-tai-tp-hcm",
    );
  });

  it("normalize bỏ nhãn (CTA), frontmatter và đoạn mở SoR", () => {
    const raw = `---
title: x
---

Bài này quan sát và trình bày ở **phạm vi dự án** — không nhảy từ vành đai xuống căn hộ.

Đoạn mở cho người đọc.

## Kiểm tra nhanh (CTA)

[Link](/lien-he)
`;
    const out = normalizeQueueBodyForReader(raw);
    assert.equal(out.includes("---"), false);
    assert.equal(out.includes("Bài này quan sát và trình bày"), false);
    assert.match(out, /Đoạn mở cho người đọc/);
    assert.match(out, /^## Kiểm tra nhanh$/m);
    assert.equal(out.includes("(CTA)"), false);
    assert.equal(queueBodyHasCtaSection(out), true);
  });

  it("normalize bỏ H2 SoR Ai đang chịu tác động", () => {
    const raw = `Lede tin.

## Ai đang chịu tác động, và ai cần theo dõi ngay?

Đoạn tiếp.

## Kiểm tra nhanh

[Link](/lien-he)
`;
    const out = normalizeQueueBodyForReader(raw);
    assert.equal(out.includes("Ai đang chịu tác động"), false);
    assert.match(out, /Lede tin/);
    assert.match(out, /Đoạn tiếp/);
    assert.match(out, /^## Kiểm tra nhanh$/m);
    assert.equal(out.includes("(CTA)"), false);
    assert.equal(queueBodyHasCtaSection(out), true);
  });

  it("normalize bỏ dòng Không cần để lại SĐT", () => {
    const raw = `Nội dung.

## Kiểm tra nhanh

[Link](/cong-cu/dieu-kien-noxh)

Không cần để lại SĐT trước khi xem kết quả gợi ý.
`;
    const out = normalizeQueueBodyForReader(raw);
    assert.equal(out.includes("Không cần để lại SĐT"), false);
    assert.match(out, /^## Kiểm tra nhanh$/m);
  });

  it("buildArticleBodyFromQueue không tái chèn câu hệ thống SĐT", () => {
    const body = buildArticleBodyFromQueue({
      title: "Test",
      bodyPreview: "Nội dung ngắn.\n\n## Kiểm tra nhanh\n\n[Xem](/cong-cu/dieu-kien-noxh)",
      ctaToolId: "noxh-check",
    });
    assert.equal(body.includes("Không cần để lại SĐT"), false);
    assert.match(body, /^## Kiểm tra nhanh$/m);
  });

  it("publish giữ đúng body admin duyệt — không tự thêm CTA", () => {
    const body = buildArticleBodyFromQueue({
      title: "Bài đã bỏ CTA",
      bodyPreview: "Chỉ nội dung người đọc, admin đã xóa khối CTA.",
      ctaToolId: "noxh-check",
      ctaLabel: "Kiểm tra miễn phí bạn có đủ điều kiện NƠXH không",
      ctaHref: "/cong-cu/dieu-kien-noxh",
    });
    assert.equal(body.includes("## Kiểm tra nhanh"), false);
    assert.equal(
      body.includes("Kiểm tra miễn phí bạn có đủ điều kiện NƠXH không"),
      false,
    );
  });

  it("dedupe gộp khối Kiểm tra nhanh bị lặp", () => {
    const raw = `Nội dung.

## Kiểm tra nhanh

[Kiểm tra miễn phí bạn có đủ điều kiện NƠXH không](/cong-cu/dieu-kien-noxh)

## Kiểm tra nhanh

[Kiểm tra miễn phí bạn có đủ điều kiện NƠXH không](/cong-cu/dieu-kien-noxh)
`;
    const out = dedupeReaderCtaSections(raw);
    assert.equal((out.match(/^## Kiểm tra nhanh$/gm) ?? []).length, 1);
    assert.equal(
      (out.match(/dieu-kien-noxh/g) ?? []).length,
      1,
    );
  });

  it("giữ nguyên khối CTA admin đã duyệt trong body", () => {
    const body = buildArticleBodyFromQueue({
      title: "Thu nhập 12tr có mua NƠXH được không?",
      painPoint: "Không biết đủ điều kiện thu nhập",
      bodyPreview:
        "Giải thích ngắn về điều kiện thu nhập NƠXH 2026.\n\n## Kiểm tra nhanh\n\n[Kiểm tra điều kiện miễn phí](/cong-cu/dieu-kien-noxh)",
      ctaToolId: "noxh-check",
      ctaLabel: "Kiểm tra điều kiện miễn phí",
      ctaHref: "/cong-cu/dieu-kien-noxh",
    });
    assert.match(body, /^## Kiểm tra nhanh$/m);
    assert.equal(body.includes("(CTA)"), false);
    assert.equal(body.includes("## Thu nhập 12tr"), false);
    assert.equal(body.includes("Câu hỏi thường gặp"), false);
    assert.match(
      body,
      /\[Kiểm tra điều kiện miễn phí\]\(\/cong-cu\/dieu-kien-noxh\)/,
    );
    assert.ok(body.length >= 20);
  });

  it("không nhân đôi khối Kiểm tra nhanh nếu draft đã có", () => {
    const body = buildArticleBodyFromQueue({
      title: "Bài đã có CTA",
      bodyPreview: `Nội dung.\n\n## Kiểm tra nhanh\n\n[Đặt lịch](/lien-he)\n`,
      ctaToolId: "legal-review",
      ctaLabel: "Đặt lịch",
    });
    const matches = body.match(/^## Kiểm tra nhanh$/gm) ?? [];
    assert.equal(matches.length, 1);
    assert.equal(body.includes("## Bài đã có CTA"), false);
  });

  it("fallback CTA khi thiếu preview", () => {
    const body = buildArticleBodyFromQueue({
      title: "Vay NƠXH",
      painPoint: "Không biết trả góp bao nhiêu",
      ctaToolId: "noxh-loan-quick",
    });
    assert.match(body, /\/cong-cu\/kiem-tra-vay-noxh/);
    assert.equal(body.includes("(CTA)"), false);
  });
});
