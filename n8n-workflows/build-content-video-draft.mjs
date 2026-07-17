#!/usr/bin/env node
/**
 * Build Agent 6 — Short Video Script (content_queue → video_drafts)
 * Run: node n8n-workflows/build-content-video-draft.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractSystemPrompt } from './code/shared/extract-prompt.mjs';
import { withPipelineStub } from './code/shared/with-pipeline-stub.mjs';
import { withLlmRouter } from './code/shared/with-llm-router.mjs';
import { loadFireNotifyCode, wireNotifyAfter } from './code/shared/notify-wire.mjs';
import { buildLegalValidatorNodeCode } from './code/shared/inject-legal-bundle.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const codeDir = path.join(__dirname, 'code', 'content-video-draft');
const PUBLIC = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'magnix-public-config.json'), 'utf8')
);
const DISCLAIMER_CFG = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'disclaimers.json'), 'utf8')
);

const FORMAT_ROUTING = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'format_routing.json'), 'utf8')
);

const read = (f) =>
  fs
    .readFileSync(path.join(codeDir, f), 'utf8')
    .replace(/^\/\/[^\n]*\n(\/\/[^\n]*\n)*/gm, '')
    .trim();

const productionSystem = extractSystemPrompt('ai-agents-prompts/n8n__production-brief.md');
const llmProviders = PUBLIC.llm_task_providers || {};

const codes = {
  parseFilter: withPipelineStub(
    buildLegalValidatorNodeCode(path.join(codeDir, '01-parse-filter-candidates.js'))
      .replace('__VIDEO_DRAFT_MIN_SCORE__', String(PUBLIC.video_draft_min_score ?? 70))
      .replace('__VIDEO_DRAFT_BATCH_SIZE__', String(PUBLIC.content_video_draft_batch_size ?? 3))
      .replace('__FORMAT_ROUTING_JSON__', JSON.stringify(FORMAT_ROUTING))
  ),
  llm: withLlmRouter(
    read('02-llm-short-video.js').replace(
      '__PRODUCTION_BRIEF_SYSTEM__',
      productionSystem.replace(/\\/g, '\\\\').replace(/`/g, '\\`')
    ),
    llmProviders
  ),
  parse: read('03-parse-video-script.js'),
  videoScriptQa: read('03b-video-script-qa-gate.js'),
  l0: read('04-l0-forbidden-check.js'),
  merge: read('05-merge-video-row.js').replace(
    '__DISCLAIMER_CONFIG_JSON__',
    JSON.stringify(DISCLAIMER_CFG),
  ),
  trackAppend: read('06-track-append-ok.js'),
  prepareMark: read('07-prepare-queue-mark.js')
    .replace('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
    .replace('__CONTENT_QUEUE_TAB__', PUBLIC.content_queue_tab),
  mergeQueueMeta: read('08-merge-queue-meta.js'),
  preparePut: read('08-prepare-video-put.js'),
  resolvePut: read('09-resolve-video-put-row.js')
    .replace('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
    .replace('__VIDEO_DRAFTS_TAB__', PUBLIC.video_drafts_tab),
};

const sheetQueueUrl = `https://sheets.googleapis.com/v4/spreadsheets/${PUBLIC.google_sheet_id}/values/${encodeURIComponent(`${PUBLIC.content_queue_tab}!A:O`)}`;
const sheetVideoSlotsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${PUBLIC.google_sheet_id}/values/${encodeURIComponent(`${PUBLIC.video_drafts_tab}!A2:E500`)}`;

const resetStats = `const data = $getWorkflowStaticData('global');
data.a6_stats = { video_ok: 0, video_fail: 0, l0_fail: 0, parse_fail: 0, llm_fail: 0, no_candidates: false, sheet_fail: 0, video_script_rejected: 0, video_script_review: 0 };
return $input.all();`;

const trackL0Fail = `const data = $getWorkflowStaticData('global');
if (!data.a6_stats) data.a6_stats = {};
data.a6_stats.l0_fail = (data.a6_stats.l0_fail || 0) + 1;
return $input.all();`;

const trackParseFail = `const data = $getWorkflowStaticData('global');
if (!data.a6_stats) data.a6_stats = {};
data.a6_stats.parse_fail = (data.a6_stats.parse_fail || 0) + 1;
return $input.all();`;

const trackSheetFail = `const data = $getWorkflowStaticData('global');
if (!data.a6_stats) data.a6_stats = {};
data.a6_stats.sheet_fail = (data.a6_stats.sheet_fail || 0) + 1;
return $input.all();`;

const trackLlmFail = `const data = $getWorkflowStaticData('global');
if (!data.a6_stats) data.a6_stats = {};
data.a6_stats.llm_fail = (data.a6_stats.llm_fail || 0) + 1;
const j = $input.first().json || {};
data.a6_stats.last_llm_error = j.message || j.error_message || String(j.error || 'LLM_FAIL');
return $input.all();`;

const summary = `const data = $getWorkflowStaticData('global');
const stats = data.a6_stats || {};
let hint = null;
if ((stats.video_ok || 0) === 0) {
  if (stats.no_candidates) hint = 'Không candidate — cần editorial_brief_v1 (chạy Layer B) + classified score≥70; xem blockers trong execution';
  else if ((stats.llm_fail || 0) > 0) hint = 'LLM fail: ' + (stats.last_llm_error || 'kiểm tra ANTHROPIC_API_KEY + N8N_BLOCK_ENV_ACCESS_IN_NODE=false trên VPS');
  else if ((stats.sheet_fail || 0) > 0) hint = 'Ghi Sheet fail — gán googleApi trên HTTP PUT video_drafts / queue meta';
  else if ((stats.parse_fail || 0) > 0) hint = 'LLM trả JSON không parse được — xem node Parse Video Script JSON';
  else if ((stats.l0_fail || 0) > 0) hint = 'L0 chặn (lãi suất %, cam kết duyệt…) — xem node L0 Forbidden Check';
  else hint = 'Không ghi Sheet — mở từng node trong execution log';
}
return [{ json: {
  ok: true,
  workflow: 'content-video-draft',
  stats,
  batch_size: ${PUBLIC.content_video_draft_batch_size ?? 3},
  hint,
  finished_at: new Date().toISOString(),
}}];`;

const empty = `const data = $getWorkflowStaticData('global');
if (!data.a6_stats) data.a6_stats = {};
data.a6_stats.no_candidates = true;
const msg = $input.first()?.json?.message || 'No video candidates';
return [{ json: { ok: true, empty: true, message: msg } }];`;

const pos = (x, y) => [x, y];

const nodes = [
  {
    parameters: {
      content:
        '## Agent 6 — Production Brief (Layer C)\n- **09:15 VN** · max **3**/lần\n- Input: `editorial_brief_v1` + classified score≥70 (intake stub OK)\n- Output: tab `video_drafts` (production_brief v2)\n- **L3 bắt buộc:** `status=approved` + `l3_approved=true` trước quay/đăng',
      height: 200,
      width: 420,
    },
    id: 'a600note',
    name: 'Sticky Note',
    type: 'n8n-nodes-base.stickyNote',
    typeVersion: 1,
    position: pos(-480, 160),
  },
  {
    parameters: {
      rule: {
        interval: [{ field: 'cronExpression', expression: PUBLIC.schedule_cron_video_draft || '15 9 * * *' }],
      },
    },
    id: 'a601sched',
    name: 'Schedule Daily Video Draft',
    type: 'n8n-nodes-base.scheduleTrigger',
    typeVersion: 1.2,
    position: pos(0, 200),
  },
  {
    parameters: {},
    id: 'a602manual',
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
    id: 'a603fetch',
    name: 'Fetch content_queue',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(240, 300),
  },
  {
    parameters: { jsCode: codes.parseFilter },
    id: 'a604filter',
    name: 'Parse Filter Video Candidates',
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
    id: 'a605if',
    name: 'IF Has Candidates',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(720, 300),
  },
  {
    parameters: { jsCode: resetStats },
    id: 'a605reset',
    name: 'Reset Run Stats',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(960, 240),
  },
  {
    parameters: { batchSize: 1, options: {} },
    id: 'a606loop',
    name: 'Loop Video Candidates',
    type: 'n8n-nodes-base.splitInBatches',
    typeVersion: 3,
    position: pos(1200, 240),
  },
  {
    parameters: { jsCode: codes.llm },
    id: 'a607llm',
    name: 'LLM Production Brief',
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
    id: 'a608ifllm',
    name: 'IF LLM OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(1680, 240),
  },
  {
    parameters: { jsCode: codes.parse },
    id: 'a609parse',
    name: 'Parse Video Script JSON',
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
    id: 'a610ifparse',
    name: 'IF Parse OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(2160, 160),
  },
  {
    parameters: { jsCode: codes.videoScriptQa },
    id: 'a609vqa',
    name: 'Video Script QA Gate',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2280, 80),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $json.video_script_qa_blocked }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'notEquals' },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a609ifvqa',
    name: 'IF Video Script QA Pass',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(2520, 80),
  },
  {
    parameters: { jsCode: codes.l0 },
    id: 'a611l0',
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
    id: 'a612ifl0',
    name: 'IF L0 Pass',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(2640, 80),
  },
  {
    parameters: { jsCode: codes.merge },
    id: 'a613merge',
    name: 'Merge Video Row',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2880, 0),
  },
  {
    parameters: { jsCode: codes.preparePut },
    id: 'a613bprep',
    name: 'Prepare Video Put',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3120, 0),
  },
  {
    parameters: {
      method: 'GET',
      url: sheetVideoSlotsUrl,
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      options: {},
    },
    id: 'a613cget',
    name: 'HTTP GET video_drafts slots',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(3360, 0),
  },
  {
    parameters: { jsCode: codes.resolvePut },
    id: 'a613dresolve',
    name: 'Resolve Video Put Row',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3600, 0),
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
    id: 'a614append',
    name: 'HTTP PUT video_drafts row',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(3840, 0),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.trackAppend },
    id: 'a614btrack',
    name: 'Track Append OK',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(4080, 0),
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
    id: 'a614cif',
    name: 'IF Append OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(4320, 0),
  },
  {
    parameters: { jsCode: codes.prepareMark },
    id: 'a615prep',
    name: 'Prepare Queue Mark',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(4560, 0),
  },
  {
    parameters: {
      method: 'GET',
      url: '={{ $json.get_url }}',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      options: {},
    },
    id: 'a615get',
    name: 'HTTP GET queue meta',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(4800, 0),
  },
  {
    parameters: { jsCode: codes.mergeQueueMeta },
    id: 'a615merge',
    name: 'Merge Queue Meta',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(5040, 0),
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
    id: 'a615put',
    name: 'HTTP PUT queue meta',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(5280, 0),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: trackLlmFail },
    id: 'a617llmfail',
    name: 'Track LLM Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1680, 360),
  },
  {
    parameters: { jsCode: trackL0Fail },
    id: 'a616l0fail',
    name: 'Track L0 Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2880, 160),
  },
  {
    parameters: { jsCode: trackParseFail },
    id: 'a617parsefail',
    name: 'Track Parse Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2400, 240),
  },
  {
    parameters: { jsCode: summary },
    id: 'a618summary',
    name: 'Build Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3600, 300),
  },
  {
    parameters: { jsCode: empty },
    id: 'a619empty',
    name: 'No Candidates Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(720, 420),
  },
];

const connections = {
  'Schedule Daily Video Draft': { main: [[{ node: 'Fetch content_queue', type: 'main', index: 0 }]] },
  "When clicking 'Execute workflow'": {
    main: [[{ node: 'Fetch content_queue', type: 'main', index: 0 }]],
  },
  'Fetch content_queue': { main: [[{ node: 'Parse Filter Video Candidates', type: 'main', index: 0 }]] },
  'Parse Filter Video Candidates': { main: [[{ node: 'IF Has Candidates', type: 'main', index: 0 }]] },
  'IF Has Candidates': {
    main: [
      [{ node: 'Reset Run Stats', type: 'main', index: 0 }],
      [{ node: 'No Candidates Summary', type: 'main', index: 0 }],
    ],
  },
  'Reset Run Stats': { main: [[{ node: 'Loop Video Candidates', type: 'main', index: 0 }]] },
  'Loop Video Candidates': {
    main: [
      [{ node: 'Build Summary', type: 'main', index: 0 }],
      [{ node: 'LLM Production Brief', type: 'main', index: 0 }],
    ],
  },
  'LLM Production Brief': { main: [[{ node: 'IF LLM OK', type: 'main', index: 0 }]] },
  'IF LLM OK': {
    main: [
      [{ node: 'Parse Video Script JSON', type: 'main', index: 0 }],
      [{ node: 'Track LLM Fail', type: 'main', index: 0 }],
    ],
  },
  'Parse Video Script JSON': { main: [[{ node: 'IF Parse OK', type: 'main', index: 0 }]] },
  'IF Parse OK': {
    main: [
      [{ node: 'Video Script QA Gate', type: 'main', index: 0 }],
      [{ node: 'Track Parse Fail', type: 'main', index: 0 }],
    ],
  },
  'Video Script QA Gate': { main: [[{ node: 'IF Video Script QA Pass', type: 'main', index: 0 }]] },
  'IF Video Script QA Pass': {
    main: [
      [{ node: 'L0 Forbidden Check', type: 'main', index: 0 }],
      [{ node: 'Track Parse Fail', type: 'main', index: 0 }],
    ],
  },
  'L0 Forbidden Check': { main: [[{ node: 'IF L0 Pass', type: 'main', index: 0 }]] },
  'IF L0 Pass': {
    main: [
      [{ node: 'Merge Video Row', type: 'main', index: 0 }],
      [{ node: 'Track L0 Fail', type: 'main', index: 0 }],
    ],
  },
  'Merge Video Row': { main: [[{ node: 'Prepare Video Put', type: 'main', index: 0 }]] },
  'Prepare Video Put': { main: [[{ node: 'HTTP GET video_drafts slots', type: 'main', index: 0 }]] },
  'HTTP GET video_drafts slots': { main: [[{ node: 'Resolve Video Put Row', type: 'main', index: 0 }]] },
  'Resolve Video Put Row': { main: [[{ node: 'HTTP PUT video_drafts row', type: 'main', index: 0 }]] },
  'HTTP PUT video_drafts row': { main: [[{ node: 'Track Append OK', type: 'main', index: 0 }]] },
  'Track Append OK': { main: [[{ node: 'IF Append OK', type: 'main', index: 0 }]] },
  'IF Append OK': {
    main: [
      [{ node: 'Prepare Queue Mark', type: 'main', index: 0 }],
      [{ node: 'Loop Video Candidates', type: 'main', index: 0 }],
    ],
  },
  'Prepare Queue Mark': { main: [[{ node: 'HTTP GET queue meta', type: 'main', index: 0 }]] },
  'HTTP GET queue meta': { main: [[{ node: 'Merge Queue Meta', type: 'main', index: 0 }]] },
  'Merge Queue Meta': { main: [[{ node: 'HTTP PUT queue meta', type: 'main', index: 0 }]] },
  'HTTP PUT queue meta': { main: [[{ node: 'Loop Video Candidates', type: 'main', index: 0 }]] },
  'Track L0 Fail': { main: [[{ node: 'Loop Video Candidates', type: 'main', index: 0 }]] },
  'Track LLM Fail': { main: [[{ node: 'Loop Video Candidates', type: 'main', index: 0 }]] },
  'Track Parse Fail': { main: [[{ node: 'Loop Video Candidates', type: 'main', index: 0 }]] },
  'No Candidates Summary': { main: [[{ node: 'Build Summary', type: 'main', index: 0 }]] },
};

wireNotifyAfter(nodes, connections, {
  idPrefix: 'a6n',
  fireCode: loadFireNotifyCode('fire-notify-agent6.js', {
    __GOOGLE_SHEET_ID__: PUBLIC.google_sheet_id,
    __VIDEO_DRAFTS_TAB__: PUBLIC.video_drafts_tab,
  }),
  insertAfter: 'HTTP PUT queue meta',
  resumeTo: 'Loop Video Candidates',
  position: pos(5520, 0),
});

const workflow = {
  name: 'Magnix Agent 6 — Short Video Script (queue → video_drafts)',
  nodes,
  connections,
  pinData: {},
  active: false,
  settings: { executionOrder: 'v1' },
  staticData: null,
  tags: [{ name: 'magnix' }, { name: 'agent-6' }, { name: 'content-video-draft' }],
  meta: { templateCredsSetupCompleted: false },
};

fs.writeFileSync(
  path.join(__dirname, 'content-video-draft.workflow.json'),
  JSON.stringify(workflow, null, 2)
);
console.log('Written content-video-draft.workflow.json —', nodes.length, 'nodes');
