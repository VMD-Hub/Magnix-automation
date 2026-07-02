#!/usr/bin/env node
/**
 * Build HouseX website article PR workflow (webhook on-demand)
 * Run: node n8n-workflows/build-content-housex-article.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractSystemPrompt } from './code/shared/extract-prompt.mjs';
import { withLlmRouter } from './code/shared/with-llm-router.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const codeDir = path.join(__dirname, 'code', 'content-housex-article');
const PUBLIC = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'magnix-public-config.json'), 'utf8')
);
const VOICE = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'housex_editorial_voice.json'), 'utf8')
);

const read = (f) =>
  fs
    .readFileSync(path.join(codeDir, f), 'utf8')
    .replace(/^\/\/[^\n]*\n(\/\/[^\n]*\n)*/gm, '')
    .trim();

const llmProviders = {
  ...(PUBLIC.llm_task_providers || {}),
  housex_article: PUBLIC.llm_task_providers?.housex_article || 'anthropic',
};

const housexSystem = extractSystemPrompt('ai-agents-prompts/housex__website-article-pr.md');

const codes = {
  intake: read('01-parse-webhook-intake.js')
    .replace(
      '__HOUSEX_BANNED_PATTERNS_JSON__',
      JSON.stringify(VOICE.banned_body_patterns)
    )
    .replace(
      '__HOUSEX_DEFAULT_CLOSING_JSON__',
      JSON.stringify(VOICE.default_closing_by_angle)
    ),
  llm: withLlmRouter(
    read('02-llm-housex-article.js').replace(
      '__HOUSEX_ARTICLE_SYSTEM__',
      housexSystem.replace(/\\/g, '\\\\').replace(/`/g, '\\`')
    ),
    llmProviders
  ),
  parse: read('03-parse-article-json.js'),
  l0: read('04-l0-editorial-voice-gate.js').replace(
    '__HOUSEX_BANNED_PATTERNS_JSON__',
    JSON.stringify(VOICE.banned_body_patterns)
  ),
  merge: read('05-merge-sheet-row.js'),
  prepare: read('06-prepare-sheet-append.js')
    .replace('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
    .replace('__HOUSEX_ARTICLES_TAB__', PUBLIC.housex_articles_tab || 'housex_articles'),
  response: read('07-build-response.js'),
};

const authWebhook = `const EXPECTED = $env.MAGNIX_WEBHOOK_TOKEN || '';
const headers = $input.first().json.headers || {};
const auth = headers.authorization || headers.Authorization || '';
if (EXPECTED && auth !== \`Bearer \${EXPECTED}\`) {
  throw new Error('Unauthorized: invalid MAGNIX_WEBHOOK_TOKEN');
}
const raw = $input.first().json;
const body = raw.body && typeof raw.body === 'object' ? raw.body : raw;
return [{ json: { triggered: true, source: 'webhook', at: new Date().toISOString(), ...body } }];`;

const pos = (x, y) => [x, y];

const nodes = [
  {
    parameters: {
      content:
        '## HouseX Article PR (on-demand)\n- **Webhook:** POST `/webhook/magnix/housex-article`\n- Prompt: `housex__website-article-pr.md`\n- L0: editorial voice + forbidden\n- Output: Sheet `housex_articles` → L3 → HouseX',
      height: 180,
      width: 460,
    },
    id: 'hx00note',
    name: 'Sticky Note',
    type: 'n8n-nodes-base.stickyNote',
    typeVersion: 1,
    position: pos(-400, 200),
  },
  {
    parameters: {},
    id: 'hx01manual',
    name: "When clicking 'Execute workflow'",
    type: 'n8n-nodes-base.manualTrigger',
    typeVersion: 1,
    position: pos(0, 400),
  },
  {
    parameters: {
      httpMethod: 'POST',
      path: 'magnix/housex-article',
      responseMode: 'lastNode',
      options: {},
    },
    id: 'hx02webhook',
    name: 'Webhook housex-article',
    type: 'n8n-nodes-base.webhook',
    typeVersion: 2,
    position: pos(0, 200),
    webhookId: 'magnix-housex-article',
  },
  {
    parameters: { jsCode: authWebhook },
    id: 'hx03auth',
    name: 'Auth Webhook',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(200, 200),
  },
  {
    parameters: {
      jsCode: `return [{ json: {
  topic: 'TOD Nhon Trach — ga quy hoach va an cu NOXH',
  angle: 'tod',
  project_slug: 'dta-happy-home-nhon-trach',
  closing_variant: 'gaQuyHoach',
  segment: 'noxh_income',
  source_refs: ['https://tienphong.vn/vi-tri-12-nha-ga-cua-tuyen-duong-sat-thu-thiem-long-thanh-tren-dia-ban-tinh-dong-nai-post1684699.tpo'],
  factsheet: { ga_quy_hoach_km: 5, long_thanh_minutes_cdt: 20, price_from_vnd: 448000000 },
}}];`,
    },
    id: 'hx03bdemo',
    name: 'Manual Demo Payload',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(200, 400),
  },
  {
    parameters: { jsCode: codes.intake },
    id: 'hx04intake',
    name: 'Parse Webhook Intake',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(440, 300),
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
    id: 'hx05ifintake',
    name: 'IF Intake OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(680, 300),
  },
  {
    parameters: { jsCode: codes.llm },
    id: 'hx06llm',
    name: 'LLM HouseX Article',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(920, 240),
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
    id: 'hx07ifllm',
    name: 'IF LLM OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(1160, 240),
  },
  {
    parameters: { jsCode: codes.parse },
    id: 'hx08parse',
    name: 'Parse Article JSON',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1400, 160),
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
    id: 'hx09ifparse',
    name: 'IF Parse OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(1640, 160),
  },
  {
    parameters: { jsCode: codes.l0 },
    id: 'hx10l0',
    name: 'L0 Editorial Voice Gate',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1880, 80),
  },
  {
    parameters: { jsCode: codes.merge },
    id: 'hx11merge',
    name: 'Merge Sheet Row',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2120, 80),
  },
  {
    parameters: { jsCode: codes.prepare },
    id: 'hx12prep',
    name: 'Prepare Sheet Append',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2360, 80),
  },
  {
    parameters: {
      method: 'POST',
      url: '={{ $json.append_url }}',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      sendBody: true,
      specifyBody: 'json',
      jsonBody: '={{ JSON.stringify({ values: [$json.append_row] }) }}',
      options: {},
    },
    id: 'hx13append',
    name: 'HTTP POST housex_articles',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(2600, 80),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.response },
    id: 'hx14resp',
    name: 'Build Response',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2840, 80),
  },
  {
    parameters: {
      jsCode: `return [{ json: {
  ok: false,
  workflow: 'content-housex-article',
  error: $input.first().json.error || $input.first().json.parse_error || $input.first().json.llm_error || 'PIPELINE_FAIL',
  request_id: $input.first().json.request_id || null,
  finished_at: new Date().toISOString(),
}}];`,
    },
    id: 'hx15fail',
    name: 'Build Fail Response',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(920, 420),
  },
];

const connections = {
  'Webhook housex-article': {
    main: [[{ node: 'Auth Webhook', type: 'main', index: 0 }]],
  },
  'Auth Webhook': { main: [[{ node: 'Parse Webhook Intake', type: 'main', index: 0 }]] },
  "When clicking 'Execute workflow'": {
    main: [[{ node: 'Manual Demo Payload', type: 'main', index: 0 }]],
  },
  'Manual Demo Payload': {
    main: [[{ node: 'Parse Webhook Intake', type: 'main', index: 0 }]],
  },
  'Parse Webhook Intake': { main: [[{ node: 'IF Intake OK', type: 'main', index: 0 }]] },
  'IF Intake OK': {
    main: [
      [{ node: 'LLM HouseX Article', type: 'main', index: 0 }],
      [{ node: 'Build Fail Response', type: 'main', index: 0 }],
    ],
  },
  'LLM HouseX Article': { main: [[{ node: 'IF LLM OK', type: 'main', index: 0 }]] },
  'IF LLM OK': {
    main: [
      [{ node: 'Parse Article JSON', type: 'main', index: 0 }],
      [{ node: 'Build Fail Response', type: 'main', index: 0 }],
    ],
  },
  'Parse Article JSON': { main: [[{ node: 'IF Parse OK', type: 'main', index: 0 }]] },
  'IF Parse OK': {
    main: [
      [{ node: 'L0 Editorial Voice Gate', type: 'main', index: 0 }],
      [{ node: 'Build Fail Response', type: 'main', index: 0 }],
    ],
  },
  'L0 Editorial Voice Gate': { main: [[{ node: 'Merge Sheet Row', type: 'main', index: 0 }]] },
  'Merge Sheet Row': { main: [[{ node: 'Prepare Sheet Append', type: 'main', index: 0 }]] },
  'Prepare Sheet Append': { main: [[{ node: 'HTTP POST housex_articles', type: 'main', index: 0 }]] },
  'HTTP POST housex_articles': { main: [[{ node: 'Build Response', type: 'main', index: 0 }]] },
};

const workflow = {
  name: 'Magnix — HouseX Website Article PR (webhook)',
  nodes,
  connections,
  pinData: {},
  active: false,
  settings: { executionOrder: 'v1' },
  staticData: null,
  tags: [{ name: 'magnix' }, { name: 'housex' }, { name: 'content-housex-article' }],
  meta: { templateCredsSetupCompleted: false },
};

fs.writeFileSync(
  path.join(__dirname, 'content-housex-article.workflow.json'),
  JSON.stringify(workflow, null, 2)
);
console.log('Written content-housex-article.workflow.json —', nodes.length, 'nodes');
