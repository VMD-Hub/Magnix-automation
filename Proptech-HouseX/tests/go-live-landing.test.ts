import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GO_LIVE_LANDING_SLUGS } from "../lib/seed/go-live-landing-slugs";
import { getDemoProjectBySlug } from "../lib/preview/demo-projects";
import { VINHOMES_SAIGON_PARK_NAME } from "../lib/preview/vinhomes-saigon-park-mock";

describe("go-live landing catalog", () => {
  it("lists 7 commercial slugs for smoke test", () => {
    assert.equal(GO_LIVE_LANDING_SLUGS.length, 7);
  });

  it("each slug resolves to mock with project name in SSR catalog", () => {
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

  it("list cards for commercial filter returns all 7 go-live projects", async () => {
    const { listGoLiveProjectCards } = await import("../lib/preview/demo-projects");
    assert.equal(listGoLiveProjectCards({ projectType: "THUONG_MAI" }).length, 7);
    assert.equal(listGoLiveProjectCards({ projectType: "NHA_O_XA_HOI" }).length, 0);
  });

  it("catalog banner variants map from projectType filter", async () => {
    const { projectCatalogBannerVariant, PROJECT_CATALOG_BANNERS } = await import(
      "../lib/brand/project-catalog-banners"
    );
    assert.equal(projectCatalogBannerVariant(undefined), "all");
    assert.equal(projectCatalogBannerVariant("THUONG_MAI"), "THUONG_MAI");
    assert.equal(projectCatalogBannerVariant("NHA_O_XA_HOI"), "NHA_O_XA_HOI");
    assert.ok(PROJECT_CATALOG_BANNERS.all.jpg.startsWith("/images/hero/"));
  });
});
