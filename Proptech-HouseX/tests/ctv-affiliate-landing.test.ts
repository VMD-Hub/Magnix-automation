import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertEditorialBodyQuality } from "@/lib/content/articles/article-editorial-voice";
import {
  CTV_AFFILIATE_ARTICLES,
  CTV_AFFILIATE_ARTICLE_SLUGS,
  ctvAffiliateArticlePath,
  listCtvAffiliateArticleCards,
} from "@/lib/content/ctv-affiliate-articles";
import {
  CTV_AFFILIATE_CTAS,
  CTV_AFFILIATE_LEAD,
  CTV_AFFILIATE_PATH,
  CTV_AFFILIATE_PERSONAS,
  CTV_AFFILIATE_RULES,
  CTV_AFFILIATE_SEO_DESCRIPTION,
  CTV_AFFILIATE_SEO_TITLE,
} from "@/lib/content/ctv-affiliate-landing";
import { PARTNERSHIPS_PAGE } from "@/lib/content/partnerships-page-content";
import { ABOUT_PARTNER_SECTION } from "@/lib/content/messaging/about-public";
import { NAV_MORE } from "@/lib/content/site-nav";

const FORBIDDEN_PUBLIC =
  /cấp\s*[1-4]|cap\s*[1-4]|15[.\s]?000[.\s]?000|15000000|Build-to-Share|đại dương xanh|công khai\s*(cơ chế|hoa hồng)?\s*100%|Affiliate NOXH thế hệ mới|loại bỏ hoàn toàn/i;

function allPublicBlob(): string {
  const landing = [
    CTV_AFFILIATE_SEO_TITLE,
    CTV_AFFILIATE_SEO_DESCRIPTION,
    CTV_AFFILIATE_LEAD,
    ...CTV_AFFILIATE_PERSONAS.map((p) => `${p.role} ${p.pain} ${p.onHouseX}`),
    ...CTV_AFFILIATE_RULES.steps.map((s) => `${s.title} ${s.desc}`),
    CTV_AFFILIATE_RULES.note,
    CTV_AFFILIATE_CTAS.closing,
  ].join("\n");
  const articles = CTV_AFFILIATE_ARTICLES.map(
    (a) => `${a.title}\n${a.excerpt}\n${a.seoDesc}\n${a.body}`,
  ).join("\n");
  return `${landing}\n${articles}`;
}

describe("CTV affiliate landing (phase 1+SEO hub)", () => {
  it("uses public path and indexable SEO bounds", () => {
    assert.equal(CTV_AFFILIATE_PATH, "/affiliate-bat-dong-san");
    assert.ok(CTV_AFFILIATE_SEO_DESCRIPTION.length >= 70);
    assert.ok(CTV_AFFILIATE_SEO_DESCRIPTION.length <= 160);
  });

  it("ships exactly four SEO articles under hub path", () => {
    assert.equal(CTV_AFFILIATE_ARTICLE_SLUGS.length, 4);
    assert.equal(CTV_AFFILIATE_ARTICLES.length, 4);
    assert.equal(listCtvAffiliateArticleCards().length, 4);
    for (const a of CTV_AFFILIATE_ARTICLES) {
      assert.equal(ctvAffiliateArticlePath(a.slug), `${CTV_AFFILIATE_PATH}/${a.slug}`);
      assert.ok(a.seoDesc.length >= 70 && a.seoDesc.length <= 170);
      assertEditorialBodyQuality(a.body, a.slug);
    }
  });

  it("CTAs point at register, CTV form, and contact", () => {
    assert.match(CTV_AFFILIATE_CTAS.primary.href, /dang-ky\/moi-gioi/);
    assert.equal(CTV_AFFILIATE_CTAS.secondary.href, "/moi-gioi/dang-ky-ctv");
    assert.equal(CTV_AFFILIATE_CTAS.tertiary.href, "/lien-he");
  });

  it("does not publish commission tiers or internal marketing jargon", () => {
    assert.ok(!FORBIDDEN_PUBLIC.test(allPublicBlob()));
  });

  it("persona cards cover open audience", () => {
    const blob = CTV_AFFILIATE_PERSONAS.map((p) => p.role).join(" ");
    assert.match(blob, /ngân hàng|bảo hiểm|chứng khoán/i);
    assert.match(blob, /mua cho chính mình/i);
  });

  it("hop-tac, About, and header More point at landing", () => {
    assert.equal(PARTNERSHIPS_PAGE.ctv.href, CTV_AFFILIATE_PATH);
    assert.ok(ABOUT_PARTNER_SECTION.ctas.some((c) => c.href === CTV_AFFILIATE_PATH));
    assert.ok(NAV_MORE.some((i) => i.href === CTV_AFFILIATE_PATH));
  });
});
