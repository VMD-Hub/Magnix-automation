#!/usr/bin/env node
/**
 * Seed content_queue rows for editorial calendar → Layer B on n8n.
 * Usage: node scripts/seed-editorial-queue-layer-b.mjs
 *        node scripts/seed-editorial-queue-layer-b.mjs --from 01 --to 05 --dry-run
 *        node scripts/seed-editorial-queue-layer-b.mjs --format fb_page_post_image --from 01 --to 30
 */
import crypto from 'node:crypto';
import { loadEnv, loadPublicConfig, loadServiceAccount, sheetId, parseMeta } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects } from './lib/sheet-client.mjs';

const CALENDAR = [
  { id: '01', format: 'fb_reels', pillar: 'D', title: 'Lương X triệu có đủ NOXH không?', cta: 'CHECKLIST' },
  { id: '02', format: 'fb_page_post_image', pillar: 'A', title: 'Thu nhập NOXH: cần xét đồng thời những gì?', cta: 'CHECKLIST' },
  { id: '03', format: 'fb_reels', pillar: 'D', title: '3 lỗi khiến hồ sơ NOXH bị trả', cta: 'MAU01' },
  { id: '04', format: 'carousel_image', pillar: 'B', title: '5 bước tự kiểm trước khi nộp hồ sơ', cta: 'CHECKLIST' },
  { id: '05', format: 'fb_page_post_image', pillar: 'B', title: 'Kho mẫu NOXH miễn phí — folder Drive', cta: 'MAU01', pin: true },
  { id: '06', format: 'fb_reels', pillar: 'B', title: 'CT07 là gì — khi nào cần làm?', cta: 'MAU01' },
  { id: '07', format: 'fb_reels', pillar: 'C', title: 'DTI / room vay — hiểu đúng trước khi nộp', cta: 'DTI' },
  { id: '08', format: 'fb_page_post_image', pillar: 'C', title: 'Vay NHCSXH NOXH: chuẩn bị tài chính', cta: 'DTI' },
  { id: '09', format: 'carousel_image', pillar: 'B', title: 'Danh mục một bộ photo — checklist', cta: 'MAU01' },
  { id: '10', format: 'fb_reels', pillar: 'A', title: 'Nhà ở tại tỉnh dự án — khác gì nơi đang ở?', cta: 'CHECKLIST' },
  { id: '11', format: 'fb_page_post_image', pillar: 'A', title: 'Hộ gia đình / vợ chồng — khai hồ sơ thế nào?', cta: 'CHECKLIST' },
  { id: '12', format: 'fb_reels', pillar: 'E', title: 'Cập nhật quy định NOXH — đọc đúng nguồn', cta: 'SAVE' },
  { id: '13', format: 'carousel_image', pillar: 'B', title: 'Mẫu 01 — 4 mục hay điền sai', cta: 'MAU01' },
  { id: '14', format: 'fb_page_post_image', pillar: 'D', title: 'Comment MAU01 nhận link folder cập nhật', cta: 'MAU01' },
  { id: '15', format: 'fb_reels', pillar: 'D', title: 'Vợ chồng khác tỉnh — ảnh hưởng hồ sơ?', cta: 'CHECKLIST' },
  { id: '16', format: 'fb_reels', pillar: 'A', title: 'Thu nhập kinh doanh — chứng minh thế nào?', cta: 'CHECKLIST' },
  { id: '17', format: 'fb_page_post_image', pillar: 'A', title: 'Đối tượng ưu tiên NOXH — hiểu đúng khái niệm', cta: 'CHECKLIST' },
  { id: '18', format: 'fb_reels', pillar: 'B', title: 'Photo mấy bộ — ai quyết định?', cta: 'MAU01' },
  { id: '19', format: 'carousel_image', pillar: 'C', title: 'Bảng tự kiểm dòng tiền', cta: 'DTI' },
  { id: '20', format: 'fb_page_post_image', pillar: 'B', title: 'Đọc thông báo tiếp nhận CĐT', cta: 'MAU01' },
  { id: '21', format: 'fb_reels', pillar: 'D', title: 'Vì sao không nên tin “chắc được duyệt”', cta: 'NOXH' },
  { id: '22', format: 'fb_reels', pillar: 'B', title: 'CIC / nợ xấu — ảnh hưởng tổng quan', cta: 'SAVE' },
  { id: '23', format: 'fb_page_post_image', pillar: 'C', title: 'Room tín dụng DN vs NOXH cá nhân', cta: 'DTI' },
  { id: '24', format: 'carousel_image', pillar: 'A', title: 'Checklist nhà ở tại tỉnh dự án', cta: 'CHECKLIST' },
  { id: '25', format: 'fb_reels', pillar: 'E', title: 'NOXH TP.HCM vs Bình Dương — khác gì?', cta: 'SAVE' },
  { id: '26', format: 'fb_page_post_image', pillar: 'D', title: '5 câu hỏi nên hỏi CĐT trước khi nộp', cta: 'MAU01' },
  { id: '27', format: 'fb_reels', pillar: 'A', title: 'Thuê nhà — tình trạng nhà ở khai thế nào?', cta: 'CHECKLIST' },
  { id: '28', format: 'carousel_image', pillar: 'B', title: 'CT07 + cư trú — tóm tắt slide', cta: 'MAU01' },
  { id: '29', format: 'fb_page_post_image', pillar: 'B', title: 'Nhắc lại — link folder mẫu NOXH', cta: 'MAU01' },
  { id: '30', format: 'fb_reels', pillar: 'D', title: 'Tóm tắt tuần — 3 điều hay bỏ sót', cta: 'CHECKLIST' },
];

function parseArgs() {
  const args = process.argv.slice(2);
  let from = '01';
  let to = '05';
  let dryRun = false;
  let format = '';
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--dry-run') dryRun = true;
    if (args[i] === '--from') from = args[++i];
    if (args[i] === '--to') to = args[++i];
    if (args[i] === '--format') format = String(args[++i] || '').trim().toLowerCase();
  }
  return { from, to, dryRun, format };
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

function queueText(item) {
  const ctx =
    item.pillar === 'C'
      ? 'Người mua NOXH cần hiểu dòng tiền, DTI và chuẩn bị tài chính trước khi nộp hồ sơ vay.'
      : item.format === 'fb_reels'
        ? 'Chủ đề video ngắn NOXH — một insight, không hard sell.'
        : 'Người mua NOXH cần hiểu điều kiện, hồ sơ và căn cứ pháp lý trước khi nộp.';
  return [
    `[Editorial Page ${item.id}] ${item.title}?`,
    `Pillar ${item.pillar} · format ${item.format} · CTA ${item.cta}.`,
    ctx,
  ].join('\n');
}

function buildRow(item) {
  const pageKey = `editorial:page:2026w27:${item.id}`;
  const nk = `editorial:queue:2026w27:${item.id}`;
  const meta = {
    editorial_page_key: pageKey,
    editorial_calendar_id: `2026w27:${item.id}`,
    content_format: item.format,
    content_pillar: item.pillar,
    target_channel: 'facebook_page',
    needs_editorial_brief: true,
    cta_keyword: item.cta,
  };
  if (item.pin) meta.pin_after_publish = true;
  const now = new Date().toISOString();
  return [
    nk,
    `cal_page_${item.id}`,
    'facebook_page',
    '',
    'magnix_editorial',
    queueText(item),
    'noxh_income',
    '78',
    'qualified',
    `noxh_editorial_${item.id}`,
    'classified',
    now,
    'editorial_calendar',
    `pillar_${item.pillar},format_${item.format}`,
    JSON.stringify(meta),
  ];
}

async function main() {
  const { from, to, dryRun, format } = parseArgs();
  const cfg = loadPublicConfig();
  const tab = cfg.content_queue_tab || 'content_queue';
  let items = CALENDAR.filter((c) => c.id >= from && c.id <= to);
  if (format) {
    items = items.filter((c) => String(c.format || '').toLowerCase() === format);
  }
  if (!items.length) throw new Error('Không có item trong range');

  const { rows } = rowsToObjects(await fetchTab(tab, 'A:O'));
  const existing = new Set(rows.map((r) => String(r.normalized_key || '').trim()));

  const toAppend = [];
  const skipped = [];
  for (const item of items) {
    const nk = `editorial:queue:2026w27:${item.id}`;
    if (existing.has(nk)) {
      const row = rows.find((r) => r.normalized_key === nk);
      const meta = parseMeta(row?.meta);
      if (meta.editorial_brief_v1) {
        skipped.push({ id: item.id, reason: 'already_has_brief' });
      } else {
        skipped.push({ id: item.id, reason: 'already_in_queue' });
      }
      continue;
    }
    toAppend.push(buildRow(item));
  }

  console.log(`Editorial queue seed ${from}–${to}: append ${toAppend.length}, skip ${skipped.length}`);
  skipped.forEach((s) => console.log(`  skip #${s.id}: ${s.reason}`));

  if (dryRun) {
    toAppend.forEach((r) => console.log(`  [dry-run] ${r[0]} | ${String(r[5]).slice(0, 60)}...`));
    return;
  }

  if (!toAppend.length) {
    console.log('Không có dòng mới — queue đã sẵn sàng cho Layer B.');
    return;
  }

  const env = loadEnv();
  const id = sheetId(env);
  const sa = loadServiceAccount();
  const tok = await token(sa);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${encodeURIComponent(`${tab}!A:O`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: toAppend }),
    }
  );
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  console.log(`✓ Đã append ${toAppend.length} dòng vào ${tab}`);
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
