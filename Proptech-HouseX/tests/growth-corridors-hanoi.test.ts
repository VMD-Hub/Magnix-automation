import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getHanoiArticleCorridor,
  HANOI_ARTICLE_GROWTH_CORRIDOR,
  HANOI_GROWTH_CORRIDOR_AXIS_IDS,
  HANOI_GROWTH_CORRIDORS,
  HANOI_GROWTH_CORRIDORS_PILLAR_SLUG,
} from "@/lib/content/growth-corridors-hanoi";
import {
  assertHanoiFunnelPlanComplete,
  HANOI_GROWTH_CORRIDOR_ARTICLE_PLAN,
} from "@/lib/content/growth-corridor-funnel-hanoi";
import {
  NOXH_TAG_AIRPORT,
  NOXH_TAG_HA_TANG,
  NOXH_TAG_HN_AIRPORT,
  NOXH_TAG_HN_EAST,
  NOXH_TAG_HN_RING4,
  NOXH_TAG_HN_SOUTHWEST,
  NOXH_TAG_HN_WEST,
  NOXH_TAG_QL13,
} from "@/lib/content/articles/noxh-handbook-tags";
import { assertEditorialBodyQuality } from "@/lib/content/articles/article-editorial-voice";
import { assertNorthernEditorialBody } from "@/lib/content/articles/northern-editorial-voice";
import { HANOI_GROWTH_CORRIDORS_PILLAR_ARTICLES_2026 } from "@/lib/content/articles/hanoi-growth-corridors-pillar-2026";
import { HANOI_EAST_CORRIDOR_ARTICLES_2026 } from "@/lib/content/articles/hanoi-east-corridor-series-2026";
import { HANOI_AIRPORT_CORRIDOR_ARTICLES_2026 } from "@/lib/content/articles/hanoi-airport-corridor-series-2026";
import { HANOI_RING4_CORRIDOR_ARTICLES_2026 } from "@/lib/content/articles/hanoi-ring4-corridor-series-2026";
import { HANOI_WEST_CORRIDOR_ARTICLES_2026 } from "@/lib/content/articles/hanoi-west-corridor-series-2026";
import { HANOI_SOUTHWEST_CORRIDOR_ARTICLES_2026 } from "@/lib/content/articles/hanoi-southwest-corridor-series-2026";
import { GROWTH_CORRIDORS_PILLAR_SLUG } from "@/lib/content/growth-corridors";
import { getDemoArticleBySlug } from "@/lib/preview/demo-articles";

const HANOI_SERIES = [
  ...HANOI_GROWTH_CORRIDORS_PILLAR_ARTICLES_2026,
  ...HANOI_EAST_CORRIDOR_ARTICLES_2026,
  ...HANOI_AIRPORT_CORRIDOR_ARTICLES_2026,
  ...HANOI_RING4_CORRIDOR_ARTICLES_2026,
  ...HANOI_WEST_CORRIDOR_ARTICLES_2026,
  ...HANOI_SOUTHWEST_CORRIDOR_ARTICLES_2026,
];

const AXIS_TAG: Record<string, string> = {
  "hn-east-southeast": NOXH_TAG_HN_EAST.slug,
  "hn-airport-north": NOXH_TAG_HN_AIRPORT.slug,
  "hn-ring-road-4": NOXH_TAG_HN_RING4.slug,
  "hn-west-thang-long": NOXH_TAG_HN_WEST.slug,
  "hn-southwest-ha-nam": NOXH_TAG_HN_SOUTHWEST.slug,
};

describe("Hanoi growth corridors SoR (5 axes)", () => {
  it("registers 5 geographic axes plus framework", () => {
    assert.equal(HANOI_GROWTH_CORRIDOR_AXIS_IDS.length, 5);
    assert.equal(HANOI_GROWTH_CORRIDORS.length, 6);
    assert.ok(HANOI_GROWTH_CORRIDORS.some((c) => c.id === "hn-framework"));
    assert.ok(
      !HANOI_GROWTH_CORRIDORS.some((c) => c.id === ("airport-long-thanh" as never)),
    );
    assert.ok(
      !HANOI_GROWTH_CORRIDORS.some((c) => c.id === ("ql13-northeast" as never)),
    );
  });

  it("funnel plan has exactly 15 slots covering all axes × stages", () => {
    assert.equal(HANOI_GROWTH_CORRIDOR_ARTICLE_PLAN.length, 15);
    assert.doesNotThrow(() => assertHanoiFunnelPlanComplete());
  });

  it("pillar is framework and published in demo — distinct from HCMC pillar", () => {
    assert.equal(
      getHanoiArticleCorridor(HANOI_GROWTH_CORRIDORS_PILLAR_SLUG),
      "hn-framework",
    );
    assert.notEqual(
      HANOI_GROWTH_CORRIDORS_PILLAR_SLUG,
      GROWTH_CORRIDORS_PILLAR_SLUG,
    );
    assert.equal(HANOI_GROWTH_CORRIDORS_PILLAR_ARTICLES_2026.length, 1);
    assert.ok(getDemoArticleBySlug(HANOI_GROWTH_CORRIDORS_PILLAR_SLUG));
    assert.match(
      HANOI_GROWTH_CORRIDORS_PILLAR_ARTICLES_2026[0]!.title,
      /Năm trục|5 trục/i,
    );
    assert.ok(
      HANOI_GROWTH_CORRIDORS_PILLAR_ARTICLES_2026[0]!.tags.some(
        (t) => t.slug === NOXH_TAG_HA_TANG.slug,
      ),
    );
  });

  it("axis articles use dedicated HN tags — not HCMC airport/QL13 hubs", () => {
    for (const a of HANOI_EAST_CORRIDOR_ARTICLES_2026) {
      assert.ok(a.tags.some((t) => t.slug === NOXH_TAG_HN_EAST.slug));
      assert.ok(!a.tags.some((t) => t.slug === NOXH_TAG_AIRPORT.slug));
      assert.ok(!a.tags.some((t) => t.slug === NOXH_TAG_QL13.slug));
    }
    for (const a of HANOI_AIRPORT_CORRIDOR_ARTICLES_2026) {
      assert.ok(a.tags.some((t) => t.slug === NOXH_TAG_HN_AIRPORT.slug));
      assert.ok(!a.tags.some((t) => t.slug === NOXH_TAG_AIRPORT.slug));
    }
    for (const a of HANOI_RING4_CORRIDOR_ARTICLES_2026) {
      assert.ok(a.tags.some((t) => t.slug === NOXH_TAG_HN_RING4.slug));
    }
    for (const a of HANOI_WEST_CORRIDOR_ARTICLES_2026) {
      assert.ok(a.tags.some((t) => t.slug === NOXH_TAG_HN_WEST.slug));
    }
    for (const a of HANOI_SOUTHWEST_CORRIDOR_ARTICLES_2026) {
      assert.ok(a.tags.some((t) => t.slug === NOXH_TAG_HN_SOUTHWEST.slug));
    }
  });

  it("all 15 funnel slots are published, resolve in demo, and match SoR map", () => {
    assert.equal(
      HANOI_GROWTH_CORRIDOR_ARTICLE_PLAN.filter((s) => s.status === "published")
        .length,
      15,
    );
    for (const slot of HANOI_GROWTH_CORRIDOR_ARTICLE_PLAN) {
      const slug = slot.publishedSlug ?? slot.slug;
      assert.ok(getDemoArticleBySlug(slug), `missing demo ${slug}`);
      assert.equal(
        HANOI_ARTICLE_GROWTH_CORRIDOR[slug],
        slot.corridorId,
        `${slug} corridor mismatch`,
      );
      const article = getDemoArticleBySlug(slug)!;
      const expectedTag = AXIS_TAG[slot.corridorId];
      assert.ok(
        article.tags.some((t) => t.slug === expectedTag),
        `${slug} missing tag ${expectedTag}`,
      );
    }
  });

  it("Hanoi series pass editorial QA and northern voice", () => {
    assert.equal(HANOI_SERIES.length, 16);
    for (const a of HANOI_SERIES) {
      assertEditorialBodyQuality(a.body, a.slug);
      assertNorthernEditorialBody(a.body, a.slug);
      assert.match(a.body, /\/lien-he/);
    }
  });
});
