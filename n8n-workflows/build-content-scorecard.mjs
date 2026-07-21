#!/usr/bin/env node
/**
 * Build n8n workflow: Sheet metrics → score.mjs logic → Sheet content_scorecard
 * Run: node n8n-workflows/build-content-scorecard.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { scorePostPublish } from '../tools/content-scorecard/lib/score-core.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const codeDir = path.join(__dirname, 'code', 'content-scorecard');
const PUBLIC = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'magnix-public-config.json'), 'utf8')
);

const read = (f) =>
  fs
    .readFileSync(path.join(codeDir, f), 'utf8')
    .replace(/^\/\/[^\n]*\n(\/\/[^\n]*\n)*/gm, '')
    .trim();

const SIGNALS = JSON.parse(
  fs.readFileSync(
    path.join(repoRoot, 'tools/content-scorecard/platform-signals.json'),
    'utf8'
  )
);

function buildScorePostNodeCode() {
  const coreSource = fs
    .readFileSync(path.join(repoRoot, 'tools/content-scorecard/lib/score-core.mjs'), 'utf8')
    .replace(/^\/\*\*[\s\S]*?\*\/\n/, '')
    .replace(/^export function /gm, 'function ')
    .replace(/^export const /gm, 'const ')
    .trim();

  return `// AUTO-GENERATED — sync with tools/content-scorecard/score.mjs via build-content-scorecard.mjs
// Do not edit manually; run: node n8n-workflows/build-content-scorecard.mjs

const SIGNALS = ${JSON.stringify(SIGNALS)};

${coreSource}

const results = [];

for (const item of $input.all()) {
  const row = item.json;

  if (row.empty === true) {
    results.push({ json: row });
    continue;
  }

  if (row.ok === false) {
    results.push({ json: row });
    continue;
  }

  try {
    const input = {
      post_id: row.post_id,
      segment: row.segment,
      metrics: row.metrics,
    };
    const scorecard = scorePostPublish(input, row.platform, SIGNALS);
    results.push({
      json: {
        ok: true,
        post_id: row.post_id,
        platform: row.platform,
        segment: row.segment,
        scorecard,
        _sheet_row_number: row._sheet_row_number,
        next_action: scorecard.verdict === 'hub_candidate' ? 'repurpose_hub' : scorecard.verdict,
      },
    });
  } catch (e) {
    results.push({
      json: {
        ok: false,
        error: 'SCORE_FAILED',
        message: e.message,
        post_id: row.post_id,
        _sheet_row_number: row._sheet_row_number,
      },
    });
  }
}

return results;
`;
}

function verifyParity() {
  const fixturePath = path.join(
    repoRoot,
    'tests/fixtures/content-scorecard/post_publish_tiktok_scale.json'
  );
  const input = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  const fromCore = scorePostPublish(input, 'tiktok', SIGNALS);

  const cli = spawnSync(
    process.execPath,
    [
      path.join(repoRoot, 'tools/content-scorecard/score.mjs'),
      'post',
      '--platform',
      'tiktok',
      '--input',
      fixturePath,
    ],
    { encoding: 'utf8' }
  );

  if (cli.status !== 0) {
    throw new Error(`CLI parity check failed: ${cli.stderr || cli.stdout}`);
  }

  const fromCli = JSON.parse(cli.stdout);
  if (
    fromCore.verdict !== fromCli.verdict ||
    fromCore.performance_score !== fromCli.performance_score
  ) {
    throw new Error(
      `Parity mismatch: core=${fromCore.verdict}/${fromCore.performance_score} cli=${fromCli.verdict}/${fromCli.performance_score}`
    );
  }
  console.log('Parity OK — score-core matches score.mjs CLI');
}

const codes = {
  rowsToObjects: read('00-rows-to-metrics-objects.js'),
  filterPending: read('01-filter-pending-rows.js'),
  normalizeRow: read('02-normalize-sheet-row.js'),
  runScore: buildScorePostNodeCode(),
  buildSummary: read('05-build-summary.js'),
};

const metricsRangeUrl = `https://sheets.googleapis.com/v4/spreadsheets/${PUBLIC.google_sheet_id}/values/${encodeURIComponent(`${PUBLIC.content_metrics_tab}!A:AA`)}`;

const nodes = [
  {
    parameters: {
      rule: { interval: [{ field: 'hours', hoursInterval: 24, triggerAtHour: 10 }] },
    },
    id: 'cs01schedule',
    name: 'Schedule Daily 10h',
    type: 'n8n-nodes-base.scheduleTrigger',
    typeVersion: 1.2,
    position: [0, 200],
  },
  {
    parameters: {},
    id: 'cs02manual',
    name: 'Manual Trigger',
    type: 'n8n-nodes-base.manualTrigger',
    typeVersion: 1,
    position: [0, 400],
  },
  {
    parameters: {
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      requestMethod: 'GET',
      url: metricsRangeUrl,
      options: { timeout: 30000 },
    },
    id: 'cs03sheets',
    name: 'Read Metrics Sheet',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [240, 300],
  },
  {
    parameters: { jsCode: codes.rowsToObjects },
    id: 'cs03rows',
    name: 'Rows to Metrics Objects',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [460, 300],
  },
  {
    parameters: { jsCode: codes.filterPending },
    id: 'cs04filter',
    name: 'Filter Pending Rows',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [680, 300],
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
    id: 'cs05ifrows',
    name: 'IF Has Rows',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: [760, 300],
  },
  {
    parameters: { jsCode: codes.normalizeRow },
    id: 'cs06norm',
    name: 'Normalize Sheet Row',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1000, 240],
  },
  {
    parameters: { jsCode: codes.runScore },
    id: 'cs07score',
    name: 'Run score.mjs Logic',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1240, 240],
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
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'cs08ifok',
    name: 'IF Score OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: [1480, 240],
  },
  {
    parameters: {
      jsCode: `function envFlagOn(name, defaultOn) {
  const raw = $env[name];
  if (raw == null || String(raw).trim() === '') return defaultOn;
  const v = String(raw).trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(v)) return true;
  if (['0', 'false', 'no', 'off'].includes(v)) return false;
  return defaultOn;
}
function scorecardWriteEnabled() {
  const raw = $env.CONTENT_SCORECARD_SHEET_WRITE_ENABLED;
  if (raw != null && String(raw).trim() !== '') {
    return envFlagOn('CONTENT_SCORECARD_SHEET_WRITE_ENABLED', true);
  }
  return envFlagOn('CONTENT_SHEET_WRITEBACK_ENABLED', true);
}
const on = scorecardWriteEnabled();
return $input.all().map((item) => ({
  json: {
    ...item.json,
    sheet_write_ok: on,
    sheet_write_skipped: !on,
    ...(on ? {} : { reason: 'CONTENT_SHEET_WRITEBACK_DISABLED' }),
  },
}));`,
    },
    id: 'cs08bgate',
    name: 'Gate Sheet Writeback',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1600, 160],
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c-wb',
            leftValue: '={{ $json.sheet_write_ok }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'cs08bifwb',
    name: 'IF Writeback On',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: [1720, 160],
  },
  {
    parameters: {
      authentication: 'serviceAccount',
      operation: 'appendOrUpdate',
      documentId: {
        __rl: true,
        mode: 'id',
        value: PUBLIC.google_sheet_id,
      },
      sheetName: {
        __rl: true,
        mode: 'name',
        value: PUBLIC.content_scorecard_tab || 'content_scorecard',
      },
      columns: {
        mappingMode: 'defineBelow',
        value: {
          post_id: '={{ $json.post_id }}',
          platform: '={{ $json.platform }}',
          segment: '={{ $json.segment }}',
          performance_score: '={{ $json.scorecard.performance_score }}',
          ivi_pct: '={{ $json.scorecard.ivi_pct }}',
          verdict: '={{ $json.scorecard.verdict }}',
          primary_retention_metric: '={{ $json.scorecard.primary_retention?.metric ?? "" }}',
          primary_retention_tier: '={{ $json.scorecard.primary_retention?.tier ?? "" }}',
          ivi_tier: '={{ $json.scorecard.ivi_tier }}',
          next_action: '={{ $json.next_action }}',
          recommendations: '={{ JSON.stringify($json.scorecard.recommendations ?? []) }}',
          scorecard_json: '={{ JSON.stringify($json.scorecard) }}',
          analyzed_at: '={{ $json.scorecard.analyzed_at }}',
          status: 'analyzed',
        },
        matchingColumns: ['post_id'],
        schema: [
          'post_id',
          'platform',
          'segment',
          'performance_score',
          'ivi_pct',
          'verdict',
          'primary_retention_metric',
          'primary_retention_tier',
          'ivi_tier',
          'next_action',
          'recommendations',
          'scorecard_json',
          'analyzed_at',
          'status',
        ].map((id) => ({
          id,
          displayName: id,
          required: false,
          defaultMatch: id === 'post_id',
          display: true,
          type: 'string',
          canBeUsedToMatch: id === 'post_id',
        })),
      },
      options: {},
    },
    id: 'cs09sheet',
    name: 'Sheet Upsert Scorecard',
    type: 'n8n-nodes-base.googleSheets',
    typeVersion: 4.5,
    position: [1960, 80],
  },
  {
    parameters: {
      authentication: 'serviceAccount',
      operation: 'update',
      documentId: {
        __rl: true,
        mode: 'id',
        value: PUBLIC.google_sheet_id,
      },
      sheetName: {
        __rl: true,
        mode: 'name',
        value: PUBLIC.content_metrics_tab,
      },
      columns: {
        mappingMode: 'defineBelow',
        value: {
          post_id: '={{ $("Run score.mjs Logic").item.json.post_id }}',
          scorecard_status: 'done',
          analyzed_at: '={{ $("Run score.mjs Logic").item.json.scorecard.analyzed_at }}',
          verdict: '={{ $("Run score.mjs Logic").item.json.scorecard.verdict }}',
          performance_score: '={{ $("Run score.mjs Logic").item.json.scorecard.performance_score }}',
          ivi_pct: '={{ $("Run score.mjs Logic").item.json.scorecard.ivi_pct }}',
          next_action: '={{ $("Run score.mjs Logic").item.json.next_action }}',
        },
        matchingColumns: ['post_id'],
        schema: [
          {
            id: 'post_id',
            displayName: 'post_id',
            required: false,
            defaultMatch: true,
            canBeUsedToMatch: true,
          },
          {
            id: 'scorecard_status',
            displayName: 'scorecard_status',
            required: false,
            defaultMatch: false,
            canBeUsedToMatch: false,
          },
          {
            id: 'analyzed_at',
            displayName: 'analyzed_at',
            required: false,
            defaultMatch: false,
            canBeUsedToMatch: false,
          },
          {
            id: 'verdict',
            displayName: 'verdict',
            required: false,
            defaultMatch: false,
            canBeUsedToMatch: false,
          },
          {
            id: 'performance_score',
            displayName: 'performance_score',
            required: false,
            defaultMatch: false,
            canBeUsedToMatch: false,
          },
          {
            id: 'ivi_pct',
            displayName: 'ivi_pct',
            required: false,
            defaultMatch: false,
            canBeUsedToMatch: false,
          },
          {
            id: 'next_action',
            displayName: 'next_action',
            required: false,
            defaultMatch: false,
            canBeUsedToMatch: false,
          },
        ],
      },
      options: {},
    },
    id: 'cs10sheetupd',
    name: 'Update Sheet Row',
    type: 'n8n-nodes-base.googleSheets',
    typeVersion: 4.5,
    position: [2200, 80],
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.buildSummary },
    id: 'cs11summary',
    name: 'Build Run Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [2440, 300],
  },
  {
    parameters: {
      jsCode: `return [{ json: { ok: true, empty: true, message: 'No pending metrics rows', count: 0 } }];`,
    },
    id: 'cs12empty',
    name: 'No Rows Summary',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1000, 420],
  },
];
const connections = {
  'Schedule Daily 10h': { main: [[{ node: 'Read Metrics Sheet', type: 'main', index: 0 }]] },
  'Manual Trigger': { main: [[{ node: 'Read Metrics Sheet', type: 'main', index: 0 }]] },
  'Read Metrics Sheet': { main: [[{ node: 'Rows to Metrics Objects', type: 'main', index: 0 }]] },
  'Rows to Metrics Objects': { main: [[{ node: 'Filter Pending Rows', type: 'main', index: 0 }]] },
  'Filter Pending Rows': { main: [[{ node: 'IF Has Rows', type: 'main', index: 0 }]] },
  'IF Has Rows': {
    main: [
      [{ node: 'Normalize Sheet Row', type: 'main', index: 0 }],
      [{ node: 'No Rows Summary', type: 'main', index: 0 }],
    ],
  },
  'Normalize Sheet Row': { main: [[{ node: 'Run score.mjs Logic', type: 'main', index: 0 }]] },
  'Run score.mjs Logic': { main: [[{ node: 'IF Score OK', type: 'main', index: 0 }]] },
  'IF Score OK': {
    main: [
      [{ node: 'Gate Sheet Writeback', type: 'main', index: 0 }],
      [{ node: 'Build Run Summary', type: 'main', index: 0 }],
    ],
  },
  'Gate Sheet Writeback': { main: [[{ node: 'IF Writeback On', type: 'main', index: 0 }]] },
  'IF Writeback On': {
    main: [
      [{ node: 'Sheet Upsert Scorecard', type: 'main', index: 0 }],
      [{ node: 'Build Run Summary', type: 'main', index: 0 }],
    ],
  },
  'Sheet Upsert Scorecard': { main: [[{ node: 'Update Sheet Row', type: 'main', index: 0 }]] },
  'Update Sheet Row': { main: [[{ node: 'Build Run Summary', type: 'main', index: 0 }]] },
  'No Rows Summary': { main: [[{ node: 'Build Run Summary', type: 'main', index: 0 }]] },
};

const workflow = {
  name: 'Magnix Mạch 5 — Content Scorecard (Sheet → score → Sheet)',
  nodes,
  connections,
  pinData: {},
  settings: { executionOrder: 'v1' },
  staticData: null,
  tags: [{ name: 'magnix' }, { name: 'circuit-5' }, { name: 'content-scorecard' }],
  meta: { templateCredsSetupCompleted: false },
};

verifyParity();

const out = path.join(__dirname, 'content-scorecard.workflow.json');
fs.writeFileSync(out, JSON.stringify(workflow, null, 2));
console.log('Written', out, '—', nodes.length, 'nodes');
