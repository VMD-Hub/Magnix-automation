#!/usr/bin/env node
/**
 * Đếm candidate Agent 6 trên content_queue + lý do bị loại.
 * Usage: node scripts/diagnose-agent6-candidates.mjs
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const MIN_SCORE = 70;
const ALLOW_SEGMENTS = new Set(['noxh_income', 'valuation', 'sme_credit', 'general_inbound']);
const VIDEO_PLATFORMS = new Set([
  'tiktok', 'tt', 'fb', 'fb_page', 'fb_group', 'fb_reels', 'reels', 'instagram', 'youtube_shorts', 'shorts',
]);

function loadEnv() {
  const envPath = path.join(root, 'n8n-workflows/.env');
  const map = {};
  if (!fs.existsSync(envPath)) return map;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i > 0) map[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return map;
}

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
      aud: sa.token_uri,
      iat: now,
      exp: now + 3600,
    })
  );
  const unsigned = `${header}.${claim}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(unsigned);
  const jwt = `${unsigned}.${base64url(sign.sign(sa.private_key))}`;
  const res = await fetch(sa.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(JSON.stringify(data));
  return data.access_token;
}

function parseMeta(raw) {
  if (!raw) return {};
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
}

function normPlatform(raw) {
  const key = String(raw || 'tiktok').trim().toLowerCase();
  const map = { tt: 'tiktok', fb: 'fb_reels', fb_group: 'fb_reels', reels: 'fb_reels', page: 'fb_page', shorts: 'youtube_shorts' };
  return map[key] || key;
}

async function main() {
  const env = loadEnv();
  const cfg = JSON.parse(fs.readFileSync(path.join(root, 'n8n-workflows/magnix-public-config.json'), 'utf8'));
  const sheetId = env.GOOGLE_SHEET_CONTENT_METRICS_ID || cfg.google_sheet_id;
  const saPath = env.GOOGLE_SERVICE_ACCOUNT_JSON || path.join(root, 'n8n-workflows/credentials/google-service-account.json');
  const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
  const token = await getAccessToken(sa);

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent('content_queue!A:O')}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);

  const rows = data.values || [];
  if (rows.length < 2) {
    console.log('content_queue trống');
    return;
  }

  const headers = rows[0].map((x) => String(x ?? '').trim().toLowerCase());
  const idx = (n) => headers.indexOf(n);

  const reasons = {
    total: 0,
    already_video_draft: 0,
    bad_segment: 0,
    low_score: 0,
    not_classified: 0,
    bad_platform: 0,
    short_text: 0,
    no_editorial_brief: 0,
    eligible: 0,
  };

  const platformCounts = {};
  const statusCounts = {};
  const segmentCounts = {};
  const samples = [];

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    if (!cells?.some((c) => String(c ?? '').trim())) continue;
    reasons.total += 1;

    const get = (n) => cells[idx(n)] ?? '';
    const segment = String(get('segment')).trim().toLowerCase();
    const score = Number(get('score') || 0);
    const status = String(get('status')).trim().toLowerCase();
    const platformRaw = String(get('platform')).trim().toLowerCase();
    const meta = parseMeta(get('meta'));
    const text = String(get('text')).trim();

    platformCounts[platformRaw] = (platformCounts[platformRaw] || 0) + 1;
    statusCounts[status || '(blank)'] = (statusCounts[status || '(blank)'] || 0) + 1;
    segmentCounts[segment || '(blank)'] = (segmentCounts[segment || '(blank)'] || 0) + 1;

    if (meta.video_draft_created === true) {
      reasons.already_video_draft += 1;
      continue;
    }
    if (!ALLOW_SEGMENTS.has(segment)) {
      reasons.bad_segment += 1;
      continue;
    }
    if (score < MIN_SCORE) {
      reasons.low_score += 1;
      continue;
    }
    if (status !== 'classified' && get('claude_verdict') !== 'qualified') {
      reasons.not_classified += 1;
      continue;
    }
    const platOk = VIDEO_PLATFORMS.has(platformRaw) || VIDEO_PLATFORMS.has(normPlatform(platformRaw));
    if (!platOk) {
      reasons.bad_platform += 1;
      continue;
    }
    if (text.length < 20) {
      reasons.short_text += 1;
      continue;
    }
    if (!meta.editorial_brief_v1) {
      reasons.no_editorial_brief += 1;
      continue;
    }

    reasons.eligible += 1;
    if (samples.length < 5) {
      samples.push({
        row: i + 1,
        platform: platformRaw,
        segment,
        score,
        status,
        text_preview: text.slice(0, 80),
      });
    }
  }

  console.log('=== Agent 6 candidate diagnostic ===');
  console.log(`Sheet rows (non-empty): ${reasons.total}`);
  console.log(`Eligible now (batch picks max 3): ${reasons.eligible}`);
  console.log('\n--- Loại bởi filter ---');
  for (const [k, v] of Object.entries(reasons)) {
    if (k === 'total' || k === 'eligible') continue;
    console.log(`  ${k}: ${v}`);
  }
  console.log('\n--- Top status ---');
  console.log(Object.entries(statusCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `  ${k}: ${v}`).join('\n'));
  console.log('\n--- Top platform ---');
  console.log(Object.entries(platformCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `  ${k}: ${v}`).join('\n'));
  console.log('\n--- Top segment ---');
  console.log(Object.entries(segmentCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `  ${k}: ${v}`).join('\n'));
  if (samples.length) {
    console.log('\n--- Sample eligible rows ---');
    for (const s of samples) console.log(JSON.stringify(s));
  } else {
    console.log('\nKhông có candidate eligible — thường do thiếu editorial_brief_v1 (chạy Layer B trước).');
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
