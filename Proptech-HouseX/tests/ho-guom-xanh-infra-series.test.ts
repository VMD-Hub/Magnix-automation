import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { HGX_INFRA_ARTICLES_2026 } from "@/lib/content/articles/ho-guom-xanh-infra-series-2026";
import { assertEditorialBodyQuality } from "@/lib/content/articles/article-editorial-voice";
import { getDemoArticlesForProject } from "@/lib/preview/demo-articles";
import { HGX_PROJECT_SLUG } from "@/lib/preview/ho-guom-xanh-mock";

describe("Ho Guom Xanh infra article series", () => {
  it("exports published hạ tầng article linked to HGX", () => {
    assert.equal(HGX_INFRA_ARTICLES_2026.length, 1);
    for (const a of HGX_INFRA_ARTICLES_2026) {
      assert.equal(a.status, "PUBLISHED");
      assert.ok(a.tags.some((t) => t.slug === "ha-tang-ket-noi-vung"));
      assert.ok(a.projects.some((p) => p.slug === HGX_PROJECT_SLUG));
      assert.ok(a.body.includes("/du-an/nha-o-xa-hoi-ho-guom-xanh-thuan-an"));
      assert.match(a.body, /!\[[^\]]+\]\([^)]+\)/);
      assertEditorialBodyQuality(a.body, a.slug);
    }
  });

  it("slug resolves on HGX project hub", () => {
    const slugs = new Set(
      getDemoArticlesForProject(HGX_PROJECT_SLUG, 20).map((a) => a.slug),
    );
    for (const a of HGX_INFRA_ARTICLES_2026) {
      assert.ok(slugs.has(a.slug), `missing ${a.slug}`);
    }
  });

  it("covers Metro 2 / TOD and project facts for SEO", () => {
    const body = HGX_INFRA_ARTICLES_2026[0]!.body;
    assert.match(body, /Metro số 2|metro số 2/i);
    assert.match(body, /Quốc lộ 13|QL13|Đại lộ Bình Dương/);
    assert.match(body, /Lái Thiêu/);
    assert.match(body, /TOD|vài trăm mét/);
    assert.match(body, /26[,.]4\s*ha/);
    assert.match(body, /5\s*[–-]\s*12\s*tầng/);
    assert.doesNotMatch(body, /\bUSP\b/);
    assert.doesNotMatch(body, /người đọc nên/);
    assert.doesNotMatch(body, /timeline marketing/);
  });
});
