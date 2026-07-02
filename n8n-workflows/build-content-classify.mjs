#!/usr/bin/env node
/**
 * Build Agent 2 — Content Queue Classify (regex → LLM → Sheet)
 * Run: node n8n-workflows/build-content-classify.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { withPipelineStub } from './code/shared/with-pipeline-stub.mjs';
import { withLlmRouter } from './code/shared/with-llm-router.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const codeDir = path.join(__dirname, 'code', 'content-classify');
const PUBLIC = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'magnix-public-config.json'), 'utf8')
);

const read = (f) =>
  fs
    .readFileSync(path.join(codeDir, f), 'utf8')
    .replace(/^\/\/[^\n]*\n(\/\/[^\n]*\n)*/gm, '')
    .trim();

const llmProviders = PUBLIC.llm_task_providers || {};

const codes = {
  parseFilter: read('01-parse-filter-pending.js').replace(
    '__CLASSIFY_BATCH_SIZE__',
    String(PUBLIC.content_classify_batch_size ?? 200)
  ),
  classifyFast: read('02-classify-fast.js'),
  wrapRegex: read('03-wrap-regex-classify.js'),
  llmRequest: withLlmRouter(read('04-llm-classify-request.js'), llmProviders),
  parseLlm: read('04-parse-llm-json.js'),
  merge: withPipelineStub(read('05-merge-content-row.js')),
  sheetUpdate: read('06-sheet-update-row.js')
    .replace('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
    .replace('__CONTENT_QUEUE_TAB__', PUBLIC.content_queue_tab),
  trackFail: read('07-track-parse-fail.js'),
};

const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${PUBLIC.google_sheet_id}/values/${encodeURIComponent(`${PUBLIC.content_queue_tab}!A:O`)}`;

const resetStatsCode = `const data = $getWorkflowStaticData('global');
data.a2_stats = { sheet_ok: 0, sheet_fail: 0, llm: 0, regex: 0, parse_fail: 0 };
return $input.all();`;

const summaryCode = `const data = $getWorkflowStaticData('global');
const stats = data.a2_stats || {};
let hint = null;
if ((stats.sheet_ok || 0) === 0) {
  hint = 'Không cập nhật dòng nào — hết pending hoặc lỗi credential googleApi trên Sheet Update Row';
} else if ((stats.parse_fail || 0) > 0) {
  hint = 'Có parse_fail — kiểm tra DEEPSEEK/ANTHROPIC key hoặc output LLM';
}
return [{ json: {
  ok: true,
  workflow: 'content-classify',
  stats,
  hint,
  batch_size: ${PUBLIC.content_classify_batch_size ?? 200},
  finished_at: new Date().toISOString(),
}}];`;

const emptyCode = `return [{ json: { ok: true, empty: true, message: 'No pending rows in content_queue' } }];`;

const nodes = [
  {
    parameters: {
      content:
        '## Agent 2 — Content Classify\n- **08:00 VN** hàng ngày, tối đa **200 dòng/lần**\n- Regex trước → LLM nếu `needs_llm`\n- **googleApi** trên Fetch + Sheet Update Row\n- Env: `DEEPSEEK_API_KEY` (rẻ) hoặc `ANTHROPIC_API_KEY`',
      height: 200,
      width: 420,
    },
    id: 'a200note',
    name: 'Sticky Note',
    type: 'n8n-nodes-base.stickyNote',
    typeVersion: 1,
    position: [-480, 160],
  },
  {
    parameters: {
      rule: {
        interval: [{ field: 'cronExpression', expression: PUBLIC.schedule_cron_classify || '0 8 * * *' }],
      },
    },
    id: 'a201sched',
    name: 'Schedule Daily Classify',
    type: 'n8n-nodes-base.scheduleTrigger',
    typeVersion: 1.2,
    position: [0, 200],
  },
  {
    parameters: {},
    id: 'a202manual',
    name: "When clicking 'Execute workflow'",
    type: 'n8n-nodes-base.manualTrigger',
    typeVersion: 1,
    position: [0, 400],
  },
  {
    parameters: {
      method: 'GET',
      url: sheetUrl,
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      options: {},
    },
    id: 'a203fetch',
    name: 'Fetch content_queue',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [240, 300],
  },
  {
    parameters: { jsCode: codes.parseFilter },
    id: 'a204filter',
    name: 'Parse Filter Pending',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [480, 300],
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c-empty',
            leftValue: '={{ $json.empty }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'notEquals' },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a205ifrows',
    name: 'IF Has Pending Rows',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: [720, 300],
  },
  {
    parameters: { jsCode: resetStatsCode },
    id: 'a205reset',
    name: 'Reset Run Stats',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [960, 240],
  },
  {
    parameters: { batchSize: 1, options: {} },
    id: 'a206loop',
    name: 'Loop Pending Rows',
    type: 'n8n-nodes-base.splitInBatches',
    typeVersion: 3,
    position: [1200, 240],
  },
  {
    parameters: { jsCode: codes.classifyFast },
    id: 'a207fast',
    name: 'Classify Fast',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1440, 240],
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c-llm',
            leftValue: '={{ $json.needs_llm }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a208ifllm',
    name: 'IF Needs LLM',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: [1680, 240],
  },
  {
    parameters: { jsCode: codes.llmRequest },
    id: 'a209llm',
    name: 'LLM Classify Request',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1920, 120],
    onError: 'continueRegularOutput',
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c-err',
            leftValue: '={{ $json.error }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'notEquals' },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a209ifok',
    name: 'IF LLM OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: [2160, 120],
  },
  {
    parameters: { jsCode: codes.parseLlm },
    id: 'a210parse',
    name: 'Parse LLM JSON',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [2400, 40],
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c-ok',
            leftValue: '={{ $json.ok }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a211ifparse',
    name: 'IF Parse OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: [2640, 40],
  },
  {
    parameters: { jsCode: codes.wrapRegex },
    id: 'a212wrap',
    name: 'Wrap Regex Classify',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1920, 360],
  },
  {
    parameters: { jsCode: codes.merge },
    id: 'a213merge',
    name: 'Merge Content Row',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [2880, 200],
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c-merge',
            leftValue: '={{ $json.ok }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a214ifmerge',
    name: 'IF Merge OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: [3120, 200],
  },
  {
    parameters: { jsCode: codes.sheetUpdate },
    id: 'a215sheet',
    name: 'Sheet Update Row',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [3360, 120],
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.trackFail },
    id: 'a216fail',
    name: 'Track Parse Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [2880, 0],
  },
  {
    parameters: { jsCode: summaryCode },
    id: 'a217summary',
    name: 'Build Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [3600, 300],
  },
  {
    parameters: { jsCode: emptyCode },
    id: 'a218empty',
    name: 'No Pending Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [720, 420],
  },
];

const connections = {
  'Schedule Daily Classify': { main: [[{ node: 'Fetch content_queue', type: 'main', index: 0 }]] },
  "When clicking 'Execute workflow'": {
    main: [[{ node: 'Fetch content_queue', type: 'main', index: 0 }]],
  },
  'Fetch content_queue': { main: [[{ node: 'Parse Filter Pending', type: 'main', index: 0 }]] },
  'Parse Filter Pending': { main: [[{ node: 'IF Has Pending Rows', type: 'main', index: 0 }]] },
  'IF Has Pending Rows': {
    main: [
      [{ node: 'Reset Run Stats', type: 'main', index: 0 }],
      [{ node: 'No Pending Summary', type: 'main', index: 0 }],
    ],
  },
  'Reset Run Stats': { main: [[{ node: 'Loop Pending Rows', type: 'main', index: 0 }]] },
  'Loop Pending Rows': {
    main: [
      [{ node: 'Build Summary', type: 'main', index: 0 }],
      [{ node: 'Classify Fast', type: 'main', index: 0 }],
    ],
  },
  'Classify Fast': { main: [[{ node: 'IF Needs LLM', type: 'main', index: 0 }]] },
  'IF Needs LLM': {
    main: [
      [{ node: 'LLM Classify Request', type: 'main', index: 0 }],
      [{ node: 'Wrap Regex Classify', type: 'main', index: 0 }],
    ],
  },
  'LLM Classify Request': { main: [[{ node: 'IF LLM OK', type: 'main', index: 0 }]] },
  'IF LLM OK': {
    main: [
      [{ node: 'Parse LLM JSON', type: 'main', index: 0 }],
      [{ node: 'Track Parse Fail', type: 'main', index: 0 }],
    ],
  },
  'Parse LLM JSON': { main: [[{ node: 'IF Parse OK', type: 'main', index: 0 }]] },
  'IF Parse OK': {
    main: [
      [{ node: 'Merge Content Row', type: 'main', index: 0 }],
      [{ node: 'Track Parse Fail', type: 'main', index: 0 }],
    ],
  },
  'Wrap Regex Classify': { main: [[{ node: 'Merge Content Row', type: 'main', index: 0 }]] },
  'Merge Content Row': { main: [[{ node: 'IF Merge OK', type: 'main', index: 0 }]] },
  'IF Merge OK': {
    main: [
      [{ node: 'Sheet Update Row', type: 'main', index: 0 }],
      [{ node: 'Loop Pending Rows', type: 'main', index: 0 }],
    ],
  },
  'Sheet Update Row': { main: [[{ node: 'Loop Pending Rows', type: 'main', index: 0 }]] },
  'Track Parse Fail': { main: [[{ node: 'Loop Pending Rows', type: 'main', index: 0 }]] },
  'No Pending Summary': { main: [[{ node: 'Build Summary', type: 'main', index: 0 }]] },
};

const workflow = {
  name: 'Magnix Agent 2 — Content Classify (regex → LLM → Sheet)',
  nodes,
  connections,
  pinData: {},
  active: false,
  settings: { executionOrder: 'v1' },
  staticData: null,
  tags: [
    { name: 'magnix' },
    { name: 'agent-2' },
    { name: 'content-classify' },
  ],
  meta: { templateCredsSetupCompleted: false },
};

const out = path.join(__dirname, 'content-classify.workflow.json');
fs.writeFileSync(out, JSON.stringify(workflow, null, 2));
console.log('Written', out, '—', nodes.length, 'nodes');
