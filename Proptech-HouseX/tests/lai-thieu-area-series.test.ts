import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LAI_THIEU_AREA_ARTICLES_2026 } from "@/lib/content/articles/lai-thieu-area-series-2026";
import { assertEditorialBodyQuality } from "@/lib/content/articles/article-editorial-voice";
import { getDemoArticlesForProject } from "@/lib/preview/demo-articles";
import { HGX_PROJECT_SLUG } from "@/lib/preview/ho-guom-xanh-mock";

const EXPECTED_SLUGS = [
  "lai-thieu-quy-hoach-2040-phuong-trung-tam-metro-2026",
  "can-ho-lai-thieu-quoc-lo-13-du-an-noi-bat-2026",
  "mua-can-ho-lai-thieu-o-thuc-hay-dau-tu-cho-thue-2026",
  "can-ho-lai-thieu-sap-mo-ban-emerald-boulevard-hgx-2026",
] as const;

describe("Lái Thiêu area article series", () => {
  it("exports 4 published articles linked to HGX", () => {
    assert.equal(LAI_THIEU_AREA_ARTICLES_2026.length, 4);
    for (const a of LAI_THIEU_AREA_ARTICLES_2026) {
      assert.equal(a.status, "PUBLISHED");
      assert.ok(a.projects.some((p) => p.slug === HGX_PROJECT_SLUG));
      assert.ok(a.body.includes("/du-an/nha-o-xa-hoi-ho-guom-xanh-thuan-an"));
      assert.ok(a.body.includes("/lien-he"));
      assert.match(a.body, /!\[[^\]]+\]\([^)]+\)/);
      assertEditorialBodyQuality(a.body, a.slug);
    }
    assert.deepEqual(
      LAI_THIEU_AREA_ARTICLES_2026.map((a) => a.slug),
      [...EXPECTED_SLUGS],
    );
  });

  it("slugs resolve on HGX project hub", () => {
    const slugs = new Set(
      getDemoArticlesForProject(HGX_PROJECT_SLUG, 20).map((a) => a.slug),
    );
    for (const slug of EXPECTED_SLUGS) {
      assert.ok(slugs.has(slug), `missing ${slug}`);
    }
  });

  it("covers quy hoạch, đang bán, ở thực/đầu tư and sắp mở bán", () => {
    const [quyHoach, duAn, quyetDinh, sapMoBan] = LAI_THIEU_AREA_ARTICLES_2026;
    assert.match(quyHoach!.body, /118[,.]?000|15[,.]46/);
    assert.match(duAn!.body, /Emerald 68|A&T Sky Garden|Astral City/);
    assert.match(duAn!.body, /\/du-an\/the-emerald-68-thuan-an/);
    assert.doesNotMatch(duAn!.body, /Bcons New Sky|Symlife|Emerald River Park/);
    assert.match(quyetDinh!.body, /ở thực|cho thuê/);
    assert.match(sapMoBan!.body, /Emerald Boulevard|Hồ Gươm Xanh/);
    assert.doesNotMatch(quyHoach!.body, /\bUSP\b/);
  });
});
