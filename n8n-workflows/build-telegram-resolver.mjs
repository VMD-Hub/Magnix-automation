#!/usr/bin/env node
/**
 * Build Magnix Telegram Resolver cron workflow
 * Run: node n8n-workflows/build-telegram-resolver.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const codeDir = path.join(__dirname, 'code', 'telegram-resolver');
const PUBLIC = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'magnix-public-config.json'), 'utf8')
);

const read = (f) =>
  fs
    .readFileSync(path.join(codeDir, f), 'utf8')
    .replace(/^\/\/[^\n]*\n(\/\/[^\n]*\n)*/gm, '')
    .trim();

const tab = PUBLIC.notification_events_tab || 'notification_events';

const codes = {
  find: read('01-find-resolved.js')
    .replaceAll('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
    .replaceAll('__NOTIFICATION_EVENTS_TAB__', tab)
    .replaceAll('__VIDEO_DRAFTS_TAB__', PUBLIC.video_drafts_tab)
    .replaceAll('__CONTENT_DRAFTS_TAB__', PUBLIC.content_drafts_tab)
    .replaceAll('__OUTREACH_QUEUE_TAB__', PUBLIC.outreach_queue_tab),
  mark: read('02-mark-resolved.js')
    .replaceAll('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
    .replaceAll('__NOTIFICATION_EVENTS_TAB__', tab),
  summary: read('03-summary.js'),
};

const pos = (x, y) => [x, y];

const nodes = [
  {
    parameters: {
      content:
        '## Telegram Resolver\n- **Mỗi 30 phút** — mark `notification_events` resolved khi Sheet đã approve/reject',
      height: 120,
      width: 400,
    },
    id: 'tgx00note',
    name: 'Sticky Note',
    type: 'n8n-nodes-base.stickyNote',
    typeVersion: 1,
    position: pos(-160, 80),
  },
  {
    parameters: {
      rule: {
        interval: [{ field: 'cronExpression', expression: '*/30 * * * *' }],
      },
    },
    id: 'tgx01sched',
      name: 'Schedule Resolver 30m',
    type: 'n8n-nodes-base.scheduleTrigger',
    typeVersion: 1.2,
    position: pos(0, 280),
  },
  {
    parameters: {},
    id: 'tgx01manual',
    name: "When clicking 'Execute workflow'",
    type: 'n8n-nodes-base.manualTrigger',
    typeVersion: 1,
    position: pos(0, 440),
  },
  {
    parameters: { jsCode: codes.find },
    id: 'tgx02find',
    name: 'Find Resolved Events',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(280, 360),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $json.empty }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'false', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'tgx03if',
    name: 'IF Has Updates',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(520, 360),
  },
  {
    parameters: { jsCode: codes.mark },
    id: 'tgx04mark',
    name: 'Mark Resolved',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(760, 280),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.summary },
    id: 'tgx05sum',
    name: 'Build Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1000, 360),
  },
];

const connections = {
  'Schedule Resolver 30m': { main: [[{ node: 'Find Resolved Events', type: 'main', index: 0 }]] },
  "When clicking 'Execute workflow'": {
    main: [[{ node: 'Find Resolved Events', type: 'main', index: 0 }]],
  },
  'Find Resolved Events': { main: [[{ node: 'IF Has Updates', type: 'main', index: 0 }]] },
  'IF Has Updates': {
    main: [
      [{ node: 'Mark Resolved', type: 'main', index: 0 }],
      [{ node: 'Build Summary', type: 'main', index: 0 }],
    ],
  },
  'Mark Resolved': { main: [[{ node: 'Build Summary', type: 'main', index: 0 }]] },
};

const workflow = {
  name: 'Magnix Telegram — Resolver',
  nodes,
  connections,
  pinData: {},
  active: false,
  settings: { executionOrder: 'v1' },
  staticData: null,
  tags: [{ name: 'magnix' }, { name: 'telegram' }, { name: 'telegram-resolver' }],
  meta: { templateCredsSetupCompleted: false },
};

fs.writeFileSync(
  path.join(__dirname, 'telegram-resolver.workflow.json'),
  JSON.stringify(workflow, null, 2)
);
console.log('Written telegram-resolver.workflow.json —', nodes.length, 'nodes');
