#!/usr/bin/env node
/**
 * Run context-enrichment unit tests.
 * Usage: node tests/context-enrichment.test.mjs
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ruleClassifyContentType,
  clusterByContentType,
  clusterEnrichmentStatus,
  isArchiveRow,
  buildContextEnrichmentPayload,
  normalizeContextSummary,
} from '../n8n-workflows/code/shared/context-enrichment.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const rules = JSON.parse(
  fs.readFileSync(path.join(root, 'n8n-workflows/content_type_rules.json'), 'utf8'),
);
const store = JSON.parse(
  fs.readFileSync(path.join(root, 'n8n-workflows/context_summaries.json'), 'utf8'),
);

// archive filter
assert.equal(isArchiveRow({ source: 'editorial_calendar', normalized_key: 'x' }, rules), false);
assert.equal(isArchiveRow({ normalized_key: 'editorial:queue:2026w27:01' }, rules), false);
assert.equal(isArchiveRow({ source: 'fb_scrape', normalized_key: 'fb:123' }, rules), true);

// keyword classify
const noxh = ruleClassifyContentType({
  text: 'Thu nhập 15 triệu có đủ điều kiện mua NOXH không?',
  segment: 'noxh_income',
  score: 82,
  rules,
});
assert.equal(noxh.content_type, 'NOXH_LEGAL');

const dti = ruleClassifyContentType({
  text: 'DTI và room vay NHCSXH cần chuẩn bị gì?',
  segment: 'sme_credit',
  score: 75,
  rules,
});
assert.equal(dti.content_type, 'LOAN_FINANCE');

// score band → needs LLM flag
const border = ruleClassifyContentType({
  text: 'Mua nhà giá bao nhiêu?',
  segment: 'general_inbound',
  score: 45,
  rules,
});
assert.equal(border.needs_llm_content_type, true);

// cluster threshold
assert.equal(clusterEnrichmentStatus(7, 8), 'waiting_for_context');
assert.equal(clusterEnrichmentStatus(8, 8), 'ready');

const clusters = clusterByContentType([
  { content_type: 'NOXH_LEGAL', text: 'a' },
  { content_type: 'NOXH_LEGAL', text: 'b' },
]);
assert.equal(clusters.NOXH_LEGAL.length, 2);

// inject payload — ready when store has summary
const ready = buildContextEnrichmentPayload(
  { segment: 'noxh_income' },
  store,
  rules,
);
assert.equal(ready.content_type, 'NOXH_LEGAL');
assert.equal(ready.context_enrichment_status, 'ready');
assert.ok(ready.context_summary?.top_questions?.length);

const emptyStore = {
  by_content_type: {
    NOXH_LEGAL: { status: 'waiting_for_context', post_count: 3, context_summary: null },
  },
};
const waiting = buildContextEnrichmentPayload(
  { segment: 'noxh_income' },
  emptyStore,
  rules,
);
assert.equal(waiting.context_enrichment_status, 'waiting_for_context');
assert.equal(waiting.context_summary, null);

// normalize summary
const norm = normalizeContextSummary({
  top_questions: [' Q1 ', ''],
  pains: ['pain1'],
  audience_voice: 'Ngắn, hỏi số',
  hook_angles: ['angle'],
});
assert.equal(norm.top_questions.length, 1);
assert.equal(norm.pains[0], 'pain1');

console.log('context-enrichment.test.mjs — all passed');
