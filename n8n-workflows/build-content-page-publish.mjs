#!/usr/bin/env node
/**
 * Build content-page-publish — đăng bài Facebook Page từ content_drafts (L3 approved)
 * Run: node n8n-workflows/build-content-page-publish.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const codeDir = path.join(__dirname, 'code', 'content-page-publish');
const PUBLIC = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'magnix-public-config.json'), 'utf8')
);

const read = (f) =>
  fs
    .readFileSync(path.join(codeDir, f), 'utf8')
    .replace(/^\/\/[^\n]*\n(\/\/[^\n]*\n)*/gm, '')
    .trim();

const batch = PUBLIC.content_page_publish_batch_size ?? 3;
const cron = PUBLIC.schedule_cron_page_publish || '0 10,14,18 * * *';

const codes = {
  parseFilter: read('01-parse-filter-due.js').replace(
    '__PAGE_PUBLISH_BATCH_SIZE__',
    String(batch)
  ),
  buildMessage: read('02-build-facebook-message.js'),
  postFacebook: read('03-post-facebook.js'),
  prepareSheet: read('04-prepare-sheet-update.js')
    .replace('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
    .replace('__CONTENT_DRAFTS_TAB__', PUBLIC.content_drafts_tab)
    .replace('__CONTENT_METRICS_TAB__', PUBLIC.content_metrics_tab),
  finalizeSheet: read('05-finalize-sheet-update.js'),
  notifyPin: read('06-notify-pin-request.js'),
  trackL0: read('05-track-l0-fail.js'),
};

const httpGoogle = {
  authentication: 'predefinedCredentialType',
  nodeCredentialType: 'googleApi',
};

const sheetDraftsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${PUBLIC.google_sheet_id}/values/${encodeURIComponent(`${PUBLIC.content_drafts_tab}!A:N`)}`;

const resetStats = `const data = $getWorkflowStaticData('global');
data.cpp_stats = { publish_ok: 0, publish_fail: 0, l0_fail: 0 };
return $input.all();`;

const summary = `const data = $getWorkflowStaticData('global');
const stats = data.cpp_stats || {};
let hint = null;
if ((stats.publish_ok || 0) === 0) {
  if (stats.no_candidates) hint = 'Không candidate — cần approved + fb_page_post|fb_page_post_image + scheduled_at<=now';
  else if ((stats.l0_fail || 0) > 0) hint = 'L0 forbidden — sửa nội dung trên Sheet';
  else if ((stats.publish_fail || 0) > 0) hint = 'Graph API fail — kiểm tra META_PAGE_ACCESS_TOKEN + quyền pages_manage_posts';
  else hint = 'Bật CONTENT_PAGE_PUBLISH_ENABLED=true và điền META_PAGE_ID';
}
return [{ json: {
  ok: true,
  workflow: 'content-page-publish',
  stats,
  batch_size: ${batch},
  hint,
  finished_at: new Date().toISOString(),
}}];`;

const empty = `const data = $getWorkflowStaticData('global');
if (!data.cpp_stats) data.cpp_stats = {};
data.cpp_stats.no_candidates = true;
const msg = $input.first()?.json?.message || 'No page publish candidates';
return [{ json: { ok: true, empty: true, message: msg, blockers: $input.first()?.json?.blockers } }];`;

const pos = (x, y) => [x, y];

const nodes = [
  {
    parameters: {
      content:
        '## Page Publish\n- **10h / 14h / 18h VN** · max **3**/lần\n- Input: `content_drafts` status=**approved**\n- meta: `target_channel=facebook_page`, `scheduled_at` (ISO)\n- Env: `CONTENT_PAGE_PUBLISH_ENABLED`, `META_PAGE_ID` (Page ID, **không** App ID), `META_PAGE_ACCESS_TOKEN` (Page token + `pages_manage_posts`)\n- **googleApi** bắt buộc trên Fetch + PUT/POST Sheet',
      height: 220,
      width: 480,
    },
    id: 'cpp00note',
    name: 'Sticky Note',
    type: 'n8n-nodes-base.stickyNote',
    typeVersion: 1,
    position: pos(-480, 160),
  },
  {
    parameters: {
      rule: {
        interval: [{ field: 'cronExpression', expression: cron }],
      },
    },
    id: 'cpp01sched',
    name: 'Schedule Page Publish',
    type: 'n8n-nodes-base.scheduleTrigger',
    typeVersion: 1.2,
    position: pos(0, 200),
  },
  {
    parameters: {},
    id: 'cpp02manual',
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
    id: 'cpp03fetch',
    name: 'Fetch content_drafts',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(240, 300),
  },
  {
    parameters: { jsCode: codes.parseFilter },
    id: 'cpp04filter',
    name: 'Parse Filter Due Posts',
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
    id: 'cpp05if',
    name: 'IF Has Candidates',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(720, 300),
  },
  {
    parameters: { jsCode: resetStats },
    id: 'cpp06reset',
    name: 'Reset Run Stats',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(960, 240),
  },
  {
    parameters: { batchSize: 1, options: {} },
    id: 'cpp07loop',
    name: 'Loop Page Publish',
    type: 'n8n-nodes-base.splitInBatches',
    typeVersion: 3,
    position: pos(1200, 240),
  },
  {
    parameters: { jsCode: codes.buildMessage },
    id: 'cpp08build',
    name: 'Build Facebook Message',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1440, 240),
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
    id: 'cpp09ifbuild',
    name: 'IF Build OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(1680, 240),
  },
  {
    parameters: { jsCode: codes.postFacebook },
    id: 'cpp10post',
    name: 'POST Facebook Page Feed',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1920, 160),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.prepareSheet },
    id: 'cpp11prepare',
    name: 'Prepare Sheet Update',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2160, 160),
  },
  {
    parameters: {
      method: 'POST',
      url: '={{ $json.sheet_batch_url }}',
      ...httpGoogle,
      sendBody: true,
      specifyBody: 'json',
      jsonBody: '={{ $json.sheet_batch_body }}',
      options: {},
    },
    id: 'cpp11batch',
    name: 'POST Draft Sheet Batch',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(2400, 160),
    onError: 'continueRegularOutput',
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $("Prepare Sheet Update").item.json.need_metrics_append }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'cpp11ifmetrics',
    name: 'IF Append Metrics',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(2640, 160),
  },
  {
    parameters: {
      method: 'POST',
      url: '={{ $("Prepare Sheet Update").item.json.metrics_append_url }}',
      ...httpGoogle,
      sendBody: true,
      specifyBody: 'json',
      jsonBody: '={{ $("Prepare Sheet Update").item.json.metrics_append_body }}',
      options: {},
    },
    id: 'cpp11postmetrics',
    name: 'POST content_metrics',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(2880, 80),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.finalizeSheet },
    id: 'cpp11finalize',
    name: 'Finalize Sheet Update',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3120, 160),
  },
  {
    parameters: { jsCode: codes.notifyPin },
    id: 'cpp11pinnotify',
    name: 'Notify Pin Request',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3360, 160),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.trackL0 },
    id: 'cpp12l0',
    name: 'Track L0 Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1920, 320),
  },
  {
    parameters: { jsCode: summary },
    id: 'cpp13summary',
    name: 'Build Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3600, 300),
  },
  {
    parameters: { jsCode: empty },
    id: 'cpp14empty',
    name: 'No Candidates Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(720, 420),
  },
];

const connections = {
  'Schedule Page Publish': { main: [[{ node: 'Fetch content_drafts', type: 'main', index: 0 }]] },
  "When clicking 'Execute workflow'": {
    main: [[{ node: 'Fetch content_drafts', type: 'main', index: 0 }]],
  },
  'Fetch content_drafts': { main: [[{ node: 'Parse Filter Due Posts', type: 'main', index: 0 }]] },
  'Parse Filter Due Posts': { main: [[{ node: 'IF Has Candidates', type: 'main', index: 0 }]] },
  'IF Has Candidates': {
    main: [
      [{ node: 'Reset Run Stats', type: 'main', index: 0 }],
      [{ node: 'No Candidates Summary', type: 'main', index: 0 }],
    ],
  },
  'Reset Run Stats': { main: [[{ node: 'Loop Page Publish', type: 'main', index: 0 }]] },
  'Loop Page Publish': {
    main: [
      [{ node: 'Build Summary', type: 'main', index: 0 }],
      [{ node: 'Build Facebook Message', type: 'main', index: 0 }],
    ],
  },
  'Build Facebook Message': { main: [[{ node: 'IF Build OK', type: 'main', index: 0 }]] },
  'IF Build OK': {
    main: [
      [{ node: 'POST Facebook Page Feed', type: 'main', index: 0 }],
      [{ node: 'Track L0 Fail', type: 'main', index: 0 }],
    ],
  },
  'POST Facebook Page Feed': { main: [[{ node: 'Prepare Sheet Update', type: 'main', index: 0 }]] },
  'Prepare Sheet Update': { main: [[{ node: 'POST Draft Sheet Batch', type: 'main', index: 0 }]] },
  'POST Draft Sheet Batch': { main: [[{ node: 'IF Append Metrics', type: 'main', index: 0 }]] },
  'IF Append Metrics': {
    main: [
      [{ node: 'POST content_metrics', type: 'main', index: 0 }],
      [{ node: 'Finalize Sheet Update', type: 'main', index: 0 }],
    ],
  },
  'POST content_metrics': { main: [[{ node: 'Finalize Sheet Update', type: 'main', index: 0 }]] },
  'Finalize Sheet Update': { main: [[{ node: 'Notify Pin Request', type: 'main', index: 0 }]] },
  'Notify Pin Request': { main: [[{ node: 'Loop Page Publish', type: 'main', index: 0 }]] },
  'Track L0 Fail': { main: [[{ node: 'Loop Page Publish', type: 'main', index: 0 }]] },
  'No Candidates Summary': { main: [[{ node: 'Build Summary', type: 'main', index: 0 }]] },
};

const workflow = {
  name: 'Magnix — Facebook Page Publish (content_drafts → Graph API)',
  nodes,
  connections,
  pinData: {},
  active: false,
  settings: { executionOrder: 'v1' },
  staticData: null,
  tags: [{ name: 'magnix' }, { name: 'content-page-publish' }, { name: 'facebook' }],
  meta: { templateCredsSetupCompleted: false },
};

fs.writeFileSync(
  path.join(__dirname, 'content-page-publish.workflow.json'),
  JSON.stringify(workflow, null, 2)
);
console.log('Written content-page-publish.workflow.json —', nodes.length, 'nodes');
