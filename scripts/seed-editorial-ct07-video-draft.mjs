#!/usr/bin/env node
/**
 * Seed video_drafts cho editorial #06 — CT07 / VNeID hybrid reel (script + beats, chưa có MP4).
 * Usage: node scripts/seed-editorial-ct07-video-draft.mjs
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { loadEnv, loadPublicConfig, loadServiceAccount, sheetId, parseMeta } from './lib/magnix-env.mjs';

const KEY = 'editorial:video:2026w27:06';
const EDITORIAL_PAGE_KEY = 'editorial:page:2026w27:06';

const hook3s = 'CT07 là gì — và khi nào hồ sơ NOXH cần giấy này?';

const spokenScript = `CT07 là giấy xác nhận thông tin về cư trú do Công an cấp — không phải phiếu lý lịch tư pháp.

Nhiều hồ sơ NOXH hoặc vay NHCSXH cần chứng minh nơi đang cư trú, đặc biệt khi thường trú khác tỉnh dự án.

Bạn có thể xin online qua VNeID mức 2, Cổng dịch vụ công, hoặc trực tiếp tại Công an xã phường.

Trước khi làm: đối chiếu địa chỉ trên VNeID và CCCD — lệch thì xử lý tại Công an trước.

Khi có file PDF hoặc bản giấy, nộp theo đúng hướng dẫn từng dự án — không phải dự án nào cũng giống nhau.

Comment MAU01 nếu bạn muốn checklist hồ sơ theo tình huống của mình.`;

const beats = [
  { t: 0, type: 'presenter', text: hook3s, slide: null },
  { t: 3, type: 'slide', text: 'CT07 = Giấy xác nhận cư trú (BCA)', slide: '01-title-ct07' },
  { t: 8, type: 'presenter', text: 'Không nhầm với lý lịch tư pháp hay bảng CĐT.', slide: null },
  { t: 12, type: 'slide', text: 'Khi nào cần trong NOXH?', slide: '02-when-needed' },
  { t: 18, type: 'presenter', text: 'VNeID mức 2 — thủ tục cư trú.', slide: null },
  { t: 22, type: 'slide', text: 'Bước 1–3: VNeID → TTHC → Xác nhận cư trú', slide: '03-vneid-mock-1' },
  { t: 32, type: 'slide', text: 'Bước 4–5: Kê khai → Chọn CA xã/phường', slide: '04-vneid-mock-2' },
  { t: 42, type: 'presenter', text: 'Địa chỉ phải khớp CSDL — lệch thì xử lý trước.', slide: null },
  { t: 48, type: 'slide', text: 'Tải PDF / in — nộp theo CĐT', slide: '05-result-pdf' },
  { t: 55, type: 'presenter', text: 'Comment MAU01 — Magnix gửi gợi ý checklist.', slide: null },
];

const shotList = beats
  .filter((b) => b.slide)
  .map((b) => ({
    slide_id: b.slide,
    canva_note: `1080x1920 mockup — ${b.text}`,
    pii: 'che/blur — data giả',
  }));

const disclaimer =
  'Thông tin mang tính tham khảo; giao diện VNeID có thể thay đổi; quyết định theo quy định và hướng dẫn từng dự án.';

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

async function appendRow(tok, sid, tab, row) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/${encodeURIComponent(`${tab}!A:V`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [row] }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
}

async function patchMeta(tok, sid, tab, rowNum, metaStr) {
  const range = encodeURIComponent(`${tab}!V${rowNum}`);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/${range}?valueInputOption=RAW`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [[metaStr]] }),
    }
  );
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
}

async function findEditorialRow(tok, sid, tab) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/${encodeURIComponent(`${tab}!A:N`)}`,
    { headers: { Authorization: `Bearer ${tok}` } }
  );
  const data = await res.json();
  const rows = data.values || [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === EDITORIAL_PAGE_KEY) return { sheet_row: i + 1, meta: rows[i][13] || '{}' };
  }
  return null;
}

async function main() {
  const cfg = loadPublicConfig();
  const env = loadEnv();
  const sid = sheetId(env, cfg);
  const videoTab = cfg.video_drafts_tab || 'video_drafts';
  const draftsTab = cfg.content_drafts_tab || 'content_drafts';
  const tok = await token(loadServiceAccount());

  const exists = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/${encodeURIComponent(`${videoTab}!A:A`)}`,
    { headers: { Authorization: `Bearer ${tok}` } }
  ).then((r) => r.json());
  const have = new Set((exists.values || []).flat().map(String));
  if (have.has(KEY)) {
    console.log('Đã có', KEY);
    return;
  }

  const meta = {
    editorial_calendar_id: '2026w27:06',
    editorial_page_key: EDITORIAL_PAGE_KEY,
    production_format: 'hybrid_presenter_slides',
    manual_assets: {
      status: 'pending_video',
      slides: shotList,
      capcut: true,
      legal_refs: ['ct07-residence-confirmation-guide.md', 'vneid-vs-cccd-counseling.md'],
    },
    scheduled_at: '2026-07-01T18:00:00+07:00',
    target_channel: 'facebook_page',
    content_format: 'fb_reels',
  };

  const row = [
    KEY,
    'cal_page_06',
    'facebook_reels',
    'noxh_income',
    'CT07 là gì — khi nào cần làm? (VNeID)',
    hook3s,
    spokenScript,
    JSON.stringify(beats),
    hook3s,
    `${spokenScript.split('\n\n')[0]}\n\n#NOXH #CT07 #VNeID #hồsơNOXH`,
    '#NOXH,#CT07,#VNeID,#hồsơNOXH,#nhàởxãhội',
    'MAU01',
    '60',
    '9:16',
    'legal-sources/noxh/ct07-residence-confirmation-guide.md',
    disclaimer,
    'draft',
    'L2',
    'false',
    new Date().toISOString(),
    'editorial_calendar',
    JSON.stringify(meta),
  ];

  await appendRow(tok, sid, videoTab, row);
  console.log('✓ video_drafts', KEY);

  const ed = await findEditorialRow(tok, sid, draftsTab);
  if (ed) {
    const pageMeta = { ...parseMeta(ed.meta), video_draft_key: KEY, manual_assets: meta.manual_assets };
    await patchMeta(tok, sid, draftsTab, ed.sheet_row, JSON.stringify(pageMeta).slice(0, 50000));
    console.log(`✓ Linked content_drafts row ${ed.sheet_row}`);
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
