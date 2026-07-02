#!/usr/bin/env node
/**
 * Content Type Router — 4 content_type × 2 channel = 8 cases
 * Run: node tests/content-type-router.test.mjs
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyContentTypeRouting, stripLegacyCta } from '../n8n-workflows/code/shared/content-type-router.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const disclaimerCfg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../n8n-workflows/disclaimers.json'), 'utf8'),
);
const ctaCfg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../n8n-workflows/cta_templates.json'), 'utf8'),
);

const FIXED_DATE = new Date('2026-06-28T10:00:00+07:00');
const BRAND = 'Magnix Test';
const LINKS = {
  MAGNIX_OFFER_LINK_NOXH: 'https://example.com/noxh-checklist',
  MAGNIX_OFFER_LINK_DONGTIEN: 'https://example.com/excel-dong-tien',
  MAGNIX_OFFER_LINK_DINHGIA: 'https://example.com/dinh-gia',
};

const linkResolver = (envKey) => LINKS[envKey] || '';

const types = [
  {
    content_type: 'NOXH_LEGAL',
    segment: 'noxh_income',
    keyword: 'NOXH',
    offer: 'Checklist hồ sơ NOXH',
    disclaimerSnippet: 'địa phương',
  },
  {
    content_type: 'LOAN_FINANCE',
    segment: 'sme_credit',
    keyword: 'DONGTIEN',
    offer: 'Bảng Excel tính dòng tiền vay bank',
    disclaimerSnippet: 'Dòng tiền',
  },
  {
    content_type: 'VALUATION',
    segment: 'valuation',
    keyword: 'DINHGIA',
    offer: 'Giải pháp thẩm định giá độc lập',
    disclaimerSnippet: 'tài sản',
  },
  {
    content_type: 'GENERAL_POLICY',
    segment: 'general_inbound',
    keyword: null,
    offer: null,
    disclaimerSnippet: 'địa phương',
    body: '## Tổng hợp\n\nChính sách NOXH mới cập nhật.',
    expectSoftKeyword: 'NOXH',
    expectSoftOffer: 'Checklist hồ sơ NOXH',
  },
];

const channels = ['facebook', 'blog_seo'];

for (const t of types) {
  for (const channel of channels) {
    const label = `${t.content_type}/${channel}`;
    const out = applyContentTypeRouting({
      draft: {
        segment: t.segment,
        content_type: t.content_type,
        format_type: 'text_post',
        product_type: 'fb_page_post_image',
        artifact_markdown: t.body || `## Nội dung ${t.content_type}\n\nChi tiết.`,
        cta_opt_in: 'Comment CHECKLIST để nhận file (không thay tư vấn chính thức).',
        disclaimer: '',
      },
      disclaimerCfg,
      ctaCfg,
      page_display_name: BRAND,
      brand: BRAND,
      format_type: 'text_post',
      product_type: 'fb_page_post_image',
      channel,
      normalized_key: `test:${label}`,
      linkResolver,
      now: FIXED_DATE,
    });

    assert.equal(out.ok, true, `${label}: ok`);
    assert.equal(out.draft.channel, channel, `${label}: channel`);
    assert.ok(out.draft.disclaimer.includes(t.disclaimerSnippet), `${label}: disclaimer`);
    assert.ok(!out.draft.disclaimer.includes('CHECKLIST'), `${label}: no CTA in disclaimer`);
    assert.ok(!out.draft.artifact_markdown.includes('CHECKLIST'), `${label}: legacy CTA stripped from body`);

    if (t.content_type === 'GENERAL_POLICY') {
      if (channel === 'facebook') {
        assert.ok(out.draft.cta_opt_in.includes(t.expectSoftKeyword), `${label}: soft keyword`);
        assert.ok(out.draft.cta_opt_in.includes(t.expectSoftOffer), `${label}: soft offer`);
      } else {
        assert.ok(out.draft.cta_opt_in.includes(LINKS.MAGNIX_OFFER_LINK_NOXH), `${label}: blog link`);
      }
      assert.equal(out.content_type_router.cta_mode, 'general_soft', `${label}: soft mode`);
    } else {
      assert.ok(out.draft.cta_opt_in.includes(t.offer), `${label}: offer name`);
      assert.equal(out.content_type_router.cta_keyword, t.keyword, `${label}: logged keyword`);
      if (channel === 'facebook') {
        assert.ok(out.draft.cta_opt_in.includes(`"${t.keyword}"`), `${label}: keyword quoted`);
      }
      if (channel === 'blog_seo') {
        const linkKey = ctaCfg.offer_links_env[t.content_type];
        assert.ok(out.draft.cta_opt_in.includes(LINKS[linkKey]), `${label}: link in CTA`);
      }
    }

    assert.ok(!/không thay tư vấn chính thức/i.test(out.draft.cta_opt_in), `${label}: no legal phrase in CTA`);
    assert.ok(!out.draft.artifact_markdown.includes(t.disclaimerSnippet), `${label}: disclaimer not in body`);
  }
}

// Exactly one CTA after stripping legacy
const dup = applyContentTypeRouting({
  draft: {
    segment: 'noxh_income',
    content_type: 'NOXH_LEGAL',
    artifact_markdown: 'Kết luận.\n\nComment MAU01 nhận mẫu.',
    cta_opt_in: 'Comment DTI nhận file.',
    disclaimer: '',
  },
  disclaimerCfg,
  ctaCfg,
  brand: BRAND,
  channel: 'facebook',
  linkResolver,
  now: FIXED_DATE,
});
assert.equal((dup.draft.cta_opt_in.match(/"NOXH"/g) || []).length, 1, 'single quoted keyword CTA');
assert.ok(!dup.draft.cta_opt_in.includes('DTI'), 'legacy DTI removed');
assert.ok(!dup.draft.artifact_markdown.includes('MAU01'), 'legacy MAU01 removed from body');

const stripped = stripLegacyCta('A\nComment SAVE để lưu bài', ctaCfg.legacy_cta_keywords);
assert.ok(!/SAVE/.test(stripped), 'strip SAVE line');

console.log('content-type-router.test.mjs — all passed (8 cases + anti-dup)');
