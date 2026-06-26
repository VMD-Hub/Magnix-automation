#!/usr/bin/env node
/**
 * Build Magnix Telegram Notify webhook workflow
 * Run: node n8n-workflows/build-telegram-notify.mjs
 *
 * Sheet ops dùng HTTP Request + googleApi (Code node trên VPS không hỗ trợ httpRequestWithAuthentication).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const codeDir = path.join(__dirname, 'code', 'telegram-notify');
const PUBLIC = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'magnix-public-config.json'), 'utf8')
);

const read = (f) =>
  fs
    .readFileSync(path.join(codeDir, f), 'utf8')
    .replace(/^\/\/[^\n]*\n(\/\/[^\n]*\n)*/gm, '')
    .trim();

const SHEET_ID = PUBLIC.google_sheet_id;
const TAB = PUBLIC.notification_events_tab || 'notification_events';
const gidsJson = JSON.stringify(PUBLIC.sheet_tab_gids || {});
const buildReviewUrlCode = fs
  .readFileSync(path.join(__dirname, 'code', 'shared', 'build-review-url.js'), 'utf8')
  .replaceAll('__SHEET_TAB_GIDS__', gidsJson);

const sheetGetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!A:F`)}`;
const sheetAppendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!A:L`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

const repl = { __GOOGLE_SHEET_ID__: SHEET_ID, __NOTIFICATION_EVENTS_TAB__: TAB };

const codes = {
  injectTest: `${buildReviewUrlCode}\n${read('00-inject-test-payload.js').replaceAll('__GOOGLE_SHEET_ID__', SHEET_ID)}`,
  auth: `${buildReviewUrlCode}\n${read('01-auth-normalize.js').replaceAll('__GOOGLE_SHEET_ID__', SHEET_ID)}`,
  format: read('02-format-message.js'),
  dedupe: read('03-dedupe-check.js'),
  mergeAppend: read('03b-merge-append.js'),
  send: read('04-send-telegram.js'),
  preparePut: read('05-prepare-status-put.js')
    .replaceAll('__GOOGLE_SHEET_ID__', SHEET_ID)
    .replaceAll('__NOTIFICATION_EVENTS_TAB__', TAB),
  finalize: read('06-finalize-response.js'),
};

const httpGoogle = {
  authentication: 'predefinedCredentialType',
  nodeCredentialType: 'googleApi',
};

const pos = (x, y) => [x, y];

const nodes = [
  {
    parameters: {
      content:
        '## Telegram Notify\n**Webhook:** POST `/webhook/magnix/telegram-notify`\n**Manual:** Execute workflow → nhánh Manual Test\n**googleApi** bắt buộc trên HTTP GET/POST/PUT\n~2–4s: GET dedupe + append + Telegram',
      height: 200,
      width: 460,
    },
    id: 'tg00note',
    name: 'Sticky Note',
    type: 'n8n-nodes-base.stickyNote',
    typeVersion: 1,
    position: pos(-200, 80),
  },
  {
    parameters: {
      httpMethod: 'POST',
      path: 'magnix/telegram-notify',
      responseMode: 'responseNode',
      options: {},
    },
    id: 'tg01webhook',
    name: 'Webhook telegram-notify',
    type: 'n8n-nodes-base.webhook',
    typeVersion: 2,
    position: pos(0, 280),
    webhookId: 'magnix-telegram-notify',
  },
  {
    parameters: {},
    id: 'tg01manual',
    name: "When clicking 'Execute workflow'",
    type: 'n8n-nodes-base.manualTrigger',
    typeVersion: 1,
    position: pos(0, 520),
  },
  {
    parameters: { jsCode: codes.injectTest },
    id: 'tg01inject',
    name: 'Inject Manual Test Event',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(240, 520),
  },
  {
    parameters: { jsCode: codes.auth },
    id: 'tg02auth',
    name: 'Auth & Normalize Event',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(240, 280),
  },
  {
    parameters: { jsCode: codes.format },
    id: 'tg03format',
    name: 'Format Message',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(480, 400),
  },
  {
    parameters: { method: 'GET', url: sheetGetUrl, ...httpGoogle, options: {} },
    id: 'tg04get',
    name: 'HTTP GET events',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(720, 400),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.dedupe },
    id: 'tg05dedupe',
    name: 'Dedupe Check',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(960, 400),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $json.skipped }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'false', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'tg06if',
    name: 'IF Not Duplicate',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(1200, 400),
  },
  {
    parameters: {
      method: 'POST',
      url: sheetAppendUrl,
      ...httpGoogle,
      sendBody: true,
      specifyBody: 'json',
      jsonBody: '={{ JSON.stringify($json.append_body) }}',
      options: {},
    },
    id: 'tg07append',
    name: 'HTTP POST append',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(1440, 320),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.mergeAppend },
    id: 'tg08merge',
    name: 'Merge Append Row',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1680, 320),
  },
  {
    parameters: { jsCode: codes.send },
    id: 'tg09send',
    name: 'Send Telegram',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1920, 320),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.preparePut },
    id: 'tg10prep',
    name: 'Prepare Status PUT',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2160, 320),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $json.put_url }}',
            rightValue: '',
            operator: { type: 'string', operation: 'notEmpty', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'tg11ifput',
    name: 'IF Has PUT',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(2400, 320),
  },
  {
    parameters: {
      method: 'PUT',
      url: '={{ $json.put_url }}',
      ...httpGoogle,
      sendBody: true,
      specifyBody: 'json',
      jsonBody: '={{ JSON.stringify($json.put_body) }}',
      options: {},
    },
    id: 'tg12put',
    name: 'HTTP PUT status',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(2640, 240),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.finalize },
    id: 'tg13final',
    name: 'Finalize Response',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2880, 400),
  },
  {
    parameters: {
      respondWith: 'json',
      responseBody: '={{ JSON.stringify($json) }}',
      options: { responseCode: 200 },
    },
    id: 'tg14respond',
    name: 'Respond to Webhook',
    type: 'n8n-nodes-base.respondToWebhook',
    typeVersion: 1.1,
    position: pos(3120, 320),
  },
  {
    parameters: { jsCode: 'return $input.all();' },
    id: 'tg15manualdone',
    name: 'Manual Test Done',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(3120, 520),
  },
];

const connections = {
  'Webhook telegram-notify': { main: [[{ node: 'Auth & Normalize Event', type: 'main', index: 0 }]] },
  "When clicking 'Execute workflow'": {
    main: [[{ node: 'Inject Manual Test Event', type: 'main', index: 0 }]],
  },
  'Inject Manual Test Event': { main: [[{ node: 'Format Message', type: 'main', index: 0 }]] },
  'Auth & Normalize Event': { main: [[{ node: 'Format Message', type: 'main', index: 0 }]] },
  'Format Message': { main: [[{ node: 'HTTP GET events', type: 'main', index: 0 }]] },
  'HTTP GET events': { main: [[{ node: 'Dedupe Check', type: 'main', index: 0 }]] },
  'Dedupe Check': { main: [[{ node: 'IF Not Duplicate', type: 'main', index: 0 }]] },
  'IF Not Duplicate': {
    main: [
      [{ node: 'HTTP POST append', type: 'main', index: 0 }],
      [{ node: 'Finalize Response', type: 'main', index: 0 }],
    ],
  },
  'HTTP POST append': { main: [[{ node: 'Merge Append Row', type: 'main', index: 0 }]] },
  'Merge Append Row': { main: [[{ node: 'Send Telegram', type: 'main', index: 0 }]] },
  'Send Telegram': { main: [[{ node: 'Prepare Status PUT', type: 'main', index: 0 }]] },
  'Prepare Status PUT': { main: [[{ node: 'IF Has PUT', type: 'main', index: 0 }]] },
  'IF Has PUT': {
    main: [
      [{ node: 'HTTP PUT status', type: 'main', index: 0 }],
      [{ node: 'Finalize Response', type: 'main', index: 0 }],
    ],
  },
  'HTTP PUT status': { main: [[{ node: 'Finalize Response', type: 'main', index: 0 }]] },
  'Finalize Response': {
    main: [
      [
        { node: 'Respond to Webhook', type: 'main', index: 0 },
        { node: 'Manual Test Done', type: 'main', index: 0 },
      ],
    ],
  },
};

const workflow = {
  name: 'Magnix Telegram — Notify (webhook)',
  nodes,
  connections,
  pinData: {},
  active: false,
  settings: { executionOrder: 'v1' },
  staticData: null,
  tags: [{ name: 'magnix' }, { name: 'telegram' }, { name: 'telegram-notify' }],
  meta: { templateCredsSetupCompleted: false },
};

fs.writeFileSync(
  path.join(__dirname, 'telegram-notify.workflow.json'),
  JSON.stringify(workflow, null, 2)
);
console.log('Written telegram-notify.workflow.json —', nodes.length, 'nodes');
