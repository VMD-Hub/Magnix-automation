#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(
  path.join(__dirname, '../n8n-workflows/code/telegram-notify/01-auth-normalize.js'),
  'utf8',
);
const execute = new Function('$env', '$input', 'buildReviewUrl', source);
const TOKENS = {
  MAGNIX_WEBHOOK_TOKEN: 'ordinary-token-123456789',
  HOUSEX_BACKUP_ALERT_TOKEN: 'backup-token-123456789',
};

function run({ body, token, env = TOKENS }) {
  return execute(
    env,
    {
      first() {
        return {
          json: {
            headers: token === undefined ? {} : { authorization: `Bearer ${token}` },
            body,
          },
        };
      },
    },
    () => 'https://example.invalid/review',
  );
}

const backupBody = {
  event_id: 'housex-backup:2026-07-18:workflow_blocked',
  event_type: 'workflow_blocked',
  agent: 'House X Backup',
};
const ordinaryBody = {
  event_id: 'agent-3:2026-07-18:approval_needed',
  event_type: 'approval_needed',
  agent: 'Agent 3',
};

assert.throws(
  () => run({ body: backupBody, token: TOKENS.HOUSEX_BACKUP_ALERT_TOKEN, env: {
    MAGNIX_WEBHOOK_TOKEN: TOKENS.MAGNIX_WEBHOOK_TOKEN,
  } }),
  /^Error: Unauthorized$/,
  'missing backup token must fail closed',
);
assert.throws(
  () => run({ body: backupBody, token: 'wrong-backup-token', env: TOKENS }),
  /^Error: Unauthorized$/,
  'wrong backup token must be rejected',
);
assert.equal(
  run({ body: JSON.stringify(backupBody), token: TOKENS.HOUSEX_BACKUP_ALERT_TOKEN })[0].json.agent,
  'House X Backup',
  'correct backup token must authenticate a safely parsed JSON body',
);
assert.throws(
  () => run({ body: ordinaryBody, token: TOKENS.HOUSEX_BACKUP_ALERT_TOKEN }),
  /^Error: Unauthorized$/,
  'backup token must not authenticate ordinary events',
);
assert.throws(
  () => run({ body: backupBody, token: TOKENS.MAGNIX_WEBHOOK_TOKEN }),
  /^Error: Unauthorized$/,
  'default token must not authenticate backup events',
);
assert.throws(
  () => run({ body: { ...backupBody, agent: ' House X Backup ' }, token: TOKENS.HOUSEX_BACKUP_ALERT_TOKEN }),
  /^Error: Unauthorized$/,
  'backup caller matching must be exact',
);
assert.equal(
  run({ body: ordinaryBody, token: TOKENS.MAGNIX_WEBHOOK_TOKEN })[0].json.agent,
  'Agent 3',
  'default token must authenticate ordinary events',
);
assert.throws(
  () => run({ body: ordinaryBody, token: TOKENS.MAGNIX_WEBHOOK_TOKEN, env: {
    HOUSEX_BACKUP_ALERT_TOKEN: TOKENS.HOUSEX_BACKUP_ALERT_TOKEN,
  } }),
  /^Error: Unauthorized$/,
  'missing default token must fail closed',
);

console.log('telegram-notify-auth.test.mjs — all passed');
