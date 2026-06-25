#!/usr/bin/env node
/**
 * Batch regex classify tab content_queue — 0 token (Agent 2 tier 0)
 *
 * Usage:
 *   node scripts/batch-regex-classify-content-queue.mjs --dry-run
 *   node scripts/batch-regex-classify-content-queue.mjs
 *   node scripts/batch-regex-classify-content-queue.mjs --all   # ghi đè cả dòng đã classified
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  classifyContentRow,
  mergeMeta,
} from '../n8n-workflows/code/shared/classify-fast.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const TAB = 'content_queue';
const BATCH_RANGES = 400;

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
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
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

async function api(token, method, pathSuffix, body) {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${pathSuffix}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data;
}

function colLetter(n) {
  let s = '';
  let x = n + 1;
  while (x > 0) {
    s = String.fromCharCode(65 + ((x - 1) % 26)) + s;
    x = Math.floor((x - 1) / 26);
  }
  return s;
}

function headerIndex(headers, name) {
  const i = headers.findIndex((h) => h === name);
  return i >= 0 ? i : -1;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const overwriteAll = process.argv.includes('--all');

  const env = loadEnv();
  const sheetId =
    env.GOOGLE_SHEET_CONTENT_METRICS_ID ||
    JSON.parse(fs.readFileSync(path.join(root, 'n8n-workflows/magnix-public-config.json'), 'utf8'))
      .google_sheet_id;

  const saPath =
    env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    path.join(root, 'n8n-workflows/credentials/google-service-account.json');
  const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
  const token = await getAccessToken(sa);

  console.log(`Đọc tab ${TAB}...`);
  const val = await api(
    token,
    'GET',
    `${sheetId}/values/${encodeURIComponent(`${TAB}!A:O`)}`
  );
  const rows = val.values || [];
  if (rows.length < 2) {
    console.log('Không có dữ liệu trong content_queue.');
    return;
  }

  const headers = rows[0].map((h) => String(h ?? '').trim().toLowerCase());
  const idx = {
    text: headerIndex(headers, 'text'),
    segment: headerIndex(headers, 'segment'),
    score: headerIndex(headers, 'score'),
    claude_verdict: headerIndex(headers, 'claude_verdict'),
    interest_key: headerIndex(headers, 'interest_key'),
    status: headerIndex(headers, 'status'),
    tags: headerIndex(headers, 'tags'),
    meta: headerIndex(headers, 'meta'),
    source: headerIndex(headers, 'source'),
  };

  if (idx.text < 0 || idx.segment < 0) {
    throw new Error('Thiếu cột text hoặc segment trong content_queue');
  }

  const stats = {
    total: rows.length - 1,
    skipped_already: 0,
    skipped_no_match: 0,
    classified: 0,
    review: 0,
    by_segment: {},
    needs_llm: 0,
  };

  const updates = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    while (row.length < headers.length) row.push('');

    const currentSegment = String(row[idx.segment] ?? '').trim().toLowerCase();
    const source = idx.source >= 0 ? String(row[idx.source] ?? '') : '';

    if (!overwriteAll && currentSegment && currentSegment !== 'unclassified') {
      stats.skipped_already += 1;
      continue;
    }

    let metaObj = {};
    if (idx.meta >= 0 && row[idx.meta]) {
      try {
        metaObj = JSON.parse(row[idx.meta]);
      } catch {
        metaObj = {};
      }
    }

    const text = String(row[idx.text] ?? '');
    const c = classifyContentRow({ text, meta: metaObj });

    if (c.segment === 'unclassified') {
      stats.skipped_no_match += 1;
      continue;
    }

    if (c.needs_llm) stats.needs_llm += 1;
    if (c.status === 'classified') stats.classified += 1;
    else if (c.status === 'review') stats.review += 1;
    stats.by_segment[c.segment] = (stats.by_segment[c.segment] || 0) + 1;

    row[idx.segment] = c.segment;
    row[idx.score] = c.score;
    if (idx.claude_verdict >= 0) row[idx.claude_verdict] = c.claude_verdict;
    if (idx.interest_key >= 0) row[idx.interest_key] = c.interest_key;
    if (idx.status >= 0) row[idx.status] = c.status;
    if (idx.tags >= 0) row[idx.tags] = c.tags;
    if (idx.meta >= 0) {
      row[idx.meta] = mergeMeta(row[idx.meta], c.meta_patch);
    }

    rows[r] = row;

    const sheetRow = r + 1;
    const minCol = Math.min(idx.segment, idx.score, idx.claude_verdict, idx.interest_key, idx.status, idx.tags, idx.meta);
    const maxCol = Math.max(idx.segment, idx.score, idx.claude_verdict, idx.interest_key, idx.status, idx.tags, idx.meta);
    const slice = row.slice(minCol, maxCol + 1);

    updates.push({
      sheetRow,
      range: `${TAB}!${colLetter(minCol)}${sheetRow}:${colLetter(maxCol)}${sheetRow}`,
      values: [slice],
      segment: c.segment,
      score: c.score,
    });
  }

  console.log('\n--- Thống kê classify (regex) ---');
  console.log('Tổng dòng:', stats.total);
  console.log('Bỏ qua (đã classified):', stats.skipped_already);
  console.log('Không match regex:', stats.skipped_no_match);
  console.log('→ Cập nhật:', updates.length);
  console.log('  classified (score≥60):', stats.classified);
  console.log('  review (score 40-59):', stats.review);
  console.log('  cần LLM sau (Agent 2):', stats.needs_llm);
  console.log('Theo segment:', stats.by_segment);

  if (!updates.length) {
    console.log('\nKhông có dòng nào cần cập nhật.');
    return;
  }

  if (dryRun) {
    console.log('\n[dry-run] Mẫu 3 dòng đầu sẽ cập nhật:');
    updates.slice(0, 3).forEach((u, i) => {
      console.log(`  ${i + 1}. row ${u.sheetRow} → ${u.segment} score=${u.score}`);
    });
    return;
  }

  for (let i = 0; i < updates.length; i += BATCH_RANGES) {
    const chunk = updates.slice(i, i + BATCH_RANGES);
    await api(token, 'POST', `${sheetId}/values:batchUpdate`, {
      valueInputOption: 'USER_ENTERED',
      data: chunk.map((u) => ({ range: u.range, values: u.values })),
    });
    console.log(`  batchUpdate: ${Math.min(i + BATCH_RANGES, updates.length)}/${updates.length}`);
  }

  console.log('\n✓ Hoàn tất regex classify — 0 token.');
  console.log(`Còn ~${stats.skipped_no_match + stats.needs_llm} dòng cho Agent 2 (LLM batch).`);
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
