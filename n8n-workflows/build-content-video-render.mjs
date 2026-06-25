#!/usr/bin/env node
/**
 * Build Agent 7 — Creatomate Video Render (video_drafts L3 → MP4)
 * Run: node n8n-workflows/build-content-video-render.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { toN8nInline } from './code/shared/video-drive-name.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const codeDir = path.join(__dirname, 'code', 'content-video-render');
const PUBLIC = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'magnix-public-config.json'), 'utf8')
);

const driveFoldersPath = path.join(__dirname, 'magnix-drive-folders.json');
let driveReadyFolder = PUBLIC.drive_video_folder_ready || '';
if (fs.existsSync(driveFoldersPath)) {
  try {
    const df = JSON.parse(fs.readFileSync(driveFoldersPath, 'utf8'));
    driveReadyFolder = df.folders?.ready_for_review?.id || driveReadyFolder;
  } catch {
    /* keep default */
  }
}

const retentionDays = PUBLIC.video_drive_retention_days_ready ?? 30;
const nameInline = toN8nInline();

const read = (f) =>
  fs
    .readFileSync(path.join(codeDir, f), 'utf8')
    .replace(/^\/\/[^\n]*\n(\/\/[^\n]*\n)*/gm, '')
    .trim();

const readShared = (f) =>
  fs
    .readFileSync(path.join(__dirname, 'code', 'shared', f), 'utf8')
    .replace(/^\/\/[^\n]*\n(\/\/[^\n]*\n)*/gm, '')
    .replace(/\n\/\* eslint-disable[\s\S]*?\*\/\nif \(typeof globalThis[\s\S]*?\n\}/m, '')
    .trim();

const modJson = JSON.stringify(
  PUBLIC.creatomate_modifications || {
    hook: 'Hook-Text',
    body: 'Body-Text',
    caption: 'Caption-Text',
    cta: 'CTA-Text',
    title: 'Title-Text',
    background: 'Background-Video',
    voiceover_text: 'Voiceover',
  }
);

const codes = {
  parseFilter:
    readShared('pexels-stock-query.js') +
    '\n\n' +
    read('01-parse-filter-approved.js').replace(
      '__VIDEO_RENDER_BATCH_SIZE__',
      String(PUBLIC.content_video_render_batch_size ?? 1)
    ),
  envProbe: read('00-env-probe.js'),
  buildPayload:
    readShared('vietnamese-tts-text.js') +
    '\n\n' +
    readShared('elevenlabs-voice-presets.js') +
    '\n\n' +
    readShared('elevenlabs-direct-tts.js') +
    '\n\n' +
    readShared('pexels-stock-query.js') +
    '\n\n' +
    readShared('beats-to-creatomate-source.js') +
    '\n\n' +
    read('02-build-creatomate-payload.js'),
  parseCreate: read('03a-parse-creatomate-create.js'),
  evaluatePoll: read('03c-evaluate-poll.js'),
  prepareSheet: read('04-prepare-sheet-update.js')
    .replace('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
    .replace('__VIDEO_DRAFTS_TAB__', PUBLIC.video_drafts_tab),
  mergeMeta: read('08-merge-meta-for-put.js'),
  trackSheetOk: read('09-track-sheet-ok.js'),
};

const retentionSkip = `return [{ json: { ok: true, cleanup_skip: true, reason: 'Drive retention phase-2' } }];`;

const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${PUBLIC.google_sheet_id}/values/${encodeURIComponent(`${PUBLIC.video_drafts_tab}!A:V`)}`;

const resetStats = `const data = $getWorkflowStaticData('global');
data.a7_stats = { render_ok: 0, render_fail: 0, payload_fail: 0, sheet_fail: 0, no_candidates: false };
data.a7_poll = {};
return $input.all();`;

const trackPayloadFail = `const data = $getWorkflowStaticData('global');
if (!data.a7_stats) data.a7_stats = {};
data.a7_stats.payload_fail = (data.a7_stats.payload_fail || 0) + 1;
return $input.all();`;

const trackRenderFail = `const data = $getWorkflowStaticData('global');
if (!data.a7_stats) data.a7_stats = {};
data.a7_stats.render_fail = (data.a7_stats.render_fail || 0) + 1;
return $input.all();`;

const summary = `const data = $getWorkflowStaticData('global');
const stats = data.a7_stats || {};
const env = data.a7_env || {};
let hint = null;
if ((stats.render_ok || 0) === 0) {
  if (stats.fetch_error) hint = 'Fetch Sheet lỗi — gán googleApi trên Fetch video_drafts';
  else if (stats.no_candidates) hint = stats.skip_hint || 'Không candidate — row cần status=approved + ☑ l3_approved, chưa có meta.render_status';
  else if ((stats.payload_fail || 0) > 0) hint = stats.last_error || 'Payload fail — thiếu beats_json v3 hoặc Header Auth Creatomate';
  else if ((stats.render_fail || 0) > 0) hint = 'Creatomate fail/timeout — xem HTTP POST Creatomate + Evaluate Poll Status';
  else if ((stats.sheet_fail || 0) > 0) hint = 'Render OK nhưng ghi Sheet fail — gán googleApi trên HTTP GET/PUT';
  else hint = 'Mở execution log — Parse Filter / Loop / Creatomate nodes';
} else {
  hint = 'OK — cột meta (V) có render_url; status=ready_for_review';
}
return [{ json: {
  ok: (stats.render_ok || 0) > 0,
  workflow: 'content-video-render',
  stats,
  env_probe: env,
  near_miss: stats.near_miss || null,
  skip_hint: stats.skip_hint || null,
  batch_count: stats.batch_count ?? null,
  batch_size: ${PUBLIC.content_video_render_batch_size ?? 1},
  provider: 'creatomate_renderscript_v2',
  hint,
  finished_at: new Date().toISOString(),
}}];`;

const empty = `const data = $getWorkflowStaticData('global');
if (!data.a7_stats) data.a7_stats = {};
data.a7_stats.no_candidates = true;
return [{ json: { ok: true, empty: true, message: 'No render candidates' } }];`;

const pos = (x, y) => [x, y];

const nodes = [
  {
    parameters: {
      content:
        '## Agent 7 v2 — RenderScript từ beats\\n- **09:45 VN** · max **1**/lần\\n- Đọc `beats_json` → Pexels/scene → Creatomate RenderScript\\n- **Credentials:** googleApi + Header Auth Creatomate\\n- Cần `PEXELS_API_KEY` (B-roll per beat)',
      height: 200,
      width: 420,
    },
    id: 'a700note',
    name: 'Sticky Note',
    type: 'n8n-nodes-base.stickyNote',
    typeVersion: 1,
    position: pos(-480, 160),
  },
  {
    parameters: {
      rule: {
        interval: [{ field: 'cronExpression', expression: PUBLIC.schedule_cron_video_render || '45 9 * * *' }],
      },
    },
    id: 'a701sched',
    name: 'Schedule Daily Video Render',
    type: 'n8n-nodes-base.scheduleTrigger',
    typeVersion: 1.2,
    position: pos(0, 200),
  },
  {
    parameters: {},
    id: 'a702manual',
    name: "When clicking 'Execute workflow'",
    type: 'n8n-nodes-base.manualTrigger',
    typeVersion: 1,
    position: pos(0, 400),
  },
  {
    parameters: {
      method: 'GET',
      url: sheetUrl,
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      options: {},
    },
    id: 'a703fetch',
    name: 'Fetch video_drafts',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(240, 300),
  },
  {
    parameters: { jsCode: codes.parseFilter },
    id: 'a704filter',
    name: 'Parse Filter Approved',
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
            leftValue: '={{ $json.sheet_row }}',
            rightValue: '',
            operator: { type: 'number', operation: 'exists', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a705if',
    name: 'IF Has Candidates',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(720, 300),
  },
  {
    parameters: { jsCode: resetStats },
    id: 'a706reset',
    name: 'Reset Run Stats',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(960, 240),
  },
  {
    parameters: { jsCode: codes.envProbe },
    id: 'a706env',
    name: 'Env Probe Creatomate',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1080, 240),
  },
  {
    parameters: { batchSize: 1, options: {} },
    id: 'a707loop',
    name: 'Loop Render Candidates',
    type: 'n8n-nodes-base.splitInBatches',
    typeVersion: 3,
    position: pos(1320, 240),
  },
  {
    parameters: { jsCode: codes.buildPayload },
    id: 'a708payload',
    name: 'Build Creatomate Payload',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1560, 240),
    onError: 'continueRegularOutput',
    credentials: {
      googleApi: { id: 'magnix-google-sa', name: 'Magnix Google Service Account' },
    },
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
    id: 'a709ifpayload',
    name: 'IF Payload OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(1800, 240),
  },
  {
    parameters: {
      method: 'POST',
      url: 'https://api.creatomate.com/v2/renders',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendBody: true,
      specifyBody: 'json',
      jsonBody: '={{ JSON.stringify($json.creatomate_payload) }}',
      options: {},
    },
    id: 'a710post',
    name: 'HTTP POST Creatomate',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(2040, 160),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.parseCreate },
    id: 'a710parse',
    name: 'Parse Creatomate Create',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2280, 160),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $json.render_id }}',
            rightValue: '',
            operator: { type: 'string', operation: 'notEmpty', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a710ifrid',
    name: 'IF Has Render ID',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(2520, 160),
  },
  {
    parameters: {
      method: 'GET',
      url: "={{ 'https://api.creatomate.com/v2/renders/' + $('Parse Creatomate Create').item.json.render_id }}",
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      options: {},
    },
    id: 'a710get',
    name: 'HTTP GET Creatomate Status',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(2520, 160),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.evaluatePoll },
    id: 'a710eval',
    name: 'Evaluate Poll Status',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2760, 160),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $json.done_polling }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a710ifpoll',
    name: 'IF Poll Done',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(3000, 160),
  },
  {
    parameters: { amount: 15, unit: 'seconds' },
    id: 'a710wait',
    name: 'Wait Poll Interval',
    type: 'n8n-nodes-base.wait',
    typeVersion: 1.1,
    position: pos(3000, 320),
    webhookId: 'a7-poll-wait',
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $json.render_ok }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a711ifrender',
    name: 'IF Render OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(3240, 80),
  },
  {
    parameters: { jsCode: codes.prepareSheet },
    id: 'a712prep',
    name: 'Prepare Sheet Update',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3720, 0),
  },
  {
    parameters: {
      method: 'GET',
      url: '={{ $json.get_meta_url }}',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      options: {},
    },
    id: 'a712get',
    name: 'HTTP GET meta',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(3960, 0),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.mergeMeta },
    id: 'a712merge',
    name: 'Merge Meta for PUT',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(4200, 0),
  },
  {
    parameters: {
      method: 'PUT',
      url: '={{ $json.put_meta_url }}',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      sendBody: true,
      specifyBody: 'json',
      jsonBody: '={{ JSON.stringify($json.meta_body) }}',
      options: {},
    },
    id: 'a712putmeta',
    name: 'HTTP PUT meta',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(4440, 0),
    onError: 'continueRegularOutput',
  },
  {
    parameters: {
      method: 'PUT',
      url: '={{ $(\'Merge Meta for PUT\').item.json.put_status_url }}',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      sendBody: true,
      specifyBody: 'json',
      jsonBody: "={{ JSON.stringify($('Merge Meta for PUT').item.json.status_body) }}",
      options: {},
    },
    id: 'a712putstatus',
    name: 'HTTP PUT status',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(4680, 0),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.trackSheetOk },
    id: 'a712track',
    name: 'Track Sheet OK',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(4920, 0),
  },
  {
    parameters: { jsCode: trackRenderFail },
    id: 'a713fail',
    name: 'Track Render Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3480, 240),
  },
  {
    parameters: { jsCode: trackPayloadFail },
    id: 'a714payloadfail',
    name: 'Track Payload Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2040, 320),
  },
  {
    parameters: { jsCode: summary },
    id: 'a715summary',
    name: 'Build Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1560, 420),
  },
  {
    parameters: { jsCode: retentionSkip },
    id: 'a717retention',
    name: 'Drive Retention Cleanup',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1320, 420),
  },
  {
    parameters: { jsCode: empty },
    id: 'a716empty',
    name: 'No Candidates Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(720, 420),
  },
];

const connections = {
  'Schedule Daily Video Render': { main: [[{ node: 'Fetch video_drafts', type: 'main', index: 0 }]] },
  "When clicking 'Execute workflow'": {
    main: [[{ node: 'Fetch video_drafts', type: 'main', index: 0 }]],
  },
  'Fetch video_drafts': { main: [[{ node: 'Parse Filter Approved', type: 'main', index: 0 }]] },
  'Parse Filter Approved': { main: [[{ node: 'IF Has Candidates', type: 'main', index: 0 }]] },
  'IF Has Candidates': {
    main: [
      [{ node: 'Reset Run Stats', type: 'main', index: 0 }],
      [{ node: 'No Candidates Summary', type: 'main', index: 0 }],
    ],
  },
  'Reset Run Stats': { main: [[{ node: 'Env Probe Creatomate', type: 'main', index: 0 }]] },
  'Env Probe Creatomate': { main: [[{ node: 'Loop Render Candidates', type: 'main', index: 0 }]] },
  'Loop Render Candidates': {
    main: [
      [{ node: 'Build Summary', type: 'main', index: 0 }],
      [{ node: 'Build Creatomate Payload', type: 'main', index: 0 }],
    ],
  },
  'Build Creatomate Payload': { main: [[{ node: 'IF Payload OK', type: 'main', index: 0 }]] },
  'IF Payload OK': {
    main: [
      [{ node: 'HTTP POST Creatomate', type: 'main', index: 0 }],
      [{ node: 'Track Payload Fail', type: 'main', index: 0 }],
    ],
  },
  'HTTP POST Creatomate': { main: [[{ node: 'Parse Creatomate Create', type: 'main', index: 0 }]] },
  'Parse Creatomate Create': { main: [[{ node: 'IF Has Render ID', type: 'main', index: 0 }]] },
  'IF Has Render ID': {
    main: [
      [{ node: 'HTTP GET Creatomate Status', type: 'main', index: 0 }],
      [{ node: 'IF Poll Done', type: 'main', index: 0 }],
    ],
  },
  'HTTP GET Creatomate Status': { main: [[{ node: 'Evaluate Poll Status', type: 'main', index: 0 }]] },
  'Evaluate Poll Status': { main: [[{ node: 'IF Poll Done', type: 'main', index: 0 }]] },
  'IF Poll Done': {
    main: [
      [{ node: 'IF Render OK', type: 'main', index: 0 }],
      [{ node: 'Wait Poll Interval', type: 'main', index: 0 }],
    ],
  },
  'Wait Poll Interval': { main: [[{ node: 'HTTP GET Creatomate Status', type: 'main', index: 0 }]] },
  'IF Render OK': {
    main: [
      [{ node: 'Prepare Sheet Update', type: 'main', index: 0 }],
      [{ node: 'Track Render Fail', type: 'main', index: 0 }],
    ],
  },
  'Prepare Sheet Update': { main: [[{ node: 'HTTP GET meta', type: 'main', index: 0 }]] },
  'HTTP GET meta': { main: [[{ node: 'Merge Meta for PUT', type: 'main', index: 0 }]] },
  'Merge Meta for PUT': { main: [[{ node: 'HTTP PUT meta', type: 'main', index: 0 }]] },
  'HTTP PUT meta': { main: [[{ node: 'HTTP PUT status', type: 'main', index: 0 }]] },
  'HTTP PUT status': { main: [[{ node: 'Track Sheet OK', type: 'main', index: 0 }]] },
  'Track Sheet OK': { main: [[{ node: 'Loop Render Candidates', type: 'main', index: 0 }]] },
  'Track Render Fail': { main: [[{ node: 'Loop Render Candidates', type: 'main', index: 0 }]] },
  'Track Payload Fail': { main: [[{ node: 'Loop Render Candidates', type: 'main', index: 0 }]] },
  'Drive Retention Cleanup': { main: [[{ node: 'Build Summary', type: 'main', index: 0 }]] },
  'No Candidates Summary': { main: [[{ node: 'Build Summary', type: 'main', index: 0 }]] },
};

const workflow = {
  // Giữ tên khớp workflow đang active trên n8n — push cập nhật in-place
  name: 'Magnix Agent 7 — Creatomate Video Render (video_drafts → MP4)',
  nodes,
  connections,
  pinData: {},
  active: false,
  settings: { executionOrder: 'v1' },
  staticData: null,
  tags: [{ name: 'magnix' }, { name: 'agent-7' }, { name: 'content-video-render' }],
  meta: { templateCredsSetupCompleted: false },
};

fs.writeFileSync(
  path.join(__dirname, 'content-video-render.workflow.json'),
  JSON.stringify(workflow, null, 2)
);
console.log('Written content-video-render.workflow.json —', nodes.length, 'nodes');
