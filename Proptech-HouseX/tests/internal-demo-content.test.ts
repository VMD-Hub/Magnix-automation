import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  INTERNAL_DEMO_LISTING_CODES,
  INTERNAL_DEMO_PROJECT_SLUGS,
  isInternalDemoListingCode,
  isInternalDemoProjectSlug,
} from "../lib/deploy/internal-demo-content";
import { getPublicProjectBySlug } from "../lib/data/project-public";
import { listCatalogSaleListingCards } from "../lib/preview/catalog-listings";
import { listDemoSaleListingCards } from "../lib/preview/demo-listings";

describe("internal demo content hidden from public", () => {
  it("registry covers HouseX sample projects", () => {
    assert.ok(isInternalDemoProjectSlug("housex-an-cu"));
    assert.ok(isInternalDemoProjectSlug("housex-riverside"));
    assert.ok(!isInternalDemoProjectSlug("dta-happy-home-nhon-trach"));
  });

  it("registry covers seed + HX-DEMO listing codes", () => {
    for (const code of INTERNAL_DEMO_LISTING_CODES) {
      assert.ok(isInternalDemoListingCode(code));
    }
    assert.ok(isInternalDemoListingCode("HX-DEMO-S001"));
    assert.ok(!isInternalDemoListingCode("DTA-HH-A10001"));
  });

  it("getPublicProjectBySlug returns null for internal demo slugs", async () => {
    for (const slug of INTERNAL_DEMO_PROJECT_SLUGS) {
      const result = await getPublicProjectBySlug(slug);
      assert.equal(result, null, slug);
    }
  });

  it("listCatalogSaleListingCards includes DTA go-live inventory in production", () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    try {
      const codes = listCatalogSaleListingCards().map((c) => c.code);
      assert.ok(codes.some((c) => c.startsWith("DTA-HH-")));
      assert.ok(codes.length >= 30);
    } finally {
      process.env.NODE_ENV = prev;
    }
  });

  it("listDemoSaleListingCards omits HX-DEMO in production mode", () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    try {
      const codes = listDemoSaleListingCards().map((c) => c.code);
      assert.ok(!codes.some((c) => c.startsWith("HX-DEMO-")));
    } finally {
      process.env.NODE_ENV = prev;
    }
  });
});
