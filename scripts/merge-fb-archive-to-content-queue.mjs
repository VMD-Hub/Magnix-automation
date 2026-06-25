#!/usr/bin/env node
/**
 * Gộp dữ liệu scrape FB từ tab _archive_* → content_queue, xóa tab archive.
 * Usage: node scripts/merge-fb-archive-to-content-queue.mjs [--dry-run]
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const CONTENT_QUEUE_HEADERS = [
  'normalized_key',
  'post_id',
  'platform',
  'post_url',
  'author_id',
  'text',
  'segment',
  'score',
  'claude_verdict',
  'interest_key',
  'status',
  'captured_at',
  'source',
  'tags',
  'meta',
];

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

function safeKey(platform, postId) {
  const p = String(platform || 'fb_group').replace(/[^a-z0-9_]/gi, '_');
  const id = String(postId || 'unknown').replace(/[^a-zA-Z0-9._-]/g, '_');
  return `apify:${p}:${id}`;
}

function normHeader(h) {
  const raw = String(h ?? '').trim();
  const paren = raw.match(/\(([^)]+)\)\s*$/);
  if (paren) {
    const inner = paren[1].split('/').pop().trim().toLowerCase().replace(/\s+/g, '_');
    if (inner) return inner;
  }
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_()/.-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

function headerAliases(headers) {
  const map = {};
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i];
    map[h] = i;
    const lower = h.toLowerCase();
    if (lower.includes('post_url') || lower.includes('link_bai') || lower.includes('link_bài')) {
      map.post_url = i;
    }
    if (lower.includes('caption') || lower.includes('noi_dung') || lower.includes('nội_dung')) {
      map.text = i;
    }
    if (lower.includes('profile_url') || lower.includes('link_profile')) {
      map.profile_url = i;
    }
    if (lower.includes('user_details/name') || lower.includes('ten_nguoi') || lower.includes('tên_người')) {
      map.author_id = i;
    }
    if (lower.includes('post_date') || lower.includes('ngay_dang') || lower.includes('ngày_đăng')) {
      map.captured_at = i;
    }
    if (lower.includes('facebook_id') || lower.includes('id_nhom') || lower.includes('id_nhóm')) {
      map.group_id = i;
    }
    if (lower.includes('comment') || lower.includes('binh_luan') || lower.includes('bình_luận')) {
      map.comments = i;
    }
    if (lower.includes('reaction') || lower.includes('cam_xuc') || lower.includes('cảm_xúc')) {
      map.reactions = i;
    }
    if (lower.includes('share') || lower.includes('chia_se') || lower.includes('chia_sẻ')) {
      map.shares = i;
    }
  }
  return map;
}

function cell(row, idx) {
  if (idx === undefined || idx === null) return '';
  return String(row[idx] ?? '').trim();
}

function extractPostId(postUrl) {
  const u = String(postUrl || '');
  const patterns = [
    /\/permalink\/(\d+)/,
    /\/posts\/(\d+)/,
    /[?&]fbid=(\d+)/,
    /\/(\d{10,})(?:[/?]|$)/,
  ];
  for (const re of patterns) {
    const m = u.match(re);
    if (m?.[1]) return m[1];
  }
  return u.split('/').filter(Boolean).pop() || '';
}

function mapRowToContentQueue(rawRow, aliasMap, sourceTab) {
  const post_url = cell(rawRow, aliasMap.post_url);
  const text = cell(rawRow, aliasMap.text);
  const author_id = cell(rawRow, aliasMap.author_id);
  const captured_at = cell(rawRow, aliasMap.captured_at) || new Date().toISOString();
  const group_id = cell(rawRow, aliasMap.group_id);

  if (!post_url && !text) return null;

  const post_id = extractPostId(post_url) || extractPostId(text) || `fb_${Date.now()}`;
  const platform = 'fb_group';
  const nk = safeKey(platform, post_id);

  const metaObj = {
    imported_from: sourceTab,
    imported_at: new Date().toISOString(),
    group_id,
    profile_url: cell(rawRow, aliasMap.profile_url),
    engagement: {
      comments: cell(rawRow, aliasMap.comments),
      reactions: cell(rawRow, aliasMap.reactions),
      shares: cell(rawRow, aliasMap.shares),
    },
  };

  return [
    nk,
    post_id,
    platform,
    post_url,
    author_id,
    String(text).slice(0, 50000),
    'unclassified',
    0,
    'qualified',
    'unknown',
    'raw',
    captured_at,
    'fb_archive_import',
    'facebook,group,noxh',
    JSON.stringify(metaObj).slice(0, 50000),
  ];
}

async function readTab(token, sheetId, tabName) {
  const range = encodeURIComponent(`${tabName}!A:Z`);
  const val = await api(token, 'GET', `${sheetId}/values/${range}`);
  const values = val.values || [];
  if (values.length < 2) return { tabName, rows: [], headers: [] };

  const headers = values[0].map(normHeader);
  const aliasMap = headerAliases(values[0].map((h) => String(h ?? '')));
  const dataRows = [];
  for (let i = 1; i < values.length; i++) {
    const cells = values[i];
    if (!cells?.some((c) => String(c ?? '').trim())) continue;
    dataRows.push(cells);
  }
  return { tabName, rows: dataRows, headers, aliasMap };
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
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

  const meta = await api(token, 'GET', `${sheetId}?fields=sheets.properties`);
  const archiveSheets = (meta.sheets || [])
    .map((s) => s.properties)
    .filter((p) => p.title.startsWith('_archive_'));

  if (!archiveSheets.length) {
    console.log('Không có tab _archive_* — không cần gộp.');
    return;
  }

  console.log(`Tìm thấy ${archiveSheets.length} tab archive:`, archiveSheets.map((s) => s.title).join(', '));

  const mapped = [];
  const seen = new Set();

  for (const sh of archiveSheets) {
    const { tabName, rows, headers, aliasMap } = await readTab(token, sheetId, sh.title);
    console.log(`\n${tabName}: ${rows.length} dòng dữ liệu, header=[${headers.slice(0, 4).join(', ')}...]`);

    for (const raw of rows) {
      const cq = mapRowToContentQueue(raw, aliasMap, tabName);
      if (!cq) continue;
      const nk = cq[0];
      if (seen.has(nk)) continue;
      seen.add(nk);
      mapped.push(cq);
    }
  }

  console.log(`\n→ Gộp được ${mapped.length} bài unique (dedupe theo normalized_key)`);

  if (!mapped.length) {
    console.log('Không map được dòng nào — kiểm tra header tab archive.');
    return;
  }

  // Existing content_queue keys
  let existingKeys = new Set();
  try {
    const cq = await api(
      token,
      'GET',
      `${sheetId}/values/${encodeURIComponent('content_queue!A:A')}`
    );
    for (let i = 1; i < (cq.values || []).length; i++) {
      const nk = String(cq.values[i][0] ?? '').trim();
      if (nk) existingKeys.add(nk);
    }
  } catch {
    /* empty */
  }

  const toAppend = mapped.filter((r) => !existingKeys.has(r[0]));
  console.log(`→ Append ${toAppend.length} dòng mới vào content_queue (${mapped.length - toAppend.length} đã tồn tại)`);

  if (dryRun) {
    console.log('\n[dry-run] Mẫu 2 dòng đầu:');
    toAppend.slice(0, 2).forEach((r, i) => {
      console.log(`  ${i + 1}. ${r[0]} | ${r[2]} | ${String(r[5]).slice(0, 60)}...`);
    });
    console.log('[dry-run] Sẽ xóa tab:', archiveSheets.map((s) => s.title).join(', '));
    return;
  }

  if (toAppend.length) {
    const BATCH = 500;
    for (let i = 0; i < toAppend.length; i += BATCH) {
      const chunk = toAppend.slice(i, i + BATCH);
      await api(
        token,
        'POST',
        `${sheetId}/values/${encodeURIComponent('content_queue!A:O')}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
        { values: chunk }
      );
      console.log(`  append content_queue: ${Math.min(i + BATCH, toAppend.length)}/${toAppend.length}`);
    }
    console.log('✓ Đã append vào content_queue');
  }

  const deleteRequests = archiveSheets.map((s) => ({
    deleteSheet: { sheetId: s.sheetId },
  }));
  await api(token, 'POST', `${sheetId}:batchUpdate`, { requests: deleteRequests });
  console.log(`✓ Đã xóa ${archiveSheets.length} tab archive`);

  // Optional: append scrape_index for dedupe
  const indexRows = toAppend.map((r) => [
    r[0],
    r[1],
    r[2],
    r[12],
    new Date().toISOString(),
    JSON.stringify({ import: 'fb_archive' }).slice(0, 500),
  ]);
  if (indexRows.length) {
    const BATCH = 500;
    for (let i = 0; i < indexRows.length; i += BATCH) {
      const chunk = indexRows.slice(i, i + BATCH);
      await api(
        token,
        'POST',
        `${sheetId}/values/${encodeURIComponent('scrape_index!A:F')}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
        { values: chunk }
      );
    }
    console.log(`✓ Đã ghi ${indexRows.length} dòng scrape_index (tránh scrape lại)`);
  }

  console.log('\nHoàn tất. Mở tab content_queue trên Sheet để kiểm tra.');
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
