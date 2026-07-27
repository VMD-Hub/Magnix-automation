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
      const corridorTag = a.tags.some(
        (t) =>
          t.slug === "ha-tang-ket-noi-vung" ||
          t.slug === "hanh-lang-san-bay-long-thanh" ||
          t.slug === "hanh-lang-kinh-te-bien-phia-dong",
      );
      assert.ok(corridorTag, `${a.slug} missing framework/airport/east-coast tag`);
      assert.ok(!a.tags.some((t) => t.slug === "truc-quoc-lo-13-dong-bac"));
      assert.ok(a.projects.some((p) => p.slug === DTA_HAPPY_HOME_SLUG));
      assert.ok(a.body.includes("[") && a.body.includes("]("));
    }
  });

  it("airport-specific TOD article uses sân bay tag", () => {
    const a = TOD_NHON_TRACH_ARTICLES_2026.find(
      (x) => x.slug === "metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026",
    );
    assert.ok(a);
    assert.ok(a!.tags.some((t) => t.slug === "hanh-lang-san-bay-long-thanh"));
    assert.ok(!a!.tags.some((t) => t.slug === "ha-tang-ket-noi-vung"));
  });

  it("Nhơn Trạch growth article uses east-coast tag, not shared airport hub", () => {
    const a = TOD_NHON_TRACH_ARTICLES_2026.find(
      (x) => x.slug === "nhon-trach-cu-tang-truong-ha-tang-tod-2026",
    );
    assert.ok(a);
    assert.ok(a!.tags.some((t) => t.slug === "hanh-lang-kinh-te-bien-phia-dong"));
    assert.ok(!a!.tags.some((t) => t.slug === "hanh-lang-san-bay-long-thanh"));
    assert.ok(!a!.tags.some((t) => t.slug === "ha-tang-ket-noi-vung"));
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
