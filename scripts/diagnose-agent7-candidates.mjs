#!/usr/bin/env node
/** Diagnostic Agent 7 — video_drafts eligible for render */
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
    aud: sa.token_uri, iat: now, exp: now + 3600,
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

function truthyL3(v) {
  if (v === true || v === 1) return true;
  const s = String(v || '').trim().toLowerCase();
  return s === 'true' || s === '1' || s === 'yes';
}

function parseMeta(raw) {
  if (!raw) return {};
  try { return typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return {}; }
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
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent('video_drafts!A:V')}`;
  const data = await fetch(url, { headers: { Authorization: `Bearer ${tok}` } }).then((r) => r.json());
  const rows = data.values || [];
  if (rows.length < 2) {
    console.log('video_drafts trống');
    return;
  }
  const h = rows[0].map((x) => String(x || '').trim().toLowerCase());
  const ix = (n) => h.indexOf(n);

  console.log('=== Agent 7 diagnostic ===\n');
  const all = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r?.some((c) => String(c || '').trim())) continue;
    const get = (n) => r[ix(n)] ?? '';
    const status = String(get('status')).trim().toLowerCase();
    const l3 = get('l3_approved');
    const meta = parseMeta(get('meta'));
    const renderStatus = String(meta.render_status || '').toLowerCase();
    const eligible = status === 'approved' && truthyL3(l3) && !['rendering', 'ready_for_review', 'published'].includes(renderStatus);

    all.push({
      row: i + 1,
      title: String(get('title')).slice(0, 50),
      status,
      l3_approved: l3,
      l3_ok: truthyL3(l3),
      render_status: renderStatus || '(none)',
      eligible,
    });
  }

  console.log('Tất cả dòng video_drafts:');
  for (const x of all) {
    console.log(`  row ${x.row}: status=${x.status} l3=${x.l3_approved} (ok=${x.l3_ok}) render=${x.render_status} eligible=${x.eligible} | ${x.title}`);
  }
  const n = all.filter((x) => x.eligible).length;
  console.log(`\nEligible cho Agent 7: ${n}`);
  if (n === 0) {
    console.log('\n→ Agent 7 kết thúc nhanh vì KHÔNG có dòng approved + l3=TRUE chưa render.');
    console.log('  Fix: status=approved (dropdown) + tick checkbox l3_approved');
  }
  console.log('\nEnv local (VPS cần tương tự):');
  console.log('  CREATOMATE_API_KEY:', env.CREATOMATE_API_KEY ? '(set)' : 'MISSING');
  console.log('  CREATOMATE_TEMPLATE_ID:', env.CREATOMATE_TEMPLATE_ID || 'MISSING');
  console.log('  DRIVE_VIDEO_FOLDER_READY:', env.DRIVE_VIDEO_FOLDER_READY || 'MISSING');
}

main().catch((e) => { console.error(e.message); process.exit(1); });
