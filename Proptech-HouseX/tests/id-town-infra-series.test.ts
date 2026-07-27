import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ID_TOWN_INFRA_ARTICLES_2026 } from "@/lib/content/articles/id-town-infra-series-2026";
import { assertEditorialBodyQuality } from "@/lib/content/articles/article-editorial-voice";
import { getDemoArticlesForProject } from "@/lib/preview/demo-articles";
import { ID_TOWN_SLUG } from "@/lib/content/id-town-landing";

describe("ID Town infra article series", () => {
  it("exports published hạ tầng article linked to ID Town", () => {
    assert.equal(ID_TOWN_INFRA_ARTICLES_2026.length, 1);
    for (const a of ID_TOWN_INFRA_ARTICLES_2026) {
      assert.equal(a.status, "PUBLISHED");
      assert.ok(a.tags.some((t) => t.slug === "hanh-lang-san-bay-long-thanh"));
      assert.ok(!a.tags.some((t) => t.slug === "ha-tang-ket-noi-vung"));
      assert.ok(a.projects.some((p) => p.slug === ID_TOWN_SLUG));
      assert.ok(a.body.includes("/du-an/id-town-long-thanh"));
      assert.match(a.body, /!\[[^\]]+\]\([^)]+\)/);
      assertEditorialBodyQuality(a.body, a.slug);
    }
  });

  it("slug resolves on ID Town project hub", () => {
    const slugs = new Set(
      getDemoArticlesForProject(ID_TOWN_SLUG, 20).map((a) => a.slug),
    );
    for (const a of ID_TOWN_INFRA_ARTICLES_2026) {
      assert.ok(slugs.has(a.slug), `missing ${a.slug}`);
    }
  });

  it("covers key distance facts for SEO", () => {
    const body = ID_TOWN_INFRA_ARTICLES_2026[0]!.body;
    assert.match(body, /5\s*km/);
    assert.match(body, /1[,.]5\s*[–-]\s*2\s*km/);
    assert.match(body, /28\s*km/);
    assert.match(body, /Long Thành 1|ga Long Thành/i);
  });
});
