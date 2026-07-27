import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CTV_AFFILIATE_CTAS,
  CTV_AFFILIATE_FAQS,
  CTV_AFFILIATE_LEAD,
  CTV_AFFILIATE_PATH,
  CTV_AFFILIATE_RULES,
  CTV_AFFILIATE_SEO_DESCRIPTION,
  CTV_AFFILIATE_SEO_TITLE,
  CTV_AFFILIATE_WHO,
} from "@/lib/content/ctv-affiliate-landing";
import { PARTNERSHIPS_PAGE } from "@/lib/content/partnerships-page-content";
import { ABOUT_PARTNER_SECTION } from "@/lib/content/messaging/about-public";

/** Public copy must not leak admin commission tiers or fixed amounts. */
const FORBIDDEN_PUBLIC =
  /cấp\s*[1-4]|cap\s*[1-4]|15[.\s]?000[.\s]?000|15000000|Build-to-Share|đại dương xanh|loại bỏ hoàn toàn/i;

function allPublicCopy(): string {
  return [
    CTV_AFFILIATE_SEO_TITLE,
    CTV_AFFILIATE_SEO_DESCRIPTION,
    CTV_AFFILIATE_LEAD,
    CTV_AFFILIATE_WHO.intro,
    ...CTV_AFFILIATE_WHO.personas,
    ...CTV_AFFILIATE_RULES.steps.map((s) => `${s.title} ${s.desc}`),
    CTV_AFFILIATE_RULES.note,
    ...CTV_AFFILIATE_FAQS.map((f) => `${f.question} ${f.answer}`),
    CTV_AFFILIATE_CTAS.closing,
    CTV_AFFILIATE_CTAS.primary.label,
  ].join("\n");
}

describe("CTV affiliate landing (phase 1)", () => {
  it("uses public path and indexable SEO bounds", () => {
    assert.equal(CTV_AFFILIATE_PATH, "/affiliate-bat-dong-san");
    assert.ok(CTV_AFFILIATE_SEO_DESCRIPTION.length >= 70);
    assert.ok(CTV_AFFILIATE_SEO_DESCRIPTION.length <= 160);
  });

  it("CTAs point at register, CTV form, and contact", () => {
    assert.match(CTV_AFFILIATE_CTAS.primary.href, /dang-ky\/moi-gioi/);
    assert.match(CTV_AFFILIATE_CTAS.primary.href, /dang-ky-ctv/);
    assert.equal(CTV_AFFILIATE_CTAS.secondary.href, "/moi-gioi/dang-ky-ctv");
    assert.equal(CTV_AFFILIATE_CTAS.tertiary.href, "/lien-he");
  });

  it("does not publish commission tier table or fixed payout amounts", () => {
    assert.ok(!FORBIDDEN_PUBLIC.test(allPublicCopy()));
  });

  it("hop-tac and About CTV CTAs point at landing not noindex form", () => {
    assert.equal(PARTNERSHIPS_PAGE.ctv.href, CTV_AFFILIATE_PATH);
    assert.ok(
      PARTNERSHIPS_PAGE.ctas.some((c) => c.href === CTV_AFFILIATE_PATH),
    );
    assert.ok(
      ABOUT_PARTNER_SECTION.ctas.some((c) => c.href === CTV_AFFILIATE_PATH),
    );
  });

  it("audience copy is open beyond RE brokers", () => {
    const blob = CTV_AFFILIATE_WHO.personas.join(" ");
    assert.match(blob, /ngân hàng|bảo hiểm|chứng khoán/i);
    assert.match(blob, /người thân|mua cho chính mình/i);
  });
});
