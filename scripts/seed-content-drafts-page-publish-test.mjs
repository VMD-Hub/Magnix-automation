#!/usr/bin/env node
/**
 * Ghi 1 dòng test Page Publish vào tab content_drafts.
 * Usage:
 *   node scripts/seed-content-drafts-page-publish-test.mjs          # append nếu chưa có
 *   node scripts/seed-content-drafts-page-publish-test.mjs --update # ghi đè row test (reset approved)
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv, loadPublicConfig, loadServiceAccount, sheetId } from './lib/magnix-env.mjs';

const ARTIFACT = `## Ai đang hỏi về thu nhập NOXH?

Nhiều người chỉ hỏi "lương X triệu có đủ không" — thực tế cần đối chiếu **đồng thời**:

- Nhóm đối tượng (theo quy định hiện hành)
- Tình trạng nhà ở tại tỉnh/TP nơi có dự án
- Cư trú, việc làm và chứng minh thu nhập

## Gợi ý bước tiếp theo

1. Xác định **tỉnh/TP của dự án NOXH** (không chỉ nơi đang ở).
2. Chuẩn bị giấy tờ thu nhập theo hướng dẫn CĐT/Sở Xây dựng.
3. Chờ thông báo tiếp nhận hồ sơ chính thức — tránh tự suy luận kết quả trước hạn.

*Bài test Magnix — Page Publish workflow.*`;

const META = {
  target_channel: 'facebook_page',
  hashtags: ['#NOXH', '#nhàởxãhội'],
  source_refs: ['noxh_income_condition_001'],
  test_row: true,
};

function b64u(s) {
  return Buffer.from(s).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function token(sa) {
  const now = Math.floor(Date.now() / 1000);
  const h = b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const c = b64u(
    JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
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

async function sheets(tok, sid, pathPart, opts = {}) {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sid}/${pathPart}`, {
    method: opts.method || 'GET',
    headers: {
      Authorization: `Bearer ${tok}`,
      'Content-Type': 'application/json',
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

function buildRow() {
  const createdAt = new Date().toISOString();
  return [
    TEST_KEY,
    'test_page_001',
    'noxh_income',
    '[TEST] Điều kiện thu nhập mua NOXH — cần xét đủ tiêu chí',
    'Thu nhập là một trong nhiều tiêu chí khi đăng ký mua nhà ở xã hội — không nên tự kết luận chỉ vì một con số.',
    ARTIFACT,
    'Comment CHECKLIST nếu bạn muốn nhận bảng tự kiểm điều kiện (tham khảo).',
    'Thông tin mang tính tham khảo; quyết định phụ thuộc quy định hiện hành và hồ sơ thực tế tại thời điểm nộp.',
    'pdf',
    'approved',
    'L0',
    createdAt,
    'test_page_publish',
    JSON.stringify(META),
  ];
}

const TEST_KEY = 'test:page_publish:001';
const forceUpdate = process.argv.includes('--update');

async function findTestRow(tok, sid, tab) {
  const existing = await sheets(tok, sid, `values/${encodeURIComponent(`${tab}!A:A`)}`);
  const keys = (existing.values || []).flat().map(String);
  const rowIndex = keys.indexOf(TEST_KEY);
  if (rowIndex < 0) return null;
  return rowIndex + 1;
}

async function main() {
  const cfg = loadPublicConfig();
  const sid = sheetId(loadEnv(), cfg);
  const tab = cfg.content_drafts_tab || 'content_drafts';
  const gid = cfg.sheet_tab_gids?.content_drafts || 299240858;
  const sa = loadServiceAccount();
  const tok = await token(sa);

  const existingRow = await findTestRow(tok, sid, tab);

  if (existingRow && !forceUpdate) {
    console.log(`Đã có ${TEST_KEY} (row ${existingRow}) — bỏ qua append.`);
    console.log('  Chạy lại với --update để ghi đè nội dung + reset status=approved');
    console.log(`  Sheet: https://docs.google.com/spreadsheets/d/${sid}/edit#gid=${gid}`);
    return;
  }

  let row = existingRow;

  if (existingRow && forceUpdate) {
    await sheets(tok, sid, `values/${encodeURIComponent(`${tab}!A${existingRow}:N${existingRow}`)}?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      body: { values: [buildRow()] },
    });
    console.log(`✓ Đã cập nhật row test Page Publish (row ${existingRow})`);
  } else {
    const append = await sheets(tok, sid, `values/${encodeURIComponent(`${tab}!A:N`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
      method: 'POST',
      body: { values: [buildRow()] },
    });
    const m = String(append.updates?.updatedRange || '').match(/!A(\d+)/i);
    row = m ? Number(m[1]) : null;
    console.log('✓ Đã ghi dòng test Page Publish vào content_drafts');
  }

  if (row) console.log(`  sheet_row: ${row}`);
  console.log(`  source_normalized_key: ${TEST_KEY}`);
  console.log(`  status: approved`);
  console.log(`  Sheet: https://docs.google.com/spreadsheets/d/${sid}/edit#gid=${gid}`);
  console.log('\nTiếp: n8n → Facebook Page Publish → Execute workflow');
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
