import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  NOXH_LEGAL_SOURCES,
  getNoxhEditorialTrust,
  resolveExpertForTags,
  resolveSourcesForTags,
} from "@/lib/content/editorial-trust";
import { buildArticleJsonLd } from "@/lib/seo/article-json-ld";
import type { ArticleDetail } from "@/lib/data/article-types";

const NOXH_ARTICLE_STUB: ArticleDetail = {
  id: "test-1",
  slug: "dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat",
  title: "Điều kiện mua NOXH 2026",
  excerpt: "Tóm tắt điều kiện theo Luật Nhà ở 2023",
  coverImageUrl: null,
  authorName: null,
  publishedAt: new Date("2026-03-01"),
  updatedAt: new Date("2026-04-07"),
  tags: [{ slug: "noxh", name: "NOXH" }],
  projects: [],
  body: "Nội dung thử nghiệm",
  seoTitle: null,
  seoDesc: null,
  status: "PUBLISHED",
};

describe("editorial trust resolvers", () => {
  it("assigns NOXH expert and sources for noxh tag", () => {
    const expert = resolveExpertForTags(["noxh"]);
    assert.ok(expert);
    assert.equal(expert?.name, "Nguyễn Vũ");
    assert.equal(expert?.jobTitle, "Biên tập viên / Luật sư / Chuyên gia Nhà Ở Xã Hội");

    const sources = resolveSourcesForTags(["noxh"]);
    assert.ok(sources.length >= NOXH_LEGAL_SOURCES.length);
    assert.ok(sources.some((s) => s.id === "luat-nha-o-2023"));
  });

  it("returns empty trust signals for unrelated tags", () => {
    assert.equal(resolveExpertForTags(["mua-ban"]), null);
    assert.deepEqual(resolveSourcesForTags(["mua-ban"]), []);
  });

  it("getNoxhEditorialTrust bundles expert, sources and rules date", () => {
    const trust = getNoxhEditorialTrust();
    assert.equal(trust.expert?.name, "Nguyễn Vũ");
    assert.ok(trust.sources.length >= NOXH_LEGAL_SOURCES.length);
    assert.equal(trust.updatedAt.toISOString().slice(0, 10), "2026-04-07");
  });

  it("buildArticleJsonLd includes Person author and isBasedOn for NOXH", () => {
    const expert = resolveExpertForTags(["noxh"]);
    const sources = resolveSourcesForTags(["noxh"]);
    const jsonLd = buildArticleJsonLd(NOXH_ARTICLE_STUB, { expert, sources });

    assert.equal(jsonLd.author["@type"], "Person");
    assert.equal(jsonLd.author.name, expert?.name);
    assert.ok(jsonLd.author.url?.includes("/chuyen-gia/noxh-policy"));

    assert.ok(Array.isArray(jsonLd.isBasedOn));
    assert.ok(jsonLd.isBasedOn!.length > 0);
    assert.equal(jsonLd.isBasedOn![0]!["@type"], "Legislation");
    assert.ok(jsonLd.isBasedOn!.some((s) => s.name === "Luật Nhà ở 2023"));
  });
});
