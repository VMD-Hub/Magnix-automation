#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const shared = path.join(root, 'n8n-workflows', 'code', 'shared');

const context = {};
vm.createContext(context);
vm.runInContext(
  [
    fs.readFileSync(path.join(shared, 'legal-gate-config.js'), 'utf8'),
    fs.readFileSync(path.join(shared, 'legal-pack-validator.js'), 'utf8'),
    fs.readFileSync(path.join(shared, 'legal-gate-n8n.js'), 'utf8')
      .replaceAll('__LEGAL_PACK_BUNDLE_JSON__', '{}'),
  ].join('\n'),
  context,
);

const fixture = (name) => JSON.parse(
  fs.readFileSync(path.join(__dirname, 'fixtures', 'legal-pack', name), 'utf8'),
);

const valid = context.validateLegalPack(fixture('valid.json'));
assert.equal(valid.valid, true);
assert.equal(valid.status, 'ready');
assert.deepEqual([...valid.claim_ids], ['noxh_income_test_001']);
assert.equal(valid.source_ref_count, 1);

const invalid = context.validateLegalPack(fixture('invalid-missing-contract.json'));
assert.equal(invalid.valid, false);
for (const expected of [
  'MISSING_NEEDS_HUMAN_STATUS',
  'LEGAL_PACK_STATUS_NOT_READY',
  'FACT_MISSING_CLAIM_ID',
  'FACT_MISSING_SOURCE_REFS',
  'MISSING_FORBIDDEN_CLAIMS',
  'DISCLAIMER_REQUIRED_NOT_TRUE',
]) {
  assert.ok(invalid.errors.includes(expected), expected);
}

const human = fixture('valid.json');
human.needs_human_legal_source = true;
const blockedGate = context.assessLegalGate('noxh_income', human);
assert.equal(blockedGate.pass, false);
assert.equal(blockedGate.status, 'blocked');
assert.equal(blockedGate.needs_human_legal_source, true);

const workflow = JSON.parse(
  fs.readFileSync(path.join(root, 'n8n-workflows', 'content-editorial-brief.workflow.json'), 'utf8'),
);
const connections = workflow.connections;
assert.equal(
  connections['Attach Legal Pack'].main[0][0].node,
  'IF Legal Gate Pass',
  'legal assessment must branch before LLM',
);
assert.equal(connections['IF Legal Gate Pass'].main[0][0].node, 'LLM Editorial Brief');
assert.equal(connections['IF Legal Gate Pass'].main[1][0].node, 'Prepare Legal Block');
assert.equal(connections['HTTP PUT blocked meta'].main[0][0].node, 'Fire Legal Source Notify');

const notifyNode = workflow.nodes.find((node) => node.name === 'Fire Legal Source Notify');
assert.ok(notifyNode.parameters.jsCode.includes(':legal_source_needed'));
assert.ok(notifyNode.parameters.jsCode.includes('BLOCKED_META_PERSIST_FAILED'));
const filterNode = workflow.nodes.find((node) => node.name === 'Parse Filter Needs Brief');
assert.ok(filterNode.parameters.jsCode.includes('sheetMeta.legal_gate_retry_requested'));
const blockedMergeNode = workflow.nodes.find((node) => node.name === 'Merge Legal Block Meta');
assert.ok(blockedMergeNode.parameters.jsCode.includes('delete existing.legal_gate_retry_requested'));

const filterCode = fs.readFileSync(
  path.join(
    root,
    'n8n-workflows',
    'code',
    'content-editorial-brief',
    '01-parse-filter-needs-brief.js',
  ),
  'utf8',
)
  .replace('__EDITORIAL_BRIEF_MIN_SCORE__', '70')
  .replace('__EDITORIAL_BRIEF_BATCH_SIZE__', '5');

function runEditorialFilter(sheetMeta, candidateMeta = {}) {
  const headers = [
    'normalized_key',
    'source',
    'segment',
    'score',
    'status',
    'claude_verdict',
    'text',
    'meta_parsed',
    'meta',
  ];
  const row = [
    'fixture:legal-retry',
    'editorial_calendar',
    'noxh_income',
    80,
    'classified',
    'qualified',
    'Nội dung kiểm thử retry legal gate có đủ độ dài.',
    candidateMeta,
    JSON.stringify(sheetMeta),
  ];
  const filterContext = {
    $input: { first: () => ({ json: { values: [headers, row] } }) },
    ensureIntakeV1: (_row, meta) => ({
      meta,
      intake_v1: meta.intake_v1 || {},
      stubbed: !meta.intake_v1,
    }),
  };
  vm.createContext(filterContext);
  vm.runInContext(
    `globalThis.filterResult = (function () {\n${filterCode}\n})();`,
    filterContext,
  );
  return filterContext.filterResult;
}

const freshDeniedRetry = runEditorialFilter(
  { editorial_brief_status: 'blocked_legal_source', legal_gate_retry_requested: false },
  { editorial_brief_status: 'blocked_legal_source', legal_gate_retry_requested: true },
);
assert.equal(freshDeniedRetry[0].json.empty, true, 'fresh Sheet metadata must deny stale retry');

const freshAllowedRetry = runEditorialFilter(
  { editorial_brief_status: 'blocked_legal_source', legal_gate_retry_requested: true },
  { editorial_brief_status: 'blocked_legal_source', legal_gate_retry_requested: false },
);
assert.equal(
  freshAllowedRetry[0].json.normalized_key,
  'fixture:legal-retry',
  'fresh Sheet metadata must allow retry despite stale candidate metadata',
);

const oversized = fixture('oversized-blocked-details.json');
const oversizedText = oversized.detail_character.repeat(oversized.detail_length);
const blockedPrep = {
  ok: true,
  normalized_key: oversized.normalized_key,
  sheet_row: oversized.sheet_row,
  existing_meta: {
    oversized_existing_detail: oversizedText,
    legal_gate_retry_requested: true,
  },
  legal_retrieval_pack: {
    topic: 'noxh_income',
    status: 'draft',
    needs_human_legal_source: true,
    block_reason: oversizedText,
    facts: [{
      claim_id: 'oversized_claim',
      claim: oversizedText,
      source_refs: ['noxh_source_test:article_1'],
    }],
    forbidden_claims: [oversizedText],
    disclaimer_required: true,
  },
  legal_gate: {
    required: true,
    pass: false,
    status: 'blocked',
    block_reason: oversized.validation_errors[0],
    validation_errors: oversized.validation_errors,
    needs_human_legal_source: true,
    claim_ids: ['oversized_claim'],
  },
};
const mergeCode = fs.readFileSync(
  path.join(
    root,
    'n8n-workflows',
    'code',
    'content-editorial-brief',
    '08-merge-legal-blocked-meta.js',
  ),
  'utf8',
);
const mergeContext = {
  $: (name) => {
    assert.equal(name, 'Prepare Legal Block');
    return { item: { json: blockedPrep } };
  },
  $input: {
    first: () => ({
      json: {
        values: [[JSON.stringify({
          prior_detail: oversizedText,
          legal_gate_retry_requested: true,
        })]],
      },
    }),
  },
};
vm.createContext(mergeContext);
vm.runInContext(
  `globalThis.mergeResult = (function () {\n${mergeCode}\n})();`,
  mergeContext,
);
const serializedBlockedMeta = mergeContext.mergeResult[0].json.meta_body.values[0][0];
assert.ok(serializedBlockedMeta.length <= 50000);
const blockedMeta = JSON.parse(serializedBlockedMeta);
assert.equal(
  blockedMeta.legal_blocked_identity.normalized_key,
  oversized.normalized_key,
  'dedupe identity must survive metadata bounding',
);
assert.deepEqual(
  [...blockedMeta.legal_gate.validation_errors],
  oversized.validation_errors,
  'legal error codes must survive metadata bounding',
);
assert.equal(
  Object.hasOwn(blockedMeta, 'legal_gate_retry_requested'),
  false,
  'consumed legal retry flag must be cleared after another blocked result',
);
const afterConsumedRetry = runEditorialFilter(
  blockedMeta,
  { editorial_brief_status: 'blocked_legal_source', legal_gate_retry_requested: true },
);
assert.equal(
  afterConsumedRetry[0].json.empty,
  true,
  'a consumed legal retry must not be eligible again',
);

const adversarialErrors = fixture('adversarial-validation-errors.json');
const oversizedCode =
  adversarialErrors.code_character.repeat(adversarialErrors.code_length);
const oversizedMessage =
  adversarialErrors.message_character.repeat(adversarialErrors.message_length);
const hostileValidationErrors = Array.from(
  { length: adversarialErrors.error_count },
  (_, index) => {
    if (index % 4 === 0) {
      return { code: `${index}:${oversizedCode}`, message: oversizedMessage };
    }
    if (index % 4 === 1) return `${index}:${oversizedCode}`;
    if (index % 4 === 2) return index;
    return [oversizedCode, oversizedMessage];
  },
);
const adversarialPrep = {
  ...blockedPrep,
  normalized_key: adversarialErrors.normalized_key,
  sheet_row: adversarialErrors.sheet_row,
  existing_meta: { legal_gate_retry_requested: true },
  legal_gate: {
    ...blockedPrep.legal_gate,
    validation_errors: hostileValidationErrors,
  },
};
const adversarialMergeContext = {
  $: (name) => {
    assert.equal(name, 'Prepare Legal Block');
    return { item: { json: adversarialPrep } };
  },
  $input: {
    first: () => ({
      json: {
        values: [[JSON.stringify({ legal_gate_retry_requested: true })]],
      },
    }),
  },
};
vm.createContext(adversarialMergeContext);
vm.runInContext(
  `globalThis.adversarialMergeResult = (function () {\n${mergeCode}\n})();`,
  adversarialMergeContext,
);
const serializedAdversarialMeta =
  adversarialMergeContext.adversarialMergeResult[0].json.meta_body.values[0][0];
assert.ok(serializedAdversarialMeta.length <= 50000);
const adversarialMeta = JSON.parse(serializedAdversarialMeta);
assert.ok(
  adversarialMeta.legal_gate.validation_errors.length
    <= adversarialErrors.expected_max_errors,
);
for (const error of adversarialMeta.legal_gate.validation_errors) {
  if (typeof error === 'string') {
    assert.ok(error.length <= adversarialErrors.expected_max_code_length);
    continue;
  }
  assert.deepEqual(Object.keys(error).sort(), ['code', 'message']);
  assert.equal(typeof error.code, 'string');
  assert.equal(typeof error.message, 'string');
  assert.ok(error.code.length <= adversarialErrors.expected_max_code_length);
  assert.ok(error.message.length <= adversarialErrors.expected_max_message_length);
}
assert.equal(
  Object.hasOwn(adversarialMeta, 'legal_gate_retry_requested'),
  false,
  'adversarial legal errors must not prevent retry consumption from persisting',
);
const afterAdversarialRetry = runEditorialFilter(
  adversarialMeta,
  { editorial_brief_status: 'blocked_legal_source', legal_gate_retry_requested: true },
);
assert.equal(
  afterAdversarialRetry[0].json.empty,
  true,
  'an adversarial blocked result must not rearm the consumed retry',
);

assert.ok(blockedMeta.legal_retrieval_pack.facts[0].claim.length < oversized.detail_length);
assert.ok(!workflow.nodes
  .find((node) => node.name === 'Merge Legal Block Meta')
  .parameters.jsCode.includes('JSON.stringify(meta).slice'));

const successMergeCode = fs.readFileSync(
  path.join(
    root,
    'n8n-workflows',
    'code',
    'content-editorial-brief',
    '05-merge-meta-brief.js',
  ),
  'utf8',
);
const oversizedSuccessPrep = {
  ok: true,
  sheet_row: 91,
  normalized_key: 'fixture:oversized-success',
  interest_key: 'noxh_income',
  editorial_brief_v1: {
    title: 'Brief thành công quá khổ',
    rationale: `${oversizedText}"\\`.repeat(3),
  },
  legal_retrieval_pack: {
    status: 'ready',
    facts: Array.from({ length: 30 }, (_, index) => ({
      claim_id: `success_claim_${index}`,
      claim: oversizedText,
      source_refs: [`source_${index}`],
    })),
  },
  legal_gate: { required: true, pass: true, status: 'ready' },
  existing_meta: {
    oversized_existing_detail: oversizedText,
    legal_gate_retry_requested: true,
  },
  put_meta_url: 'https://example.test/meta',
  put_interest_url: 'https://example.test/interest',
};
const successMergeContext = {
  $: (name) => {
    assert.equal(name, 'Prepare Meta Update');
    return { item: { json: oversizedSuccessPrep } };
  },
  $input: {
    first: () => ({
      json: {
        values: [[JSON.stringify({
          prior_detail: oversizedText,
          legal_gate_retry_requested: true,
        })]],
      },
    }),
  },
};
vm.createContext(successMergeContext);
vm.runInContext(
  `globalThis.successMergeResult = (function () {\n${successMergeCode}\n})();`,
  successMergeContext,
);
const serializedSuccessMeta =
  successMergeContext.successMergeResult[0].json.meta_body.values[0][0];
assert.ok(serializedSuccessMeta.length <= 50000);
const successMeta = JSON.parse(serializedSuccessMeta);
assert.equal(successMeta.editorial_brief_v1.title, 'Brief thành công quá khổ');
assert.equal(successMeta.legal_gate.pass, true);
assert.equal(
  Object.hasOwn(successMeta, 'legal_gate_retry_requested'),
  false,
  'successful merge must consume the manual legal retry flag',
);
assert.ok(
  successMeta.editorial_brief_v1.rationale.length
    < oversizedSuccessPrep.editorial_brief_v1.rationale.length,
  'oversized successful metadata must be structurally bounded',
);

const successMergeNode = workflow.nodes.find((node) => node.name === 'Merge Meta Brief');
assert.ok(!successMergeNode.parameters.jsCode.includes('JSON.stringify(meta).slice'));

for (const file of [
  'content-draft.workflow.json',
  'content-video-draft.workflow.json',
  'content-carousel-draft.workflow.json',
]) {
  const built = fs.readFileSync(path.join(root, 'n8n-workflows', file), 'utf8');
  assert.ok(built.includes('function validateLegalPack(pack)'), `${file}: validator inlined`);
}

console.log('legal-pack-gate.test.mjs — all passed');
