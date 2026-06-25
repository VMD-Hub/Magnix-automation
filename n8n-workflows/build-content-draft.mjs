#!/usr/bin/env node
/**
 * Build Agent 3 — Lead Magnet Draft (content_queue → content_drafts)
 * Run: node n8n-workflows/build-content-draft.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const codeDir = path.join(__dirname, 'code', 'content-draft');
const PUBLIC = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'magnix-public-config.json'), 'utf8')
);

const read = (f) =>
  fs
    .readFileSync(path.join(codeDir, f), 'utf8')
    .replace(/^\/\/[^\n]*\n(\/\/[^\n]*\n)*/gm, '')
    .trim();

const draftModel = PUBLIC.anthropic_draft_model || PUBLIC.anthropic_model;

const codes = {
  parseFilter: read('01-parse-filter-candidates.js')
    .replace('__DRAFT_MIN_SCORE__', String(PUBLIC.draft_min_score ?? 70))
    .replace('__DRAFT_BATCH_SIZE__', String(PUBLIC.content_draft_batch_size ?? 5)),
  llm: read('02-llm-lead-magnet.js').replace('${ANTHROPIC_DRAFT_MODEL}', draftModel),
  parse: read('03-parse-lead-magnet.js'),
  l0: read('04-l0-forbidden-check.js'),
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
data.a3_stats = { draft_ok: 0, draft_fail: 0, l0_fail: 0, parse_fail: 0 };
return $input.all();`;

const trackL0Fail = `const data = $getWorkflowStaticData('global');
if (!data.a3_stats) data.a3_stats = {};
data.a3_stats.l0_fail = (data.a3_stats.l0_fail || 0) + 1;
return $input.all();`;

const trackParseFail = `const data = $getWorkflowStaticData('global');
if (!data.a3_stats) data.a3_stats = {};
data.a3_stats.parse_fail = (data.a3_stats.parse_fail || 0) + 1;
return $input.all();`;

const summary = `const data = $getWorkflowStaticData('global');
const stats = data.a3_stats || {};
return [{ json: {
  ok: true,
  workflow: 'content-draft',
  stats,
  batch_size: ${PUBLIC.content_draft_batch_size ?? 5},
  hint: (stats.draft_ok || 0) === 0 ? 'Không draft mới — hết candidate hoặc lỗi LLM/L0' : null,
  finished_at: new Date().toISOString(),
}}];`;

const empty = `return [{ json: { ok: true, empty: true, message: 'No draft candidates' } }];`;

const pos = (x, y) => [x, y];

const nodes = [
  {
    parameters: {
      content:
        '## Agent 3 — Lead Magnet\n- **09:00 VN** · max **5**/lần\n- Input: `content_queue` score≥70 classified\n- Output: tab `content_drafts`\n- **L3:** duyệt `status=approved` trên Sheet trước publish',
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
    parameters: { batchSize: 1, options: {} },
    id: 'a306loop',
    name: 'Loop Draft Candidates',
    type: 'n8n-nodes-base.splitInBatches',
    typeVersion: 3,
    position: pos(1200, 240),
  },
  {
    parameters: { jsCode: codes.llm },
    id: 'a307llm',
    name: 'LLM Lead Magnet',
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
    id: 'a308ifllm',
    name: 'IF LLM OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(1680, 240),
  },
  {
    parameters: { jsCode: codes.parse },
    id: 'a309parse',
    name: 'Parse Lead Magnet JSON',
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
    id: 'a310ifparse',
    name: 'IF Parse OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(2160, 160),
  },
  {
    parameters: { jsCode: codes.l0 },
    id: 'a311l0',
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
    id: 'a312ifl0',
    name: 'IF L0 Pass',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(2640, 80),
  },
  {
    parameters: { jsCode: codes.merge },
    id: 'a313merge',
    name: 'Merge Draft Row',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2880, 0),
  },
  {
    parameters: { jsCode: codes.append },
    id: 'a314append',
    name: 'Sheet Append content_drafts',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3120, 0),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.markQueue },
    id: 'a315mark',
    name: 'Mark Queue Drafted',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3360, 0),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: trackL0Fail },
    id: 'a316l0fail',
    name: 'Track L0 Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2880, 160),
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
  'Reset Run Stats': { main: [[{ node: 'Loop Draft Candidates', type: 'main', index: 0 }]] },
  'Loop Draft Candidates': {
    main: [
      [{ node: 'Build Summary', type: 'main', index: 0 }],
      [{ node: 'LLM Lead Magnet', type: 'main', index: 0 }],
    ],
  },
  'LLM Lead Magnet': { main: [[{ node: 'IF LLM OK', type: 'main', index: 0 }]] },
  'IF LLM OK': {
    main: [
      [{ node: 'Parse Lead Magnet JSON', type: 'main', index: 0 }],
      [{ node: 'Loop Draft Candidates', type: 'main', index: 0 }],
    ],
  },
  'Parse Lead Magnet JSON': { main: [[{ node: 'IF Parse OK', type: 'main', index: 0 }]] },
  'IF Parse OK': {
    main: [
      [{ node: 'L0 Forbidden Check', type: 'main', index: 0 }],
      [{ node: 'Track Parse Fail', type: 'main', index: 0 }],
    ],
  },
  'L0 Forbidden Check': { main: [[{ node: 'IF L0 Pass', type: 'main', index: 0 }]] },
  'IF L0 Pass': {
    main: [
      [{ node: 'Merge Draft Row', type: 'main', index: 0 }],
      [{ node: 'Track L0 Fail', type: 'main', index: 0 }],
    ],
  },
  'Merge Draft Row': { main: [[{ node: 'Sheet Append content_drafts', type: 'main', index: 0 }]] },
  'Sheet Append content_drafts': { main: [[{ node: 'Mark Queue Drafted', type: 'main', index: 0 }]] },
  'Mark Queue Drafted': { main: [[{ node: 'Loop Draft Candidates', type: 'main', index: 0 }]] },
  'Track L0 Fail': { main: [[{ node: 'Loop Draft Candidates', type: 'main', index: 0 }]] },
  'Track Parse Fail': { main: [[{ node: 'Loop Draft Candidates', type: 'main', index: 0 }]] },
  'No Candidates Summary': { main: [[{ node: 'Build Summary', type: 'main', index: 0 }]] },
};

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
