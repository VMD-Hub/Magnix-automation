import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  extractArticleFaqsFromMarkdown,
  parseArticleFaqSection,
} from "@/lib/content/article-faq-markdown";
import { buildArticleFaqJsonLd } from "@/lib/seo/article-json-ld";

describe("article FAQ accordion markdown", () => {
  it("parses ## Các câu hỏi thường gặp with ### questions", () => {
    const blocks = `## Các câu hỏi thường gặp

### Vì sao phải kiểm tra tài chính trước?

Vì nghĩa vụ trả nợ kéo dài nhiều năm.

### Lịch sử tín dụng ảnh hưởng thế nào?

Ngân hàng dùng để đánh giá năng lực trả nợ.

## Kiểm tra nhanh

* [Công cụ](/cong-cu/dieu-kien-noxh)`.split(/\n\n+/);

    const faq = parseArticleFaqSection(blocks, 0);
    assert.ok(faq);
    assert.equal(faq!.heading, "Các câu hỏi thường gặp");
    assert.equal(faq!.items.length, 2);
    assert.match(faq!.items[0]!.q, /tài chính/);
    assert.match(faq!.items[0]!.a, /nghĩa vụ trả nợ/);
  });

  it("extracts FAQs and builds FAQPage JSON-LD", () => {
    const body = `## Intro

Đoạn mở.

## Các câu hỏi thường gặp

### Câu hỏi một?

Trả lời một.

### Câu hỏi hai?

Trả lời hai có [link](/lien-he).

## Kết`;

    const items = extractArticleFaqsFromMarkdown(body);
    assert.equal(items.length, 2);

    const ld = buildArticleFaqJsonLd(body);
    assert.ok(ld);
    assert.equal(ld!["@type"], "FAQPage");
    assert.equal((ld as { mainEntity: unknown[] }).mainEntity.length, 2);
  });
});
