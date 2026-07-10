#!/usr/bin/env node
/**
 * Build HouseX events hub workflow (NOXH + lead inquiry + supply signup)
 * Run: node n8n-workflows/build-housex-noxh-lead.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const codeDir = path.join(__dirname, 'code', 'housex-noxh-lead');
const PUBLIC = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'magnix-public-config.json'), 'utf8')
);

const read = (f) =>
  fs
    .readFileSync(path.join(codeDir, f), 'utf8')
    .replace(/^\/\/[^\n]*\n(\/\/[^\n]*\n)*/gm, '')
    .trim();

const sheetId = PUBLIC.google_sheet_id;
const opsTab = PUBLIC.noxh_leads_ops_tab || 'noxh_leads_ops';
const detailTab = PUBLIC.noxh_leads_detail_tab || 'noxh_leads_detail';
const inquiryTab = PUBLIC.housex_leads_inquiry_tab || 'housex_leads_inquiry';
const nurtureTab = PUBLIC.housex_leads_nurture_tab || 'housex_leads_nurture';
const conflictTab = PUBLIC.housex_attribution_conflicts_tab || 'housex_attribution_conflicts';
const supplyTab = PUBLIC.housex_supply_ops_tab || 'housex_supply_ops';

const replaceSheet = (code) =>
  code
    .replace(/__GOOGLE_SHEET_ID__/g, sheetId)
    .replace(/__NOXH_OPS_TAB__/g, opsTab)
    .replace(/__NOXH_DETAIL_TAB__/g, detailTab)
    .replace(/__INQUIRY_TAB__/g, inquiryTab)
    .replace(/__NURTURE_TAB__/g, nurtureTab)
    .replace(/__CONFLICT_TAB__/g, conflictTab)
    .replace(/__SUPPLY_TAB__/g, supplyTab);

const codes = {
  parseEvent: replaceSheet(read('01-auth-parse-event.js')),
  prepareOps: replaceSheet(read('02-prepare-ops-append.js')),
  dedupeOps: replaceSheet(read('03-dedupe-ops.js')),
  formatTg: replaceSheet(read('04-format-telegram.js')),
  sendTg: replaceSheet(read('05-send-telegram.js')),
  response: replaceSheet(read('06-build-response.js')),
  parseDetail: replaceSheet(read('detail-01-auth-parse.js')),
  prepareDetail: replaceSheet(read('detail-02-prepare-append.js')),
  prepareInquiry: replaceSheet(read('inquiry-02-prepare-append.js')),
  dedupeInquiry: replaceSheet(read('inquiry-03-dedupe.js')),
  formatInquiryTg: replaceSheet(read('inquiry-04-format-telegram.js')),
  sendInquiryTg: replaceSheet(read('inquiry-05-send-telegram.js')),
  prepareSupply: replaceSheet(read('supply-02-prepare-append.js')),
  dedupeSupply: replaceSheet(read('supply-03-dedupe.js')),
  formatSupplyTg: replaceSheet(read('supply-04-format-telegram.js')),
  sendSupplyTg: replaceSheet(read('supply-05-send-telegram.js')),
  formatNoxhCaseTg: replaceSheet(read('noxh-case-04-format-telegram.js')),
  sendNoxhCaseTg: replaceSheet(read('noxh-case-05-send-telegram.js')),
  prepareNurture: replaceSheet(read('nurture-02-prepare-append.js')),
  dedupeNurture: replaceSheet(read('nurture-03-dedupe.js')),
  formatNurtureTg: replaceSheet(read('nurture-04-format-telegram.js')),
  sendNurtureTg: replaceSheet(read('nurture-05-send-telegram.js')),
  prepareConflict: replaceSheet(read('conflict-02-prepare-append.js')),
  dedupeConflict: replaceSheet(read('conflict-03-dedupe.js')),
  formatConflictTg: replaceSheet(read('conflict-04-format-telegram.js')),
  sendConflictTg: replaceSheet(read('nurture-05-send-telegram.js')),
};

const manualEvent = `return [{ json: {
  headers: { 'x-events-secret': $env.EVENTS_WEBHOOK_SECRET || '' },
  body: {
    type: 'lead.noxh_checked',
    sentAt: new Date().toISOString(),
    payload: {
      leadId: 'manual-test-' + Date.now(),
      tier: 'HOT',
      overall: 'ELIGIBLE',
      creditFlag: 'CLEAN',
      reasonCodes: ['eligible_ready'],
      recommendedAction: 'Chuyển chuyên gia tư vấn realtime',
      rulesVersion: '2026-04-ND136',
      contact: { name: 'Manual Test', phone: '0901234567', email: 'test@housex.local' },
    },
  },
}}];`;

const manualInquiry = `return [{ json: {
  headers: { 'x-events-secret': $env.EVENTS_WEBHOOK_SECRET || '' },
  body: {
    type: 'lead.created',
    sentAt: new Date().toISOString(),
    payload: {
      leadId: 'manual-inquiry-noxh-' + Date.now(),
      source: 'zalo_miniapp',
      segment: 'noxh',
      message: 'Muốn tư vấn suất A10',
      contact: { name: 'Manual Inquiry NOXH', phone: '0909999888', email: 'inquiry@housex.local' },
      context: {
        kind: 'project',
        entityId: 'demo-project',
        entityName: 'DTA Happy Home Nhơn Trạch',
        slug: 'dta-happy-home-nhon-trach',
        listingCode: null,
        projectType: 'NHA_O_XA_HOI',
        province: 'Đồng Nai',
        adminUrl: 'https://timnhaxahoi.com/du-an/dta-happy-home-nhon-trach',
      },
      assignedBrokerId: null,
      createdAt: new Date().toISOString(),
    },
  },
}}];`;

const manualInquiryCctm = `return [{ json: {
  headers: { 'x-events-secret': $env.EVENTS_WEBHOOK_SECRET || '' },
  body: {
    type: 'lead.created',
    sentAt: new Date().toISOString(),
    payload: {
      leadId: 'manual-inquiry-cctm-' + Date.now(),
      source: 'zalo_miniapp',
      segment: 'cctm',
      message: 'Muốn xem căn 2PN Solena',
      contact: { name: 'Manual Inquiry CCTM', phone: '0908888777', email: 'cctm@housex.local' },
      context: {
        kind: 'project',
        entityId: 'demo-cctm',
        entityName: 'Solena Green Town Bình Tân',
        slug: 'solena-green-town-binh-tan',
        listingCode: null,
        projectType: 'THUONG_MAI',
        province: 'TP.HCM',
        adminUrl: 'https://timnhaxahoi.com/du-an/solena-green-town-binh-tan',
      },
      assignedBrokerId: null,
      createdAt: new Date().toISOString(),
    },
  },
}}];`;

const manualNoxhCaseCreated = `return [{ json: {
  headers: { 'x-events-secret': $env.EVENTS_WEBHOOK_SECRET || '' },
  body: {
    type: 'noxh_case.created',
    sentAt: new Date().toISOString(),
    payload: {
      caseId: 'manual-case-' + Date.now(),
      caseCode: 'HX-NOXH-MANUAL',
      brokerId: null,
      milestone: 'M1_RECEIVED',
      customerName: 'Manual Wizard HOT',
      normalizedPhone: '0901234567',
    },
  },
}}];`;

const manualNoxhCaseMilestone = `return [{ json: {
  headers: { 'x-events-secret': $env.EVENTS_WEBHOOK_SECRET || '' },
  body: {
    type: 'noxh_case.milestone_changed',
    sentAt: new Date().toISOString(),
    payload: {
      caseId: 'manual-case-milestone-' + Date.now(),
      caseCode: 'HX-NOXH-MANUAL',
      brokerId: 'broker-demo',
      fromMilestone: 'M2_DOCUMENTS',
      toMilestone: 'M5_SIGNED',
      milestoneSub: null,
      opsNote: 'Test DNA-C milestone Telegram',
    },
  },
}}];`;

const manualLeadNurture = `return [{ json: {
  headers: { 'x-events-secret': $env.EVENTS_WEBHOOK_SECRET || '' },
  body: {
    type: 'lead.nurture',
    sentAt: new Date().toISOString(),
    payload: {
      leadId: 'manual-nurture-' + Date.now(),
      nurtureScriptId: 'noxh-zalo-ads-checklist',
      scriptLabel: 'NOXH — Checklist hồ sơ (Zalo Ads)',
      scriptDescription: 'Gửi checklist điều kiện NOXH + hẹn gọi xác nhận thu nhập trong 24h.',
      channel: 'zalo',
      trigger: 'on_create',
      segment: 'noxh',
      source: 'zalo_ads',
      contact: { name: 'Manual Nurture', phone: '0901234567', email: 'nurture@housex.local' },
      channels: { phone: '0901234567' },
      opsNote: null,
    },
  },
}}];`;

const manualAttributionConflict = `return [{ json: {
  headers: { 'x-events-secret': $env.EVENTS_WEBHOOK_SECRET || '' },
  body: {
    type: 'attribution.conflict',
    sentAt: new Date().toISOString(),
    payload: {
      phase: 'opened',
      conflictId: 'manual-conflict-' + Date.now(),
      kind: 'CTV_CLAIM_BLOCKED',
      normalizedPhoneMasked: '0901***567',
      brokerId: 'broker-demo',
      rejectReason: 'PLATFORM_LEAD_ACTIVE',
      rejectLabel: 'Ops đang tư vấn (R4)',
      resolution: null,
      resolutionLabel: null,
      platformLeadSource: 'zalo_ads',
      noxhCaseCode: 'HX-NOXH-MANUAL',
      customerName: 'Manual Conflict Test',
    },
  },
}}];`;

const pos = (x, y) => [x, y];
const nid = (prefix, n) => `${prefix}${String(n).padStart(2, '0')}`;

const nodes = [
  {
    parameters: {
      content:
        '## HouseX Events Hub\n**Webhook A:** POST `/webhook/magnix/housex-events` ← `EVENTS_WEBHOOK_URL`\n**Webhook B:** POST `/webhook/magnix/housex-noxh-detail` ← `NOXH_DETAIL_WEBHOOK_URL`\n**Events:** `lead.noxh_checked` · `lead.created` · `lead.nurture` · `attribution.conflict` · `noxh_case.*` · `account.registered` · `ctv.application_submitted`\nAuth: `x-events-secret` = `EVENTS_WEBHOOK_SECRET`',
      height: 260,
      width: 560,
    },
    id: nid('nx', 0),
    name: 'Sticky Note',
    type: 'n8n-nodes-base.stickyNote',
    typeVersion: 1,
    position: pos(-200, 80),
  },
  {
    parameters: { httpMethod: 'POST', path: 'magnix/housex-events', responseMode: 'responseNode', options: {} },
    id: nid('nx', 1),
    name: 'Webhook housex-events',
    type: 'n8n-nodes-base.webhook',
    typeVersion: 2,
    position: pos(0, 320),
    webhookId: 'magnix-housex-events',
  },
  {
    parameters: { httpMethod: 'POST', path: 'magnix/housex-noxh-detail', responseMode: 'responseNode', options: {} },
    id: nid('nx', 2),
    name: 'Webhook noxh-detail',
    type: 'n8n-nodes-base.webhook',
    typeVersion: 2,
    position: pos(0, 920),
    webhookId: 'magnix-housex-noxh-detail',
  },
  {
    parameters: {},
    id: nid('nx', 3),
    name: "When clicking 'Execute workflow'",
    type: 'n8n-nodes-base.manualTrigger',
    typeVersion: 1,
    position: pos(-200, 520),
  },
  {
    parameters: { jsCode: manualEvent },
    id: nid('nx', 4),
    name: 'Inject Manual NOXH Event',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(40, 480),
  },
  {
    parameters: { jsCode: manualInquiry },
    id: nid('nx', 21),
    name: 'Inject Manual Inquiry Event',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(40, 560),
  },
  {
    parameters: { jsCode: manualInquiryCctm },
    id: nid('nx', 22),
    name: 'Inject Manual CCTM Inquiry',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(40, 640),
  },
  {
    parameters: { jsCode: manualNoxhCaseCreated },
    id: nid('nx', 45),
    name: 'Inject Manual Noxh Case',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(40, 720),
  },
  {
    parameters: { jsCode: manualNoxhCaseMilestone },
    id: nid('nx', 46),
    name: 'Inject Manual Case Milestone',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(40, 800),
  },
  {
    parameters: { jsCode: manualLeadNurture },
    id: nid('nx', 49),
    name: 'Inject Manual Lead Nurture',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(40, 880),
  },
  {
    parameters: { jsCode: manualAttributionConflict },
    id: nid('nx', 57),
    name: 'Inject Manual Attribution Conflict',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(40, 960),
  },
  {
    parameters: { jsCode: codes.parseEvent },
    id: nid('nx', 5),
    name: 'Parse HouseX Event',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(280, 400),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, typeValidation: 'strict' },
        conditions: [{ id: 'c1', leftValue: '={{ $json.skipped }}', rightValue: true, operator: { type: 'boolean', operation: 'equals' } }],
        combinator: 'and',
      },
    },
    id: nid('nx', 6),
    name: 'Skipped Event?',
    type: 'n8n-nodes-base.if',
    typeVersion: 2,
    position: pos(520, 400),
  },
  {
    parameters: {
      rules: {
        values: [
          {
            conditions: {
              options: { caseSensitive: true, typeValidation: 'strict' },
              conditions: [{ id: 'r1', leftValue: '={{ $json.event_path }}', rightValue: 'inquiry', operator: { type: 'string', operation: 'equals' } }],
              combinator: 'and',
            },
            renameOutput: true,
            outputKey: 'inquiry',
          },
          {
            conditions: {
              options: { caseSensitive: true, typeValidation: 'strict' },
              conditions: [{ id: 'r2', leftValue: '={{ $json.event_path }}', rightValue: 'noxh', operator: { type: 'string', operation: 'equals' } }],
              combinator: 'and',
            },
            renameOutput: true,
            outputKey: 'noxh',
          },
          {
            conditions: {
              options: { caseSensitive: true, typeValidation: 'strict' },
              conditions: [{ id: 'r3', leftValue: '={{ $json.event_path }}', rightValue: 'supply', operator: { type: 'string', operation: 'equals' } }],
              combinator: 'and',
            },
            renameOutput: true,
            outputKey: 'supply',
          },
          {
            conditions: {
              options: { caseSensitive: true, typeValidation: 'strict' },
              conditions: [{ id: 'r4', leftValue: '={{ $json.event_path }}', rightValue: 'noxh_case', operator: { type: 'string', operation: 'equals' } }],
              combinator: 'and',
            },
            renameOutput: true,
            outputKey: 'noxh_case',
          },
          {
            conditions: {
              options: { caseSensitive: true, typeValidation: 'strict' },
              conditions: [{ id: 'r5', leftValue: '={{ $json.event_path }}', rightValue: 'nurture', operator: { type: 'string', operation: 'equals' } }],
              combinator: 'and',
            },
            renameOutput: true,
            outputKey: 'nurture',
          },
          {
            conditions: {
              options: { caseSensitive: true, typeValidation: 'strict' },
              conditions: [{ id: 'r6', leftValue: '={{ $json.event_path }}', rightValue: 'attribution_conflict', operator: { type: 'string', operation: 'equals' } }],
              combinator: 'and',
            },
            renameOutput: true,
            outputKey: 'attribution_conflict',
          },
        ],
      },
      options: { fallbackOutput: 'extra' },
    },
    id: nid('nx', 22),
    name: 'Route Event Path',
    type: 'n8n-nodes-base.switch',
    typeVersion: 3,
    position: pos(760, 480),
  },
  {
    parameters: { jsCode: codes.prepareInquiry },
    id: nid('nx', 23),
    name: 'Prepare Inquiry Append',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1000, 360),
  },
  {
    parameters: {
      method: 'GET',
      url: `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(`${inquiryTab}!A:A`)}`,
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      options: {},
    },
    id: nid('nx', 24),
    name: 'HTTP GET inquiry dedupe',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(1240, 360),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.dedupeInquiry },
    id: nid('nx', 25),
    name: 'Dedupe Inquiry',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1480, 360),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, typeValidation: 'strict' },
        conditions: [{ id: 'c1', leftValue: '={{ $json.duplicate }}', rightValue: true, operator: { type: 'boolean', operation: 'equals' } }],
        combinator: 'and',
      },
    },
    id: nid('nx', 26),
    name: 'Inquiry Duplicate?',
    type: 'n8n-nodes-base.if',
    typeVersion: 2,
    position: pos(1720, 360),
  },
  {
    parameters: {
      method: 'POST',
      url: '={{ $json.append_url }}',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      sendBody: true,
      specifyBody: 'json',
      jsonBody: '={{ JSON.stringify($json.append_body) }}',
      options: {},
    },
    id: nid('nx', 27),
    name: 'HTTP POST housex_leads_inquiry',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(1960, 280),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.formatInquiryTg },
    id: nid('nx', 28),
    name: 'Format Inquiry Telegram',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2200, 280),
  },
  {
    parameters: { jsCode: codes.sendInquiryTg },
    id: nid('nx', 29),
    name: 'Send Inquiry Telegram',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2440, 280),
  },
  {
    parameters: { jsCode: codes.prepareSupply },
    id: nid('nx', 30),
    name: 'Prepare Supply Append',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1000, 680),
  },
  {
    parameters: {
      method: 'GET',
      url: `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(`${supplyTab}!A:A`)}`,
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      options: {},
    },
    id: nid('nx', 31),
    name: 'HTTP GET supply dedupe',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(1240, 680),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.dedupeSupply },
    id: nid('nx', 32),
    name: 'Dedupe Supply',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1480, 680),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, typeValidation: 'strict' },
        conditions: [{ id: 'c1', leftValue: '={{ $json.duplicate }}', rightValue: true, operator: { type: 'boolean', operation: 'equals' } }],
        combinator: 'and',
      },
    },
    id: nid('nx', 33),
    name: 'Supply Duplicate?',
    type: 'n8n-nodes-base.if',
    typeVersion: 2,
    position: pos(1720, 680),
  },
  {
    parameters: {
      method: 'POST',
      url: '={{ $json.append_url }}',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      sendBody: true,
      specifyBody: 'json',
      jsonBody: '={{ JSON.stringify($json.append_body) }}',
      options: {},
    },
    id: nid('nx', 34),
    name: 'HTTP POST housex_supply_ops',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(1960, 600),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.formatSupplyTg },
    id: nid('nx', 35),
    name: 'Format Supply Telegram',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2200, 600),
  },
  {
    parameters: { jsCode: codes.sendSupplyTg },
    id: nid('nx', 36),
    name: 'Send Supply Telegram',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2440, 600),
  },
  {
    parameters: { jsCode: codes.formatNoxhCaseTg },
    id: nid('nx', 47),
    name: 'Format Noxh Case Telegram',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1000, 820),
  },
  {
    parameters: { jsCode: codes.sendNoxhCaseTg },
    id: nid('nx', 48),
    name: 'Send Noxh Case Telegram',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1240, 820),
  },
  {
    parameters: { jsCode: codes.prepareNurture },
    id: nid('nx', 50),
    name: 'Prepare Nurture Append',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1000, 960),
  },
  {
    parameters: {
      method: 'GET',
      url: `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(`${nurtureTab}!A:A`)}`,
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      options: {},
    },
    id: nid('nx', 51),
    name: 'HTTP GET nurture dedupe',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(1240, 960),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.dedupeNurture },
    id: nid('nx', 52),
    name: 'Dedupe Nurture',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1480, 960),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, typeValidation: 'strict' },
        conditions: [{ id: 'c1', leftValue: '={{ $json.duplicate }}', rightValue: true, operator: { type: 'boolean', operation: 'equals' } }],
        combinator: 'and',
      },
    },
    id: nid('nx', 53),
    name: 'Nurture Duplicate?',
    type: 'n8n-nodes-base.if',
    typeVersion: 2,
    position: pos(1720, 960),
  },
  {
    parameters: {
      method: 'POST',
      url: '={{ $json.append_url }}',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      sendBody: true,
      specifyBody: 'json',
      jsonBody: '={{ JSON.stringify($json.append_body) }}',
      options: {},
    },
    id: nid('nx', 54),
    name: 'HTTP POST housex_leads_nurture',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(1960, 880),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.formatNurtureTg },
    id: nid('nx', 55),
    name: 'Format Nurture Telegram',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2200, 880),
  },
  {
    parameters: { jsCode: codes.sendNurtureTg },
    id: nid('nx', 56),
    name: 'Send Nurture Telegram',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2440, 880),
  },
  {
    parameters: { jsCode: codes.prepareConflict },
    id: nid('nx', 58),
    name: 'Prepare Conflict Append',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1000, 1100),
  },
  {
    parameters: {
      method: 'GET',
      url: `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(`${conflictTab}!A:A`)}`,
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      options: {},
    },
    id: nid('nx', 59),
    name: 'HTTP GET conflict dedupe',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(1240, 1100),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.dedupeConflict },
    id: nid('nx', 60),
    name: 'Dedupe Conflict',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1480, 1100),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, typeValidation: 'strict' },
        conditions: [{ id: 'c1', leftValue: '={{ $json.duplicate }}', rightValue: true, operator: { type: 'boolean', operation: 'equals' } }],
        combinator: 'and',
      },
    },
    id: nid('nx', 61),
    name: 'Conflict Duplicate?',
    type: 'n8n-nodes-base.if',
    typeVersion: 2,
    position: pos(1720, 1100),
  },
  {
    parameters: {
      method: 'POST',
      url: '={{ $json.append_url }}',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      sendBody: true,
      specifyBody: 'json',
      jsonBody: '={{ JSON.stringify($json.append_body) }}',
      options: {},
    },
    id: nid('nx', 62),
    name: 'HTTP POST housex_attribution_conflicts',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(1960, 1020),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.formatConflictTg },
    id: nid('nx', 63),
    name: 'Format Conflict Telegram',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2200, 1020),
  },
  {
    parameters: { jsCode: codes.sendConflictTg },
    id: nid('nx', 64),
    name: 'Send Conflict Telegram',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2440, 1020),
  },
  {
    parameters: { jsCode: codes.prepareOps },
    id: nid('nx', 7),
    name: 'Prepare Ops Append',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1000, 560),
  },
  {
    parameters: {
      method: 'GET',
      url: `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(`${opsTab}!A:A`)}`,
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      options: {},
    },
    id: nid('nx', 8),
    name: 'HTTP GET ops dedupe',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(1240, 560),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.dedupeOps },
    id: nid('nx', 9),
    name: 'Dedupe Ops',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1480, 560),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, typeValidation: 'strict' },
        conditions: [{ id: 'c1', leftValue: '={{ $json.duplicate }}', rightValue: true, operator: { type: 'boolean', operation: 'equals' } }],
        combinator: 'and',
      },
    },
    id: nid('nx', 10),
    name: 'Duplicate?',
    type: 'n8n-nodes-base.if',
    typeVersion: 2,
    position: pos(1720, 560),
  },
  {
    parameters: {
      method: 'POST',
      url: '={{ $json.append_url }}',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      sendBody: true,
      specifyBody: 'json',
      jsonBody: '={{ JSON.stringify($json.append_body) }}',
      options: {},
    },
    id: nid('nx', 11),
    name: 'HTTP POST noxh_leads_ops',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(1960, 480),
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.formatTg },
    id: nid('nx', 12),
    name: 'Format Telegram',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2200, 480),
  },
  {
    parameters: { jsCode: codes.sendTg },
    id: nid('nx', 13),
    name: 'Send Telegram',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2440, 480),
  },
  {
    parameters: { jsCode: codes.response },
    id: nid('nx', 14),
    name: 'Build Response',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(2680, 520),
  },
  {
    parameters: { respondWith: 'json', responseBody: '={{ $json }}', options: {} },
    id: nid('nx', 15),
    name: 'Respond to Webhook',
    type: 'n8n-nodes-base.respondToWebhook',
    typeVersion: 1.1,
    position: pos(2920, 520),
  },
  {
    parameters: { jsCode: codes.parseDetail },
    id: nid('nx', 16),
    name: 'Parse NOXH Detail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(280, 920),
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, typeValidation: 'strict' },
        conditions: [{ id: 'c1', leftValue: '={{ $json.skipped }}', rightValue: true, operator: { type: 'boolean', operation: 'equals' } }],
        combinator: 'and',
      },
    },
    id: nid('nx', 17),
    name: 'Skipped Detail?',
    type: 'n8n-nodes-base.if',
    typeVersion: 2,
    position: pos(520, 920),
  },
  {
    parameters: { jsCode: codes.prepareDetail },
    id: nid('nx', 18),
    name: 'Prepare Detail Append',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(760, 840),
  },
  {
    parameters: {
      method: 'POST',
      url: '={{ $json.append_url }}',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      sendBody: true,
      specifyBody: 'json',
      jsonBody: '={{ JSON.stringify($json.append_body) }}',
      options: {},
    },
    id: nid('nx', 19),
    name: 'HTTP POST noxh_leads_detail',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(1000, 840),
    onError: 'continueRegularOutput',
  },
  {
    parameters: {
      jsCode: `const item = $('Prepare Detail Append').item?.json || $input.first().json;
return [{ json: { ok: true, workflow: 'housex-noxh-lead-route', path: 'detail', lead_id: item.lead_id, tier: item.tier, finished_at: new Date().toISOString() } }];`,
    },
    id: nid('nx', 20),
    name: 'Build Detail Response',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos(1240, 840),
  },
];

const connections = {
  'Webhook housex-events': { main: [[{ node: 'Parse HouseX Event', type: 'main', index: 0 }]] },
  "When clicking 'Execute workflow'": {
    main: [
      [{ node: 'Inject Manual NOXH Event', type: 'main', index: 0 }],
      [{ node: 'Inject Manual Inquiry Event', type: 'main', index: 0 }],
      [{ node: 'Inject Manual CCTM Inquiry', type: 'main', index: 0 }],
      [{ node: 'Inject Manual Noxh Case', type: 'main', index: 0 }],
      [{ node: 'Inject Manual Case Milestone', type: 'main', index: 0 }],
      [{ node: 'Inject Manual Lead Nurture', type: 'main', index: 0 }],
      [{ node: 'Inject Manual Attribution Conflict', type: 'main', index: 0 }],
    ],
  },
  'Inject Manual NOXH Event': { main: [[{ node: 'Parse HouseX Event', type: 'main', index: 0 }]] },
  'Inject Manual Inquiry Event': { main: [[{ node: 'Parse HouseX Event', type: 'main', index: 0 }]] },
  'Inject Manual CCTM Inquiry': { main: [[{ node: 'Parse HouseX Event', type: 'main', index: 0 }]] },
  'Inject Manual Noxh Case': { main: [[{ node: 'Parse HouseX Event', type: 'main', index: 0 }]] },
  'Inject Manual Case Milestone': { main: [[{ node: 'Parse HouseX Event', type: 'main', index: 0 }]] },
  'Inject Manual Lead Nurture': { main: [[{ node: 'Parse HouseX Event', type: 'main', index: 0 }]] },
  'Inject Manual Attribution Conflict': { main: [[{ node: 'Parse HouseX Event', type: 'main', index: 0 }]] },
  'Parse HouseX Event': { main: [[{ node: 'Skipped Event?', type: 'main', index: 0 }]] },
  'Skipped Event?': {
    main: [
      [{ node: 'Build Response', type: 'main', index: 0 }],
      [{ node: 'Route Event Path', type: 'main', index: 0 }],
    ],
  },
  'Route Event Path': {
    main: [
      [{ node: 'Prepare Inquiry Append', type: 'main', index: 0 }],
      [{ node: 'Prepare Ops Append', type: 'main', index: 0 }],
      [{ node: 'Prepare Supply Append', type: 'main', index: 0 }],
      [{ node: 'Format Noxh Case Telegram', type: 'main', index: 0 }],
      [{ node: 'Prepare Nurture Append', type: 'main', index: 0 }],
      [{ node: 'Prepare Conflict Append', type: 'main', index: 0 }],
      [{ node: 'Build Response', type: 'main', index: 0 }],
    ],
  },
  'Prepare Inquiry Append': { main: [[{ node: 'HTTP GET inquiry dedupe', type: 'main', index: 0 }]] },
  'HTTP GET inquiry dedupe': { main: [[{ node: 'Dedupe Inquiry', type: 'main', index: 0 }]] },
  'Dedupe Inquiry': { main: [[{ node: 'Inquiry Duplicate?', type: 'main', index: 0 }]] },
  'Inquiry Duplicate?': {
    main: [
      [{ node: 'Build Response', type: 'main', index: 0 }],
      [{ node: 'HTTP POST housex_leads_inquiry', type: 'main', index: 0 }],
    ],
  },
  'HTTP POST housex_leads_inquiry': { main: [[{ node: 'Format Inquiry Telegram', type: 'main', index: 0 }]] },
  'Format Inquiry Telegram': { main: [[{ node: 'Send Inquiry Telegram', type: 'main', index: 0 }]] },
  'Send Inquiry Telegram': { main: [[{ node: 'Build Response', type: 'main', index: 0 }]] },
  'Prepare Supply Append': { main: [[{ node: 'HTTP GET supply dedupe', type: 'main', index: 0 }]] },
  'HTTP GET supply dedupe': { main: [[{ node: 'Dedupe Supply', type: 'main', index: 0 }]] },
  'Dedupe Supply': { main: [[{ node: 'Supply Duplicate?', type: 'main', index: 0 }]] },
  'Supply Duplicate?': {
    main: [
      [{ node: 'Build Response', type: 'main', index: 0 }],
      [{ node: 'HTTP POST housex_supply_ops', type: 'main', index: 0 }],
    ],
  },
  'HTTP POST housex_supply_ops': { main: [[{ node: 'Format Supply Telegram', type: 'main', index: 0 }]] },
  'Format Supply Telegram': { main: [[{ node: 'Send Supply Telegram', type: 'main', index: 0 }]] },
  'Send Supply Telegram': { main: [[{ node: 'Build Response', type: 'main', index: 0 }]] },
  'Format Noxh Case Telegram': { main: [[{ node: 'Send Noxh Case Telegram', type: 'main', index: 0 }]] },
  'Send Noxh Case Telegram': { main: [[{ node: 'Build Response', type: 'main', index: 0 }]] },
  'Prepare Nurture Append': { main: [[{ node: 'HTTP GET nurture dedupe', type: 'main', index: 0 }]] },
  'HTTP GET nurture dedupe': { main: [[{ node: 'Dedupe Nurture', type: 'main', index: 0 }]] },
  'Dedupe Nurture': { main: [[{ node: 'Nurture Duplicate?', type: 'main', index: 0 }]] },
  'Nurture Duplicate?': {
    main: [
      [{ node: 'Build Response', type: 'main', index: 0 }],
      [{ node: 'HTTP POST housex_leads_nurture', type: 'main', index: 0 }],
    ],
  },
  'HTTP POST housex_leads_nurture': { main: [[{ node: 'Format Nurture Telegram', type: 'main', index: 0 }]] },
  'Format Nurture Telegram': { main: [[{ node: 'Send Nurture Telegram', type: 'main', index: 0 }]] },
  'Send Nurture Telegram': { main: [[{ node: 'Build Response', type: 'main', index: 0 }]] },
  'Prepare Conflict Append': { main: [[{ node: 'HTTP GET conflict dedupe', type: 'main', index: 0 }]] },
  'HTTP GET conflict dedupe': { main: [[{ node: 'Dedupe Conflict', type: 'main', index: 0 }]] },
  'Dedupe Conflict': { main: [[{ node: 'Conflict Duplicate?', type: 'main', index: 0 }]] },
  'Conflict Duplicate?': {
    main: [
      [{ node: 'Build Response', type: 'main', index: 0 }],
      [{ node: 'HTTP POST housex_attribution_conflicts', type: 'main', index: 0 }],
    ],
  },
  'HTTP POST housex_attribution_conflicts': { main: [[{ node: 'Format Conflict Telegram', type: 'main', index: 0 }]] },
  'Format Conflict Telegram': { main: [[{ node: 'Send Conflict Telegram', type: 'main', index: 0 }]] },
  'Send Conflict Telegram': { main: [[{ node: 'Build Response', type: 'main', index: 0 }]] },
  'Prepare Ops Append': { main: [[{ node: 'HTTP GET ops dedupe', type: 'main', index: 0 }]] },
  'HTTP GET ops dedupe': { main: [[{ node: 'Dedupe Ops', type: 'main', index: 0 }]] },
  'Dedupe Ops': { main: [[{ node: 'Duplicate?', type: 'main', index: 0 }]] },
  'Duplicate?': {
    main: [
      [{ node: 'Build Response', type: 'main', index: 0 }],
      [{ node: 'HTTP POST noxh_leads_ops', type: 'main', index: 0 }],
    ],
  },
  'HTTP POST noxh_leads_ops': { main: [[{ node: 'Format Telegram', type: 'main', index: 0 }]] },
  'Format Telegram': { main: [[{ node: 'Send Telegram', type: 'main', index: 0 }]] },
  'Send Telegram': { main: [[{ node: 'Build Response', type: 'main', index: 0 }]] },
  'Build Response': { main: [[{ node: 'Respond to Webhook', type: 'main', index: 0 }]] },
  'Webhook noxh-detail': { main: [[{ node: 'Parse NOXH Detail', type: 'main', index: 0 }]] },
  'Parse NOXH Detail': { main: [[{ node: 'Skipped Detail?', type: 'main', index: 0 }]] },
  'Skipped Detail?': {
    main: [
      [{ node: 'Respond to Webhook', type: 'main', index: 0 }],
      [{ node: 'Prepare Detail Append', type: 'main', index: 0 }],
    ],
  },
  'Prepare Detail Append': { main: [[{ node: 'HTTP POST noxh_leads_detail', type: 'main', index: 0 }]] },
  'HTTP POST noxh_leads_detail': { main: [[{ node: 'Build Detail Response', type: 'main', index: 0 }]] },
  'Build Detail Response': { main: [[{ node: 'Respond to Webhook', type: 'main', index: 0 }]] },
};

const workflow = {
  name: 'HouseX — Events Hub (NOXH + Form liên hệ)',
  nodes,
  connections,
  active: false,
  settings: { executionOrder: 'v1' },
  versionId: '2',
  meta: { templateCredsSetupCompleted: true },
  tags: [{ name: 'housex' }, { name: 'housex-noxh-lead-route' }, { name: 'housex-lead-inquiry' }, { name: 'housex-lead-nurture' }, { name: 'housex-attribution-conflict' }, { name: 'housex-supply-signup' }, { name: 'housex-noxh-case' }],
};

const out = path.join(__dirname, 'housex-noxh-lead-route.workflow.json');
fs.writeFileSync(out, JSON.stringify(workflow, null, 2) + '\n');
console.log('Wrote', out);
