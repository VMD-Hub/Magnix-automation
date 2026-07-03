#!/usr/bin/env node
/**
 * Build HouseX NOXH nurture cron (COLD/OUT → email Resend)
 * Run: node n8n-workflows/build-housex-noxh-nurture.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const codeDir = path.join(__dirname, 'code', 'housex-noxh-nurture');
const PUBLIC = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'magnix-public-config.json'), 'utf8')
);

const read = (f) =>
  fs
    .readFileSync(path.join(codeDir, f), 'utf8')
    .replace(/^\/\/[^\n]*\n(\/\/[^\n]*\n)*/gm, '')
    .trim();

const batch = PUBLIC.noxh_nurture_batch_size ?? 10;
const minAge = PUBLIC.noxh_nurture_min_age_hours ?? 24;
const cron = PUBLIC.schedule_cron_noxh_nurture || '0 9 * * *';
const sheetId = PUBLIC.google_sheet_id;
const opsTab = PUBLIC.noxh_leads_ops_tab || 'noxh_leads_ops';

const replaceSheet = (code) =>
  code
    .replace(/__GOOGLE_SHEET_ID__/g, sheetId)
    .replace(/__NOXH_OPS_TAB__/g, opsTab)
    .replace('__NOXH_NURTURE_BATCH_SIZE__', String(batch))
    .replace('__NOXH_NURTURE_MIN_AGE_HOURS__', String(minAge));

const codes = {
  parseFilter: replaceSheet(read('01-parse-filter-nurture.js')),
  buildEmail: replaceSheet(read('02-build-email.js')),
  sendEmail: replaceSheet(read('03-send-email.js')),
  prepareMeta: replaceSheet(read('04-prepare-meta-update.js')),
  trackSend: replaceSheet(read('05-track-send.js')),
  summary: replaceSheet(read('06-build-summary.js')),
};

const sheetOpsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(`${opsTab}!A:O`)}`;

const resetStats = `const data = $getWorkflowStaticData('global');
data.nxn_stats = { sent: 0, failed: 0, skipped: 0 };
return $input.all();`;

const empty = `const data = $getWorkflowStaticData('global');
if (!data.nxn_stats) data.nxn_stats = {};
return [{ json: { ok: true, empty: true, message: $input.first()?.json?.message || 'No nurture candidates', finished_at: new Date().toISOString() } }];`;

const httpGoogle = {
  authentication: 'predefinedCredentialType',
  nodeCredentialType: 'googleApi',
};

const pos = (x, y) => [x, y];
const nid = (n) => `nxn${String(n).padStart(2, '0')}`;

const nodes = [
  {
    parameters: {
      content:
        '## HouseX NOXH Nurture Cron\n- **09:00 VN** hàng ngày · max **10** email/lần\n- Input: `noxh_leads_ops` tier **COLD|OUT**, có email, chưa `nurture_sent_at`, tuổi ≥ **24h**\n- Gửi qua **Resend** (`RESEND_API_KEY`, `EMAIL_FROM`)\n- Cập nhật cột **meta** (O) sau gửi thành công',
      height: 200,
      width: 480,
    },
    id: nid(0),
    name: 'Sticky Note',
    type: 'n8n-nodes-base.stickyNote',
    typeVersion: 1,
    position: pos(-480, 160),
  },
  {
    parameters: { rule: { interval: [{ field: 'cronExpression', expression: cron }] } },
    id: nid(1),
    name: 'Schedule Daily Nurture',
    type: 'n8n-nodes-base.scheduleTrigger',
    typeVersion: 1.2,
    position: pos(0, 200),
  },
  {
    parameters: {},
    id: nid(2),
    name: "When clicking 'Execute workflow'",
    type: 'n8n-nodes-base.manualTrigger',
    typeVersion: 1,
    position: pos(0, 400),
  },
  {
    parameters: { method: 'GET', url: sheetOpsUrl, ...httpGoogle, options: {} },
    id: nid(3),
    name: 'Fetch noxh_leads_ops',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(240, 300),
  },
  {
    parameters: { jsCode: codes.parseFilter },
    id: nid(4),
    name: 'Parse Filter Nurture',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(480, 300),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, typeValidation: 'strict', version: 2 },
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
    },
    id: nid(5),
    name: 'IF Has Candidates',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(720, 300),
  },
  {
    parameters: { jsCode: resetStats },
    id: nid(6),
    name: 'Reset Run Stats',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(960, 240),
  },
  {
    parameters: { batchSize: 1, options: {} },
    id: nid(7),
    name: 'Loop Nurture Leads',
    type: 'n8n-nodes-base.splitInBatches',
    typeVersion: 3,
    position: pos(1200, 240),
  },
  {
    parameters: { jsCode: codes.buildEmail },
    id: nid(8),
    name: 'Build Nurture Email',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1440, 240),
  },
  {
    parameters: { jsCode: codes.sendEmail },
    id: nid(9),
    name: 'Send Email Resend',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1680, 240),
    onError: 'continueRegularOutput',
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $json.email_sent }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'equals' },
          },
        ],
        combinator: 'and',
      },
    },
    id: nid(10),
    name: 'IF Email Sent',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: pos(1920, 240),
  },
  {
    parameters: { jsCode: codes.prepareMeta },
    id: nid(11),
    name: 'Prepare Meta Update',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2160, 160),
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
    id: nid(12),
    name: 'HTTP PUT meta nurture',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(2400, 160),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.trackSend },
    id: nid(13),
    name: 'Track Send',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2640, 240),
  },
  {
    parameters: { jsCode: codes.summary },
    id: nid(14),
    name: 'Build Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2880, 300),
  },
  {
    parameters: { jsCode: empty },
    id: nid(15),
    name: 'No Candidates Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(960, 420),
  },
];

const connections = {
  'Schedule Daily Nurture': { main: [[{ node: 'Fetch noxh_leads_ops', type: 'main', index: 0 }]] },
  "When clicking 'Execute workflow'": {
    main: [[{ node: 'Fetch noxh_leads_ops', type: 'main', index: 0 }]],
  },
  'Fetch noxh_leads_ops': { main: [[{ node: 'Parse Filter Nurture', type: 'main', index: 0 }]] },
  'Parse Filter Nurture': { main: [[{ node: 'IF Has Candidates', type: 'main', index: 0 }]] },
  'IF Has Candidates': {
    main: [
      [{ node: 'Reset Run Stats', type: 'main', index: 0 }],
      [{ node: 'No Candidates Summary', type: 'main', index: 0 }],
    ],
  },
  'Reset Run Stats': { main: [[{ node: 'Loop Nurture Leads', type: 'main', index: 0 }]] },
  'Loop Nurture Leads': {
    main: [
      [{ node: 'Build Summary', type: 'main', index: 0 }],
      [{ node: 'Build Nurture Email', type: 'main', index: 0 }],
    ],
  },
  'Build Nurture Email': { main: [[{ node: 'Send Email Resend', type: 'main', index: 0 }]] },
  'Send Email Resend': { main: [[{ node: 'IF Email Sent', type: 'main', index: 0 }]] },
  'IF Email Sent': {
    main: [
      [{ node: 'Prepare Meta Update', type: 'main', index: 0 }],
      [{ node: 'Track Send', type: 'main', index: 0 }],
    ],
  },
  'Prepare Meta Update': { main: [[{ node: 'HTTP PUT meta nurture', type: 'main', index: 0 }]] },
  'HTTP PUT meta nurture': { main: [[{ node: 'Track Send', type: 'main', index: 0 }]] },
  'Track Send': { main: [[{ node: 'Loop Nurture Leads', type: 'main', index: 0 }]] },
  'No Candidates Summary': { main: [[{ node: 'Build Summary', type: 'main', index: 0 }]] },
};

const workflow = {
  name: 'HouseX — NOXH Nurture Cron',
  nodes,
  connections,
  active: false,
  settings: { executionOrder: 'v1' },
  tags: [{ name: 'housex' }, { name: 'housex-noxh-nurture' }],
  meta: { templateCredsSetupCompleted: true },
};

const out = path.join(__dirname, 'housex-noxh-nurture.workflow.json');
fs.writeFileSync(out, JSON.stringify(workflow, null, 2) + '\n');
console.log('Wrote', out, '—', nodes.length, 'nodes');
