#!/usr/bin/env node
/**
 * DEPRECATED for copy generation — ghi placeholder hook vào content_drafts, bỏ qua Agent 3.
 * Dùng: seed-editorial-queue-layer-b.mjs → Layer B → run-editorial-fb-page-image-pipeline.mjs
 *
 * Giữ script này chỉ để tạo skeleton row (title, schedule meta) nếu chưa có draft row.
 * Usage: node scripts/seed-editorial-calendar-page.mjs --skeleton-only
 *        node scripts/seed-editorial-calendar-page.mjs --dry-run
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { loadEnv, loadPublicConfig, loadServiceAccount, sheetId } from './lib/magnix-env.mjs';

const CALENDAR = [
  { id: '01', day: '2026-06-30', hour: 10, format: 'fb_reels', pillar: 'D', title: 'Lương X triệu có đủ NOXH không?', cta: 'CHECKLIST' },
  { id: '02', day: '2026-06-30', hour: 14, format: 'fb_page_post_image', pillar: 'A', title: 'Thu nhập NOXH: cần xét đồng thời những gì?', cta: 'CHECKLIST' },
  { id: '03', day: '2026-06-30', hour: 18, format: 'fb_reels', pillar: 'D', title: '3 lỗi khiến hồ sơ NOXH bị trả', cta: 'MAU01' },
  { id: '04', day: '2026-07-01', hour: 10, format: 'carousel_image', pillar: 'B', title: '5 bước tự kiểm trước khi nộp hồ sơ', cta: 'CHECKLIST' },
  { id: '05', day: '2026-07-01', hour: 14, format: 'fb_page_post_image', pillar: 'B', title: 'Kho mẫu NOXH miễn phí — folder Drive', cta: 'MAU01', pin: true },
  { id: '06', day: '2026-07-01', hour: 18, format: 'fb_reels', pillar: 'B', title: 'CT07 là gì — khi nào cần làm?', cta: 'MAU01' },
  { id: '07', day: '2026-07-02', hour: 10, format: 'fb_reels', pillar: 'C', title: 'DTI / room vay — hiểu đúng trước khi nộp', cta: 'DTI' },
  { id: '08', day: '2026-07-02', hour: 14, format: 'fb_page_post_image', pillar: 'C', title: 'Vay NHCSXH NOXH: chuẩn bị tài chính', cta: 'DTI' },
  { id: '09', day: '2026-07-02', hour: 18, format: 'carousel_image', pillar: 'B', title: 'Danh mục một bộ photo — checklist', cta: 'MAU01' },
  { id: '10', day: '2026-07-03', hour: 10, format: 'fb_reels', pillar: 'A', title: 'Nhà ở tại tỉnh dự án — khác gì nơi đang ở?', cta: 'CHECKLIST' },
  { id: '11', day: '2026-07-03', hour: 14, format: 'fb_page_post_image', pillar: 'A', title: 'Hộ gia đình / vợ chồng — khai hồ sơ thế nào?', cta: 'CHECKLIST' },
  { id: '12', day: '2026-07-03', hour: 18, format: 'fb_reels', pillar: 'E', title: 'Cập nhật quy định NOXH — đọc đúng nguồn', cta: 'SAVE' },
  { id: '13', day: '2026-07-04', hour: 10, format: 'carousel_image', pillar: 'B', title: 'Mẫu 01 — 4 mục hay điền sai', cta: 'MAU01' },
  { id: '14', day: '2026-07-04', hour: 14, format: 'fb_page_post_image', pillar: 'D', title: 'Comment MAU01 nhận link folder cập nhật', cta: 'MAU01' },
  { id: '15', day: '2026-07-05', hour: 10, format: 'fb_reels', pillar: 'D', title: 'Vợ chồng khác tỉnh — ảnh hưởng hồ sơ?', cta: 'CHECKLIST' },
  { id: '16', day: '2026-07-07', hour: 10, format: 'fb_reels', pillar: 'A', title: 'Thu nhập kinh doanh — chứng minh thế nào?', cta: 'CHECKLIST' },
  { id: '17', day: '2026-07-07', hour: 14, format: 'fb_page_post_image', pillar: 'A', title: 'Đối tượng ưu tiên NOXH — hiểu đúng', cta: 'CHECKLIST' },
  { id: '18', day: '2026-07-07', hour: 18, format: 'fb_reels', pillar: 'B', title: 'Photo mấy bộ — ai quyết định?', cta: 'MAU01' },
  { id: '19', day: '2026-07-08', hour: 10, format: 'carousel_image', pillar: 'C', title: 'Bảng tự kiểm dòng tiền', cta: 'DTI' },
  { id: '20', day: '2026-07-08', hour: 14, format: 'fb_page_post_image', pillar: 'B', title: 'Đọc thông báo tiếp nhận CĐT', cta: 'MAU01' },
  { id: '21', day: '2026-07-08', hour: 18, format: 'fb_reels', pillar: 'D', title: 'Vì sao không nên tin “chắc được duyệt”', cta: 'NOXH' },
  { id: '22', day: '2026-07-09', hour: 10, format: 'fb_reels', pillar: 'B', title: 'CIC / nợ xấu — ảnh hưởng tổng quan', cta: 'SAVE' },
  { id: '23', day: '2026-07-09', hour: 14, format: 'fb_page_post_image', pillar: 'C', title: 'Room tín dụng DN vs NOXH cá nhân', cta: 'DTI' },
  { id: '24', day: '2026-07-09', hour: 18, format: 'carousel_image', pillar: 'A', title: 'Checklist nhà ở tại tỉnh dự án', cta: 'CHECKLIST' },
  { id: '25', day: '2026-07-10', hour: 10, format: 'fb_reels', pillar: 'E', title: 'NOXH TP.HCM vs Bình Dương — khác gì?', cta: 'SAVE' },
  { id: '26', day: '2026-07-10', hour: 14, format: 'fb_page_post_image', pillar: 'D', title: '5 câu hỏi nên hỏi CĐT trước khi nộp', cta: 'MAU01' },
  { id: '27', day: '2026-07-10', hour: 18, format: 'fb_reels', pillar: 'A', title: 'Thuê nhà — tình trạng nhà ở khai thế nào?', cta: 'CHECKLIST' },
  { id: '28', day: '2026-07-11', hour: 10, format: 'carousel_image', pillar: 'B', title: 'CT07 + cư trú — tóm tắt slide', cta: 'MAU01' },
  { id: '29', day: '2026-07-11', hour: 14, format: 'fb_page_post_image', pillar: 'B', title: 'Nhắc lại — link folder mẫu NOXH', cta: 'MAU01' },
  { id: '30', day: '2026-07-12', hour: 10, format: 'fb_reels', pillar: 'D', title: 'Tóm tắt tuần — 3 điều hay bỏ sót', cta: 'CHECKLIST' },
];

const HASHTAGS_BY_PILLAR = {
  A: ['#NOXH', '#nhàởxãhội', '#điều kiện mua NOXH'],
  B: ['#NOXH', '#hồ sơ NOXH', '#Mẫu01'],
  C: ['#NOXH', '#vaymuanha', '#dòngtiền'],
  D: ['#NOXH', '#nhàởxãhội', '#sai lầm NOXH'],
  E: ['#NOXH', '#TPHCM', '#BìnhDương'],
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

function scheduledAt(day, hour) {
  const hh = String(hour).padStart(2, '0');
  return `${day}T${hh}:00:00+07:00`;
}

function stubMarkdown(item) {
  return `## ${item.title}?

*Placeholder — chờ Layer B editorial brief + Agent 3.*

- Pillar: ${item.pillar}
- Format: ${item.format}
- CTA: ${item.cta}

Chạy Layer B → Agent 3 trước khi approve.`;
}

function buildMeta(item, driveUrl) {
  const meta = {
    target_channel: 'facebook_page',
    content_format: item.format,
    content_pillar: item.pillar,
    scheduled_at: scheduledAt(item.day, item.hour),
    editorial_calendar_id: `2026w27:${item.id}`,
    cta_keyword: item.cta,
    hashtags: HASHTAGS_BY_PILLAR[item.pillar] || ['#NOXH', '#nhàởxãhội'],
    product_type: item.format.startsWith('fb_page') ? 'fb_page_post' : item.format,
    publish_image_prompt: `Cover NOXH chuyên nghiệp: "${item.title}" — brand Magnix, icon checklist, màu xanh tin cậy`,
    needs_editorial_brief: true,
    source_refs: [],
  };
  if (item.pin) meta.pin_after_publish = true;
  if (driveUrl && (item.id === '05' || item.id === '14' || item.id === '29')) {
    meta.publish_link = driveUrl;
    meta.drive_pack_url = driveUrl;
  }
  return meta;
}

function buildRow(item, driveUrl, skeletonOnly) {
  const key = `editorial:page:2026w27:${item.id}`;
  const ctaLine = skeletonOnly
    ? ''
    : `Comment **${item.cta}** nếu bạn muốn tài liệu tham khảo (không thay tư vấn chính thức).`;
  return [
    key,
    `cal_page_${item.id}`,
    'noxh_income',
    item.title,
    skeletonOnly ? '' : `${item.title} — nội dung chờ biên tập từ listening/brief.`,
    skeletonOnly ? '' : stubMarkdown(item),
    ctaLine,
    skeletonOnly ? '' : 'Thông tin mang tính tham khảo; quyết định phụ thuộc quy định hiện hành và hồ sơ thực tế tại thời điểm nộp.',
    item.format.includes('carousel') ? 'carousel' : 'md',
    'draft',
    skeletonOnly ? 'L0' : 'L2',
    new Date().toISOString(),
    'editorial_calendar',
    JSON.stringify(buildMeta(item, driveUrl)),
  ];
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const skeletonOnly = process.argv.includes('--skeleton-only');
  const forceLegacy = process.argv.includes('--force-legacy');

  if (!dryRun && !skeletonOnly && !forceLegacy) {
    console.error('DEPRECATED — script này ghi placeholder hook, bỏ qua Agent 3.');
    console.error('Dùng pipeline đúng:');
    console.error('  node scripts/seed-editorial-queue-layer-b.mjs --format fb_page_post_image --from 01 --to 30');
    console.error('  node scripts/run-editorial-fb-page-image-pipeline.mjs');
    console.error('Chỉ cần skeleton row: --skeleton-only | test cũ: --force-legacy');
    process.exit(1);
  }
  const cfg = loadPublicConfig();
  const env = loadEnv();
  const sid = sheetId(env, cfg);
  const tab = cfg.content_drafts_tab || 'content_drafts';

  let driveUrl = env.DRIVE_NOXH_TEMPLATES_PUBLIC_URL || '';
  const foldersPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../n8n-workflows/magnix-drive-folders.json');
  if (!driveUrl && fs.existsSync(foldersPath)) {
    try {
      const j = JSON.parse(fs.readFileSync(foldersPath, 'utf8'));
      driveUrl = j.noxh_templates?.public_url || '';
    } catch {
      /* ignore */
    }
  }

  const rows = CALENDAR.map((item) => buildRow(item, driveUrl, skeletonOnly));
  const keys = rows.map((r) => r[0]);

  if (dryRun) {
    console.log(JSON.stringify({ count: rows.length, sample_key: keys[0], driveUrl: driveUrl || null }, null, 2));
    return;
  }

  const tok = await token(loadServiceAccount());
  const existing = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/${encodeURIComponent(`${tab}!A:A`)}`,
    { headers: { Authorization: `Bearer ${tok}` } }
  ).then((r) => r.json());
  const have = new Set((existing.values || []).flat().map(String));
  const toAppend = rows.filter((r) => !have.has(r[0]));
  if (!toAppend.length) {
    console.log(`Đã có đủ ${keys.length} dòng editorial:page:2026w27:* — bỏ qua.`);
    return;
  }

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/${encodeURIComponent(`${tab}!A:N`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: toAppend }),
    }
  );
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);

  console.log(`✓ Đã ghi ${toAppend.length} dòng editorial calendar → ${tab}`);
  console.log(`  Bỏ qua ${rows.length - toAppend.length} dòng đã tồn tại`);
  if (!driveUrl) console.log('  ⚠ Chưa có DRIVE_NOXH_TEMPLATES_PUBLIC_URL — chạy init-magnix-drive-noxh-templates.mjs');
  console.log(`  Sheet: https://docs.google.com/spreadsheets/d/${sid}/edit#gid=${cfg.sheet_tab_gids?.content_drafts || 299240858}`);
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
