import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ensureCatalogCoverUrl, getCatalogCoverUrl } from "../lib/content/catalog-cover-fallback";
import { getCatalogSlugs } from "../lib/seed/catalog-project-slugs";
import {
  buildDemoListingDetail,
  listDemoSaleListingCards,
} from "../lib/preview/demo-listings";

describe("catalog media fallbacks", () => {
  it("every catalog project slug has a cover image", () => {
    for (const slug of getCatalogSlugs()) {
      const url = getCatalogCoverUrl(slug);
      assert.ok(url?.startsWith("http"), `missing cover for ${slug}`);
    }
  });

  it("ensureCatalogCoverUrl never returns empty", () => {
    assert.ok(ensureCatalogCoverUrl("noxh-la-home-luong-hoa-ben-luc").startsWith("http"));
  });

  it("demo sale listings have images and detail pages", () => {
    const cards = listDemoSaleListingCards();
    assert.ok(cards.length >= 3);
    for (const c of cards) {
      assert.ok(c.imageUrl?.startsWith("http"), `${c.code} missing image`);
      assert.ok(buildDemoListingDetail(c.code), `${c.code} missing detail`);
    }
  });
});
