#!/usr/bin/env node
/**
 * Build Magnix Telegram Reminder cron workflow
 * Run: node n8n-workflows/build-telegram-reminder.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const codeDir = path.join(__dirname, 'code', 'telegram-reminder');
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
  find: read('01-find-due-reminders.js')
    .replaceAll('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
    .replaceAll('__NOTIFICATION_EVENTS_TAB__', tab),
  send: read('02-send-reminder.js')
    .replaceAll('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
    .replaceAll('__NOTIFICATION_EVENTS_TAB__', tab),
  summary: read('03-summary.js'),
};

const pos = (x, y) => [x, y];

const nodes = [
  {
    parameters: {
      content:
        '## Telegram Reminder\n- **Mỗi 30 phút** · SLA theo `docs/TELEGRAM_APPROVAL_NOTIFICATIONS.md`\n- Cần `TELEGRAM_REMINDER_ENABLED=true`',
      height: 140,
      width: 400,
    },
    id: 'tgr00note',
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
    id: 'tgr01sched',
      name: 'Schedule Reminder 30m',
    type: 'n8n-nodes-base.scheduleTrigger',
    typeVersion: 1.2,
    position: pos(0, 280),
  },
  {
    parameters: {},
    id: 'tgr01manual',
    name: "When clicking 'Execute workflow'",
    type: 'n8n-nodes-base.manualTrigger',
    typeVersion: 1,
    position: pos(0, 440),
  },
  {
    parameters: { jsCode: codes.find },
    id: 'tgr02find',
    name: 'Find Due Reminders',
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
    id: 'tgr03if',
    name: 'IF Has Reminders',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(520, 360),
  },
  {
    parameters: { jsCode: codes.send },
    id: 'tgr04send',
    name: 'Send Reminder',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(760, 280),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.summary },
    id: 'tgr05sum',
    name: 'Build Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1000, 360),
  },
];

const connections = {
  'Schedule Reminder 30m': { main: [[{ node: 'Find Due Reminders', type: 'main', index: 0 }]] },
  "When clicking 'Execute workflow'": {
    main: [[{ node: 'Find Due Reminders', type: 'main', index: 0 }]],
  },
  'Find Due Reminders': { main: [[{ node: 'IF Has Reminders', type: 'main', index: 0 }]] },
  'IF Has Reminders': {
    main: [
      [{ node: 'Send Reminder', type: 'main', index: 0 }],
      [{ node: 'Build Summary', type: 'main', index: 0 }],
    ],
  },
  'Send Reminder': { main: [[{ node: 'Build Summary', type: 'main', index: 0 }]] },
};

const workflow = {
  name: 'Magnix Telegram — Reminder (SLA)',
  nodes,
  connections,
  pinData: {},
  active: false,
  settings: { executionOrder: 'v1' },
  staticData: null,
  tags: [{ name: 'magnix' }, { name: 'telegram' }, { name: 'telegram-reminder' }],
  meta: { templateCredsSetupCompleted: false },
};

fs.writeFileSync(
  path.join(__dirname, 'telegram-reminder.workflow.json'),
  JSON.stringify(workflow, null, 2)
);
console.log('Written telegram-reminder.workflow.json —', nodes.length, 'nodes');
