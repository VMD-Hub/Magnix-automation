import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ensureCatalogCoverUrl, getCatalogCoverUrl } from "../lib/content/catalog-cover-fallback";
import { getCatalogSlugs } from "../lib/seed/catalog-project-slugs";
import {
  buildDemoListingDetail,
  listDemoSaleListingCards,
} from "../lib/preview/demo-listings";
import { buildDtaHappyHomeLanding } from "../lib/content/dta-happy-home-landing";

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

  it("DTA Happy Home landing has floor plans, show units and payment gallery", () => {
    const landing = buildDtaHappyHomeLanding();
    assert.ok(landing.gallery.length >= 10);
    assert.ok(landing.heroImage?.url.includes("/wp-content/uploads/"));
    assert.ok(landing.locationMapImage?.url.includes("/wp-content/themes/"));
    assert.match(landing.gallery[0]?.caption ?? "", /Mặt bằng tổng thể/i);
    assert.ok(landing.services.length >= 2);
  });
});
