import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildArticleBodyFromQueue,
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

  it("normalize bỏ nhãn (CTA) và frontmatter", () => {
    const raw = `---
title: x
---

Đoạn mở.

## Kiểm tra nhanh (CTA)

[Link](/lien-he)
`;
    const out = normalizeQueueBodyForReader(raw);
    assert.equal(out.includes("---"), false);
    assert.match(out, /^## Kiểm tra nhanh$/m);
    assert.equal(out.includes("(CTA)"), false);
    assert.equal(queueBodyHasCtaSection(out), true);
  });

  it("body luôn có markdown link CTA tool (H2 người đọc)", () => {
    const body = buildArticleBodyFromQueue({
      title: "Thu nhập 12tr có mua NƠXH được không?",
      painPoint: "Không biết đủ điều kiện thu nhập",
      bodyPreview: "Giải thích ngắn về điều kiện thu nhập NƠXH 2026.",
      ctaToolId: "noxh-check",
      ctaLabel: "Kiểm tra điều kiện miễn phí",
      ctaHref: "/cong-cu/dieu-kien-noxh",
    });
    assert.match(body, /^## Kiểm tra nhanh$/m);
    assert.equal(body.includes("(CTA)"), false);
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
