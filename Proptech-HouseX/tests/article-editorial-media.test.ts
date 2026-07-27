import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ARTICLE_EDITORIAL_COVERS,
  applyEditorialMedia,
  editorialFigure,
} from "@/lib/content/articles/article-editorial-media";
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
import { getDemoArticleBySlug } from "@/lib/preview/demo-articles";

const CORRIDOR_SERIES_2026 = [
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
];

describe("article editorial media standards", () => {
  it("every editorial slug has cover url, alt and caption", () => {
    const slugs = [
      ...NOXH_TREND_ARTICLES_2026.map((a) => a.slug),
      ...TOD_NHON_TRACH_ARTICLES_2026.map((a) => a.slug),
      ...ID_TOWN_INFRA_ARTICLES_2026.map((a) => a.slug),
      ...HGX_INFRA_ARTICLES_2026.map((a) => a.slug),
      ...LAI_THIEU_AREA_ARTICLES_2026.map((a) => a.slug),
      ...GROWTH_CORRIDORS_PILLAR_ARTICLES_2026.map((a) => a.slug),
      ...CORRIDOR_SERIES_2026.map((a) => a.slug),
      "gia-nha-o-xa-hoi-ly-thuong-kiet-cong-bo-6-2026",
      "tien-do-noxh-kdc-chang-song-phuoc-tan-2026",
      "dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat",
    ];
    for (const slug of slugs) {
      const cover = ARTICLE_EDITORIAL_COVERS[slug];
      assert.ok(cover, `missing cover pack for ${slug}`);
      assert.ok(cover.url.length > 0);
      assert.ok(cover.alt.length > 10);
      assert.ok(cover.caption.length > 10);
    }
  });

  it("editorial articles include inline figure markdown", () => {
    for (const a of [
      ...NOXH_TREND_ARTICLES_2026,
      ...TOD_NHON_TRACH_ARTICLES_2026,
      ...ID_TOWN_INFRA_ARTICLES_2026,
      ...HGX_INFRA_ARTICLES_2026,
      ...LAI_THIEU_AREA_ARTICLES_2026,
      ...GROWTH_CORRIDORS_PILLAR_ARTICLES_2026,
      ...CORRIDOR_SERIES_2026,
    ]) {
      assert.match(a.body, /!\[[^\]]+\]\([^)]+\)/, `${a.slug} missing inline image`);
      assert.match(a.body, /\*Ảnh:/, `${a.slug} missing figure caption`);
    }
  });

  it("applyEditorialMedia sets cover metadata on fetch", () => {
    const raw = NOXH_TREND_ARTICLES_2026[0]!;
    const enriched = applyEditorialMedia(raw);
    assert.ok(enriched.coverImageUrl);
    assert.ok(enriched.coverImageAlt);
    assert.ok(enriched.coverImageCaption);
  });

  it("demo article without raw cover gets cover from registry", () => {
    const a = getDemoArticleBySlug("dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat");
    assert.ok(a?.coverImageUrl);
    assert.ok(a?.coverImageAlt);
  });

  it("editorialFigure emits caption line", () => {
    const md = editorialFigure({
      url: "/images/hero/test.jpg",
      alt: "Test",
      caption: "Minh họa thử nghiệm",
      source: "HouseX",
    });
    assert.match(md, /!\[Test\]/);
    assert.match(md, /\*Ảnh: Minh họa thử nghiệm — Nguồn: HouseX\*/);
  });
});
