#!/usr/bin/env node
/**
 * Build Agent 3b — Carousel Draft (content_queue → content_drafts)
 * Run: node n8n-workflows/build-content-carousel-draft.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractSystemPrompt } from './code/shared/extract-prompt.mjs';
import { withPipelineStub } from './code/shared/with-pipeline-stub.mjs';
import { withLlmRouter } from './code/shared/with-llm-router.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const codeDir = path.join(__dirname, 'code', 'content-carousel-draft');
const PUBLIC = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'magnix-public-config.json'), 'utf8')
);
const DISCLAIMER_CFG = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'disclaimers.json'), 'utf8')
);
const FORMAT_ROUTING = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'format_routing.json'), 'utf8')
);
const CAROUSEL_CFG = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'carousel_templates.json'), 'utf8')
);

const read = (f) =>
  fs
    .readFileSync(path.join(codeDir, f), 'utf8')
    .replace(/^\/\/[^\n]*\n(\/\/[^\n]*\n)*/gm, '')
    .trim();

const carouselSystem = extractSystemPrompt('ai-agents-prompts/n8n__carousel-draft.md');
const llmProviders = PUBLIC.llm_task_providers || {};

const codes = {
  parseFilter: withPipelineStub(
    read('01-parse-filter-candidates.js')
      .replace('__CAROUSEL_DRAFT_MIN_SCORE__', String(PUBLIC.carousel_draft_min_score ?? 70))
      .replace('__CAROUSEL_DRAFT_BATCH_SIZE__', String(PUBLIC.content_carousel_draft_batch_size ?? 3))
      .replace('__FORMAT_ROUTING_JSON__', JSON.stringify(FORMAT_ROUTING))
  ),
  llm: withLlmRouter(
    read('02-llm-carousel.js')
      .replace('__CAROUSEL_TEMPLATES_JSON__', JSON.stringify(CAROUSEL_CFG))
      .replace(
        '__CAROUSEL_DRAFT_SYSTEM__',
        carouselSystem.replace(/\\/g, '\\\\').replace(/`/g, '\\`')
      ),
    llmProviders
  ),
  parse: read('03-parse-carousel.js').replace(
    '__CAROUSEL_TEMPLATES_JSON__',
    JSON.stringify(CAROUSEL_CFG)
  ),
  l0: read('04-l0-forbidden-check.js'),
  merge: read('05-merge-carousel-row.js').replace(
    '__DISCLAIMER_CONFIG_JSON__',
    JSON.stringify(DISCLAIMER_CFG)
  ),
  resolvePut: read('06-resolve-draft-put.js')
    .replace('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
    .replace('__CONTENT_DRAFTS_TAB__', PUBLIC.content_drafts_tab),
  trackOk: read('07-track-ok.js'),
  prepareMark: read('08-prepare-queue-mark.js')
    .replace('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
    .replace('__CONTENT_QUEUE_TAB__', PUBLIC.content_queue_tab),
  mergeQueueMeta: read('09-merge-queue-meta.js'),
};

const sheetQueueUrl = `https://sheets.googleapis.com/v4/spreadsheets/${PUBLIC.google_sheet_id}/values/${encodeURIComponent(`${PUBLIC.content_queue_tab}!A:O`)}`;
const sheetDraftKeysUrl = `https://sheets.googleapis.com/v4/spreadsheets/${PUBLIC.google_sheet_id}/values/${encodeURIComponent(`${PUBLIC.content_drafts_tab}!A2:D500`)}`;

const resetStats = `const data = $getWorkflowStaticData('global');
data.a3b_stats = { carousel_ok: 0, carousel_fail: 0, l0_fail: 0, parse_fail: 0, llm_fail: 0, no_candidates: false };
return $input.all();`;

const trackL0Fail = `const data = $getWorkflowStaticData('global');
if (!data.a3b_stats) data.a3b_stats = {};
data.a3b_stats.l0_fail = (data.a3b_stats.l0_fail || 0) + 1;
return $input.all();`;

const trackParseFail = `const data = $getWorkflowStaticData('global');
if (!data.a3b_stats) data.a3b_stats = {};
data.a3b_stats.parse_fail = (data.a3b_stats.parse_fail || 0) + 1;
return $input.all();`;

const trackLlmFail = `const data = $getWorkflowStaticData('global');
if (!data.a3b_stats) data.a3b_stats = {};
data.a3b_stats.llm_fail = (data.a3b_stats.llm_fail || 0) + 1;
return $input.all();`;

const summary = `const data = $getWorkflowStaticData('global');
const stats = data.a3b_stats || {};
let hint = null;
if ((stats.carousel_ok || 0) === 0) {
  if (stats.no_candidates) hint = 'Không candidate — cần carousel_image + editorial_brief_v1 (Layer B)';
  else if ((stats.llm_fail || 0) > 0) hint = 'LLM fail — kiểm tra DEEPSEEK_API_KEY';
  else if ((stats.parse_fail || 0) > 0) hint = 'Parse fail — xem Parse Carousel JSON';
  else if ((stats.l0_fail || 0) > 0) hint = 'L0 chặn — xem L0 Forbidden Check';
}
return [{ json: {
  ok: true,
  workflow: 'content-carousel-draft',
  stats,
  batch_size: ${PUBLIC.content_carousel_draft_batch_size ?? 3},
  hint,
  finished_at: new Date().toISOString(),
}}];`;

const empty = `const data = $getWorkflowStaticData('global');
if (!data.a3b_stats) data.a3b_stats = {};
data.a3b_stats.no_candidates = true;
return [{ json: { ok: true, empty: true, message: $input.first()?.json?.message || 'No carousel candidates' } }];`;

const pos = (x, y) => [x, y];

const nodes = [
  {
    parameters: {
      content:
        '## Agent 3b — Carousel Draft\n- **09:20 VN** · max **3**/lần\n- Input: `carousel_image` + `editorial_brief_v1`\n- Output: `content_drafts` (slides trong meta)',
      height: 180,
      width: 400,
    },
    id: 'a3bnote',
    name: 'Sticky Note',
    type: 'n8n-nodes-base.stickyNote',
    typeVersion: 1,
    position: pos(-480, 160),
  },
  {
    parameters: {
      rule: {
        interval: [{ field: 'cronExpression', expression: PUBLIC.schedule_cron_carousel_draft || '20 9 * * *' }],
      },
    },
    id: 'a3b1sched',
    name: 'Schedule Daily Carousel Draft',
    type: 'n8n-nodes-base.scheduleTrigger',
    typeVersion: 1.2,
    position: pos(0, 200),
  },
  {
    parameters: {},
    id: 'a3b2manual',
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
    id: 'a3b3fetch',
    name: 'Fetch content_queue',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(240, 300),
  },
  {
    parameters: { jsCode: codes.parseFilter },
    id: 'a3b4filter',
    name: 'Parse Filter Carousel Candidates',
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
    id: 'a3b5if',
    name: 'IF Has Candidates',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(720, 300),
  },
  {
    parameters: { jsCode: resetStats },
    id: 'a3b6reset',
    name: 'Reset Run Stats',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(960, 240),
  },
  {
    parameters: { batchSize: 1, options: {} },
    id: 'a3b7loop',
    name: 'Loop Carousel Candidates',
    type: 'n8n-nodes-base.splitInBatches',
    typeVersion: 3,
    position: pos(1200, 240),
  },
  {
    parameters: { jsCode: codes.llm },
    id: 'a3b8llm',
    name: 'LLM Carousel Draft',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1440, 240),
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
    id: 'a3b9ifllm',
    name: 'IF LLM OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(1680, 240),
  },
  {
    parameters: { jsCode: codes.parse },
    id: 'a3b10parse',
    name: 'Parse Carousel JSON',
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
            leftValue: '={{ $json.ok }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a3b11ifparse',
    name: 'IF Parse OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(2160, 160),
  },
  {
    parameters: { jsCode: codes.l0 },
    id: 'a3b12l0',
    name: 'L0 Forbidden Check',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2400, 80),
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
    id: 'a3b13ifl0',
    name: 'IF L0 Pass',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(2640, 80),
  },
  {
    parameters: { jsCode: codes.merge },
    id: 'a3b14merge',
    name: 'Merge Carousel Row',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2880, 0),
  },
  {
    parameters: {
      method: 'GET',
      url: sheetDraftKeysUrl,
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      options: {},
    },
    id: 'a3b15getdrafts',
    name: 'HTTP GET content_drafts keys',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(3120, 0),
  },
  {
    parameters: { jsCode: codes.resolvePut },
    id: 'a3b16resolve',
    name: 'Resolve Draft Put Row',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3360, 0),
  },
  {
    parameters: {
      method: 'PUT',
      url: '={{ $json.put_url }}',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      sendBody: true,
      specifyBody: 'json',
      jsonBody: '={{ JSON.stringify($json.put_body) }}',
      options: {},
    },
    id: 'a3b17put',
    name: 'HTTP PUT content_drafts row',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(3600, 0),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.trackOk },
    id: 'a3b18track',
    name: 'Track Carousel OK',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3840, 0),
  },
  {
    parameters: { jsCode: codes.prepareMark },
    id: 'a3b19prep',
    name: 'Prepare Queue Mark',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(4080, 0),
  },
  {
    parameters: {
      method: 'GET',
      url: '={{ $json.get_url }}',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      options: {},
    },
    id: 'a3b20getq',
    name: 'HTTP GET queue meta',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(4320, 0),
  },
  {
    parameters: { jsCode: codes.mergeQueueMeta },
    id: 'a3b21mergeq',
    name: 'Merge Queue Meta',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(4560, 0),
  },
  {
    parameters: {
      method: 'PUT',
      url: '={{ $json.put_url }}',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      sendBody: true,
      specifyBody: 'json',
      jsonBody: '={{ JSON.stringify($json.put_body) }}',
      options: {},
    },
    id: 'a3b22putq',
    name: 'HTTP PUT queue meta',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(4800, 0),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: trackLlmFail },
    id: 'a3b23llmfail',
    name: 'Track LLM Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1680, 360),
  },
  {
    parameters: { jsCode: trackL0Fail },
    id: 'a3b24l0fail',
    name: 'Track L0 Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2880, 160),
  },
  {
    parameters: { jsCode: trackParseFail },
    id: 'a3b25parsefail',
    name: 'Track Parse Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2400, 240),
  },
  {
    parameters: { jsCode: summary },
    id: 'a3b26summary',
    name: 'Build Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3600, 300),
  },
  {
    parameters: { jsCode: empty },
    id: 'a3b27empty',
    name: 'No Candidates Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(720, 420),
  },
];

const connections = {
  'Schedule Daily Carousel Draft': { main: [[{ node: 'Fetch content_queue', type: 'main', index: 0 }]] },
  "When clicking 'Execute workflow'": {
    main: [[{ node: 'Fetch content_queue', type: 'main', index: 0 }]],
  },
  'Fetch content_queue': { main: [[{ node: 'Parse Filter Carousel Candidates', type: 'main', index: 0 }]] },
  'Parse Filter Carousel Candidates': { main: [[{ node: 'IF Has Candidates', type: 'main', index: 0 }]] },
  'IF Has Candidates': {
    main: [
      [{ node: 'Reset Run Stats', type: 'main', index: 0 }],
      [{ node: 'No Candidates Summary', type: 'main', index: 0 }],
    ],
  },
  'Reset Run Stats': { main: [[{ node: 'Loop Carousel Candidates', type: 'main', index: 0 }]] },
  'Loop Carousel Candidates': {
    main: [
      [{ node: 'Build Summary', type: 'main', index: 0 }],
      [{ node: 'LLM Carousel Draft', type: 'main', index: 0 }],
    ],
  },
  'LLM Carousel Draft': { main: [[{ node: 'IF LLM OK', type: 'main', index: 0 }]] },
  'IF LLM OK': {
    main: [
      [{ node: 'Parse Carousel JSON', type: 'main', index: 0 }],
      [{ node: 'Track LLM Fail', type: 'main', index: 0 }],
    ],
  },
  'Parse Carousel JSON': { main: [[{ node: 'IF Parse OK', type: 'main', index: 0 }]] },
  'IF Parse OK': {
    main: [
      [{ node: 'L0 Forbidden Check', type: 'main', index: 0 }],
      [{ node: 'Track Parse Fail', type: 'main', index: 0 }],
    ],
  },
  'L0 Forbidden Check': { main: [[{ node: 'IF L0 Pass', type: 'main', index: 0 }]] },
  'IF L0 Pass': {
    main: [
      [{ node: 'Merge Carousel Row', type: 'main', index: 0 }],
      [{ node: 'Track L0 Fail', type: 'main', index: 0 }],
    ],
  },
  'Merge Carousel Row': { main: [[{ node: 'HTTP GET content_drafts keys', type: 'main', index: 0 }]] },
  'HTTP GET content_drafts keys': { main: [[{ node: 'Resolve Draft Put Row', type: 'main', index: 0 }]] },
  'Resolve Draft Put Row': { main: [[{ node: 'HTTP PUT content_drafts row', type: 'main', index: 0 }]] },
  'HTTP PUT content_drafts row': { main: [[{ node: 'Track Carousel OK', type: 'main', index: 0 }]] },
  'Track Carousel OK': { main: [[{ node: 'Prepare Queue Mark', type: 'main', index: 0 }]] },
  'Prepare Queue Mark': { main: [[{ node: 'HTTP GET queue meta', type: 'main', index: 0 }]] },
  'HTTP GET queue meta': { main: [[{ node: 'Merge Queue Meta', type: 'main', index: 0 }]] },
  'Merge Queue Meta': { main: [[{ node: 'HTTP PUT queue meta', type: 'main', index: 0 }]] },
  'HTTP PUT queue meta': { main: [[{ node: 'Loop Carousel Candidates', type: 'main', index: 0 }]] },
  'Track L0 Fail': { main: [[{ node: 'Loop Carousel Candidates', type: 'main', index: 0 }]] },
  'Track LLM Fail': { main: [[{ node: 'Loop Carousel Candidates', type: 'main', index: 0 }]] },
  'Track Parse Fail': { main: [[{ node: 'Loop Carousel Candidates', type: 'main', index: 0 }]] },
  'No Candidates Summary': { main: [[{ node: 'Build Summary', type: 'main', index: 0 }]] },
};

const workflow = {
  name: 'Magnix Agent 3b — Carousel Draft (queue → content_drafts)',
  nodes,
  connections,
  pinData: {},
  active: false,
  settings: { executionOrder: 'v1' },
  staticData: null,
  tags: [{ name: 'magnix' }, { name: 'agent-3b' }, { name: 'content-carousel-draft' }],
  meta: { templateCredsSetupCompleted: false },
};

fs.writeFileSync(
  path.join(__dirname, 'content-carousel-draft.workflow.json'),
  JSON.stringify(workflow, null, 2)
);
console.log('Written content-carousel-draft.workflow.json —', nodes.length, 'nodes');
