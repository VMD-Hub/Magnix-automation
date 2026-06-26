#!/usr/bin/env node
/**
 * Build Agent 4 — Outreach Queue (content_drafts → outreach_queue)
 * Run: node n8n-workflows/build-outreach-queue.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadFireNotifyCode, wireNotifyAfter } from './code/shared/notify-wire.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const codeDir = path.join(__dirname, 'code', 'outreach-queue');
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
  parseFilter: read('01-parse-filter-candidates.js').replace(
    '__OUTREACH_BATCH_SIZE__',
    String(PUBLIC.outreach_batch_size ?? 10)
  ),
  llm: read('02-llm-outreach.js').replace('${ANTHROPIC_DRAFT_MODEL}', draftModel),
  parse: read('03-parse-outreach.js'),
  l0l1: read('04-l0-l1-check.js'),
  merge: read('05-merge-outreach-row.js'),
  append: read('06-sheet-append-outreach.js')
    .replace('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
    .replace('__OUTREACH_QUEUE_TAB__', PUBLIC.outreach_queue_tab),
  markDraft: read('07-mark-draft-outreach.js')
    .replace('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
    .replace('__CONTENT_DRAFTS_TAB__', PUBLIC.content_drafts_tab),
};

const sheetDraftsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${PUBLIC.google_sheet_id}/values/${encodeURIComponent(`${PUBLIC.content_drafts_tab}!A:N`)}`;

const resetStats = `const data = $getWorkflowStaticData('global');
data.a4_stats = { outreach_ok: 0, l0_fail: 0, l1_fail: 0, parse_fail: 0 };
return $input.all();`;

const trackQaFail = `const data = $getWorkflowStaticData('global');
if (!data.a4_stats) data.a4_stats = {};
const j = $input.first().json;
if (j.error === 'L1_LENGTH') data.a4_stats.l1_fail = (data.a4_stats.l1_fail || 0) + 1;
else data.a4_stats.l0_fail = (data.a4_stats.l0_fail || 0) + 1;
return $input.all();`;

const trackParse = `const data = $getWorkflowStaticData('global');
if (!data.a4_stats) data.a4_stats = {};
data.a4_stats.parse_fail = (data.a4_stats.parse_fail || 0) + 1;
return $input.all();`;

const summary = `const data = $getWorkflowStaticData('global');
const stats = data.a4_stats || {};
return [{ json: {
  ok: true,
  workflow: 'outreach-queue',
  stats,
  batch_size: ${PUBLIC.outreach_batch_size ?? 10},
  hint: (stats.outreach_ok || 0) === 0 ? 'Không outreach mới — hết draft hoặc L0/L1 fail' : 'Set l3_approved=true trên Sheet trước khi gửi',
  finished_at: new Date().toISOString(),
}}];`;

const empty = `return [{ json: { ok: true, empty: true, message: 'No outreach candidates' } }];`;

const pos = (x, y) => [x, y];

const nodes = [
  {
    parameters: {
      content:
        '## Agent 4 — Outreach\n- **09:30 VN** · max **10**/lần\n- Input: `content_drafts` status=draft\n- Output: `outreach_queue`\n- **L3 bắt buộc:** `l3_approved=true` trước khi gửi Zalo',
      height: 180,
      width: 400,
    },
    id: 'a400note',
    name: 'Sticky Note',
    type: 'n8n-nodes-base.stickyNote',
    typeVersion: 1,
    position: pos(-480, 160),
  },
  {
    parameters: {
      rule: {
        interval: [{ field: 'cronExpression', expression: PUBLIC.schedule_cron_outreach || '30 9 * * *' }],
      },
    },
    id: 'a401sched',
    name: 'Schedule Daily Outreach',
    type: 'n8n-nodes-base.scheduleTrigger',
    typeVersion: 1.2,
    position: pos(0, 200),
  },
  {
    parameters: {},
    id: 'a402manual',
    name: "When clicking 'Execute workflow'",
    type: 'n8n-nodes-base.manualTrigger',
    typeVersion: 1,
    position: pos(0, 400),
  },
  {
    parameters: {
      method: 'GET',
      url: sheetDraftsUrl,
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      options: {},
    },
    id: 'a403fetch',
    name: 'Fetch content_drafts',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(240, 300),
  },
  {
    parameters: { jsCode: codes.parseFilter },
    id: 'a404filter',
    name: 'Parse Filter Outreach Candidates',
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
    id: 'a405if',
    name: 'IF Has Candidates',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(720, 300),
  },
  {
    parameters: { jsCode: resetStats },
    id: 'a405reset',
    name: 'Reset Run Stats',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(960, 240),
  },
  {
    parameters: { batchSize: 1, options: {} },
    id: 'a406loop',
    name: 'Loop Outreach Candidates',
    type: 'n8n-nodes-base.splitInBatches',
    typeVersion: 3,
    position: pos(1200, 240),
  },
  {
    parameters: { jsCode: codes.llm },
    id: 'a407llm',
    name: 'LLM Outreach Script',
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
    id: 'a408ifllm',
    name: 'IF LLM OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(1680, 240),
  },
  {
    parameters: { jsCode: codes.parse },
    id: 'a409parse',
    name: 'Parse Outreach JSON',
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
    id: 'a410ifparse',
    name: 'IF Parse OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(2160, 160),
  },
  {
    parameters: { jsCode: codes.l0l1 },
    id: 'a411l0l1',
    name: 'L0 L1 Check',
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
            leftValue: '={{ $json.ok }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a412ifqa',
    name: 'IF QA Pass',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(2640, 80),
  },
  {
    parameters: { jsCode: codes.merge },
    id: 'a413merge',
    name: 'Merge Outreach Row',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2880, 0),
  },
  {
    parameters: { jsCode: codes.append },
    id: 'a414append',
    name: 'Sheet Append outreach_queue',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3120, 0),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.markDraft },
    id: 'a415mark',
    name: 'Mark Draft Outreach',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3360, 0),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: trackQaFail },
    id: 'a416qafail',
    name: 'Track QA Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2880, 160),
  },
  {
    parameters: { jsCode: trackParse },
    id: 'a418parsefail',
    name: 'Track Parse Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2400, 240),
  },
  {
    parameters: { jsCode: summary },
    id: 'a419summary',
    name: 'Build Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3600, 300),
  },
  {
    parameters: { jsCode: empty },
    id: 'a420empty',
    name: 'No Candidates Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(720, 420),
  },
];

const connections = {
  'Schedule Daily Outreach': { main: [[{ node: 'Fetch content_drafts', type: 'main', index: 0 }]] },
  "When clicking 'Execute workflow'": {
    main: [[{ node: 'Fetch content_drafts', type: 'main', index: 0 }]],
  },
  'Fetch content_drafts': { main: [[{ node: 'Parse Filter Outreach Candidates', type: 'main', index: 0 }]] },
  'Parse Filter Outreach Candidates': { main: [[{ node: 'IF Has Candidates', type: 'main', index: 0 }]] },
  'IF Has Candidates': {
    main: [
      [{ node: 'Reset Run Stats', type: 'main', index: 0 }],
      [{ node: 'No Candidates Summary', type: 'main', index: 0 }],
    ],
  },
  'Reset Run Stats': { main: [[{ node: 'Loop Outreach Candidates', type: 'main', index: 0 }]] },
  'Loop Outreach Candidates': {
    main: [
      [{ node: 'Build Summary', type: 'main', index: 0 }],
      [{ node: 'LLM Outreach Script', type: 'main', index: 0 }],
    ],
  },
  'LLM Outreach Script': { main: [[{ node: 'IF LLM OK', type: 'main', index: 0 }]] },
  'IF LLM OK': {
    main: [
      [{ node: 'Parse Outreach JSON', type: 'main', index: 0 }],
      [{ node: 'Loop Outreach Candidates', type: 'main', index: 0 }],
    ],
  },
  'Parse Outreach JSON': { main: [[{ node: 'IF Parse OK', type: 'main', index: 0 }]] },
  'IF Parse OK': {
    main: [
      [{ node: 'L0 L1 Check', type: 'main', index: 0 }],
      [{ node: 'Track Parse Fail', type: 'main', index: 0 }],
    ],
  },
  'L0 L1 Check': { main: [[{ node: 'IF QA Pass', type: 'main', index: 0 }]] },
  'IF QA Pass': {
    main: [
      [{ node: 'Merge Outreach Row', type: 'main', index: 0 }],
      [{ node: 'Track QA Fail', type: 'main', index: 0 }],
    ],
  },
  'Track QA Fail': { main: [[{ node: 'Loop Outreach Candidates', type: 'main', index: 0 }]] },
  'Merge Outreach Row': { main: [[{ node: 'Sheet Append outreach_queue', type: 'main', index: 0 }]] },
  'Sheet Append outreach_queue': { main: [[{ node: 'Mark Draft Outreach', type: 'main', index: 0 }]] },
  'Mark Draft Outreach': { main: [[{ node: 'Loop Outreach Candidates', type: 'main', index: 0 }]] },
  'Track Parse Fail': { main: [[{ node: 'Loop Outreach Candidates', type: 'main', index: 0 }]] },
  'No Candidates Summary': { main: [[{ node: 'Build Summary', type: 'main', index: 0 }]] },
};

wireNotifyAfter(nodes, connections, {
  idPrefix: 'a4n',
  fireCode: loadFireNotifyCode('fire-notify-agent4.js', {
    __GOOGLE_SHEET_ID__: PUBLIC.google_sheet_id,
    __OUTREACH_QUEUE_TAB__: PUBLIC.outreach_queue_tab,
  }),
  insertAfter: 'Mark Draft Outreach',
  resumeTo: 'Loop Outreach Candidates',
  position: pos(5520, 0),
});

const workflow = {
  name: 'Magnix Agent 4 — Outreach Queue (drafts → outreach_queue)',
  nodes,
  connections,
  pinData: {},
  active: false,
  settings: { executionOrder: 'v1' },
  staticData: null,
  tags: [{ name: 'magnix' }, { name: 'agent-4' }, { name: 'outreach-queue' }],
  meta: { templateCredsSetupCompleted: false },
};

fs.writeFileSync(path.join(__dirname, 'outreach-queue.workflow.json'), JSON.stringify(workflow, null, 2));
console.log('Written outreach-queue.workflow.json —', nodes.length, 'nodes');
