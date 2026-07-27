import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ARTICLE_GROWTH_CORRIDOR,
  getArticleCorridor,
  getProjectCorridor,
  GROWTH_CORRIDOR_AXIS_IDS,
  GROWTH_CORRIDORS,
  GROWTH_CORRIDORS_PILLAR_SLUG,
  PROJECT_GROWTH_CORRIDOR,
} from "@/lib/content/growth-corridors";
import {
  assertFunnelPlanComplete,
  GROWTH_CORRIDOR_ARTICLE_PLAN,
} from "@/lib/content/growth-corridor-funnel";
import {
  NOXH_TAG_AIRPORT,
  NOXH_TAG_EAST_COAST,
  NOXH_TAG_HA_TANG,
  NOXH_TAG_QL13,
} from "@/lib/content/articles/noxh-handbook-tags";
import { ID_TOWN_INFRA_ARTICLES_2026 } from "@/lib/content/articles/id-town-infra-series-2026";
import { HGX_INFRA_ARTICLES_2026 } from "@/lib/content/articles/ho-guom-xanh-infra-series-2026";
import { LAI_THIEU_AREA_ARTICLES_2026 } from "@/lib/content/articles/lai-thieu-area-series-2026";
import { GROWTH_CORRIDORS_PILLAR_ARTICLES_2026 } from "@/lib/content/articles/growth-corridors-pillar-2026";
import {
  PROJECT_ARTICLE_TAG_SLUG,
  PROJECT_FEATURED_ARTICLE_SLUGS,
} from "@/lib/content/project-related-articles";
import { ID_TOWN_SLUG } from "@/lib/content/id-town-landing";
import { DTA_HAPPY_HOME_SLUG } from "@/lib/content/dta-happy-home-landing";
import { HGX_PROJECT_SLUG } from "@/lib/preview/ho-guom-xanh-mock";
import { getDemoArticleBySlug } from "@/lib/preview/demo-articles";

const ID_TOWN_ARTICLE = "id-town-long-thanh-ha-tang-san-bay-metro-2026";
const HGX_ARTICLE = "ho-guom-xanh-metro-so-2-ql13-tod-2026";
const NHON_TRACH_ARTICLE = "nhon-trach-cu-tang-truong-ha-tang-tod-2026";
const LAI_THIEU_QL13_SLUGS = [
  "lai-thieu-quy-hoach-2040-phuong-trung-tam-metro-2026",
  "can-ho-lai-thieu-quoc-lo-13-du-an-noi-bat-2026",
  "mua-can-ho-lai-thieu-o-thuc-hay-dau-tu-cho-thue-2026",
  "can-ho-lai-thieu-sap-mo-ban-emerald-boulevard-hgx-2026",
] as const;

describe("growth corridors SoR (6 axes)", () => {
  it("registers 6 geographic axes plus framework", () => {
    assert.equal(GROWTH_CORRIDOR_AXIS_IDS.length, 6);
    assert.equal(GROWTH_CORRIDORS.length, 7);
    assert.ok(GROWTH_CORRIDORS.some((c) => c.id === "framework"));
    assert.ok(!GROWTH_CORRIDORS.some((c) => c.id === ("thu-thiem-core" as never)));
    assert.ok(
      !GROWTH_CORRIDORS.some((c) => c.id === ("south-phu-my-hung" as never)),
    );
  });

  it("funnel plan has exactly 18 slots covering all axes × stages", () => {
    assert.equal(GROWTH_CORRIDOR_ARTICLE_PLAN.length, 18);
    assert.doesNotThrow(() => assertFunnelPlanComplete());
  });

  it("ID Town is airport corridor, never QL13 or east-coast primary", () => {
    assert.equal(getProjectCorridor(ID_TOWN_SLUG), "airport-long-thanh");
    assert.equal(getArticleCorridor(ID_TOWN_ARTICLE), "airport-long-thanh");
    assert.notEqual(PROJECT_GROWTH_CORRIDOR[ID_TOWN_SLUG], "ql13-northeast");
    assert.notEqual(PROJECT_GROWTH_CORRIDOR[ID_TOWN_SLUG], "east-coast-brvt");
  });

  it("HGX is QL13 corridor, never airport", () => {
    assert.equal(getProjectCorridor(HGX_PROJECT_SLUG), "ql13-northeast");
    assert.equal(getArticleCorridor(HGX_ARTICLE), "ql13-northeast");
    assert.notEqual(
      PROJECT_GROWTH_CORRIDOR[HGX_PROJECT_SLUG],
      "airport-long-thanh",
    );
  });

  it("DTA is east-coast primary, not airport and not QL13", () => {
    assert.equal(getProjectCorridor(DTA_HAPPY_HOME_SLUG), "east-coast-brvt");
    assert.equal(getArticleCorridor(NHON_TRACH_ARTICLE), "east-coast-brvt");
    assert.notEqual(
      PROJECT_GROWTH_CORRIDOR[DTA_HAPPY_HOME_SLUG],
      "airport-long-thanh",
    );
    assert.notEqual(
      PROJECT_GROWTH_CORRIDOR[DTA_HAPPY_HOME_SLUG],
      "ql13-northeast",
    );
  });

  it("pillar is framework and published in demo", () => {
    assert.equal(
      getArticleCorridor(GROWTH_CORRIDORS_PILLAR_SLUG),
      "framework",
    );
    assert.equal(GROWTH_CORRIDORS_PILLAR_ARTICLES_2026.length, 1);
    assert.ok(getDemoArticleBySlug(GROWTH_CORRIDORS_PILLAR_SLUG));
    assert.match(
      GROWTH_CORRIDORS_PILLAR_ARTICLES_2026[0]!.title,
      /Sáu trục|6 trục/i,
    );
  });

  it("ID Town / Lái Thiêu / HGX tags stay off shared ha-tang hub", () => {
    for (const a of ID_TOWN_INFRA_ARTICLES_2026) {
      assert.ok(a.tags.some((t) => t.slug === NOXH_TAG_AIRPORT.slug));
      assert.ok(!a.tags.some((t) => t.slug === NOXH_TAG_HA_TANG.slug));
      assert.ok(!a.tags.some((t) => t.slug === NOXH_TAG_QL13.slug));
    }
    for (const a of HGX_INFRA_ARTICLES_2026) {
      assert.ok(a.tags.some((t) => t.slug === NOXH_TAG_QL13.slug));
      assert.ok(!a.tags.some((t) => t.slug === NOXH_TAG_HA_TANG.slug));
      assert.ok(!a.tags.some((t) => t.slug === NOXH_TAG_AIRPORT.slug));
    }
    for (const a of LAI_THIEU_AREA_ARTICLES_2026) {
      assert.ok(a.tags.some((t) => t.slug === NOXH_TAG_QL13.slug));
      assert.ok(!a.tags.some((t) => t.slug === NOXH_TAG_HA_TANG.slug));
      assert.ok(!a.tags.some((t) => t.slug === NOXH_TAG_AIRPORT.slug));
    }
  });

  it("Lái Thiêu series is QL13-only — no id-town project link as same axis", () => {
    for (const slug of LAI_THIEU_QL13_SLUGS) {
      assert.equal(getArticleCorridor(slug), "ql13-northeast");
    }
    for (const a of LAI_THIEU_AREA_ARTICLES_2026) {
      assert.ok(!a.projects.some((p) => p.slug === ID_TOWN_SLUG));
      assert.doesNotMatch(a.body, /\/du-an\/id-town-long-thanh/);
      assert.doesNotMatch(a.body, /id-town-long-thanh-ha-tang/);
    }
  });

  it("project featured and tag hubs keep airport vs east-coast vs QL13 split", () => {
    assert.equal(
      PROJECT_ARTICLE_TAG_SLUG[ID_TOWN_SLUG],
      NOXH_TAG_AIRPORT.slug,
    );
    assert.equal(
      PROJECT_ARTICLE_TAG_SLUG[DTA_HAPPY_HOME_SLUG],
      NOXH_TAG_EAST_COAST.slug,
    );
    assert.equal(
      PROJECT_ARTICLE_TAG_SLUG[HGX_PROJECT_SLUG],
      NOXH_TAG_QL13.slug,
    );

    const idTownFeatured = PROJECT_FEATURED_ARTICLE_SLUGS[ID_TOWN_SLUG] ?? [];
    const hgxFeatured = PROJECT_FEATURED_ARTICLE_SLUGS[HGX_PROJECT_SLUG] ?? [];
    const dtaFeatured = PROJECT_FEATURED_ARTICLE_SLUGS[DTA_HAPPY_HOME_SLUG] ?? [];

    assert.ok(idTownFeatured.includes(ID_TOWN_ARTICLE));
    assert.ok(idTownFeatured.includes(GROWTH_CORRIDORS_PILLAR_SLUG));
    assert.ok(!idTownFeatured.includes(HGX_ARTICLE));
    for (const slug of LAI_THIEU_QL13_SLUGS) {
      assert.ok(!idTownFeatured.includes(slug), `ID Town featured has ${slug}`);
    }

    assert.ok(hgxFeatured.includes(HGX_ARTICLE));
    assert.ok(hgxFeatured.includes(GROWTH_CORRIDORS_PILLAR_SLUG));
    assert.ok(!hgxFeatured.includes(ID_TOWN_ARTICLE));

    assert.ok(dtaFeatured.includes(NHON_TRACH_ARTICLE));
    assert.ok(dtaFeatured.includes(GROWTH_CORRIDORS_PILLAR_SLUG));
    assert.ok(!dtaFeatured.includes(HGX_ARTICLE));
  });

  it("all 18 funnel slots are published and resolve in demo", () => {
    assert.equal(
      GROWTH_CORRIDOR_ARTICLE_PLAN.filter((s) => s.status === "published")
        .length,
      18,
    );
    for (const slot of GROWTH_CORRIDOR_ARTICLE_PLAN) {
      const slug = slot.publishedSlug ?? slot.slug;
      assert.ok(getDemoArticleBySlug(slug), `missing demo ${slug}`);
      assert.equal(
        ARTICLE_GROWTH_CORRIDOR[slug],
        slot.corridorId,
        `${slug} corridor mismatch`,
      );
    }
  });
});
