#!/usr/bin/env node
/**
 * Disclaimer injection — affirmative tone, reel vs post_long
 * Run: node tests/disclaimer-selector.test.mjs
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyContentTypeRouting } from '../n8n-workflows/code/shared/content-type-router.mjs';
import {
  stripBoilerplateDisclaimers,
  buildBoilerplateRegexes,
  resolveDisclaimerVariant,
  buildInjectedDisclaimer,
} from '../n8n-workflows/code/shared/disclaimer-selector.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const disclaimerCfg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../n8n-workflows/disclaimers.json'), 'utf8'),
);
const ctaCfg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../n8n-workflows/cta_templates.json'), 'utf8'),
);

const PAGE = 'Tim Nha O Xa Hoi';

assert.equal(resolveDisclaimerVariant({ format_type: 'video_script', product_type: 'fb_reels' }, disclaimerCfg), 'reel_short');
assert.equal(resolveDisclaimerVariant({ format_type: 'text_post', product_type: 'fb_page_post_image' }, disclaimerCfg), 'post_long');

const reelBuilt = buildInjectedDisclaimer({
  cfg: disclaimerCfg,
  content_type: 'NOXH_LEGAL',
  variant: 'reel_short',
  pageDisplayName: PAGE,
});
assert.ok(reelBuilt.disclaimer.includes('inbox'));
assert.ok(reelBuilt.disclaimer.includes(PAGE));
assert.ok(!/không phải tư vấn/i.test(reelBuilt.disclaimer));

const postBuilt = buildInjectedDisclaimer({
  cfg: disclaimerCfg,
  content_type: 'NOXH_LEGAL',
  variant: 'post_long',
  pageDisplayName: PAGE,
});
assert.ok(postBuilt.disclaimer.includes('SĐT'));
assert.ok(postBuilt.disclaimer.includes(PAGE));

const samples = [
  {
    label: 'NOXH_LEGAL post',
    draft: {
      segment: 'noxh_income',
      content_type: 'NOXH_LEGAL',
      format_type: 'text_post',
      product_type: 'fb_page_post_image',
      artifact_markdown: '## Ai được mua NOXH?',
      cta_opt_in: '',
      disclaimer: '',
    },
    expectSnippet: 'địa phương',
    variant: 'post_long',
    expectLegal: true,
  },
  {
    label: 'LOAN_FINANCE post',
    draft: {
      segment: 'sme_credit',
      content_type: 'LOAN_FINANCE',
      format_type: 'text_post',
      product_type: 'carousel_image',
      artifact_markdown: '## Dòng tiền vay',
      cta_opt_in: '',
      disclaimer: '',
    },
    expectSnippet: 'Dòng tiền',
    variant: 'post_long',
    expectLegal: true,
  },
  {
    label: 'reel_short',
    draft: {
      segment: 'noxh_income',
      content_type: 'NOXH_LEGAL',
      format_type: 'video_script',
      product_type: 'fb_reels',
      artifact_markdown: 'caption body',
      cta_opt_in: '',
      disclaimer: '',
    },
    expectSnippet: 'inbox',
    variant: 'reel_short',
    expectLegal: true,
  },
  {
    label: 'GENERAL_POLICY',
    draft: {
      segment: 'general_inbound',
      content_type: 'NOT_A_REAL_TYPE',
      format_type: 'text_post',
      product_type: 'fb_page_post_image',
      artifact_markdown: '## Tổng hợp',
      cta_opt_in: '',
      disclaimer: 'Nội dung mang tính tham khảo theo quy định hiện hành.',
    },
    expectSnippet: 'địa phương',
    variant: 'post_long',
    expectLegal: false,
    expectWarn: 'INVALID_CONTENT_TYPE',
  },
];

for (const sample of samples) {
  const out = applyContentTypeRouting({
    draft: sample.draft,
    disclaimerCfg,
    ctaCfg,
    page_display_name: PAGE,
    brand: PAGE,
    channel: 'facebook',
    product_type: sample.draft.product_type,
    format_type: sample.draft.format_type,
    normalized_key: `test:${sample.label}`,
  });

  assert.equal(out.ok, true, `${sample.label}: ok`);
  assert.ok(out.draft.disclaimer.includes(sample.expectSnippet), `${sample.label}: disclaimer`);
  assert.ok(out.draft.disclaimer.includes(PAGE), `${sample.label}: page name`);
  assert.ok(!/không phải tư vấn/i.test(out.draft.disclaimer), `${sample.label}: no negative disclaimer`);
  assert.equal(out.content_type_router.disclaimer_variant, sample.variant, `${sample.label}: variant`);
  assert.equal(out.content_type_router.requires_legal_review, sample.expectLegal, `${sample.label}: legal`);
  assert.ok(!out.draft.artifact_markdown.includes('mang tính tham khảo'), `${sample.label}: body clean`);

  if (sample.expectWarn) {
    assert.ok(String(out.content_type_router.disclaimer_warn || '').includes(sample.expectWarn));
  }
}

const regexes = buildBoilerplateRegexes(disclaimerCfg.boilerplate_patterns);
const dirtyBody = 'Kết luận hợp lý.\n\n—\nThông tin mang tính tham khảo theo quy định hiện hành.';
const cleaned = stripBoilerplateDisclaimers(dirtyBody, regexes);
assert.ok(!/mang tính tham khảo/i.test(cleaned), 'strip footer boilerplate');

console.log('disclaimer-selector.test.mjs — all passed (affirmative + reel/post)');
