#!/usr/bin/env node
/**
 * Build Agent 3 — Lead Magnet Draft (content_queue → content_drafts)
 * Run: node n8n-workflows/build-content-draft.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadFireNotifyCode, wireNotifyAfter } from './code/shared/notify-wire.mjs';
import { withLlmRouter } from './code/shared/with-llm-router.mjs';
import { buildLegalValidatorNodeCode } from './code/shared/inject-legal-bundle.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const codeDir = path.join(__dirname, 'code', 'content-draft');
const PUBLIC = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'magnix-public-config.json'), 'utf8')
);
const DISCLAIMER_CFG = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'disclaimers.json'), 'utf8')
);
const CTA_CFG = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'cta_templates.json'), 'utf8')
);
const TITLE_RULES = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'title_rules.json'), 'utf8')
);
const TITLE_WHITELIST = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', '.cursor', 'title_whitelist.json'), 'utf8')
);
const FORMAT_ROUTING = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'format_routing.json'), 'utf8')
);
const CANONICAL_FACTS = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'canonical_facts.json'), 'utf8')
);
const CONTEXT_SUMMARIES = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'context_summaries.json'), 'utf8')
);
const CONTENT_TYPE_RULES = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'content_type_rules.json'), 'utf8')
);
const BRAND_VOICE = fs
  .readFileSync(path.join(__dirname, '..', '.cursor', 'BRAND_VOICE.md'), 'utf8')
  .split('\n')
  .filter((l) => /^\d+\./.test(l.trim()))
  .join('\n');

function canonicalFactsBlock(facts) {
  const dti = facts.DTI || {};
  return `- DTI: ${dti.canonical_guidance || ''}
- Cấm claim: ${(dti.forbidden_claims || []).join('; ')}`;
}

function titleFormulasBlock(rules) {
  const lines = Object.entries(rules.title_formulas || {}).map(
    ([k, v]) => `  - ${k}: ${v}`,
  );
  return `- Công thức title theo content_type:\n${lines.join('\n')}`;
}

const sheetDraftsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${PUBLIC.google_sheet_id}/values/${encodeURIComponent(`${PUBLIC.content_drafts_tab}!A:N`)}`;

const read = (f) =>
  fs
    .readFileSync(path.join(codeDir, f), 'utf8')
    .replace(/^\/\/[^\n]*\n(\/\/[^\n]*\n)*/gm, '')
    .trim();

const llmProviders = PUBLIC.llm_task_providers || {};

const codes = {
  parseFilter: buildLegalValidatorNodeCode(
    path.join(codeDir, '01-parse-filter-candidates.js')
  )
    .replace('__DRAFT_MIN_SCORE__', String(PUBLIC.draft_min_score ?? 70))
    .replace('__DRAFT_BATCH_SIZE__', String(PUBLIC.content_draft_batch_size ?? 5))
    .replace('__FORMAT_ROUTING_JSON__', JSON.stringify(FORMAT_ROUTING)),
  llm: withLlmRouter(
    read('02-llm-lead-magnet.js')
      .replace('__CONTEXT_SUMMARIES_JSON__', JSON.stringify(CONTEXT_SUMMARIES))
      .replace('__CONTENT_TYPE_RULES_JSON__', JSON.stringify(CONTENT_TYPE_RULES))
      .replace('__TITLE_FORMULAS_BLOCK__', titleFormulasBlock(TITLE_RULES))
      .replace('__BRAND_VOICE_BLOCK__', BRAND_VOICE.replace(/\\/g, '\\\\').replace(/`/g, '\\`'))
      .replace('__CANONICAL_FACTS_BLOCK__', canonicalFactsBlock(CANONICAL_FACTS))
      .replace('__TEXT_POST_FORMAT_HINT__', FORMAT_ROUTING.prompt_hints?.text_post || ''),
    llmProviders,
  ),
  indexTitles: read('00-index-published-titles.js').replace(
    '__TITLE_RULES_JSON__',
    JSON.stringify(TITLE_RULES),
  ),
  titleQa: read('02b-title-qa-gate.js')
    .replace('__TITLE_RULES_JSON__', JSON.stringify(TITLE_RULES))
    .replace('__TITLE_WHITELIST_JSON__', JSON.stringify(TITLE_WHITELIST)),
  trackTitleReject: read('02c-track-title-reject.js')
    .replace('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
    .replace('__CONTENT_QUEUE_TAB__', PUBLIC.content_queue_tab),
  parse: read('03-parse-lead-magnet.js'),
  disclaimer: read('03b-content-type-router.js')
    .replace('__DISCLAIMER_CONFIG_JSON__', JSON.stringify(DISCLAIMER_CFG))
    .replace('__CTA_CONFIG_JSON__', JSON.stringify(CTA_CFG)),
  hookQa: read('03c-hook-completion-gate.js')
    .replace('__CTA_CONFIG_JSON__', JSON.stringify(CTA_CFG)),
  l0: read('04-l0-forbidden-check.js'),
  routeL2: read('05-route-l2-devil.js'),
  skipL2: read('05b-wrap-skip-l2.js'),
  llmDevil: withLlmRouter(read('06-llm-devil-qa.js'), llmProviders),
  parseDevil: read('07-parse-devil-qa.js'),
  merge: read('05-merge-draft-row.js'),
  append: read('06-sheet-append-draft.js')
    .replace('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
    .replace('__CONTENT_DRAFTS_TAB__', PUBLIC.content_drafts_tab),
  markQueue: read('07-mark-queue-drafted.js')
    .replace('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
    .replace('__CONTENT_QUEUE_TAB__', PUBLIC.content_queue_tab),
};

const sheetQueueUrl = `https://sheets.googleapis.com/v4/spreadsheets/${PUBLIC.google_sheet_id}/values/${encodeURIComponent(`${PUBLIC.content_queue_tab}!A:O`)}`;

const resetStats = `const data = $getWorkflowStaticData('global');
data.a3_stats = { draft_ok: 0, draft_fail: 0, l0_fail: 0, parse_fail: 0, l2_fail: 0, l2_parse_fail: 0, l2_llm_fail: 0, title_rejected: 0, title_capitalization_error: 0, title_dup_review: 0, hook_rejected: 0, hook_comment_bait_review: 0, hook_truncation_review: 0, hook_frequency_review: 0 };
return $input.all();`;

const trackL0Fail = `const data = $getWorkflowStaticData('global');
if (!data.a3_stats) data.a3_stats = {};
data.a3_stats.l0_fail = (data.a3_stats.l0_fail || 0) + 1;
return $input.all();`;

const trackParseFail = `const data = $getWorkflowStaticData('global');
if (!data.a3_stats) data.a3_stats = {};
data.a3_stats.parse_fail = (data.a3_stats.parse_fail || 0) + 1;
return $input.all();`;

const trackL2Fail = `const data = $getWorkflowStaticData('global');
if (!data.a3_stats) data.a3_stats = {};
const v = $input.first().json?.l2_qa?.verdict;
if (v === 'fail') data.a3_stats.l2_fail = (data.a3_stats.l2_fail || 0) + 1;
return $input.all();`;

const trackL2ParseFail = `const data = $getWorkflowStaticData('global');
if (!data.a3_stats) data.a3_stats = {};
data.a3_stats.l2_parse_fail = (data.a3_stats.l2_parse_fail || 0) + 1;
return $input.all();`;

const trackL2LlmFail = `const data = $getWorkflowStaticData('global');
if (!data.a3_stats) data.a3_stats = {};
data.a3_stats.l2_llm_fail = (data.a3_stats.l2_llm_fail || 0) + 1;
return $input.all();`;

const summary = `const data = $getWorkflowStaticData('global');
const stats = data.a3_stats || {};
let hint = null;
if ((stats.draft_ok || 0) === 0) {
  hint = 'Không draft mới — hết candidate hoặc lỗi LLM/L0/L2';
} else if ((stats.l2_fail || 0) > 0) {
  hint = 'Có L2 fail — kiểm tra content_drafts status=review';
} else if ((stats.title_rejected || 0) > 0) {
  hint = 'Có title_rejected — kiểm tra content_queue meta';
} else if ((stats.title_capitalization_error || 0) > 0) {
  hint = 'Có title_capitalization_error — sửa sentence case trên queue';
}
return [{ json: {
  ok: true,
  workflow: 'content-draft',
  stats,
  batch_size: ${PUBLIC.content_draft_batch_size ?? 5},
  hint,
  finished_at: new Date().toISOString(),
}}];`;

const empty = `return [{ json: { ok: true, empty: true, message: 'No draft candidates' } }];`;

const pos = (x, y) => [x, y];

const nodes = [
  {
    parameters: {
      content:
        '## Agent 3 — Lead Magnet\n- **09:00 VN** · max **5**/lần\n- LLM → Title QA → Parse → Router → **Hook Gate** → L0 → L2\n- hook_review: comment-bait / truncation / frequency flags',
      height: 180,
      width: 400,
    },
    id: 'a300note',
    name: 'Sticky Note',
    type: 'n8n-nodes-base.stickyNote',
    typeVersion: 1,
    position: pos(-480, 160),
  },
  {
    parameters: {
      rule: { interval: [{ field: 'cronExpression', expression: PUBLIC.schedule_cron_draft || '0 9 * * *' }] },
    },
    id: 'a301sched',
    name: 'Schedule Daily Draft',
    type: 'n8n-nodes-base.scheduleTrigger',
    typeVersion: 1.2,
    position: pos(0, 200),
  },
  {
    parameters: {},
    id: 'a302manual',
    name: "When clicking 'Execute workflow'",
    type: 'n8n-nodes-base.manualTrigger',
    typeVersion: 1,
    position: pos(0, 400),
  },
  {
    parameters: {
      method: 'GET',
      url: sheetQueueUrl,
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      options: {},
    },
    id: 'a303fetch',
    name: 'Fetch content_queue',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(240, 300),
  },
  {
    parameters: { jsCode: codes.parseFilter },
    id: 'a304filter',
    name: 'Parse Filter Draft Candidates',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(480, 300),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $json.empty }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'notEquals' },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a305if',
    name: 'IF Has Candidates',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(720, 300),
  },
  {
    parameters: { jsCode: resetStats },
    id: 'a305reset',
    name: 'Reset Run Stats',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(960, 240),
  },
  {
    parameters: {
      method: 'GET',
      url: sheetDraftsUrl,
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      options: {},
    },
    id: 'a305fetchdrafts',
    name: 'Fetch content_drafts titles',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(1080, 240),
  },
  {
    parameters: { jsCode: codes.indexTitles },
    id: 'a305index',
    name: 'Index Published Titles',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1080, 360),
  },
  {
    parameters: { batchSize: 1, options: {} },
    id: 'a306loop',
    name: 'Loop Draft Candidates',
    type: 'n8n-nodes-base.splitInBatches',
    typeVersion: 3,
    position: pos(1320, 240),
  },
  {
    parameters: { jsCode: codes.llm },
    id: 'a307llm',
    name: 'LLM Lead Magnet',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1560, 240),
    onError: 'continueRegularOutput',
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $json.error }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'notEquals' },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a308ifllm',
    name: 'IF LLM OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(1800, 240),
  },
  {
    parameters: { jsCode: codes.titleQa },
    id: 'a308titleqa',
    name: 'Title QA Gate',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1920, 160),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $json.title_qa_pass }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a308iftitle',
    name: 'IF Title Pass',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(2160, 160),
  },
  {
    parameters: { jsCode: codes.parse },
    id: 'a309parse',
    name: 'Parse Lead Magnet JSON',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2400, 80),
  },
  {
    parameters: { jsCode: codes.trackTitleReject },
    id: 'a308titlerej',
    name: 'Track Title Reject',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2400, 280),
    onError: 'continueRegularOutput',
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $json.ok }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a310ifparse',
    name: 'IF Parse OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(2640, 80),
  },
  {
    parameters: { jsCode: codes.disclaimer },
    id: 'a310router',
    name: 'Content Type Router',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2760, 80),
  },
  {
    parameters: { jsCode: codes.hookQa },
    id: 'a310hook',
    name: 'Hook Completion Gate',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2880, 80),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $json.hook_qa_blocked }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'notEquals' },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a310ifhook',
    name: 'IF Hook Pass',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(3000, 80),
  },
  {
    parameters: { jsCode: `const data = $getWorkflowStaticData('global');
if (!data.a3_stats) data.a3_stats = {};
data.a3_stats.hook_rejected = (data.a3_stats.hook_rejected || 0) + 1;
return $input.all();` },
    id: 'a310hookrej',
    name: 'Track Hook Reject',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3240, 200),
  },
  {
    parameters: { jsCode: codes.l0 },
    id: 'a311l0',
    name: 'L0 Forbidden Check',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3120, 80),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $json.l0_pass }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a312ifl0',
    name: 'IF L0 Pass',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(3120, 80),
  },
  {
    parameters: { jsCode: codes.routeL2 },
    id: 'a312route',
    name: 'Route L2 Devil',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3240, 80),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $json.needs_l2_devil }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a312ifl2',
    name: 'IF Needs L2 Devil',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(3120, 80),
  },
  {
    parameters: { jsCode: codes.llmDevil },
    id: 'a312llm2',
    name: 'LLM L2 Devil QA',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3360, 0),
    onError: 'continueRegularOutput',
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $json.l2_error }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'notEquals' },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a312ifl2llm',
    name: 'IF L2 LLM OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(3600, 0),
  },
  {
    parameters: { jsCode: codes.parseDevil },
    id: 'a312parse2',
    name: 'Parse L2 Devil JSON',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3840, 0),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $json.l2_ok }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a312ifl2parse',
    name: 'IF L2 Parse OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(4080, 0),
  },
  {
    parameters: { jsCode: codes.skipL2 },
    id: 'a312skipl2',
    name: 'Wrap Skip L2',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3360, 200),
  },
  {
    parameters: { jsCode: codes.merge },
    id: 'a313merge',
    name: 'Merge Draft Row',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(4320, 80),
  },
  {
    parameters: { jsCode: trackL2Fail },
    id: 'a313l2track',
    name: 'Track L2 Verdict',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(4560, 80),
  },
  {
    parameters: { jsCode: codes.append },
    id: 'a314append',
    name: 'Sheet Append content_drafts',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(4800, 80),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.markQueue },
    id: 'a315mark',
    name: 'Mark Queue Drafted',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(5040, 80),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: trackL0Fail },
    id: 'a316l0fail',
    name: 'Track L0 Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2880, 240),
  },
  {
    parameters: { jsCode: trackParseFail },
    id: 'a317parsefail',
    name: 'Track Parse Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2400, 240),
  },
  {
    parameters: { jsCode: trackL2ParseFail },
    id: 'a317l2parsefail',
    name: 'Track L2 Parse Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(4320, 200),
  },
  {
    parameters: { jsCode: trackL2LlmFail },
    id: 'a317l2llmfail',
    name: 'Track L2 LLM Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3840, 160),
  },
  {
    parameters: { jsCode: summary },
    id: 'a318summary',
    name: 'Build Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3600, 300),
  },
  {
    parameters: { jsCode: empty },
    id: 'a319empty',
    name: 'No Candidates Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(720, 420),
  },
];

const connections = {
  'Schedule Daily Draft': { main: [[{ node: 'Fetch content_queue', type: 'main', index: 0 }]] },
  "When clicking 'Execute workflow'": {
    main: [[{ node: 'Fetch content_queue', type: 'main', index: 0 }]],
  },
  'Fetch content_queue': { main: [[{ node: 'Parse Filter Draft Candidates', type: 'main', index: 0 }]] },
  'Parse Filter Draft Candidates': { main: [[{ node: 'IF Has Candidates', type: 'main', index: 0 }]] },
  'IF Has Candidates': {
    main: [
      [{ node: 'Reset Run Stats', type: 'main', index: 0 }],
      [{ node: 'No Candidates Summary', type: 'main', index: 0 }],
    ],
  },
  'Reset Run Stats': {
    main: [[
      { node: 'Fetch content_drafts titles', type: 'main', index: 0 },
    ]],
  },
  'Fetch content_drafts titles': {
    main: [[{ node: 'Index Published Titles', type: 'main', index: 0 }]],
  },
  'Index Published Titles': {
    main: [[{ node: 'Loop Draft Candidates', type: 'main', index: 0 }]],
  },
  'Loop Draft Candidates': {
    main: [
      [{ node: 'Build Summary', type: 'main', index: 0 }],
      [{ node: 'LLM Lead Magnet', type: 'main', index: 0 }],
    ],
  },
  'LLM Lead Magnet': { main: [[{ node: 'IF LLM OK', type: 'main', index: 0 }]] },
  'IF LLM OK': {
    main: [
      [{ node: 'Title QA Gate', type: 'main', index: 0 }],
      [{ node: 'Loop Draft Candidates', type: 'main', index: 0 }],
    ],
  },
  'Title QA Gate': { main: [[{ node: 'IF Title Pass', type: 'main', index: 0 }]] },
  'IF Title Pass': {
    main: [
      [{ node: 'Parse Lead Magnet JSON', type: 'main', index: 0 }],
      [{ node: 'Track Title Reject', type: 'main', index: 0 }],
    ],
  },
  'Track Title Reject': { main: [[{ node: 'Loop Draft Candidates', type: 'main', index: 0 }]] },
  'Parse Lead Magnet JSON': { main: [[{ node: 'IF Parse OK', type: 'main', index: 0 }]] },
  'IF Parse OK': {
    main: [
      [{ node: 'Content Type Router', type: 'main', index: 0 }],
      [{ node: 'Track Parse Fail', type: 'main', index: 0 }],
    ],
  },
  'Content Type Router': { main: [[{ node: 'Hook Completion Gate', type: 'main', index: 0 }]] },
  'Hook Completion Gate': { main: [[{ node: 'IF Hook Pass', type: 'main', index: 0 }]] },
  'IF Hook Pass': {
    main: [
      [{ node: 'L0 Forbidden Check', type: 'main', index: 0 }],
      [{ node: 'Track Hook Reject', type: 'main', index: 0 }],
    ],
  },
  'Track Hook Reject': { main: [[{ node: 'Loop Draft Candidates', type: 'main', index: 0 }]] },
  'L0 Forbidden Check': { main: [[{ node: 'IF L0 Pass', type: 'main', index: 0 }]] },
  'IF L0 Pass': {
    main: [
      [{ node: 'Route L2 Devil', type: 'main', index: 0 }],
      [{ node: 'Track L0 Fail', type: 'main', index: 0 }],
    ],
  },
  'Route L2 Devil': { main: [[{ node: 'IF Needs L2 Devil', type: 'main', index: 0 }]] },
  'IF Needs L2 Devil': {
    main: [
      [{ node: 'LLM L2 Devil QA', type: 'main', index: 0 }],
      [{ node: 'Wrap Skip L2', type: 'main', index: 0 }],
    ],
  },
  'LLM L2 Devil QA': { main: [[{ node: 'IF L2 LLM OK', type: 'main', index: 0 }]] },
  'IF L2 LLM OK': {
    main: [
      [{ node: 'Parse L2 Devil JSON', type: 'main', index: 0 }],
      [{ node: 'Track L2 LLM Fail', type: 'main', index: 0 }],
    ],
  },
  'Parse L2 Devil JSON': { main: [[{ node: 'IF L2 Parse OK', type: 'main', index: 0 }]] },
  'IF L2 Parse OK': {
    main: [
      [{ node: 'Merge Draft Row', type: 'main', index: 0 }],
      [{ node: 'Track L2 Parse Fail', type: 'main', index: 0 }],
    ],
  },
  'Wrap Skip L2': { main: [[{ node: 'Merge Draft Row', type: 'main', index: 0 }]] },
  'Merge Draft Row': { main: [[{ node: 'Track L2 Verdict', type: 'main', index: 0 }]] },
  'Track L2 Verdict': { main: [[{ node: 'Sheet Append content_drafts', type: 'main', index: 0 }]] },
  'Sheet Append content_drafts': { main: [[{ node: 'Mark Queue Drafted', type: 'main', index: 0 }]] },
  'Mark Queue Drafted': { main: [[{ node: 'Loop Draft Candidates', type: 'main', index: 0 }]] },
  'Track L0 Fail': { main: [[{ node: 'Loop Draft Candidates', type: 'main', index: 0 }]] },
  'Track Parse Fail': { main: [[{ node: 'Loop Draft Candidates', type: 'main', index: 0 }]] },
  'Track L2 Parse Fail': { main: [[{ node: 'Loop Draft Candidates', type: 'main', index: 0 }]] },
  'Track L2 LLM Fail': { main: [[{ node: 'Loop Draft Candidates', type: 'main', index: 0 }]] },
  'No Candidates Summary': { main: [[{ node: 'Build Summary', type: 'main', index: 0 }]] },
};

wireNotifyAfter(nodes, connections, {
  idPrefix: 'a3n',
  fireCode: loadFireNotifyCode('fire-notify-agent3.js', {
    __GOOGLE_SHEET_ID__: PUBLIC.google_sheet_id,
    __CONTENT_DRAFTS_TAB__: PUBLIC.content_drafts_tab,
  }),
  insertAfter: 'Mark Queue Drafted',
  resumeTo: 'Loop Draft Candidates',
  position: pos(7200, 80),
});

const workflow = {
  name: 'Magnix Agent 3 — Lead Magnet Draft (queue → content_drafts)',
  nodes,
  connections,
  pinData: {},
  active: false,
  settings: { executionOrder: 'v1' },
  staticData: null,
  tags: [{ name: 'magnix' }, { name: 'agent-3' }, { name: 'content-draft' }],
  meta: { templateCredsSetupCompleted: false },
};

fs.writeFileSync(path.join(__dirname, 'content-draft.workflow.json'), JSON.stringify(workflow, null, 2));
console.log('Written content-draft.workflow.json —', nodes.length, 'nodes');
