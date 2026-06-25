#!/usr/bin/env node
/**
 * Seed one approved long-form (~4 min) NOXH podcast row for Agent 7 validation.
 *
 * Usage:
 *   node scripts/seed-agent7-longform-noxh.mjs
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

function buildLongformBeats() {
  const seg = 20;
  const mk = (i, role, intent, onScreen, spoken, stockQuery, fallback = '#0f172a') => ({
    role,
    start_sec: i * seg,
    end_sec: (i + 1) * seg,
    retention_intent: intent,
    on_screen: onScreen,
    spoken,
    visual: onScreen,
    visual_spec: { type: 'broll', stock_query: stockQuery, fallback_color: fallback },
  });

  return [
    mk(
      0,
      'hook',
      'pattern_interrupt',
      '15 triệu đủ mua nhà ở xã hội?',
      'Thu nhập mười lăm triệu có đủ điều kiện mua nhà ở xã hội không?',
      'Vietnamese young couple phone apartment surprised portrait',
    ),
    mk(
      1,
      'value',
      'checklist_tease',
      'Podcast checklist NOXH',
      'Hôm nay mình cùng đi qua toàn bộ checklist nhà ở xã hội, từ điều kiện thu nhập, hồ sơ, đến sai lầm hay gặp khi nộp vay. Nếu bạn đang cân nhắc mua nhà ở xã hội, nghe hết phần này trước khi hỏi ngân hàng.',
      'Vietnam podcast microphone home office portrait warm light',
    ),
    mk(
      2,
      'value',
      'reframe',
      'Nhà ở xã hội là gì?',
      'Nhà ở xã hội là chương trình hỗ trợ người thu nhập trung bình mua nhà với giá ưu đãi và lãi suất thấp hơn thị trường. Mỗi tỉnh có đợt mở bán khác nhau, nên bước đầu là xác định mình thuộc nhóm đối tượng nào.',
      'Vietnam social housing apartment building exterior portrait',
    ),
    mk(
      3,
      'tension',
      'reframe',
      'Ai được hưởng chính sách?',
      'Thông thường ngân hàng xét hộ gia đình chưa có nhà ở, thu nhập ổn định và không có khoản nợ xấu. Một số đợt ưu tiên công nhân, viên chức hoặc hộ nghèo theo quy định địa phương. Đừng tự loại mình trước khi đọc bảng điều kiện chính thức.',
      'Vietnamese family documents table worried portrait',
    ),
    mk(
      4,
      'proof',
      'checklist_tease',
      'Thu nhập và tỷ lệ trả nợ',
      'Ngân hàng không chỉ nhìn lương cơ bản mà cộng cả phụ cấp, thu nhập thêm nếu chứng minh được. Tỷ lệ trả nợ trên thu nhập thường không vượt quá bốn mươi đến năm mươi phần trăm. Bạn nên tự tính trước một lần để biết mức vay an toàn.',
      'calculator bank documents desk flat lay no people',
    ),
    mk(
      5,
      'checklist',
      'checklist_tease',
      'Hồ sơ cần chuẩn bị',
      'Checklist cơ bản gồm giấy tờ nhân thân, xác nhận thu nhập, sao kê tài khoản ba đến sáu tháng, và giấy xác nhận tình trạng nhà ở. Thiếu một giấy nhỏ cũng có thể bị trả hồ sơ, làm lỡ đợt xét duyệt.',
      'checklist document pen phone desk no people',
    ),
    mk(
      6,
      'value',
      'reframe',
      'Quy trình nộp hồ sơ',
      'Thứ tự thực tế thường là đăng ký đợt bán, nộp hồ sơ qua ngân hàng liên kết, chờ thẩm định tín dụng, rồi ký hợp đồng mua bán và giải ngân. Mỗi bước có thời hạn riêng, nên theo dõi tin nhắn và email từ ngân hàng.',
      'Vietnam bank office customer service desk portrait',
    ),
    mk(
      7,
      'tension',
      'reframe',
      'Sai lầm hay gặp — phần 1',
      'Sai lầm phổ biến nhất là khai thu nhập không khớp sao kê, hoặc vay thêm tiêu dùng ngay trước khi nộp hồ sơ nhà ở xã hội. Điều đó làm tỷ lệ trả nợ tăng đột ngột và hồ sơ dễ bị từ chối.',
      'worried person mortgage paperwork desk close up',
    ),
    mk(
      8,
      'tension',
      'reframe',
      'Sai lầm hay gặp — phần 2',
      'Nhiều người chỉ so giá căn hộ mà quên chi phí làm sổ, bảo hiểm, và quỹ bảo trì. Dòng tiền thực tế cao hơn dự kiến khiến trả góp căng ngay từ tháng đầu. Hãy lập bảng ngân sách đủ mười hai tháng trước khi cam kết.',
      'budget planning notebook coffee desk no people',
    ),
    mk(
      9,
      'proof',
      'checklist_tease',
      'Mẹo tăng cơ hội duyệt',
      'Chuẩn bị hồ sơ một lần đúng chuẩn, nộp đúng hạn, và giữ sao kê sạch trong ba tháng trước nộp. Nếu có người phụ thuộc, khai rõ để ngân hàng tính đúng tổng thu nhập hộ. Minh bạch từ đầu thường nhanh hơn sửa hồ sơ nhiều lần.',
      'Vietnam housing application paperwork stamp desk no people',
    ),
    mk(
      10,
      'checklist',
      'checklist_tease',
      'Tóm tắt 5 bước',
      'Tóm lại năm bước: một, kiểm tra đối tượng. Hai, tính thu nhập và tỷ lệ trả nợ. Ba, chuẩn bị hồ sơ đầy đủ. Bốn, tránh vay mới trước khi duyệt. Năm, theo dõi tiến độ sau khi nộp. Lưu checklist này để tự kiểm trước mỗi cuộc gọi với ngân hàng.',
      'checklist five steps sticky notes desk no people',
    ),
    mk(
      11,
      'cta',
      'cta_soft',
      'Comment NOXH nhận checklist',
      'Nếu thấy hữu ích, bình luận NOXH để nhận bản checklist tự kiểm miễn phí. Lưu video lại và gửi cho người thân đang tìm mua nhà ở xã hội. Cảm ơn bạn đã nghe đến cuối.',
      'Vietnam apartment skyline city sunset aerial no people',
      '#7c2d12',
    ),
  ];
}

function buildTestRow() {
  const createdAt = new Date().toISOString();
  const key = 'agent7-test:noxh-podcast-v1';
  const beats = appendBrandOutroToBeats(buildLongformBeats(), {
    cta_keyword: 'NOXH',
    format: 'full',
    variant: 2,
  });

  return {
    source_normalized_key: key,
    post_id: 'agent7_test_noxh_podcast_v1',
    platform: 'youtube_shorts',
    segment: 'noxh_income',
    title: 'Podcast checklist nhà ở xã hội — đủ điều kiện chưa?',
    hook_3s: 'Thu nhập 15 triệu đủ mua nhà ở xã hội chưa?',
    spoken_script: beats.map((beat) => beat.spoken).join(' '),
    beats_json: JSON.stringify(beats),
    on_screen_text: beats.map((beat) => beat.on_screen).join(' | '),
    caption:
      'Podcast ~4 phút: checklist nhà ở xã hội từ A-Z — thu nhập, hồ sơ, sai lầm hay gặp. Comment NOXH nhận checklist.',
    hashtags: '#NOXH #nhaxahoi #podcast #taichinhcanhan #Magnix',
    cta_keyword: 'NOXH',
    duration_sec: String(estimateDurationWithBrandOutro(240, { format: 'full' })),
    aspect_ratio: '9:16',
    source_insight: 'Long-form validation — hook preset v3 + body volume contrast trên nội dung NOXH dài.',
    disclaimer: 'Nội dung chỉ là checklist tham khảo, không thay thế tư vấn pháp lý hoặc phê duyệt tín dụng.',
    status: 'approved',
    qa_tier: 'L3_test_approved',
    l3_approved: 'TRUE',
    created_at: createdAt,
    source: 'manual_agent7_longform_seed',
    meta: JSON.stringify({
      test_seed: true,
      format: 'longform_podcast',
      render_status: 'queued_for_longform_e2e',
      created_by: 'seed-agent7-longform-noxh',
      beats_count: beats.length,
      target_duration_sec: Number(estimateDurationWithBrandOutro(240, { format: 'full' })),
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
    console.log(`Updated longform test row: ${tab}!A${rowNum}:V${rowNum}`);
  } else {
    await sheetsApi(
      token,
      'POST',
      sheetId,
      `values/${encodeURIComponent(`${tab}!A:V`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      { values: [rowValues] }
    );
    console.log(`Appended longform test row to ${tab}`);
  }

  console.log(`source_normalized_key=${record.source_normalized_key}`);
  console.log(`beats=${JSON.parse(record.beats_json).length} · duration_sec=${record.duration_sec}`);
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
