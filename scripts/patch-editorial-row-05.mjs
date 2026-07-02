#!/usr/bin/env node
/**
 * Patch editorial:page:2026w27:05 — PIN post kho mẫu Drive (row 7).
 * Usage: node scripts/patch-editorial-row-05.mjs [--status approved|draft]
 */
import { fetchTab, rowsToObjects, updateCell } from './lib/sheet-client.mjs';
import { loadPublicConfig } from './lib/magnix-env.mjs';

const KEY = 'editorial:page:2026w27:05';
const statusArg = process.argv.find((a) => a.startsWith('--status='))?.split('=')[1]
  || (process.argv.includes('--draft') ? 'draft' : 'approved');

const hookLine =
  'Folder Drive miễn phí: mẫu hồ sơ NOXH, checklist thu nhập, hướng dẫn điền — xem ngay qua link.';

const artifactMarkdown = `## Kho mẫu NOXH trên Drive là gì?

Magnix gom tài liệu tham khảo (mẫu đăng ký, checklist, gợi ý điền) vào một folder Google Drive. Bạn mở link là xem được — mục tiêu là giúp tự soạn hồ sơ có cấu trúc trước khi nộp cho chủ đầu tư hoặc đơn vị quản lý dự án.

## Ai nên dùng kho mẫu này?

- Người đang tìm hiểu điều kiện mua NOXH, chưa rõ giấy tờ cần chuẩn bị
- Vợ chồng, công nhân KCN cần checklist thu nhập và diện tích nhà
- Người muốn có bản tham chiếu trước khi in mẫu chính thức từ CĐT

## Trong folder có những gì?

- Hướng dẫn đọc trước (cách dùng, giới hạn trách nhiệm)
- Gợi ý điền Mẫu 01 (bản tham chiếu — không thay mẫu CĐT)
- Checklist thu nhập và giấy tờ thường gặp
- Ghi chú viết tay và đối chiếu Công báo

## Lưu ý quan trọng

- Đây là tài liệu tham khảo, không phải form chính thức của dự án bạn đăng ký
- Mỗi dự án NOXH có mẫu và thời hạn riêng — luôn lấy bản mới nhất từ CĐT
- Không sao chép dữ liệu mẫu vào hồ sơ thật của bạn`;

const ctaOptIn =
  'Muốn gợi ý checklist theo tình huống của bạn? Comment **MAU01** — Magnix phản hồi thêm (không thay tư vấn pháp lý chính thức).';

const disclaimer =
  'Thông tin mang tính tham khảo; quyết định phụ thuộc quy định hiện hành và hồ sơ thực tế tại thời điểm nộp.';

const driveUrl =
  'https://drive.google.com/drive/folders/1MqPOPCwNp9ga1i2O0yqd7F8GP9_TJYKr';

const meta = {
  target_channel: 'facebook_page',
  content_format: 'fb_page_post_image',
  content_pillar: 'B',
  scheduled_at: '2026-07-01T14:00:00+07:00',
  editorial_calendar_id: '2026w27:05',
  cta_keyword: 'MAU01',
  hashtags: ['#NOXH', '#hồsơNOXH', '#Mẫu01', '#nhàởxãhội'],
  product_type: 'fb_page_post',
  publish_image_prompt:
    'Cover 1080x1080: tiêu đề "Kho mẫu NOXH miễn phí" — icon folder + checklist, nền xanh tin cậy, logo Magnix nhỏ góc dưới',
  publish_link: driveUrl,
  drive_pack_url: driveUrl,
  drive_pack_folder_id: '1MqPOPCwNp9ga1i2O0yqd7F8GP9_TJYKr',
  drive_pack_ready: true,
  pin_after_publish: true,
  needs_editorial_brief: false,
  editorial_ready_at: new Date().toISOString(),
  source_refs: [],
  publish_image_pending: true,
};

const cfg = loadPublicConfig();
const tab = cfg.content_drafts_tab || 'content_drafts';
const values = await fetchTab(tab, 'A:N');
const { headers, rows } = rowsToObjects(values);
const row = rows.find((r) => r.source_normalized_key === KEY);
if (!row) {
  console.error(`Row not found: ${KEY}`);
  process.exit(1);
}

const fields = [
  ['hook_line', hookLine],
  ['artifact_markdown', artifactMarkdown],
  ['cta_opt_in', ctaOptIn],
  ['disclaimer', disclaimer],
  ['status', statusArg],
  ['meta', JSON.stringify(meta)],
];

for (const [col, val] of fields) {
  await updateCell(tab, row.sheet_row, col, val, headers);
  console.log(`  ${col} → row ${row.sheet_row}`);
}

// L0 dry-run (same patterns as workflow)
const FORBIDDEN = [
  /cam kết.*duyệt/i,
  /lãi suất\s*\d+([.,]\d+)?\s*%/i,
  /đảm bảo.*(vay|duyệt)/i,
  /100%\s*(thành công|duyệt)/i,
];
const probe = [hookLine, artifactMarkdown, ctaOptIn, disclaimer].join('\n');
const hits = FORBIDDEN.filter((re) => re.test(probe)).map((re) => re.source);
if (hits.length) {
  console.warn('L0 warnings:', hits);
} else {
  console.log('L0 dry-run: PASS');
}

console.log(`\nDone — ${KEY} row ${row.sheet_row} status=${statusArg}`);
console.log('Next: thêm meta.publish_image_url (HTTPS Canva) nếu muốn đăng dạng ảnh; không có URL → cron đăng link Drive.');
console.log('Publish: chờ 01/07 14:00 +07 hoặc đổi scheduled_at về quá khứ + chạy workflow thủ công.');
