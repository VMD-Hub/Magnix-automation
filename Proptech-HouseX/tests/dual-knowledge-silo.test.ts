import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canonicalArticlePath,
  knowledgeArticlePath,
  RE_KNOWLEDGE_PATH,
  topicPath,
  articlePath,
} from "@/lib/content/article-routes";
import {
  isGeneralReKnowledgeArticle,
  isNoxhHandbookArticle,
  NOXH_TAG_BTR,
  NOXH_TAG_DU_AN_GIA,
  NOXH_TAG_HA_TANG,
} from "@/lib/content/articles/noxh-handbook-tags";
import { BTR_HUB_PATH } from "@/lib/content/long-term-rental-btr";
import { BTR_POLICY_SERIES_2026 } from "@/lib/content/articles/btr-policy-series-2026";
import { LTK_FUNNEL_SERIES_2026 } from "@/lib/content/articles/ltk-funnel-series-2026";
import { getDemoArticleBySlug } from "@/lib/preview/demo-articles";

describe("dual knowledge silo", () => {
  it("BTR articles are knowledge, not Wiki NOXH handbook", () => {
    for (const a of BTR_POLICY_SERIES_2026) {
      assert.ok(isGeneralReKnowledgeArticle(a), a.slug);
      assert.ok(!isNoxhHandbookArticle(a), a.slug);
      assert.equal(canonicalArticlePath(a), knowledgeArticlePath(a.slug));
      assert.ok(a.body.includes(RE_KNOWLEDGE_PATH) || a.body.includes("/du-an/"));
    }
    assert.equal(BTR_HUB_PATH, topicPath(NOXH_TAG_BTR.slug));
    assert.ok(BTR_HUB_PATH.startsWith(RE_KNOWLEDGE_PATH));
  });

  it("LTK funnel stays on Wiki NOXH", () => {
    for (const a of LTK_FUNNEL_SERIES_2026) {
      assert.ok(isNoxhHandbookArticle(a), a.slug);
      assert.ok(!isGeneralReKnowledgeArticle(a), a.slug);
      assert.equal(canonicalArticlePath(a), articlePath(a.slug));
    }
  });

  it("topicPath branches by tag set", () => {
    assert.equal(
      topicPath(NOXH_TAG_DU_AN_GIA.slug),
      `/wiki-nha-o-xa-hoi/chu-de/${NOXH_TAG_DU_AN_GIA.slug}`,
    );
    assert.equal(
      topicPath(NOXH_TAG_HA_TANG.slug),
      `${RE_KNOWLEDGE_PATH}/chu-de/${NOXH_TAG_HA_TANG.slug}`,
    );
    assert.equal(
      topicPath(NOXH_TAG_BTR.slug),
      `${RE_KNOWLEDGE_PATH}/chu-de/${NOXH_TAG_BTR.slug}`,
    );
  });

  it("demo catalog resolves BTR under knowledge path helper", () => {
    const a = getDemoArticleBySlug(
      "chinh-sach-nha-o-cho-thue-dai-han-tru-cot-an-cu-2030",
    );
    assert.ok(a);
    assert.equal(
      canonicalArticlePath(a!),
      `${RE_KNOWLEDGE_PATH}/chinh-sach-nha-o-cho-thue-dai-han-tru-cot-an-cu-2030`,
    );
  });
});
