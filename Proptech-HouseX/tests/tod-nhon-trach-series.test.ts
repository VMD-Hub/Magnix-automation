import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { TOD_NHON_TRACH_ARTICLES_2026 } from "@/lib/content/articles/tod-nhon-trach-series-2026";
import { getDemoArticlesForProject } from "@/lib/preview/demo-articles";
import { DTA_HAPPY_HOME_SLUG } from "@/lib/content/dta-happy-home-landing";

describe("TOD Nhon Trach article series", () => {
  it("exports 5 published articles with DTA project link", () => {
    assert.equal(TOD_NHON_TRACH_ARTICLES_2026.length, 5);
    for (const a of TOD_NHON_TRACH_ARTICLES_2026) {
      assert.equal(a.status, "PUBLISHED");
      assert.ok(a.tags.some((t) => t.slug === "ha-tang-ket-noi-vung"));
      assert.ok(a.projects.some((p) => p.slug === DTA_HAPPY_HOME_SLUG));
      assert.ok(a.body.includes("[") && a.body.includes("]("));
    }
  });

  it("all slugs resolve on DTA project hub", () => {
    const slugs = new Set(
      getDemoArticlesForProject(DTA_HAPPY_HOME_SLUG, 20).map((a) => a.slug),
    );
    for (const a of TOD_NHON_TRACH_ARTICLES_2026) {
      assert.ok(slugs.has(a.slug), `missing ${a.slug}`);
    }
  });
});
