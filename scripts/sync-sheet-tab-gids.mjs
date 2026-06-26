#!/usr/bin/env node
/**
 * Đồng bộ sheetId (gid) từng tab vào magnix-public-config.json — dùng cho review_url deep link Telegram.
 * Usage: node scripts/sync-sheet-tab-gids.mjs
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const cfgPath = path.join(root, 'n8n-workflows/magnix-public-config.json');

const TABS = [
  'content_drafts',
  'video_drafts',
  'outreach_queue',
  'content_queue',
  'notification_events',
];

function loadEnv() {
  const map = {};
  const p = path.join(root, 'n8n-workflows/.env');
  if (!fs.existsSync(p)) return map;
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i > 0) map[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return map;
}

function b64u(s) {
  return Buffer.from(s).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function token(sa) {
  const now = Math.floor(Date.now() / 1000);
  const h = b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const c = b64u(
    JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
      aud: sa.token_uri,
      iat: now,
      exp: now + 3600,
    })
  );
  const u = `${h}.${c}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(u);
  const jwt = `${u}.${b64u(sign.sign(sa.private_key))}`;
  const res = await fetch(sa.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const d = await res.json();
  if (!d.access_token) throw new Error(JSON.stringify(d));
  return d.access_token;
}

async function main() {
  const env = loadEnv();
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  const spreadsheetId = env.GOOGLE_SHEET_CONTENT_METRICS_ID || cfg.google_sheet_id;
  const saPath =
    env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    path.join(root, 'n8n-workflows/credentials/google-service-account.json');
  const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
  const tok = await token(sa);

  const meta = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties(sheetId,title)`,
    { headers: { Authorization: `Bearer ${tok}` } }
  ).then((r) => r.json());

  if (meta.error) throw new Error(meta.error.message);

  const gids = { ...(cfg.sheet_tab_gids || {}) };
  for (const s of meta.sheets || []) {
    const title = s.properties.title;
    if (TABS.includes(title)) {
      gids[title] = s.properties.sheetId;
    }
  }

  cfg.sheet_tab_gids = gids;
  fs.writeFileSync(cfgPath, `${JSON.stringify(cfg, null, 2)}\n`);
  console.log('Updated sheet_tab_gids:', gids);
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
