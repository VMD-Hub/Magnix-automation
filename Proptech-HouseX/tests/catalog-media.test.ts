import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ensureCatalogCoverUrl, getCatalogCoverUrl } from "../lib/content/catalog-cover-fallback";
import { getCatalogSlugs } from "../lib/seed/catalog-project-slugs";
import {
  buildDemoListingDetail,
  listDemoSaleListingCards,
} from "../lib/preview/demo-listings";
import { buildDtaHappyHomeLanding } from "../lib/content/dta-happy-home-landing";
import { ensureNoxhLandingMedia } from "../lib/content/noxh-stock-images";
import { isSafeImageUrl } from "../lib/content/safe-image";
import { NOXH_REGION_TAGLINE } from "../lib/content/messaging/noxh-public";
import { parseProjectOverview } from "../lib/content/project-landing";

describe("catalog media fallbacks", () => {
  it("every catalog project slug has a cover image", () => {
    for (const slug of getCatalogSlugs()) {
      const url = getCatalogCoverUrl(slug);
      assert.ok(
        url?.startsWith("http") || url?.startsWith("/"),
        `missing cover for ${slug}`,
      );
    }
  });

  it("ensureCatalogCoverUrl never returns empty", () => {
    const url = ensureCatalogCoverUrl("noxh-la-home-luong-hoa-ben-luc");
    assert.ok(url.startsWith("http") || url.startsWith("/"));
  });

  it("demo sale listings have images and detail pages", () => {
    const cards = listDemoSaleListingCards();
    assert.ok(cards.length >= 30);
    for (const c of cards.slice(0, 5)) {
      assert.ok(
        c.imageUrl?.startsWith("http") || c.imageUrl?.startsWith("/"),
        `${c.code} missing image`,
      );
      assert.ok(buildDemoListingDetail(c.code), `${c.code} missing detail`);
    }
    assert.ok(buildDemoListingDetail("DTA-HH-A10201"));
  });

  it("DTA Happy Home landing has floor plans, show units and payment gallery", () => {
    const landing = buildDtaHappyHomeLanding();
    assert.ok(landing.gallery.length >= 10);
    assert.ok(landing.heroImage?.url.startsWith("/images/projects/dta-happy-home/"));
    assert.ok(
      landing.locationMapImage?.url.startsWith("/images/projects/dta-happy-home/"),
    );
    assert.match(landing.gallery[0]?.caption ?? "", /Mặt bằng tổng thể/i);
    assert.ok(landing.services.length >= 2);
  });

  it("NOXH stock media fills risky external URLs and preserves DTA CĐT images", () => {
    const dta = buildDtaHappyHomeLanding();
    const dtaAfter = ensureNoxhLandingMedia(dta, "dta-happy-home-nhon-trach");
    assert.equal(dtaAfter.heroImage?.url, dta.heroImage?.url);

    const risky = ensureNoxhLandingMedia(
      {
        ...dta,
        heroImage: { url: "http://broken.example/hero.jpg", alt: "x" },
        gallery: [{ url: "http://broken.example/g.jpg", caption: "y" }],
      },
      "noxh-phu-an-thanh-ben-luc",
    );
    assert.ok(risky.heroImage?.url.startsWith("/images/"));
    assert.ok(isSafeImageUrl(risky.heroImage?.url));
    assert.ok(risky.gallery.length >= 2);
    assert.ok(risky.gallery.every((g) => isSafeImageUrl(g.url)));
  });

  it("parseProjectOverview keeps landing when blocks is invalid but landing valid", () => {
    const overview = parseProjectOverview({
      blocks: 0,
      totalUnits: 1100,
      landing: buildDtaHappyHomeLanding(),
    });
    assert.ok(overview.landing?.heroImage?.url);
    assert.equal(overview.blocks, undefined);
  });

  it("NOXH region tagline is SEO-friendly without internal Rada brand name", () => {
    assert.match(NOXH_REGION_TAGLINE, /nhà ở xã hội miền Nam/i);
    assert.match(NOXH_REGION_TAGLINE, /người lao động/i);
    assert.doesNotMatch(NOXH_REGION_TAGLINE, /Rada/i);
  });
});
