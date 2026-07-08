import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const codeDir = path.join(__dirname, 'code', 'uid-ingest');
const PUBLIC = JSON.parse(fs.readFileSync(path.join(__dirname, 'magnix-public-config.json'), 'utf8'));

const read = (f) =>
  fs
    .readFileSync(path.join(codeDir, f), 'utf8')
    .replace(/^\/\/[^\n]*\n(\/\/[^\n]*\n)*/gm, '')
    .trim();

const codes = {
  enrich: read('01-auth-enrich.js'),
  classify: read('02-classify-fast.js'),
  wrapRegex: read('03-wrap-regex-classify.js'),
  parseLlm: read('04-parse-llm-json.js'),
  merge: read('05-merge-uid-record.js'),
  deadLetter: read('06-dead-letter-parse.js'),
  housexIngest: read('09-housex-postgres-ingest.js'),
  driveBackup: read('08-prepare-drive-backup.js'),
  buildResponse: read('10-build-webhook-response.js'),
};

const systemPrompt =
  'Bạn là bộ phận phân loại Magnix. [/focus] [/silent] [/ooda] nội bộ. Chỉ trả JSON: {"segment":"","score":0,"interest_key":""}. segment ∈ noxh_income|valuation|sme_credit|general_inbound|unclassified. Không markdown.';

const llmJsonBody = `={{ JSON.stringify({
  model: $env.DEEPSEEK_MODEL || 'deepseek-chat',
  temperature: 0.2,
  response_format: { type: 'json_object' },
  messages: [
    { role: 'system', content: ${JSON.stringify(systemPrompt)} },
    { role: 'user', content: JSON.stringify({
      uid: $('Auth & Enrich Skeleton').first().json.uid,
      uid_source: $('Auth & Enrich Skeleton').first().json.uid_source,
      text: $('Auth & Enrich Skeleton').first().json.text,
      meta: $('Auth & Enrich Skeleton').first().json.meta,
    }) },
  ],
}) }}`;

const nodes = [
  {
    parameters: {
      content:
        '## UID Ingest — ADR-013\n**Webhook:** POST `/webhook/magnix/uid-ingest`\n**Store:** House X Postgres `POST /api/ingest/magnix-lead`\n**Archive:** Google Drive JSONL (best-effort)\n**Env:** `MAGNIX_INGEST_SECRET` = `MAGNIX_INGEST_SECRET` trên HouseX · `HOUSEX_PUBLIC_URL`',
      height: 200,
      width: 520,
    },
    id: 'a0sticky01',
    name: 'Sticky Note',
    type: 'n8n-nodes-base.stickyNote',
    typeVersion: 1,
    position: [-40, 80],
  },
  {
    parameters: {
      httpMethod: 'POST',
      path: 'magnix/uid-ingest',
      responseMode: 'responseNode',
      options: {},
    },
    id: 'a1webhook001',
    name: 'Webhook uid-ingest',
    type: 'n8n-nodes-base.webhook',
    typeVersion: 2,
    position: [0, 300],
    webhookId: 'magnix-uid-ingest',
  },
  {
    parameters: { jsCode: codes.enrich },
    id: 'a2enrich001',
    name: 'Auth & Enrich Skeleton',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [240, 300],
  },
  {
    parameters: { jsCode: codes.classify },
    id: 'a3classify01',
    name: 'Classify Fast',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [480, 300],
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ $json.needs_llm }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a4ifllm001',
    name: 'IF Needs LLM',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: [720, 300],
  },
  {
    parameters: { jsCode: codes.wrapRegex },
    id: 'a5regex001',
    name: 'Wrap Regex Classify',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [960, 480],
  },
  {
    parameters: {
      method: 'POST',
      url: '={{ $env.DEEPSEEK_API_URL || "https://api.deepseek.com/chat/completions" }}',
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: 'Authorization', value: '=Bearer {{ $env.DEEPSEEK_API_KEY }}' },
          { name: 'Content-Type', value: 'application/json' },
        ],
      },
      sendBody: true,
      specifyBody: 'json',
      jsonBody: llmJsonBody,
      options: { timeout: 30000 },
    },
    id: 'a6llm00001',
    name: 'HTTP LLM Classify',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [960, 120],
    onError: 'continueRegularOutput',
  },
  {
    parameters: { jsCode: codes.parseLlm },
    id: 'a7parse001',
    name: 'Parse LLM JSON',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1200, 120],
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [
          {
            id: 'c2',
            leftValue: '={{ $json.ok }}',
            rightValue: '',
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      options: {},
    },
    id: 'a8ifparse1',
    name: 'IF Parse OK',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: [1440, 120],
  },
  {
    parameters: { jsCode: codes.deadLetter },
    id: 'a9dead0001',
    name: 'Dead Letter Parse Fail',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1680, 0],
  },
  {
    parameters: { jsCode: codes.merge },
    id: 'a10merge01',
    name: 'Merge UID Record',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1680, 300],
  },
  {
    parameters: { jsCode: codes.housexIngest },
    id: 'a11housex01',
    name: 'HouseX Postgres Ingest',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1920, 300],
  },
  {
    parameters: { jsCode: codes.driveBackup },
    id: 'a15driveprep',
    name: 'Prepare Drive Backup',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1920, 480],
  },
  {
    parameters: {
      operation: 'upload',
      name: '={{ $json.fileName }}',
      driveId: {
        __rl: true,
        mode: 'list',
        value: 'My Drive',
      },
      folderId: {
        __rl: true,
        mode: 'id',
        value: '={{ $env.GOOGLE_DRIVE_ARCHIVE_FOLDER_ID }}',
      },
      options: {},
    },
    id: 'a16driveup',
    name: 'Drive Backup Upload',
    type: 'n8n-nodes-base.googleDrive',
    typeVersion: 3,
    position: [2160, 480],
    onError: 'continueRegularOutput',
    credentials: {
      googleDriveOAuth2Api: {
        id: 'CONFIGURE_AFTER_IMPORT',
        name: 'Google Drive Magnix',
      },
    },
  },
  {
    parameters: { jsCode: codes.buildResponse },
    id: 'a13wrapresp',
    name: 'Build Webhook Response',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [2160, 300],
  },
  {
    parameters: {
      respondWith: 'json',
      responseBody: '={{ JSON.stringify($json) }}',
      options: {},
    },
    id: 'a14respond1',
    name: 'Respond to Webhook',
    type: 'n8n-nodes-base.respondToWebhook',
    typeVersion: 1.1,
    position: [2400, 300],
  },
];

const connections = {
  'Webhook uid-ingest': {
    main: [[{ node: 'Auth & Enrich Skeleton', type: 'main', index: 0 }]],
  },
  'Auth & Enrich Skeleton': {
    main: [[{ node: 'Classify Fast', type: 'main', index: 0 }]],
  },
  'Classify Fast': {
    main: [[{ node: 'IF Needs LLM', type: 'main', index: 0 }]],
  },
  'IF Needs LLM': {
    main: [
      [{ node: 'HTTP LLM Classify', type: 'main', index: 0 }],
      [{ node: 'Wrap Regex Classify', type: 'main', index: 0 }],
    ],
  },
  'HTTP LLM Classify': {
    main: [[{ node: 'Parse LLM JSON', type: 'main', index: 0 }]],
  },
  'Parse LLM JSON': {
    main: [[{ node: 'IF Parse OK', type: 'main', index: 0 }]],
  },
  'IF Parse OK': {
    main: [
      [{ node: 'Merge UID Record', type: 'main', index: 0 }],
      [{ node: 'Dead Letter Parse Fail', type: 'main', index: 0 }],
    ],
  },
  'Wrap Regex Classify': {
    main: [[{ node: 'Merge UID Record', type: 'main', index: 0 }]],
  },
  'Merge UID Record': {
    main: [
      [
        { node: 'HouseX Postgres Ingest', type: 'main', index: 0 },
        { node: 'Prepare Drive Backup', type: 'main', index: 0 },
      ],
    ],
  },
  'Dead Letter Parse Fail': {
    main: [[{ node: 'Build Webhook Response', type: 'main', index: 0 }]],
  },
  'Prepare Drive Backup': {
    main: [[{ node: 'Drive Backup Upload', type: 'main', index: 0 }]],
  },
  'HouseX Postgres Ingest': {
    main: [[{ node: 'Build Webhook Response', type: 'main', index: 0 }]],
  },
  'Build Webhook Response': {
    main: [[{ node: 'Respond to Webhook', type: 'main', index: 0 }]],
  },
};

const workflow = {
  name: 'Magnix Mạch 1 — UID Ingest',
  nodes,
  connections,
  pinData: {},
  settings: { executionOrder: 'v1' },
  staticData: null,
  tags: [
    { name: 'magnix' },
    { name: 'circuit-1' },
    { name: 'postgres-primary' },
  ],
  meta: { templateCredsSetupCompleted: false },
};

const out = path.join(__dirname, 'uid-ingest.workflow.json');
fs.writeFileSync(out, JSON.stringify(workflow, null, 2));
console.log('Written', out, '—', nodes.length, 'nodes');
