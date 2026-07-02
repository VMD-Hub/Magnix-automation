#!/usr/bin/env node
/**
 * Build content-page-cover — Gemini image → Drive → meta.publish_image_url
 * Run: node n8n-workflows/build-content-page-cover.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const codeDir = path.join(__dirname, 'code', 'content-page-cover');
const PUBLIC = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'magnix-public-config.json'), 'utf8')
);

const read = (f) =>
  fs
    .readFileSync(path.join(codeDir, f), 'utf8')
    .replace(/^\/\/[^\n]*\n(\/\/[^\n]*\n)*/gm, '')
    .trim();

const batch = PUBLIC.content_page_cover_batch_size ?? 3;
const cron = PUBLIC.schedule_cron_page_cover || '30 9 * * *';

const driveCoversFolder =
  PUBLIC.drive_page_covers_folder_id
  || process.env.DRIVE_PAGE_COVERS_FOLDER_ID
  || '__DRIVE_PAGE_COVERS_FOLDER_ID__';

const codes = {
  parseFilter: read('01-parse-filter-candidates.js').replace(
    '__PAGE_COVER_BATCH_SIZE__',
    String(batch)
  ),
  buildPrompt: read('02-build-cover-prompt.js'),
  generateGemini: read('03-generate-image-gemini.js'),
  uploadDrive: read('04-upload-drive-share.js').replace(
    '__DRIVE_PAGE_COVERS_FOLDER_ID__',
    driveCoversFolder
  ),
  updateSheet: read('05-update-sheet-meta.js')
    .replace('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
    .replace('__CONTENT_DRAFTS_TAB__', PUBLIC.content_drafts_tab),
  trackFail: read('06-track-fail.js'),
};

const httpGoogle = {
  authentication: 'predefinedCredentialType',
  nodeCredentialType: 'googleApi',
};

const sheetDraftsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${PUBLIC.google_sheet_id}/values/${encodeURIComponent(`${PUBLIC.content_drafts_tab}!A:N`)}`;

const resetStats = `const data = $getWorkflowStaticData('global');
data.cpc_stats = { cover_ok: 0, generate_fail: 0, drive_fail: 0, other_fail: 0 };
return $input.all();`;

const summary = `const data = $getWorkflowStaticData('global');
const stats = data.cpc_stats || {};
let hint = null;
if ((stats.cover_ok || 0) === 0) {
  if (stats.no_candidates) hint = 'Không candidate — cần fb_page_post_image + thiếu publish_image_url';
  else if ((stats.generate_fail || 0) > 0) hint = 'Gemini fail — kiểm tra GEMINI_API_KEY + GEMINI_IMAGE_MODEL';
  else if ((stats.drive_fail || 0) > 0) hint = 'Drive upload fail — googleApi credential + DRIVE_PAGE_COVERS_FOLDER_ID';
  else hint = 'Bật CONTENT_PAGE_COVER_ENABLED=true + GEMINI_API_KEY';
}
return [{ json: {
  ok: true,
  workflow: 'content-page-cover',
  stats,
  batch_size: ${batch},
  hint,
  finished_at: new Date().toISOString(),
}}];`;

const empty = `const data = $getWorkflowStaticData('global');
if (!data.cpc_stats) data.cpc_stats = {};
data.cpc_stats.no_candidates = true;
const msg = $input.first()?.json?.message || 'No cover candidates';
return [{ json: { ok: true, empty: true, message: msg, blockers: $input.first()?.json?.blockers } }];`;

const trackOk = `const data = $getWorkflowStaticData('global');
if (!data.cpc_stats) data.cpc_stats = {};
data.cpc_stats.cover_ok = (data.cpc_stats.cover_ok || 0) + 1;
return $input.all();`;

const pos = (x, y) => [x, y];

const nodes = [
  {
    parameters: {
      content:
        '## Page Cover (Gemini → Drive)\n- **09:30 VN** · max **3**/lần (trước Page Publish 10h)\n- Input: `content_drafts` `fb_page_post_image` thiếu `publish_image_url`\n- Env: `CONTENT_PAGE_COVER_ENABLED`, `GEMINI_API_KEY`, `DRIVE_PAGE_COVERS_FOLDER_ID`\n- Output: `meta.publish_image_url` (Drive public)',
      height: 200,
      width: 520,
    },
    id: 'cpc00note',
    name: 'Sticky Note',
    type: 'n8n-nodes-base.stickyNote',
    typeVersion: 1,
    position: pos(-480, 160),
  },
  {
    parameters: {
      rule: { interval: [{ field: 'cronExpression', expression: cron }] },
    },
    id: 'cpc01sched',
    name: 'Schedule Page Cover',
    type: 'n8n-nodes-base.scheduleTrigger',
    typeVersion: 1.2,
    position: pos(0, 200),
  },
  {
    parameters: {},
    id: 'cpc02manual',
    name: "When clicking 'Execute workflow'",
    type: 'n8n-nodes-base.manualTrigger',
    typeVersion: 1,
    position: pos(0, 400),
  },
  {
    parameters: {
      method: 'GET',
      url: sheetDraftsUrl,
      ...httpGoogle,
      options: {},
    },
    id: 'cpc03fetch',
    name: 'Fetch content_drafts',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(240, 300),
  },
  {
    parameters: { jsCode: codes.parseFilter },
    id: 'cpc04filter',
    name: 'Parse Filter Cover Candidates',
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
    id: 'cpc05if',
    name: 'IF Has Candidates',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(720, 300),
  },
  {
    parameters: { jsCode: resetStats },
    id: 'cpc06reset',
    name: 'Reset Run Stats',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(960, 240),
  },
  {
    parameters: { batchSize: 1, options: {} },
    id: 'cpc07loop',
    name: 'Loop Cover Candidates',
    type: 'n8n-nodes-base.splitInBatches',
    typeVersion: 3,
    position: pos(1200, 240),
  },
  {
    parameters: { jsCode: codes.buildPrompt },
    id: 'cpc08prompt',
    name: 'Build Cover Prompt',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1440, 240),
  },
  {
    parameters: { jsCode: codes.generateGemini },
    id: 'cpc09gemini',
    name: 'Generate Image Gemini',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1680, 240),
    onError: 'continueRegularOutput',
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $json.generate_ok }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'cpc10ifgen',
    name: 'IF Generate OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(1920, 240),
  },
  {
    parameters: { jsCode: codes.uploadDrive },
    id: 'cpc11drive',
    name: 'Upload Drive Share',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2160, 160),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.updateSheet },
    id: 'cpc12sheet',
    name: 'Prepare Sheet Meta Update',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2400, 160),
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
    id: 'cpc13batch',
    name: 'POST Draft Sheet Batch',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(2640, 160),
    onError: 'continueRegularOutput',
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $("Prepare Sheet Meta Update").item.json.cover_ok }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'cpc13ifok',
    name: 'IF Cover Sheet OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(2880, 160),
  },
  {
    parameters: { jsCode: trackOk },
    id: 'cpc14ok',
    name: 'Track Cover OK',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3120, 80),
  },
  {
    parameters: { jsCode: codes.trackFail },
    id: 'cpc15fail',
    name: 'Track Cover Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3120, 240),
  },
  {
    parameters: { jsCode: summary },
    id: 'cpc16summary',
    name: 'Build Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3120, 300),
  },
  {
    parameters: { jsCode: empty },
    id: 'cpc17empty',
    name: 'No Candidates Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(720, 420),
  },
];

const connections = {
  'Schedule Page Cover': { main: [[{ node: 'Fetch content_drafts', type: 'main', index: 0 }]] },
  "When clicking 'Execute workflow'": {
    main: [[{ node: 'Fetch content_drafts', type: 'main', index: 0 }]],
  },
  'Fetch content_drafts': { main: [[{ node: 'Parse Filter Cover Candidates', type: 'main', index: 0 }]] },
  'Parse Filter Cover Candidates': { main: [[{ node: 'IF Has Candidates', type: 'main', index: 0 }]] },
  'IF Has Candidates': {
    main: [
      [{ node: 'Reset Run Stats', type: 'main', index: 0 }],
      [{ node: 'No Candidates Summary', type: 'main', index: 0 }],
    ],
  },
  'Reset Run Stats': { main: [[{ node: 'Loop Cover Candidates', type: 'main', index: 0 }]] },
  'Loop Cover Candidates': {
    main: [
      [{ node: 'Build Summary', type: 'main', index: 0 }],
      [{ node: 'Build Cover Prompt', type: 'main', index: 0 }],
    ],
  },
  'Build Cover Prompt': { main: [[{ node: 'Generate Image Gemini', type: 'main', index: 0 }]] },
  'Generate Image Gemini': { main: [[{ node: 'IF Generate OK', type: 'main', index: 0 }]] },
  'IF Generate OK': {
    main: [
      [{ node: 'Upload Drive Share', type: 'main', index: 0 }],
      [{ node: 'Prepare Sheet Meta Update', type: 'main', index: 0 }],
    ],
  },
  'Upload Drive Share': { main: [[{ node: 'Prepare Sheet Meta Update', type: 'main', index: 0 }]] },
  'Prepare Sheet Meta Update': { main: [[{ node: 'POST Draft Sheet Batch', type: 'main', index: 0 }]] },
  'POST Draft Sheet Batch': {
    main: [[{ node: 'IF Cover Sheet OK', type: 'main', index: 0 }]],
  },
  'IF Cover Sheet OK': {
    main: [
      [{ node: 'Track Cover OK', type: 'main', index: 0 }],
      [{ node: 'Track Cover Fail', type: 'main', index: 0 }],
    ],
  },
  'Track Cover OK': { main: [[{ node: 'Loop Cover Candidates', type: 'main', index: 0 }]] },
  'Track Cover Fail': { main: [[{ node: 'Loop Cover Candidates', type: 'main', index: 0 }]] },
  'No Candidates Summary': { main: [[{ node: 'Build Summary', type: 'main', index: 0 }]] },
};

const workflow = {
  name: 'Magnix — Facebook Page Cover (Gemini → Drive → Sheet)',
  nodes,
  connections,
  pinData: {},
  active: false,
  settings: { executionOrder: 'v1' },
  staticData: null,
  tags: [{ name: 'magnix' }, { name: 'content-page-cover' }, { name: 'gemini' }],
  meta: { templateCredsSetupCompleted: false },
};

fs.writeFileSync(
  path.join(__dirname, 'content-page-cover.workflow.json'),
  JSON.stringify(workflow, null, 2)
);
console.log('Written content-page-cover.workflow.json —', nodes.length, 'nodes');
