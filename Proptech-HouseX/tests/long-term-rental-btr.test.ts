import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BTR_ARTICLE_META,
  BTR_PILLAR_SLUG,
  getBtrArticleMeta,
} from "@/lib/content/long-term-rental-btr";
import {
  assertBtrFunnelPlanComplete,
  BTR_ARTICLE_PLAN,
} from "@/lib/content/long-term-rental-funnel";
import {
  NOXH_TAG_BTR,
  NOXH_TAG_CHINH_SACH,
} from "@/lib/content/articles/noxh-handbook-tags";
import { assertEditorialBodyQuality } from "@/lib/content/articles/article-editorial-voice";
import { assertBtrEditorialBody } from "@/lib/content/articles/long-term-rental-editorial-voice";
import { BTR_POLICY_SERIES_2026 } from "@/lib/content/articles/btr-policy-series-2026";
import { BTR_MINDSET_SERIES_2026 } from "@/lib/content/articles/btr-mindset-series-2026";
import { BTR_CORRIDOR_SERIES_2026 } from "@/lib/content/articles/btr-corridor-series-2026";
import { BTR_CASHFLOW_SERIES_2026 } from "@/lib/content/articles/btr-cashflow-series-2026";
import { getDemoArticleBySlug } from "@/lib/preview/demo-articles";

const BTR_SERIES = [
  ...BTR_POLICY_SERIES_2026,
  ...BTR_MINDSET_SERIES_2026,
  ...BTR_CORRIDOR_SERIES_2026,
  ...BTR_CASHFLOW_SERIES_2026,
];

describe("long-term rental BTR silo", () => {
  it("funnel has 12 published slots matching SoR meta", () => {
    assert.equal(BTR_ARTICLE_PLAN.length, 12);
    assert.doesNotThrow(() => assertBtrFunnelPlanComplete());
    assert.equal(
      BTR_ARTICLE_PLAN.filter((s) => s.status === "published").length,
      12,
    );
    for (const slot of BTR_ARTICLE_PLAN) {
      const slug = slot.publishedSlug ?? slot.slug;
      assert.ok(getDemoArticleBySlug(slug), `missing demo ${slug}`);
      assert.equal(getBtrArticleMeta(slug)?.toneGroup, slot.toneGroup);
    }
  });

  it("pillar is policy article and not NOXH chinh-sach hub tag", () => {
    assert.ok(BTR_ARTICLE_META[BTR_PILLAR_SLUG]?.isPillar);
    const pillar = getDemoArticleBySlug(BTR_PILLAR_SLUG);
    assert.ok(pillar);
    assert.ok(pillar!.tags.some((t) => t.slug === NOXH_TAG_BTR.slug));
    assert.ok(!pillar!.tags.some((t) => t.slug === NOXH_TAG_CHINH_SACH.slug));
    assert.match(pillar!.title, /cho thuê dài hạn|trụ cột/i);
  });

  it("all BTR articles use BTR tag only as primary hub and pass voice QA", () => {
    assert.equal(BTR_SERIES.length, 12);
    for (const a of BTR_SERIES) {
      assert.ok(a.tags.some((t) => t.slug === NOXH_TAG_BTR.slug));
      assert.ok(!a.tags.some((t) => t.slug === NOXH_TAG_CHINH_SACH.slug));
      assertEditorialBodyQuality(a.body, a.slug);
      assertBtrEditorialBody(a.body, a.slug);
      assert.match(a.body, /\/lien-he/);
      if (a.slug !== BTR_PILLAR_SLUG) {
        assert.match(a.body, /chinh-sach-nha-o-cho-thue-dai-han-tru-cot-an-cu-2030/);
      }
    }
  });

  it("comparison and cashflow articles include tables", () => {
    const compare = BTR_MINDSET_SERIES_2026.find(
      (a) => a.slug === "thue-can-ho-dai-han-vs-chung-cu-mini-phong-tro-2026",
    );
    const cashflow = BTR_CASHFLOW_SERIES_2026.find(
      (a) => a.slug === "tinh-dong-tien-don-bay-can-ho-cho-thue-2026",
    );
    assert.ok(compare);
    assert.ok(cashflow);
    assert.match(compare!.body, /\| Tiêu chí \|/);
    assert.match(cashflow!.body, /\| Hạng mục \|/);
    assert.match(cashflow!.body, /\/tinh-tra-gop/);
  });
});
