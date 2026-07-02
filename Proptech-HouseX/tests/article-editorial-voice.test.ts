import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertEditorialBodyQuality,
  EDITORIAL_BANNED_BODY_PATTERNS,
} from "@/lib/content/articles/article-editorial-voice";
import { NOXH_TREND_ARTICLES_2026 } from "@/lib/content/articles/noxh-trend-series-2026";
import { TOD_NHON_TRACH_ARTICLES_2026 } from "@/lib/content/articles/tod-nhon-trach-series-2026";

const EDITORIAL_SERIES = [
  ...NOXH_TREND_ARTICLES_2026,
  ...TOD_NHON_TRACH_ARTICLES_2026,
];

describe("article editorial voice", () => {
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
