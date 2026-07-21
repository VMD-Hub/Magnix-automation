import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildArticleBodyFromQueue,
  slugifyArticleTitle,
} from "../lib/content/content-queue-article.ts";

describe("content-queue article seed", () => {
  it("slugify bỏ dấu tiếng Việt", () => {
    assert.equal(
      slugifyArticleTitle("Điều kiện NƠXH 2026 tại TP.HCM"),
      "dieu-kien-noxh-2026-tai-tp-hcm",
    );
  });

  it("body luôn có markdown link CTA tool", () => {
    const body = buildArticleBodyFromQueue({
      title: "Thu nhập 12tr có mua NƠXH được không?",
      painPoint: "Không biết đủ điều kiện thu nhập",
      bodyPreview: "Giải thích ngắn về điều kiện thu nhập NƠXH 2026.",
      ctaToolId: "noxh-check",
      ctaLabel: "Kiểm tra điều kiện miễn phí",
      ctaHref: "/cong-cu/dieu-kien-noxh",
    });
    assert.match(body, /## Kiểm tra nhanh \(CTA\)/);
    assert.match(
      body,
      /\[Kiểm tra điều kiện miễn phí\]\(\/cong-cu\/dieu-kien-noxh\)/,
    );
    assert.ok(body.length >= 20);
  });

  it("fallback CTA khi thiếu preview", () => {
    const body = buildArticleBodyFromQueue({
      title: "Vay NƠXH",
      painPoint: "Không biết trả góp bao nhiêu",
      ctaToolId: "noxh-loan-quick",
    });
    assert.match(body, /\/cong-cu\/kiem-tra-vay-noxh/);
  });
});
