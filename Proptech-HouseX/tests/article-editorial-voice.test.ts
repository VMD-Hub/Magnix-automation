import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertEditorialBodyQuality,
  EDITORIAL_BANNED_BODY_PATTERNS,
} from "@/lib/content/articles/article-editorial-voice";
import { NOXH_TREND_ARTICLES_2026 } from "@/lib/content/articles/noxh-trend-series-2026";
import { TOD_NHON_TRACH_ARTICLES_2026 } from "@/lib/content/articles/tod-nhon-trach-series-2026";
import { getDemoArticleBySlug } from "@/lib/preview/demo-articles";

const EDITORIAL_SERIES = [
  ...NOXH_TREND_ARTICLES_2026,
  ...TOD_NHON_TRACH_ARTICLES_2026,
];

const LEGACY_DEMO_SLUGS = [
  "gia-nha-o-xa-hoi-ly-thuong-kiet-cong-bo-6-2026",
  "tien-do-noxh-kdc-chang-song-phuoc-tan-2026",
  "dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat",
];

describe("article editorial voice", () => {
  it("all demo catalog articles pass editorial voice QA", () => {
    const slugs = [
      ...EDITORIAL_SERIES.map((a) => a.slug),
      ...LEGACY_DEMO_SLUGS,
    ];
    for (const slug of slugs) {
      const article = getDemoArticleBySlug(slug);
      assert.ok(article, `missing demo article ${slug}`);
      assertEditorialBodyQuality(article!.body, slug);
    }
  });

  it("TOD and NOXH series avoid raw ** and writer prompt headings", () => {
    for (const article of EDITORIAL_SERIES) {
      assertEditorialBodyQuality(article.body, article.slug);
    }
  });

  it("DTA closings mention project link without meta CTA headings", () => {
    const withDta = EDITORIAL_SERIES.filter((a) =>
      a.body.includes("/du-an/dta-happy-home-nhon-trach"),
    );
    assert.ok(withDta.length >= 6);
    for (const article of withDta) {
      for (const pattern of EDITORIAL_BANNED_BODY_PATTERNS) {
        assert.equal(
          pattern.test(article.body),
          false,
          `${article.slug} matches ${pattern}`,
        );
      }
    }
  });
});
