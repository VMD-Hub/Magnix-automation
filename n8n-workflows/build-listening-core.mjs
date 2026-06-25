#!/usr/bin/env node
/**
 * Shared builder — Agent 1 Social Listening (TikTok / Facebook)
 * Called from build-social-listening.mjs and build-social-listening-facebook.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractSystemPrompt } from './code/shared/extract-prompt.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function buildListeningWorkflow(PUBLIC, opts) {
  const codeDir = path.join(__dirname, 'code', 'social-listening');

  const read = (f) =>
    fs
      .readFileSync(path.join(codeDir, f), 'utf8')
      .replace(/^\/\/[^\n]*\n(\/\/[^\n]*\n)*/gm, '')
      .trim();

  const sheetRangeUrl = (tab, range) =>
    `https://sheets.googleapis.com/v4/spreadsheets/${PUBLIC.google_sheet_id}/values/${encodeURIComponent(`${tab}!${range}`)}`;

  const sheetAppendUrl = (tab, range) =>
    `${sheetRangeUrl(tab, range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const codes = {
    parseProjectConfig: read('01b-parse-project-config-sheet.js'),
    splitUrls: read('01-split-urls-from-config.js'),
    filterPlatform: read('01d-filter-platform.js').replace(
      '__LISTEN_PLATFORMS__',
      opts.platforms.join(',')
    ),
    filterDue: read('01e-filter-due-channels.js').replace(
      '__CHANNEL_SCRAPE_INTERVAL_DAYS__',
      String(PUBLIC.channel_scrape_interval_days ?? 7)
    ),
    parseScrapeIndex: read('00a-parse-scrape-index.js'),
    parseChannelState: read('00b-parse-channel-state.js'),
    wrapApify: read(opts.wrapApifyFile),
    filterNewPosts: read('02c-filter-new-posts.js'),
    trackApify: read('02b-track-apify-stats.js'),
    parseClaude: read('03-parse-pain-intake.js'),
    trackClaude: read('03b-track-claude-stats.js'),
    normalize: read('04-normalize-content-record.js'),
    flattenSheet: read('05a-flatten-sheet-row.js'),
    sheetUpsert: read('05-sheet-upsert-content-queue.js')
      .replace('__GOOGLE_SHEET_ID__', PUBLIC.google_sheet_id)
      .replace('__CONTENT_QUEUE_TAB__', PUBLIC.content_queue_tab),
    markSheetDone: read('05b-mark-sheet-done.js'),
    updateIndexRow: read('07-update-scrape-index-row.js'),
    updateChannelRow: read('07b-update-channel-state-row.js'),
    driveBackup: read('06-prepare-drive-backup-content.js').replace(
      '__MAGNIX_DRIVE_FOLDER_ID__',
      PUBLIC.drive_folder_id
    ),
  };

  const claudeSystem = extractSystemPrompt('ai-agents-prompts/n8n__pain-intake.md');

  const wrapNodeName = opts.wrapNodeName || 'Wrap Apify Response';

  const claudeBody = `={{ JSON.stringify({
  model: '${PUBLIC.anthropic_model}',
  max_tokens: 4096,
  temperature: 0.2,
  system: ${JSON.stringify(claudeSystem)},
  messages: [{
    role: 'user',
    content: JSON.stringify({
      platform: $('${wrapNodeName}').item.json.platform,
      post_url: $('${wrapNodeName}').item.json.post_url,
      text: $('${wrapNodeName}').item.json.text,
      author_id: $('${wrapNodeName}').item.json.author_id,
      engagement: $('${wrapNodeName}').item.json.engagement,
    }),
  }],
}) }}`;

  const resetStatsCode = `const data = $getWorkflowStaticData('global');
data.sl_stats = { sheet_ok: 0, sheet_fail: 0, qualified: 0, apify_empty: 0, not_qualified: 0, skipped_duplicate: 0, skipped_channel: 0 };
return $input.all();`;

  const summaryCode = `const data = $getWorkflowStaticData('global');
const stats = data.sl_stats || {};
let hint = null;
if ((stats.sheet_ok || 0) === 0 && (stats.apify_empty || 0) > 0) {
  hint = 'Apify trả rỗng — kiểm tra token/URL hoặc kênh đã quét trong 7 ngày';
} else if ((stats.sheet_ok || 0) === 0 && (stats.qualified || 0) === 0) {
  hint = 'Không có bài qualified — duplicate/reject hoặc ngách ngoài BĐS';
} else if ((stats.sheet_ok || 0) === 0 && (stats.qualified || 0) > 0) {
  hint = 'Có qualified nhưng Sheet chưa ghi — gán googleApi trên Sheet Upsert';
}
return [{ json: {
  ok: true,
  workflow: '${opts.workflowSlug}',
  sheet_upserted: stats.sheet_ok || 0,
  stats,
  hint,
  finished_at: new Date().toISOString(),
}}];`;

  const pos = (x, y) => [x, y];

  const nodes = [
    {
      parameters: {
        content: opts.stickyNote,
        height: 220,
        width: 440,
      },
      id: `${opts.idPrefix}00note`,
      name: 'Sticky Note',
      type: 'n8n-nodes-base.stickyNote',
      typeVersion: 1,
      position: pos(-560, 160),
    },
    {
      parameters: {
        rule: {
          interval: [{ field: 'cronExpression', expression: opts.scheduleCron }],
        },
      },
      id: `${opts.idPrefix}01sched`,
      name: opts.scheduleName,
      type: 'n8n-nodes-base.scheduleTrigger',
      typeVersion: 1.2,
      position: pos(0, 200),
    },
    {
      parameters: {},
      id: `${opts.idPrefix}02manual`,
      name: "When clicking 'Execute workflow'",
      type: 'n8n-nodes-base.manualTrigger',
      typeVersion: 1,
      position: pos(0, 420),
    },
    {
      parameters: {
        method: 'GET',
        url: sheetRangeUrl(PUBLIC.project_config_tab, 'A:Z'),
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'googleApi',
        options: {},
      },
      id: `${opts.idPrefix}03fetch`,
      name: 'Fetch project_config',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: pos(240, 300),
    },
    {
      parameters: { jsCode: codes.parseProjectConfig },
      id: `${opts.idPrefix}03parse`,
      name: 'Parse project_config rows',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(480, 300),
    },
    {
      parameters: { jsCode: codes.splitUrls },
      id: `${opts.idPrefix}04split`,
      name: 'Split URLs from Config',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(720, 300),
    },
    {
      parameters: { jsCode: codes.filterPlatform },
      id: `${opts.idPrefix}04pf`,
      name: 'Filter Platform',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(960, 300),
    },
    {
      parameters: { jsCode: codes.filterDue },
      id: `${opts.idPrefix}04due`,
      name: 'Filter Due Channels',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(1200, 300),
    },
    {
      parameters: {
        conditions: {
          options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
          conditions: [
            {
              id: 'c-empty',
              leftValue: '={{ $json.empty }}',
              rightValue: true,
              operator: { type: 'boolean', operation: 'notEquals' },
            },
          ],
          combinator: 'and',
        },
        options: {},
      },
      id: `${opts.idPrefix}05ifurls`,
      name: 'IF Has URLs',
      type: 'n8n-nodes-base.if',
      typeVersion: 2.2,
      position: pos(1440, 300),
    },
    {
      parameters: {
        method: 'GET',
        url: sheetRangeUrl(PUBLIC.scrape_index_tab, 'A:F'),
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'googleApi',
        options: {},
      },
      id: `${opts.idPrefix}05idx`,
      name: 'Fetch scrape_index',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: pos(1680, 240),
    },
    {
      parameters: { jsCode: codes.parseScrapeIndex },
      id: `${opts.idPrefix}05idxp`,
      name: 'Parse scrape_index',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(1920, 240),
    },
    {
      parameters: {
        method: 'GET',
        url: sheetRangeUrl(PUBLIC.channel_state_tab, 'A:D'),
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'googleApi',
        options: {},
      },
      id: `${opts.idPrefix}05ch`,
      name: 'Fetch channel_state',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: pos(2160, 240),
    },
    {
      parameters: { jsCode: codes.parseChannelState },
      id: `${opts.idPrefix}05chp`,
      name: 'Parse channel_state',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(2400, 240),
    },
    {
      parameters: { jsCode: resetStatsCode },
      id: `${opts.idPrefix}05reset`,
      name: 'Reset Run Stats',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(2640, 240),
    },
    {
      parameters: { batchSize: 1, options: {} },
      id: `${opts.idPrefix}06loop`,
      name: 'Loop Over URLs',
      type: 'n8n-nodes-base.splitInBatches',
      typeVersion: 3,
      position: pos(2880, 240),
    },
    {
      parameters: {
        method: 'POST',
        url: `={{ $env.${opts.apifyRunUrlEnv} || "${opts.apifyDefaultUrl}" }}`,
        sendQuery: true,
        queryParameters: {
          parameters: [{ name: 'token', value: '={{ $env.APIFY_TOKEN }}' }],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: opts.apifyBody,
        options: { timeout: 120000 },
      },
      id: `${opts.idPrefix}07apify`,
      name: 'Apify Scrape',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: pos(3120, 240),
      onError: 'continueRegularOutput',
    },
    {
      parameters: { jsCode: codes.updateChannelRow },
      id: `${opts.idPrefix}07bchrow`,
      name: 'Prepare channel_state row',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(3360, 320),
    },
    {
      parameters: {
        method: 'POST',
        url: sheetAppendUrl(PUBLIC.channel_state_tab, 'A:D'),
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'googleApi',
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={{ JSON.stringify($json.channel_body) }}',
        options: {},
      },
      id: `${opts.idPrefix}07bch`,
      name: 'Append channel_state',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: pos(3600, 320),
      onError: 'continueRegularOutput',
    },
    {
      parameters: { jsCode: codes.wrapApify },
      id: `${opts.idPrefix}08wrap`,
      name: wrapNodeName,
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(3360, 160),
    },
    {
      parameters: { jsCode: codes.filterNewPosts },
      id: `${opts.idPrefix}08dedupe`,
      name: 'Filter New Posts',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(3600, 160),
    },
    {
      parameters: { jsCode: codes.trackApify },
      id: `${opts.idPrefix}08track`,
      name: 'Track Apify Stats',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(3840, 160),
    },
    {
      parameters: {
        conditions: {
          options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
          conditions: [
            {
              id: 'c-postid',
              leftValue: '={{ $json.post_id }}',
              rightValue: '',
              operator: { type: 'string', operation: 'notEmpty' },
            },
          ],
          combinator: 'and',
        },
        options: {},
      },
      id: `${opts.idPrefix}08ifposts`,
      name: 'IF Apify Has Posts',
      type: 'n8n-nodes-base.if',
      typeVersion: 2.2,
      position: pos(4080, 160),
    },
    {
      parameters: {
        method: 'POST',
        url: PUBLIC.anthropic_api_url,
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: 'x-api-key', value: '={{ $env.ANTHROPIC_API_KEY }}' },
            { name: 'anthropic-version', value: '2023-06-01' },
            { name: 'Content-Type', value: 'application/json' },
          ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: claudeBody,
        options: { timeout: 60000 },
      },
      id: `${opts.idPrefix}09claude`,
      name: 'Claude Pain Intake',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: pos(4320, 80),
      onError: 'continueRegularOutput',
    },
    {
      parameters: { jsCode: codes.parseClaude },
      id: `${opts.idPrefix}10parse`,
      name: 'Parse Claude JSON',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(4560, 80),
    },
    {
      parameters: { jsCode: codes.trackClaude },
      id: `${opts.idPrefix}10track`,
      name: 'Track Claude Stats',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(4800, 80),
    },
    {
      parameters: {
        conditions: {
          options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
          conditions: [
            {
              id: 'c-ok',
              leftValue: '={{ $json.ok }}',
              rightValue: '',
              operator: { type: 'boolean', operation: 'true', singleValue: true },
            },
            {
              id: 'c-verdict',
              leftValue: '={{ $json.claude.verdict }}',
              rightValue: 'qualified',
              operator: { type: 'string', operation: 'equals' },
            },
          ],
          combinator: 'and',
        },
        options: {},
      },
      id: `${opts.idPrefix}11ifqual`,
      name: 'IF Qualified',
      type: 'n8n-nodes-base.if',
      typeVersion: 2.2,
      position: pos(5040, 80),
    },
    {
      parameters: { jsCode: codes.normalize },
      id: `${opts.idPrefix}12norm`,
      name: 'Normalize Content Record',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(5280, 0),
    },
    {
      parameters: { jsCode: codes.flattenSheet },
      id: `${opts.idPrefix}12flat`,
      name: 'Flatten Sheet Row',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(5520, -80),
    },
    {
      parameters: { jsCode: codes.sheetUpsert },
      id: `${opts.idPrefix}13sheet`,
      name: 'Sheet Upsert content_queue',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(5760, -80),
      onError: 'continueRegularOutput',
    },
    {
      parameters: { jsCode: codes.markSheetDone },
      id: `${opts.idPrefix}13done`,
      name: 'Mark Sheet Done',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(6000, -80),
    },
    {
      parameters: { jsCode: codes.updateIndexRow },
      id: `${opts.idPrefix}13idxrow`,
      name: 'Prepare scrape_index row',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(6240, -80),
    },
    {
      parameters: {
        method: 'POST',
        url: sheetAppendUrl(PUBLIC.scrape_index_tab, 'A:F'),
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'googleApi',
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={{ JSON.stringify($json.index_body) }}',
        options: {},
      },
      id: `${opts.idPrefix}13idx`,
      name: 'Append scrape_index',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: pos(6480, -80),
      onError: 'continueRegularOutput',
    },
    {
      parameters: { jsCode: codes.driveBackup },
      id: `${opts.idPrefix}14driveprep`,
      name: 'Prepare Drive Backup',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(5520, 80),
    },
    {
      parameters: {
        authentication: 'serviceAccount',
        operation: 'upload',
        name: '={{ $json.fileName }}',
        driveId: { __rl: true, mode: 'list', value: 'My Drive' },
        folderId: { __rl: true, mode: 'id', value: PUBLIC.drive_folder_id },
        options: {},
      },
      id: `${opts.idPrefix}15drive`,
      name: 'Drive Backup Upload',
      type: 'n8n-nodes-base.googleDrive',
      typeVersion: 3,
      position: pos(5760, 80),
      onError: 'continueRegularOutput',
    },
    {
      parameters: { jsCode: summaryCode },
      id: `${opts.idPrefix}16summary`,
      name: 'Build Summary',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(6720, 300),
    },
    {
      parameters: {
        jsCode: `return [{ json: { ok: true, empty: true, message: 'No URLs due for ${opts.platforms.join('/')}' } }];`,
      },
      id: `${opts.idPrefix}17empty`,
      name: 'No URLs Summary',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: pos(1440, 420),
    },
  ];

  const connections = {
    [opts.scheduleName]: { main: [[{ node: 'Fetch project_config', type: 'main', index: 0 }]] },
    "When clicking 'Execute workflow'": {
      main: [[{ node: 'Fetch project_config', type: 'main', index: 0 }]],
    },
    'Fetch project_config': { main: [[{ node: 'Parse project_config rows', type: 'main', index: 0 }]] },
    'Parse project_config rows': { main: [[{ node: 'Split URLs from Config', type: 'main', index: 0 }]] },
    'Split URLs from Config': { main: [[{ node: 'Filter Platform', type: 'main', index: 0 }]] },
    'Filter Platform': { main: [[{ node: 'Filter Due Channels', type: 'main', index: 0 }]] },
    'Filter Due Channels': { main: [[{ node: 'IF Has URLs', type: 'main', index: 0 }]] },
    'IF Has URLs': {
      main: [
        [{ node: 'Fetch scrape_index', type: 'main', index: 0 }],
        [{ node: 'No URLs Summary', type: 'main', index: 0 }],
      ],
    },
    'Fetch scrape_index': { main: [[{ node: 'Parse scrape_index', type: 'main', index: 0 }]] },
    'Parse scrape_index': { main: [[{ node: 'Fetch channel_state', type: 'main', index: 0 }]] },
    'Fetch channel_state': { main: [[{ node: 'Parse channel_state', type: 'main', index: 0 }]] },
    'Parse channel_state': { main: [[{ node: 'Reset Run Stats', type: 'main', index: 0 }]] },
    'Reset Run Stats': { main: [[{ node: 'Loop Over URLs', type: 'main', index: 0 }]] },
    'Loop Over URLs': {
      main: [
        [{ node: 'Build Summary', type: 'main', index: 0 }],
        [{ node: 'Apify Scrape', type: 'main', index: 0 }],
      ],
    },
    'Apify Scrape': { main: [[{ node: wrapNodeName, type: 'main', index: 0 }]] },
    [wrapNodeName]: {
      main: [
        [
          { node: 'Filter New Posts', type: 'main', index: 0 },
          { node: 'Prepare channel_state row', type: 'main', index: 0 },
        ],
      ],
    },
    'Prepare channel_state row': { main: [[{ node: 'Append channel_state', type: 'main', index: 0 }]] },
    'Append channel_state': { main: [[{ node: 'Loop Over URLs', type: 'main', index: 0 }]] },
    'Filter New Posts': { main: [[{ node: 'Track Apify Stats', type: 'main', index: 0 }]] },
    'Track Apify Stats': { main: [[{ node: 'IF Apify Has Posts', type: 'main', index: 0 }]] },
    'IF Apify Has Posts': {
      main: [
        [{ node: 'Claude Pain Intake', type: 'main', index: 0 }],
        [{ node: 'Loop Over URLs', type: 'main', index: 0 }],
      ],
    },
    'Claude Pain Intake': { main: [[{ node: 'Parse Claude JSON', type: 'main', index: 0 }]] },
    'Parse Claude JSON': { main: [[{ node: 'Track Claude Stats', type: 'main', index: 0 }]] },
    'Track Claude Stats': { main: [[{ node: 'IF Qualified', type: 'main', index: 0 }]] },
    'IF Qualified': {
      main: [
        [{ node: 'Normalize Content Record', type: 'main', index: 0 }],
        [{ node: 'Loop Over URLs', type: 'main', index: 0 }],
      ],
    },
    'Normalize Content Record': {
      main: [
        [
          { node: 'Flatten Sheet Row', type: 'main', index: 0 },
          { node: 'Prepare Drive Backup', type: 'main', index: 0 },
        ],
      ],
    },
    'Flatten Sheet Row': { main: [[{ node: 'Sheet Upsert content_queue', type: 'main', index: 0 }]] },
    'Sheet Upsert content_queue': { main: [[{ node: 'Mark Sheet Done', type: 'main', index: 0 }]] },
    'Mark Sheet Done': { main: [[{ node: 'Prepare scrape_index row', type: 'main', index: 0 }]] },
    'Prepare scrape_index row': { main: [[{ node: 'Append scrape_index', type: 'main', index: 0 }]] },
    'Append scrape_index': { main: [[{ node: 'Loop Over URLs', type: 'main', index: 0 }]] },
    'Prepare Drive Backup': { main: [[{ node: 'Drive Backup Upload', type: 'main', index: 0 }]] },
    'Drive Backup Upload': { main: [[{ node: 'Loop Over URLs', type: 'main', index: 0 }]] },
    'No URLs Summary': { main: [[{ node: 'Build Summary', type: 'main', index: 0 }]] },
  };

  return {
    name: opts.workflowName,
    nodes,
    connections,
    pinData: {},
    active: false,
    settings: { executionOrder: 'v1' },
    staticData: null,
    tags: opts.tags,
    meta: { templateCredsSetupCompleted: false },
  };
}
