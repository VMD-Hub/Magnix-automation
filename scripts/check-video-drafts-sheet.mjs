#!/usr/bin/env node
/** Kiểm tra tab video_drafts + queue flags Agent 6 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

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
  const c = b64u(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: sa.token_uri,
    iat: now,
    exp: now + 3600,
  }));
  const u = `${h}.${c}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(u);
  const jwt = `${u}.${b64u(sign.sign(sa.private_key))}`;
  const res = await fetch(sa.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  });
  const d = await res.json();
  if (!d.access_token) throw new Error(JSON.stringify(d));
  return d.access_token;
}

async function getValues(tok, sheetId, range) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${tok}` } });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.values || [];
}

async function main() {
  const env = loadEnv();
  const cfg = JSON.parse(fs.readFileSync(path.join(root, 'n8n-workflows/magnix-public-config.json'), 'utf8'));
  const sheetId = env.GOOGLE_SHEET_CONTENT_METRICS_ID || cfg.google_sheet_id;
  const sa = JSON.parse(fs.readFileSync(
    env.GOOGLE_SERVICE_ACCOUNT_JSON || path.join(root, 'n8n-workflows/credentials/google-service-account.json'),
    'utf8'
  ));
  const tok = await token(sa);

  const meta = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=sheets.properties.title`,
    { headers: { Authorization: `Bearer ${tok}` } }
  ).then((r) => r.json());
  const tabs = (meta.sheets || []).map((s) => s.properties.title);
  console.log('Tabs:', tabs.join(', '));
  console.log('Has video_drafts:', tabs.includes('video_drafts'));

  const vd = await getValues(tok, sheetId, 'video_drafts!A:V');
  console.log(`video_drafts rows (incl header): ${vd.length}`);
  if (vd.length > 1) {
    console.log('Row 2 title:', vd[1][4] || '(empty)');
    console.log('Row 2 status:', vd[1][16], 'l3:', vd[1][18]);
  }

  const q = await getValues(tok, sheetId, 'content_queue!A:O');
  let flagged = 0;
  for (let i = 1; i < q.length; i++) {
    const metaCol = q[i][14];
    if (!metaCol) continue;
    try {
      if (JSON.parse(metaCol).video_draft_created === true) flagged += 1;
    } catch { /* ignore */ }
  }
  console.log(`content_queue rows with video_draft_created=true: ${flagged}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
