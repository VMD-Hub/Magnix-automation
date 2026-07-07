import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GO_LIVE_LANDING_SLUGS } from "../lib/seed/go-live-landing-slugs";
import { getNoxhCatalogSlugs, getCatalogSlugs } from "../lib/seed/catalog-project-slugs";
import { getDemoProjectBySlug } from "../lib/preview/demo-projects";
import { VINHOMES_SAIGON_PARK_NAME } from "../lib/preview/vinhomes-saigon-park-mock";

describe("go-live landing catalog", () => {
  it("lists 8 commercial slugs for smoke test", () => {
    assert.equal(GO_LIVE_LANDING_SLUGS.length, 8);
  });

  it("lists NOXH slugs for /du-an/nha-o-xa-hoi hub", () => {
    const noxh = getNoxhCatalogSlugs();
    assert.ok(noxh.length >= 10, `expected >=10 NOXH, got ${noxh.length}`);
    assert.ok(noxh.includes("noxh-la-home-luong-hoa-ben-luc"));
  });

  it("combined catalog has commercial + NOXH", () => {
    assert.equal(
      getCatalogSlugs().length,
      GO_LIVE_LANDING_SLUGS.length + getNoxhCatalogSlugs().length,
    );
  });

  it("each commercial slug resolves to mock with project name in SSR catalog", () => {
    for (const slug of GO_LIVE_LANDING_SLUGS) {
      const project = getDemoProjectBySlug(slug);
      assert.ok(project, `missing mock for ${slug}`);
      assert.ok(project.name.length > 2);
    }
    assert.equal(
      getDemoProjectBySlug(GO_LIVE_LANDING_SLUGS[0])?.name,
      VINHOMES_SAIGON_PARK_NAME,
    );
  });

  it("list cards for commercial filter returns all 8 go-live projects", async () => {
    const { listCatalogProjectCards } = await import("../lib/preview/demo-projects");
    assert.equal(listCatalogProjectCards({ projectType: "THUONG_MAI" }).length, 8);
    assert.ok(listCatalogProjectCards({ projectType: "NHA_O_XA_HOI" }).length >= 10);
  });

  it("catalog banner variants map from projectType filter", async () => {
    const { projectCatalogBannerVariant, PROJECT_CATALOG_BANNERS } = await import(
      "../lib/brand/project-catalog-banners"
    );
    assert.equal(projectCatalogBannerVariant(undefined), "all");
    assert.equal(projectCatalogBannerVariant("THUONG_MAI"), "THUONG_MAI");
    assert.equal(projectCatalogBannerVariant("NHA_O_XA_HOI"), "NHA_O_XA_HOI");
    assert.ok(PROJECT_CATALOG_BANNERS.all.slide.webp1280.startsWith("/images/hero/"));
  });
});
