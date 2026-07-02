import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ARTICLE_EDITORIAL_COVERS,
  applyEditorialMedia,
  editorialFigure,
} from "@/lib/content/articles/article-editorial-media";
import { NOXH_TREND_ARTICLES_2026 } from "@/lib/content/articles/noxh-trend-series-2026";
import { TOD_NHON_TRACH_ARTICLES_2026 } from "@/lib/content/articles/tod-nhon-trach-series-2026";
import { getDemoArticleBySlug } from "@/lib/preview/demo-articles";

describe("article editorial media standards", () => {
  it("every editorial slug has cover url, alt and caption", () => {
    const slugs = [
      ...NOXH_TREND_ARTICLES_2026.map((a) => a.slug),
      ...TOD_NHON_TRACH_ARTICLES_2026.map((a) => a.slug),
      "gia-nha-o-xa-hoi-ly-thuong-kiet-cong-bo-6-2026",
      "tien-do-noxh-kdc-chang-song-phuoc-tan-2026",
      "dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat",
    ];
    for (const slug of slugs) {
      const cover = ARTICLE_EDITORIAL_COVERS[slug];
      assert.ok(cover, `missing cover pack for ${slug}`);
      assert.ok(cover.url.length > 0);
      assert.ok(cover.alt.length > 10);
      assert.ok(cover.caption.length > 10);
    }
  });

  it("editorial articles include inline figure markdown", () => {
    for (const a of [...NOXH_TREND_ARTICLES_2026, ...TOD_NHON_TRACH_ARTICLES_2026]) {
      assert.match(a.body, /!\[[^\]]+\]\([^)]+\)/, `${a.slug} missing inline image`);
      assert.match(a.body, /\*Ảnh:/, `${a.slug} missing figure caption`);
    }
  });

  it("applyEditorialMedia sets cover metadata on fetch", () => {
    const raw = NOXH_TREND_ARTICLES_2026[0]!;
    const enriched = applyEditorialMedia(raw);
    assert.ok(enriched.coverImageUrl);
    assert.ok(enriched.coverImageAlt);
    assert.ok(enriched.coverImageCaption);
  });

  it("demo article without raw cover gets cover from registry", () => {
    const a = getDemoArticleBySlug("dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat");
    assert.ok(a?.coverImageUrl);
    assert.ok(a?.coverImageAlt);
  });

  it("editorialFigure emits caption line", () => {
    const md = editorialFigure({
      url: "/images/hero/test.jpg",
      alt: "Test",
      caption: "Minh họa thử nghiệm",
      source: "HouseX",
    });
    assert.match(md, /!\[Test\]/);
    assert.match(md, /\*Ảnh: Minh họa thử nghiệm — Nguồn: HouseX\*/);
  });
});
