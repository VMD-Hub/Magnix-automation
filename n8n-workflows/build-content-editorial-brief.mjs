#!/usr/bin/env node
/**
 * Build Layer B — Editorial Brief (content_queue intake → meta.editorial_brief_v1)
 * Run: node n8n-workflows/build-content-editorial-brief.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractSystemPrompt } from './code/shared/extract-prompt.mjs';
import { withPipelineStub } from './code/shared/with-pipeline-stub.mjs';
import { withLlmRouter } from './code/shared/with-llm-router.mjs';
import { buildLegalGateNodeCode } from './code/shared/inject-legal-bundle.mjs';
import { loadFireNotifyCode } from './code/shared/notify-wire.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const codeDir = path.join(__dirname, 'code', 'content-editorial-brief');
const PUBLIC = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'magnix-public-config.json'), 'utf8')
);
const CONTEXT_SUMMARIES = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'context_summaries.json'), 'utf8')
);
const CONTENT_TYPE_RULES = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'content_type_rules.json'), 'utf8')
);

const read = (f) =>
  fs
    .readFileSync(path.join(codeDir, f), 'utf8')
    .replace(/^\/\/[^\n]*\n(\/\/[^\n]*\n)*/gm, '')
    .trim();

const editorialSystem = extractSystemPrompt('ai-agents-prompts/n8n__editorial-brief.md');
const llmProviders = PUBLIC.llm_task_providers || {};

const codes = {
  attachLegal: buildLegalGateNodeCode(
    path.join(codeDir, '01b-attach-legal-pack.js')
  ),
  parseFilter: withPipelineStub(
    read('01-parse-filter-needs-brief.js')
      .replace('__EDITORIAL_BRIEF_MIN_SCORE__', String(PUBLIC.editorial_brief_min_score ?? 70))
      .replace('__EDITORIAL_BRIEF_BATCH_SIZE__', String(PUBLIC.content_editorial_brief_batch_size ?? 5))
  ),
  llm: withLlmRouter(
    read('02-llm-editorial-brief.js')
      .replace('__CONTEXT_SUMMARIES_JSON__', JSON.stringify(CONTEXT_SUMMARIES))
      .replace('__CONTENT_TYPE_RULES_JSON__', JSON.stringify(CONTENT_TYPE_RULES))
      .replace(
        '__EDITORIAL_BRIEF_SYSTEM__',
        editorialSystem.replace(/\\/g, '\\\\').replace(/`/g, '\\`')
      ),
    llmProviders
  ),
  parse: read('03-parse-editorial-brief.js'),
  prepare: read('04-prepare-meta-update.js')
    .replace('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
    .replace('__CONTENT_QUEUE_TAB__', PUBLIC.content_queue_tab),
  merge: read('05-merge-meta-brief.js'),
  track: read('06-track-sheet-ok.js'),
  blockedPrepare: read('07-prepare-legal-blocked.js')
    .replace('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
    .replace('__CONTENT_QUEUE_TAB__', PUBLIC.content_queue_tab),
  blockedMerge: read('08-merge-legal-blocked-meta.js'),
  blockedNotify: loadFireNotifyCode('../content-editorial-brief/09-fire-legal-notify.js', {
    __CONTENT_QUEUE_TAB__: PUBLIC.content_queue_tab,
  }),
};

const sheetQueueUrl = `https://sheets.googleapis.com/v4/spreadsheets/${PUBLIC.google_sheet_id}/values/${encodeURIComponent(`${PUBLIC.content_queue_tab}!A:O`)}`;

const resetStats = `const data = $getWorkflowStaticData('global');
data.eb_stats = { brief_ok: 0, brief_fail: 0, legal_blocked: 0, parse_fail: 0, llm_fail: 0, no_candidates: false, sheet_fail: 0 };
return $input.all();`;

const trackLlmFail = `const data = $getWorkflowStaticData('global');
if (!data.eb_stats) data.eb_stats = {};
data.eb_stats.llm_fail = (data.eb_stats.llm_fail || 0) + 1;
data.eb_stats.brief_fail = (data.eb_stats.brief_fail || 0) + 1;
return $input.all();`;

const trackParseFail = `const data = $getWorkflowStaticData('global');
if (!data.eb_stats) data.eb_stats = {};
data.eb_stats.parse_fail = (data.eb_stats.parse_fail || 0) + 1;
data.eb_stats.brief_fail = (data.eb_stats.brief_fail || 0) + 1;
return $input.all();`;

const trackLegalBlocked = `const item = $input.first().json || {};
const data = $getWorkflowStaticData('global');
if (!data.eb_stats) data.eb_stats = {};
data.eb_stats.legal_blocked = (data.eb_stats.legal_blocked || 0) + 1;
data.eb_stats.brief_fail = (data.eb_stats.brief_fail || 0) + 1;
return [{ json: { ...item, ok: true, legal_blocked: true } }];`;

const summary = `const data = $getWorkflowStaticData('global');
const stats = data.eb_stats || {};
let hint = null;
if ((stats.brief_ok || 0) === 0) {
  if (stats.no_candidates) hint = 'Không candidate — cần classified score≥70 + chưa editorial_brief_v1 (intake stub tự sinh nếu thiếu)';
  else if ((stats.legal_blocked || 0) > 0) hint = 'Legal gate block — metadata đã lưu, notification legal_source_needed đã route';
  else if ((stats.llm_fail || 0) > 0) hint = 'LLM fail — kiểm tra DEEPSEEK/ANTHROPIC key';
  else if ((stats.parse_fail || 0) > 0) hint = 'Parse fail — xem node Parse Editorial Brief JSON';
  else if ((stats.sheet_fail || 0) > 0) hint = 'Ghi Sheet fail — gán googleApi trên HTTP PUT nodes';
}
return [{ json: {
  ok: true,
  workflow: 'content-editorial-brief',
  stats,
  batch_size: ${PUBLIC.content_editorial_brief_batch_size ?? 5},
  hint,
  finished_at: new Date().toISOString(),
}}];`;

const empty = `const data = $getWorkflowStaticData('global');
if (!data.eb_stats) data.eb_stats = {};
data.eb_stats.no_candidates = true;
const msg = $input.first()?.json?.message || 'No editorial brief candidates';
return [{ json: { ok: true, empty: true, message: msg } }];`;

const pos = (x, y) => [x, y];

const nodes = [
  {
    parameters: {
      content:
        '## Layer B — Editorial Brief + Legal Gate\n- **08:30 VN** · max **5**/lần\n- **Webhook:** POST `/webhook/magnix/editorial-brief`\n- **Attach Legal Pack** trước LLM (NOXH/vay/định giá)\n- Output: `meta.editorial_brief_v1` + `meta.legal_retrieval_pack`\n- Editorial calendar ưu tiên trước scrape queue',
      height: 200,
      width: 440,
    },
    id: 'eb00note',
    name: 'Sticky Note',
    type: 'n8n-nodes-base.stickyNote',
    typeVersion: 1,
    position: pos(-480, 160),
  },
  {
    parameters: {
      rule: {
        interval: [{ field: 'cronExpression', expression: PUBLIC.schedule_cron_editorial_brief || '30 8 * * *' }],
      },
    },
    id: 'eb01sched',
    name: 'Schedule Editorial Brief',
    type: 'n8n-nodes-base.scheduleTrigger',
    typeVersion: 1.2,
    position: pos(0, 200),
  },
  {
    parameters: {},
    id: 'eb02manual',
    name: "When clicking 'Execute workflow'",
    type: 'n8n-nodes-base.manualTrigger',
    typeVersion: 1,
    position: pos(0, 400),
  },
  {
    parameters: {
      httpMethod: 'POST',
      path: 'magnix/editorial-brief',
      responseMode: 'onReceived',
      options: {},
    },
    id: 'eb02webhook',
    name: 'Webhook editorial-brief',
    type: 'n8n-nodes-base.webhook',
    typeVersion: 2,
    position: pos(0, 560),
    webhookId: 'magnix-editorial-brief',
  },
  {
    parameters: {
      jsCode: `const EXPECTED = $env.MAGNIX_WEBHOOK_TOKEN || '';
const headers = $input.first().json.headers || {};
const auth = headers.authorization || headers.Authorization || '';
if (EXPECTED && auth !== \`Bearer \${EXPECTED}\`) {
  throw new Error('Unauthorized: invalid MAGNIX_WEBHOOK_TOKEN');
}
const raw = $input.first().json;
const body = raw.body && typeof raw.body === 'object' ? raw.body : raw;
return [{ json: { triggered: true, source: 'webhook', at: new Date().toISOString(), ...body } }];`,
    },
    id: 'eb02auth',
    name: 'Auth Webhook',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(120, 560),
  },
  {
    parameters: {
      method: 'GET',
      url: sheetQueueUrl,
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      options: {},
    },
    id: 'eb03fetch',
    name: 'Fetch content_queue',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(240, 300),
  },
  {
    parameters: { jsCode: codes.parseFilter },
    id: 'eb04filter',
    name: 'Parse Filter Needs Brief',
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
    id: 'eb05if',
    name: 'IF Has Candidates',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(720, 300),
  },
  {
    parameters: { jsCode: resetStats },
    id: 'eb06reset',
    name: 'Reset Run Stats',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(960, 240),
  },
  {
    parameters: { batchSize: 1, options: {} },
    id: 'eb07loop',
    name: 'Loop Brief Candidates',
    type: 'n8n-nodes-base.splitInBatches',
    typeVersion: 3,
    position: pos(1200, 240),
  },
  {
    parameters: { jsCode: codes.attachLegal },
    id: 'eb07blegal',
    name: 'Attach Legal Pack',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1320, 240),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $json.legal_gate.pass }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'eb07ciflegal',
    name: 'IF Legal Gate Pass',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(1440, 240),
  },
  {
    parameters: { jsCode: codes.blockedPrepare },
    id: 'eb07dblockedprep',
    name: 'Prepare Legal Block',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1560, 440),
  },
  {
    parameters: {
      method: 'GET',
      url: '={{ $json.get_meta_url }}',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      options: {},
    },
    id: 'eb07eblockedget',
    name: 'HTTP GET blocked meta',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(1800, 440),
  },
  {
    parameters: { jsCode: codes.blockedMerge },
    id: 'eb07fblockedmerge',
    name: 'Merge Legal Block Meta',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2040, 440),
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
    id: 'eb07gblockedput',
    name: 'HTTP PUT blocked meta',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(2280, 440),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.blockedNotify },
    id: 'eb07hblockednotify',
    name: 'Fire Legal Source Notify',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2520, 440),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: trackLegalBlocked },
    id: 'eb07iblockedtrack',
    name: 'Track Legal Blocked',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2760, 440),
  },
  {
    parameters: { jsCode: codes.llm },
    id: 'eb08llm',
    name: 'LLM Editorial Brief',
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
    id: 'eb09ifllm',
    name: 'IF LLM OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(1680, 240),
  },
  {
    parameters: { jsCode: codes.parse },
    id: 'eb10parse',
    name: 'Parse Editorial Brief JSON',
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
    id: 'eb11ifparse',
    name: 'IF Parse OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(2160, 160),
  },
  {
    parameters: { jsCode: codes.prepare },
    id: 'eb12prep',
    name: 'Prepare Meta Update',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2400, 80),
  },
  {
    parameters: {
      method: 'GET',
      url: '={{ $json.get_meta_url }}',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      options: {},
    },
    id: 'eb13get',
    name: 'HTTP GET queue meta',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(2640, 80),
  },
  {
    parameters: { jsCode: codes.merge },
    id: 'eb14merge',
    name: 'Merge Meta Brief',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2880, 80),
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
    id: 'eb15putmeta',
    name: 'HTTP PUT queue meta',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(3120, 80),
    onError: 'continueRegularOutput',
  },
  {
    parameters: {
      method: 'PUT',
      url: '={{ $("Merge Meta Brief").item.json.put_interest_url }}',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      sendBody: true,
      specifyBody: 'json',
      jsonBody: '={{ JSON.stringify($("Merge Meta Brief").item.json.interest_body) }}',
      options: {},
    },
    id: 'eb16putinterest',
    name: 'HTTP PUT interest_key',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(3360, 80),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.track },
    id: 'eb17track',
    name: 'Track Brief OK',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3600, 80),
  },
  {
    parameters: { jsCode: trackLlmFail },
    id: 'eb18llmfail',
    name: 'Track LLM Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1680, 360),
  },
  {
    parameters: { jsCode: trackParseFail },
    id: 'eb19parsefail',
    name: 'Track Parse Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2400, 240),
  },
  {
    parameters: { jsCode: summary },
    id: 'eb20summary',
    name: 'Build Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3600, 300),
  },
  {
    parameters: { jsCode: empty },
    id: 'eb21empty',
    name: 'No Candidates Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(720, 420),
  },
];

const connections = {
  'Schedule Editorial Brief': { main: [[{ node: 'Fetch content_queue', type: 'main', index: 0 }]] },
  "When clicking 'Execute workflow'": {
    main: [[{ node: 'Fetch content_queue', type: 'main', index: 0 }]],
  },
  'Webhook editorial-brief': {
    main: [[{ node: 'Auth Webhook', type: 'main', index: 0 }]],
  },
  'Auth Webhook': { main: [[{ node: 'Fetch content_queue', type: 'main', index: 0 }]] },
  'Fetch content_queue': { main: [[{ node: 'Parse Filter Needs Brief', type: 'main', index: 0 }]] },
  'Parse Filter Needs Brief': { main: [[{ node: 'IF Has Candidates', type: 'main', index: 0 }]] },
  'IF Has Candidates': {
    main: [
      [{ node: 'Reset Run Stats', type: 'main', index: 0 }],
      [{ node: 'No Candidates Summary', type: 'main', index: 0 }],
    ],
  },
  'Reset Run Stats': { main: [[{ node: 'Loop Brief Candidates', type: 'main', index: 0 }]] },
  'Loop Brief Candidates': {
    main: [
      [{ node: 'Build Summary', type: 'main', index: 0 }],
      [{ node: 'Attach Legal Pack', type: 'main', index: 0 }],
    ],
  },
  'Attach Legal Pack': { main: [[{ node: 'IF Legal Gate Pass', type: 'main', index: 0 }]] },
  'IF Legal Gate Pass': {
    main: [
      [{ node: 'LLM Editorial Brief', type: 'main', index: 0 }],
      [{ node: 'Prepare Legal Block', type: 'main', index: 0 }],
    ],
  },
  'Prepare Legal Block': { main: [[{ node: 'HTTP GET blocked meta', type: 'main', index: 0 }]] },
  'HTTP GET blocked meta': { main: [[{ node: 'Merge Legal Block Meta', type: 'main', index: 0 }]] },
  'Merge Legal Block Meta': { main: [[{ node: 'HTTP PUT blocked meta', type: 'main', index: 0 }]] },
  'HTTP PUT blocked meta': { main: [[{ node: 'Fire Legal Source Notify', type: 'main', index: 0 }]] },
  'Fire Legal Source Notify': { main: [[{ node: 'Track Legal Blocked', type: 'main', index: 0 }]] },
  'Track Legal Blocked': { main: [[{ node: 'Loop Brief Candidates', type: 'main', index: 0 }]] },
  'LLM Editorial Brief': { main: [[{ node: 'IF LLM OK', type: 'main', index: 0 }]] },
  'IF LLM OK': {
    main: [
      [{ node: 'Parse Editorial Brief JSON', type: 'main', index: 0 }],
      [{ node: 'Track LLM Fail', type: 'main', index: 0 }],
    ],
  },
  'Parse Editorial Brief JSON': { main: [[{ node: 'IF Parse OK', type: 'main', index: 0 }]] },
  'IF Parse OK': {
    main: [
      [{ node: 'Prepare Meta Update', type: 'main', index: 0 }],
      [{ node: 'Track Parse Fail', type: 'main', index: 0 }],
    ],
  },
  'Prepare Meta Update': { main: [[{ node: 'HTTP GET queue meta', type: 'main', index: 0 }]] },
  'HTTP GET queue meta': { main: [[{ node: 'Merge Meta Brief', type: 'main', index: 0 }]] },
  'Merge Meta Brief': { main: [[{ node: 'HTTP PUT queue meta', type: 'main', index: 0 }]] },
  'HTTP PUT queue meta': { main: [[{ node: 'HTTP PUT interest_key', type: 'main', index: 0 }]] },
  'HTTP PUT interest_key': { main: [[{ node: 'Track Brief OK', type: 'main', index: 0 }]] },
  'Track Brief OK': { main: [[{ node: 'Loop Brief Candidates', type: 'main', index: 0 }]] },
  'Track LLM Fail': { main: [[{ node: 'Loop Brief Candidates', type: 'main', index: 0 }]] },
  'Track Parse Fail': { main: [[{ node: 'Loop Brief Candidates', type: 'main', index: 0 }]] },
  'No Candidates Summary': { main: [[{ node: 'Build Summary', type: 'main', index: 0 }]] },
};

const workflow = {
  name: 'Magnix Layer B — Editorial Brief (intake → meta)',
  nodes,
  connections,
  pinData: {},
  active: false,
  settings: { executionOrder: 'v1' },
  staticData: null,
  tags: [{ name: 'magnix' }, { name: 'layer-b' }, { name: 'content-editorial-brief' }],
  meta: { templateCredsSetupCompleted: false },
};

fs.writeFileSync(
  path.join(__dirname, 'content-editorial-brief.workflow.json'),
  JSON.stringify(workflow, null, 2)
);
console.log('Written content-editorial-brief.workflow.json —', nodes.length, 'nodes');
