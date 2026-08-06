import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertEditorialBodyQuality } from "@/lib/content/articles/article-editorial-voice";
import { LTK_FUNNEL_SERIES_2026 } from "@/lib/content/articles/ltk-funnel-series-2026";
import { NOXH_TAG_DU_AN_GIA } from "@/lib/content/articles/noxh-handbook-tags";
import {
  getDemoArticleBySlug,
  getDemoArticlesForProject,
} from "@/lib/preview/demo-articles";
import { LTK_PROJECT_SLUG } from "@/lib/preview/phu-tho-dmc-mock";

const EXPECTED_SLUGS = [
  "gia-nha-o-xa-hoi-ly-thuong-kiet-cong-bo-6-2026",
  "ho-so-mua-noxh-ly-thuong-kiet-doi-tuong-checklist-2026",
  "vi-sao-noxh-ly-thuong-kiet-sot-so-sanh-gia-quan-10-2026",
  "canh-bao-lua-dao-suat-noi-bo-noxh-ly-thuong-kiet-2026",
  "giai-ma-4-don-thao-tung-tam-ly-suat-noi-bo-noxh-ly-thuong-kiet-2026",
  "mua-noxh-ly-thuong-kiet-co-kho-khong-canh-giac-ve-bua-thu-tuc-2026",
] as const;

describe("LTK SEO funnel series 2026", () => {
  it("exports 6 published articles with DU_AN_GIA tag and LTK project", () => {
    assert.equal(LTK_FUNNEL_SERIES_2026.length, 6);
    assert.deepEqual(
      LTK_FUNNEL_SERIES_2026.map((a) => a.slug),
      [...EXPECTED_SLUGS],
    );
    for (const a of LTK_FUNNEL_SERIES_2026) {
      assert.equal(a.status, "PUBLISHED");
      assert.ok(
        a.tags.some((t) => t.slug === NOXH_TAG_DU_AN_GIA.slug),
        `${a.slug} missing du-an-gia-tien-do-noxh`,
      );
      assert.ok(a.projects.some((p) => p.slug === LTK_PROJECT_SLUG));
      assertEditorialBodyQuality(a.body, a.slug);
    }
  });

  it("all six slugs resolve in demo catalog and LTK project hub", () => {
    for (const slug of EXPECTED_SLUGS) {
      assert.ok(getDemoArticleBySlug(slug), `missing demo ${slug}`);
    }
    const hub = new Set(
      getDemoArticlesForProject(LTK_PROJECT_SLUG, 20).map((a) => a.slug),
    );
    for (const slug of EXPECTED_SLUGS) {
      assert.ok(hub.has(slug), `missing on LTK hub: ${slug}`);
    }
  });

  it("article 1 distinguishes 755 bán vs 270 thuê and cites official unit price", () => {
    const a = LTK_FUNNEL_SERIES_2026[0]!;
    assert.ok(a.body.includes("23.251.398"));
    assert.ok(a.body.includes("755"));
    assert.ok(a.body.includes("270"));
    assert.ok(a.body.includes(`/du-an/${LTK_PROJECT_SLUG}`));
  });

  it("article 2 lists 11 Điều 76 groups and three legal pillars", () => {
    const a = LTK_FUNNEL_SERIES_2026[1]!;
    assert.ok(/Điều 76/i.test(a.body));
    assert.ok(/11 nhóm/i.test(a.body) || a.body.includes("11 nhóm"));
    assert.ok(/Điều 77/i.test(a.body));
    assert.ok(a.body.includes("/lien-he"));
    assert.ok(a.body.includes("/cong-cu/dieu-kien-noxh"));
    assert.ok(
      a.body.includes("canh-bao-lua-dao-suat-noi-bo-noxh-ly-thuong-kiet-2026"),
    );
  });

  it("article 4 warns on scams and CTA /lien-he", () => {
    const a = LTK_FUNNEL_SERIES_2026[3]!;
    assert.ok(/suất nội bộ|bao đậu|lừa đảo/i.test(a.body));
    assert.ok(a.body.includes("270"));
    assert.ok(a.body.includes("/lien-he"));
    assert.ok(a.body.includes("95%"));
  });

  it("article 5 covers four psychology levers and invite-to-share CTA", () => {
    const a = LTK_FUNNEL_SERIES_2026[4]!;
    assert.ok(/ngữ nghĩa|đặc quyền|triển vọng|phản kháng/i.test(a.body));
    assert.ok(a.body.includes("270"));
    assert.ok(a.body.includes("/lien-he"));
    assert.ok(/người thân|gia đình/i.test(a.body));
    assert.ok(
      a.body.includes("canh-bao-lua-dao-suat-noi-bo-noxh-ly-thuong-kiet-2026"),
    );
  });

  it("article 6 exposes procedure-fear fee scam without editorial jargon", () => {
    const a = LTK_FUNNEL_SERIES_2026[5]!;
    assert.ok(/phức tạp|vẽ bùa|hù dọa|thân lừa/i.test(a.body));
    assert.ok(!/Complexity Bias|Barrier Obsession|neo góc chuyên gia|Lớp thao túng/i.test(a.body));
    assert.ok(!/Complexity Bias|neo góc|Lớp thao túng/i.test(a.excerpt));
    assert.ok(a.body.includes("/lien-he"));
    assert.ok(
      a.body.includes("ho-so-mua-noxh-ly-thuong-kiet-doi-tuong-checklist-2026"),
    );
    assert.ok(/không nhận làm dịch vụ bao đậu|tự làm/i.test(a.body));
  });
});
