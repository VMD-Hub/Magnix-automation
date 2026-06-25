#!/usr/bin/env node
/**
 * Seed one approved video_drafts row for Agent 7 manual render test.
 *
 * Usage:
 *   node scripts/seed-agent7-test-video.mjs
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  appendBrandOutroToBeats,
  estimateDurationWithBrandOutro,
} from './lib/magnix-brand-outro.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const VIDEO_HEADERS = [
  'source_normalized_key',
  'post_id',
  'platform',
  'segment',
  'title',
  'hook_3s',
  'spoken_script',
  'beats_json',
  'on_screen_text',
  'caption',
  'hashtags',
  'cta_keyword',
  'duration_sec',
  'aspect_ratio',
  'source_insight',
  'disclaimer',
  'status',
  'qa_tier',
  'l3_approved',
  'created_at',
  'source',
  'meta',
];

function loadEnv() {
  const envPath = path.join(root, 'n8n-workflows/.env');
  const map = {};
  if (!fs.existsSync(envPath)) return map;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
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

async function getAccessToken(sa, scopes) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(JSON.stringify({
    iss: sa.client_email,
    scope: scopes.join(' '),
    aud: sa.token_uri,
    iat: now,
    exp: now + 3600,
  }));
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
  if (!data.access_token) throw new Error(`Token failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function sheetsApi(token, method, spreadsheetId, pathPart, body) {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/${pathPart}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data;
}

function buildTestRow() {
  const createdAt = new Date().toISOString();
  const key = 'agent7-test:noxh-checklist-v1';
  const beats = [
    {
      role: 'hook',
      start_sec: 0,
      end_sec: 4,
      retention_intent: 'pattern_interrupt',
      on_screen: '15 triệu đủ mua nhà ở xã hội?',
      spoken: 'Thu nhập mười lăm triệu có đủ điều kiện mua nhà ở xã hội không?',
      visual: 'Cặp vợ chồng trẻ xem điện thoại thông báo ngân hàng',
      visual_spec: {
        type: 'broll',
        stock_query: 'Vietnamese young couple phone apartment surprised portrait',
        fallback_color: '#0f172a',
      },
    },
    {
      role: 'tension',
      start_sec: 4,
      end_sec: 10,
      retention_intent: 'reframe',
      on_screen: 'Thu nhập, phụ thuộc, khoản vay',
      spoken: 'Ngân hàng xét tổng thu nhập hộ gia đình, người phụ thuộc và khả năng trả nợ hàng tháng.',
      visual: 'Giấy tờ thu nhập và bảng ngân sách trên bàn',
      visual_spec: {
        type: 'broll',
        stock_query: 'mortgage calculator income documents desk no people',
        fallback_color: '#14532d',
      },
    },
    {
      role: 'value',
      start_sec: 10,
      end_sec: 17,
      retention_intent: 'checklist_tease',
      on_screen: 'Checklist 3 bước trước nộp hồ sơ',
      spoken: 'Trước khi nộp hồ sơ, tự kiểm ba mục: nhóm đối tượng, điều kiện nhà ở và dòng tiền trả góp.',
      visual: 'Checklist hồ sơ trên điện thoại',
      visual_spec: {
        type: 'broll',
        stock_query: 'checklist document phone desk close up no people',
        fallback_color: '#1e3a8a',
      },
    },
    {
      role: 'proof',
      start_sec: 17,
      end_sec: 22,
      retention_intent: 'checklist_tease',
      on_screen: 'Hồ sơ đúng = tăng cơ hội',
      spoken: 'Chuẩn bị đúng giấy tờ và nộp đúng thời điểm giúp tăng cơ hội được xét duyệt minh bạch.',
      visual: 'Giấy tờ hồ sơ nhà ở xã hội trên bàn',
      visual_spec: {
        type: 'broll',
        stock_query: 'Vietnam housing application paperwork stamp desk no people',
        fallback_color: '#334155',
      },
    },
    {
      role: 'cta',
      start_sec: 22,
      end_sec: 30,
      retention_intent: 'cta_soft',
      on_screen: 'Comment NOXH nhận checklist',
      spoken: 'Bình luận NOXH để nhận checklist tự kiểm miễn phí trước khi hỏi ngân hàng.',
      visual: 'Skyline chung cư Việt Nam chiều tối',
      visual_spec: {
        type: 'broll',
        stock_query: 'Vietnam apartment skyline city sunset aerial no people',
        fallback_color: '#7c2d12',
      },
    },
  ];

  const beatsWithBrand = appendBrandOutroToBeats(beats, {
    cta_keyword: 'NOXH',
    format: 'short',
    variant: 1,
  });

  return {
    source_normalized_key: key,
    post_id: 'agent7_test_noxh_checklist_v1',
    platform: 'tiktok',
    segment: 'noxh_income',
    title: 'Checklist nhà ở xã hội trước khi vay',
    hook_3s: 'Thu nhập 15 triệu đã đủ mua nhà ở xã hội chưa?',
    spoken_script: beatsWithBrand.map((beat) => beat.spoken).join(' '),
    beats_json: JSON.stringify(beatsWithBrand),
    on_screen_text: beatsWithBrand.map((beat) => beat.on_screen).join(' | '),
    caption: 'Tự kiểm nhanh trước khi nộp hồ sơ nhà ở xã hội. Comment NOXH để nhận checklist.',
    hashtags: '#NOXH #nhaxahoi #taichinhcanhan #Magnix',
    cta_keyword: 'NOXH',
    duration_sec: String(estimateDurationWithBrandOutro(30, { format: 'short' })),
    aspect_ratio: '9:16',
    source_insight: 'Người xem thường hỏi thu nhập bao nhiêu thì đủ điều kiện vay/mua NOXH.',
    disclaimer: 'Nội dung chỉ là checklist tham khảo, không thay thế tư vấn pháp lý hoặc phê duyệt tín dụng.',
    status: 'approved',
    qa_tier: 'L3_test_approved',
    l3_approved: 'TRUE',
    created_at: createdAt,
    source: 'manual_agent7_seed',
    meta: JSON.stringify({
      test_seed: true,
      render_status: 'queued_for_e2e_test',
      created_by: 'seed-agent7-test-video',
      note: 'Agent 7 v3 e2e test row — có brand_outro cuối video.',
      brand_outro: true,
    }),
  };
}

function toRow(record, headers) {
  return headers.map((header) => record[header] ?? '');
}

async function main() {
  const env = loadEnv();
  const sheetId = env.GOOGLE_SHEET_DATABASE_ID || env.GOOGLE_SHEET_CONTENT_METRICS_ID;
  const tab = env.GOOGLE_SHEET_VIDEO_DRAFTS_TAB || 'video_drafts';
  const saPath =
    env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    path.join(root, 'n8n-workflows/credentials/google-service-account.json');

  if (!sheetId) throw new Error('Missing GOOGLE_SHEET_DATABASE_ID');
  if (!fs.existsSync(saPath)) throw new Error(`Service account not found: ${saPath}`);

  const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
  const token = await getAccessToken(sa, ['https://www.googleapis.com/auth/spreadsheets']);
  const read = await sheetsApi(token, 'GET', sheetId, `values/${encodeURIComponent(`${tab}!A:V`)}`);
  const rows = read.values || [];
  const headers = (rows[0] || VIDEO_HEADERS).map((h) => String(h || '').trim());

  if (!rows.length) {
    await sheetsApi(
      token,
      'PUT',
      sheetId,
      `values/${encodeURIComponent(`${tab}!A1:V1`)}?valueInputOption=USER_ENTERED`,
      { values: [VIDEO_HEADERS] }
    );
  }

  const sourceKeyIdx = headers.findIndex((h) => h.toLowerCase() === 'source_normalized_key');
  const record = buildTestRow();
  const rowValues = toRow(record, headers.length ? headers : VIDEO_HEADERS);
  const existingRow = rows.findIndex((row, idx) => idx > 0 && row[sourceKeyIdx] === record.source_normalized_key);

  if (existingRow > 0) {
    const rowNum = existingRow + 1;
    await sheetsApi(
      token,
      'PUT',
      sheetId,
      `values/${encodeURIComponent(`${tab}!A${rowNum}:V${rowNum}`)}?valueInputOption=USER_ENTERED`,
      { values: [rowValues] }
    );
    console.log(`Updated Agent 7 test row: ${tab}!A${rowNum}:V${rowNum}`);
    console.log(`source_normalized_key=${record.source_normalized_key}`);
    return;
  }

  await sheetsApi(
    token,
    'POST',
    sheetId,
    `values/${encodeURIComponent(`${tab}!A:V`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    { values: [rowValues] }
  );
  console.log(`Appended Agent 7 test row to ${tab}`);
  console.log(`source_normalized_key=${record.source_normalized_key}`);
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
