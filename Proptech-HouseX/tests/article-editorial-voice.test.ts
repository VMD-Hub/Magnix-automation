import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertEditorialBodyQuality,
  EDITORIAL_BANNED_BODY_PATTERNS,
} from "@/lib/content/articles/article-editorial-voice";
import { NOXH_HANDBOOK_JOURNEY_ARTICLES_2026 } from "@/lib/content/articles/noxh-handbook-journey-2026";
import { NOXH_KNOWLEDGE_ARTICLES_2026 } from "@/lib/content/articles/noxh-knowledge-series-2026";
import { NOXH_TREND_ARTICLES_2026 } from "@/lib/content/articles/noxh-trend-series-2026";
import { TOD_NHON_TRACH_ARTICLES_2026 } from "@/lib/content/articles/tod-nhon-trach-series-2026";
import { ID_TOWN_INFRA_ARTICLES_2026 } from "@/lib/content/articles/id-town-infra-series-2026";
import { HGX_INFRA_ARTICLES_2026 } from "@/lib/content/articles/ho-guom-xanh-infra-series-2026";
import { LAI_THIEU_AREA_ARTICLES_2026 } from "@/lib/content/articles/lai-thieu-area-series-2026";
import { GROWTH_CORRIDORS_PILLAR_ARTICLES_2026 } from "@/lib/content/articles/growth-corridors-pillar-2026";
import { NORTH_SOUTH_CORRIDOR_ARTICLES_2026 } from "@/lib/content/articles/north-south-corridor-series-2026";
import { EAST_WEST_CORRIDOR_ARTICLES_2026 } from "@/lib/content/articles/east-west-corridor-series-2026";
import { EAST_COAST_CORRIDOR_ARTICLES_2026 } from "@/lib/content/articles/east-coast-corridor-series-2026";
import { RING_ROAD_CORRIDOR_ARTICLES_2026 } from "@/lib/content/articles/ring-road-corridor-series-2026";
import { AIRPORT_CORRIDOR_POTENTIAL_ARTICLES_2026 } from "@/lib/content/articles/airport-corridor-potential-2026";
import { HANOI_GROWTH_CORRIDORS_PILLAR_ARTICLES_2026 } from "@/lib/content/articles/hanoi-growth-corridors-pillar-2026";
import { HANOI_EAST_CORRIDOR_ARTICLES_2026 } from "@/lib/content/articles/hanoi-east-corridor-series-2026";
import { HANOI_AIRPORT_CORRIDOR_ARTICLES_2026 } from "@/lib/content/articles/hanoi-airport-corridor-series-2026";
import { HANOI_RING4_CORRIDOR_ARTICLES_2026 } from "@/lib/content/articles/hanoi-ring4-corridor-series-2026";
import { HANOI_WEST_CORRIDOR_ARTICLES_2026 } from "@/lib/content/articles/hanoi-west-corridor-series-2026";
import { HANOI_SOUTHWEST_CORRIDOR_ARTICLES_2026 } from "@/lib/content/articles/hanoi-southwest-corridor-series-2026";
import { BTR_POLICY_SERIES_2026 } from "@/lib/content/articles/btr-policy-series-2026";
import { BTR_MINDSET_SERIES_2026 } from "@/lib/content/articles/btr-mindset-series-2026";
import { BTR_CORRIDOR_SERIES_2026 } from "@/lib/content/articles/btr-corridor-series-2026";
import { BTR_CASHFLOW_SERIES_2026 } from "@/lib/content/articles/btr-cashflow-series-2026";
import { LTK_FUNNEL_SERIES_2026 } from "@/lib/content/articles/ltk-funnel-series-2026";
import { getDemoArticleBySlug } from "@/lib/preview/demo-articles";

const EDITORIAL_SERIES = [
  ...NOXH_TREND_ARTICLES_2026,
  ...NOXH_KNOWLEDGE_ARTICLES_2026,
  ...NOXH_HANDBOOK_JOURNEY_ARTICLES_2026,
  ...TOD_NHON_TRACH_ARTICLES_2026,
  ...ID_TOWN_INFRA_ARTICLES_2026,
  ...HGX_INFRA_ARTICLES_2026,
  ...LAI_THIEU_AREA_ARTICLES_2026,
  ...GROWTH_CORRIDORS_PILLAR_ARTICLES_2026,
  ...NORTH_SOUTH_CORRIDOR_ARTICLES_2026,
  ...EAST_WEST_CORRIDOR_ARTICLES_2026,
  ...EAST_COAST_CORRIDOR_ARTICLES_2026,
  ...RING_ROAD_CORRIDOR_ARTICLES_2026,
  ...AIRPORT_CORRIDOR_POTENTIAL_ARTICLES_2026,
  ...HANOI_GROWTH_CORRIDORS_PILLAR_ARTICLES_2026,
  ...HANOI_EAST_CORRIDOR_ARTICLES_2026,
  ...HANOI_AIRPORT_CORRIDOR_ARTICLES_2026,
  ...HANOI_RING4_CORRIDOR_ARTICLES_2026,
  ...HANOI_WEST_CORRIDOR_ARTICLES_2026,
  ...HANOI_SOUTHWEST_CORRIDOR_ARTICLES_2026,
  ...BTR_POLICY_SERIES_2026,
  ...BTR_MINDSET_SERIES_2026,
  ...BTR_CORRIDOR_SERIES_2026,
  ...BTR_CASHFLOW_SERIES_2026,
  ...LTK_FUNNEL_SERIES_2026,
];

const LEGACY_DEMO_SLUGS = [
  "tien-do-noxh-kdc-chang-song-phuoc-tan-2026",
  "dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat",
];

describe("article editorial voice", () => {
  it("all demo catalog articles pass editorial voice QA", () => {
    const slugs = [
      ...EDITORIAL_SERIES.map((a) => a.slug),
      ...LEGACY_DEMO_SLUGS,
    ];
    for (const slug of slugs) {
      const article = getDemoArticleBySlug(slug);
      assert.ok(article, `missing demo article ${slug}`);
      assertEditorialBodyQuality(article!.body, slug);
    }
  });

  it("TOD and NOXH series avoid raw ** and writer prompt headings", () => {
    for (const article of EDITORIAL_SERIES) {
      assertEditorialBodyQuality(article.body, article.slug);
    }
  });

  it("DTA closings mention project link without meta CTA headings", () => {
    const withDta = EDITORIAL_SERIES.filter((a) =>
      a.body.includes("/du-an/dta-happy-home-nhon-trach"),
    );
    assert.ok(withDta.length >= 6);
    for (const article of withDta) {
      for (const pattern of EDITORIAL_BANNED_BODY_PATTERNS) {
        assert.equal(
          pattern.test(article.body),
          false,
          `${article.slug} matches ${pattern}`,
        );
      }
    }
  });
});
