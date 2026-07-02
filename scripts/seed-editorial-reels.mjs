#!/usr/bin/env node
/**
 * Seed video_drafts — script + beats hybrid (CapCut) từ editorial brief.
 * Usage: node scripts/seed-editorial-reels.mjs --from 01 --to 05
 *        node scripts/seed-editorial-reels.mjs --editorial 03 --dry-run
 */
import crypto from 'node:crypto';
import { loadEnv, loadPublicConfig, loadServiceAccount, sheetId, parseMeta } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects, updateCell } from './lib/sheet-client.mjs';

const CALENDAR = [
  { id: '01', day: '2026-06-30', hour: 10, format: 'fb_reels', pillar: 'D', title: 'Lương X triệu có đủ NOXH không?', cta: 'CHECKLIST' },
  { id: '03', day: '2026-06-30', hour: 18, format: 'fb_reels', pillar: 'D', title: '3 lỗi khiến hồ sơ NOXH bị trả', cta: 'MAU01' },
  { id: '06', day: '2026-07-01', hour: 18, format: 'fb_reels', pillar: 'B', title: 'CT07 là gì — khi nào cần làm?', cta: 'MAU01' },
  { id: '07', day: '2026-07-02', hour: 10, format: 'fb_reels', pillar: 'C', title: 'DTI / room vay — hiểu đúng trước khi nộp', cta: 'DTI' },
  { id: '10', day: '2026-07-03', hour: 10, format: 'fb_reels', pillar: 'A', title: 'Nhà ở tại tỉnh dự án — khác gì nơi đang ở?', cta: 'CHECKLIST' },
  { id: '12', day: '2026-07-03', hour: 18, format: 'fb_reels', pillar: 'E', title: 'Cập nhật quy định NOXH — đọc đúng nguồn', cta: 'SAVE' },
  { id: '15', day: '2026-07-04', hour: 18, format: 'fb_reels', pillar: 'D', title: 'Vợ chồng khác tỉnh — ảnh hưởng hồ sơ?', cta: 'CHECKLIST' },
  { id: '16', day: '2026-07-07', hour: 10, format: 'fb_reels', pillar: 'A', title: 'Thu nhập kinh doanh — chứng minh thế nào?', cta: 'CHECKLIST' },
  { id: '18', day: '2026-07-07', hour: 18, format: 'fb_reels', pillar: 'B', title: 'Photo mấy bộ — ai quyết định?', cta: 'MAU01' },
  { id: '21', day: '2026-07-08', hour: 18, format: 'fb_reels', pillar: 'D', title: 'Vì sao không nên tin “chắc được duyệt”', cta: 'NOXH' },
  { id: '22', day: '2026-07-09', hour: 10, format: 'fb_reels', pillar: 'B', title: 'CIC / nợ xấu — ảnh hưởng tổng quan', cta: 'SAVE' },
  { id: '25', day: '2026-07-10', hour: 10, format: 'fb_reels', pillar: 'E', title: 'NOXH TP.HCM vs Bình Dương — khác gì?', cta: 'SAVE' },
  { id: '27', day: '2026-07-10', hour: 18, format: 'fb_reels', pillar: 'A', title: 'Thuê nhà — tình trạng nhà ở khai thế nào?', cta: 'CHECKLIST' },
  { id: '30', day: '2026-07-12', hour: 10, format: 'fb_reels', pillar: 'D', title: 'Tóm tắt tuần — 3 điều hay bỏ sót', cta: 'CHECKLIST' },
];

const FORBIDDEN = [
  /(?<!không\s)(?<!\bko\s)cam kết[^.\n]{0,50}duyệt/i,
  /lãi suất\s*\d+([.,]\d+)?\s*%/i,
  /(?<!không\s)(?<!\bko\s)đảm bảo[^.\n]{0,50}(vay|duyệt)/i,
  /100%\s*(thành công|duyệt)/i,
];

const PILLAR_SEGMENT = { A: 'noxh_income', B: 'noxh_income', C: 'sme_credit', D: 'noxh_income', E: 'noxh_income' };

function parseArgs() {
  const args = process.argv.slice(2);
  let from = '01';
  let to = '05';
  let editorial = null;
  let dryRun = false;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--dry-run') dryRun = true;
    if (args[i] === '--from') from = args[++i];
    if (args[i] === '--to') to = args[++i];
    if (args[i] === '--editorial') editorial = String(args[++i]).padStart(2, '0');
  }
  return { from, to, editorial, dryRun };
}

function scheduledAt(day, hour) {
  return `${day}T${String(hour).padStart(2, '0')}:00:00+07:00`;
}

function extractJson(text) {
  const s = String(text || '');
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  let t = (fenced ? fenced[1] : s).trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start >= 0 && end > start) t = t.slice(start, end + 1);
  return JSON.parse(t);
}

function l0Check(text, cal) {
  const rules = cal?.id === '21'
    ? FORBIDDEN.filter((re) => !re.source.includes('cam kết'))
    : FORBIDDEN;
  const hits = rules.filter((re) => re.test(text)).map((re) => re.source);
  return { pass: hits.length === 0, hits };
}

async function callDeepSeek(env, system, userPayload) {
  const key = env.DEEPSEEK_API_KEY;
  if (!key || key.length < 12) throw new Error('Thiếu DEEPSEEK_API_KEY trong n8n-workflows/.env');
  const userText = typeof userPayload === 'string'
    ? userPayload
    : Object.entries(userPayload)
        .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
        .join('\n');
  const res = await fetch(env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: env.DEEPSEEK_MODEL || 'deepseek-chat',
      temperature: 0.45,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userText },
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || res.statusText);
  return data.choices?.[0]?.message?.content;
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

async function getSheetToken() {
  const sa = loadServiceAccount();
  const now = Math.floor(Date.now() / 1000);
  const b64u = (s) => Buffer.from(s).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
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

function buildSystemPrompt() {
  return `Bạn là biên kịch video short-form Magnix (Facebook Reels, 35–45 giây, 9:16).
Value-first, không hard sell. TUYỆT ĐỐI KHÔNG dùng: cam kết duyệt, đảm bảo vay/duyệt, lãi suất X%, 100% thành công/duyệt.

Viết kịch bản hybrid: xen kẽ quay presenter và slide text (CapCut).
spoken_script: tiếng Việt đầy đủ, đọc được (nói "nhà ở xã hội" thay vì NOXH khi đọc).

Trả JSON với ĐÚNG các key sau (flat, không lồng input):
title, platform, segment, hook_3s, duration_sec, aspect_ratio, source_insight,
beats (≥4: start_sec, end_sec, spoken, on_screen, visual),
hybrid_beats (≥8: t, type presenter|slide, text, slide slug hoặc null),
spoken_script, on_screen_text (array), caption, hashtags (array), cta_keyword, disclaimer, source_refs`;
}

function shotListFromHybrid(hybridBeats) {
  return (hybridBeats || [])
    .filter((b) => b.slide)
    .map((b) => ({
      slide_id: b.slide,
      canva_note: `1080x1920 — ${String(b.text).slice(0, 80)}`,
      pii: 'không lộ PII thật',
    }));
}

function normalizeParsed(parsed, cal, brief) {
  const next = { ...parsed };
  if (!String(next.title || '').trim()) {
    next.title = String(brief?.editorial_title || cal.title || next.hook_3s || 'Magnix reel').slice(0, 80);
  }
  if (!String(next.hook_3s || '').trim()) {
    const hookFromBrief = brief?.qa_backbone?.[0]?.hook_line || brief?.qa_backbone?.[0]?.question;
    next.hook_3s = String(hookFromBrief || next.title || cal.title).slice(0, 120);
  }
  if (!String(next.source_insight || '').trim()) {
    next.source_insight = String(brief?.one_line_insight || next.hook_3s || cal.title).slice(0, 2000);
  }
  if (!String(next.caption || '').trim()) {
    next.caption = String(next.hook_3s || next.title).slice(0, 150);
  }
  if (!String(next.cta_keyword || '').trim()) next.cta_keyword = cal.cta;
  if (!String(next.disclaimer || '').trim()) {
    next.disclaimer = 'Thông tin mang tính tham khảo; quyết định theo quy định và hồ sơ thực tế.';
  }
  if (!next.duration_sec) next.duration_sec = 40;
  if (!Array.isArray(next.hashtags)) next.hashtags = ['#NOXH', '#nhàởxãhội'];
  return next;
}

function hybridFromBeats(beats, hook) {
  if (!Array.isArray(beats) || !beats.length) return null;
  const first = beats[0];
  if (first && (first.t != null || first.type === 'presenter' || first.type === 'slide')) {
    return beats;
  }
  let t = 0;
  return beats.map((b, i) => {
    const start = Number(b.start_sec ?? t);
    const spoken = String(b.spoken || b.text || '').trim();
    const onScreen = String(b.on_screen || '').trim();
    const isSlide = Boolean(onScreen) && i % 2 === 1;
    const beat = {
      t: start,
      type: isSlide ? 'slide' : 'presenter',
      text: isSlide ? onScreen : spoken || hook,
      slide: isSlide ? `${String(i).padStart(2, '0')}-slide` : null,
    };
    t = Number(b.end_sec ?? start + 4);
    return beat;
  });
}

async function generateScript(env, cal, draftRow, brief) {
  const system = buildSystemPrompt();
  const userPayload = {
    segment: PILLAR_SEGMENT[cal.pillar] || 'noxh_income',
    platform: 'fb_reels',
    editorial_calendar_id: `2026w27:${cal.id}`,
    editorial_title: cal.title,
    cta_keyword: cal.cta,
    one_line_insight: brief?.one_line_insight || cal.title,
    qa_backbone: (brief?.qa_backbone || []).slice(0, 3),
    topic_lock: `Reel editorial #${cal.id}: "${cal.title}" — CTA comment ${cal.cta}. Không lệch chủ đề.`,
    requires_legal_qa: true,
    duration_target_sec: 40,
    production_format: 'hybrid_presenter_slides',
  };

  let lastErr;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const extra =
        attempt > 1 && lastErr?.message?.includes('L0')
          ? '\n\nLần trước vi phạm L0 — viết lại, tránh mọi cam kết/đảm bảo duyệt.'
          : '';
      const raw = await callDeepSeek(env, system + extra, userPayload);
      let parsed = extractJson(raw);
      if (parsed.editorial_brief_v1 && !parsed.hook_3s) {
        throw new Error('LLM echo input — retry');
      }
      parsed = normalizeParsed(parsed, cal, brief);

      const required = ['title', 'hook_3s', 'spoken_script', 'caption', 'cta_keyword', 'disclaimer', 'beats'];
      for (const k of required) {
        if (!parsed[k] || (typeof parsed[k] === 'string' && !String(parsed[k]).trim())) {
          throw new Error(`LLM thiếu field: ${k}`);
        }
      }
      if (!Array.isArray(parsed.beats) || parsed.beats.length < 4) throw new Error('LLM thiếu beats (≥4)');

      if (!Array.isArray(parsed.hybrid_beats) || parsed.hybrid_beats.length < 6) {
        const derived = hybridFromBeats(parsed.beats, parsed.hook_3s);
        if (!derived || derived.length < 6) throw new Error('LLM thiếu hybrid_beats (≥6)');
        parsed.hybrid_beats = derived;
      }

      const probe = [parsed.hook_3s, parsed.spoken_script, parsed.caption, parsed.disclaimer].join('\n');
      const l0 = l0Check(probe, cal);
      if (!l0.pass) throw new Error(`L0 fail: ${l0.hits.join(', ')}`);

      return parsed;
    } catch (e) {
      lastErr = e;
      if (attempt < 4) await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw lastErr;
}

async function seedOne({ env, cfg, tok, sid, cal, draftRow, draftHeaders, videoTab, draftsTab, dryRun }) {
  const id = cal.id;
  const pageKey = `editorial:page:2026w27:${id}`;
  const videoKey = `editorial:video:2026w27:${id}`;

  const { rows: existing } = rowsToObjects(await fetchTab(videoTab, 'A:A'));
  const haveKeys = new Set(
    existing.map((r) => String(r.source_normalized_key || Object.values(r)[0] || '').trim())
  );
  if (haveKeys.has(videoKey)) {
    console.log(`  skip #${id} — đã có ${videoKey}`);
    return { id, status: 'skip' };
  }

  const meta = parseMeta(draftRow.meta);
  const brief = meta.editorial_brief_v1;
  if (!brief) {
    console.warn(`  skip #${id} — chưa có editorial_brief_v1 trên content_drafts`);
    return { id, status: 'no_brief' };
  }

  console.log(`  gen #${id} — ${cal.title.slice(0, 50)}…`);
  if (dryRun) return { id, status: 'dry-run' };

  const parsed = await generateScript(env, cal, draftRow, brief);
  const hybridBeats = parsed.hybrid_beats;
  const shotList = shotListFromHybrid(hybridBeats);
  const hashtags = Array.isArray(parsed.hashtags) ? parsed.hashtags.join(',') : String(parsed.hashtags || '#NOXH,#nhàởxãhội');
  const onScreen = Array.isArray(parsed.on_screen_text)
    ? parsed.on_screen_text.join(' | ')
    : String(parsed.hook_3s);

  const videoMeta = {
    editorial_calendar_id: `2026w27:${id}`,
    editorial_page_key: pageKey,
    production_format: 'hybrid_presenter_slides',
    manual_assets: {
      status: 'pending_video',
      slides: shotList,
      capcut: true,
    },
    scheduled_at: scheduledAt(cal.day, cal.hour),
    target_channel: 'facebook_page',
    content_format: 'fb_reels',
    agent6_provider: 'deepseek',
    agent6_seeded_at: new Date().toISOString(),
  };

  const row = [
    videoKey,
    `cal_reel_${id}`,
    'facebook_reels',
    PILLAR_SEGMENT[cal.pillar] || 'noxh_income',
    String(parsed.title).slice(0, 200),
    String(parsed.hook_3s).slice(0, 500),
    String(parsed.spoken_script).slice(0, 45000),
    JSON.stringify(hybridBeats).slice(0, 45000),
    onScreen.slice(0, 2000),
    String(parsed.caption).slice(0, 500),
    hashtags.slice(0, 500),
    String(parsed.cta_keyword || cal.cta).slice(0, 50),
    String(parsed.duration_sec || 40),
    '9:16',
    String(parsed.source_insight || brief.one_line_insight || cal.title).slice(0, 2000),
    String(parsed.disclaimer).slice(0, 2000),
    'draft',
    'L2',
    'false',
    new Date().toISOString(),
    'editorial_calendar',
    JSON.stringify(videoMeta).slice(0, 50000),
  ];

  await appendRow(tok, sid, videoTab, row);
  console.log(`  ✓ video_drafts ${videoKey}`);

  const pageMeta = {
    ...meta,
    video_draft_key: videoKey,
    manual_assets: videoMeta.manual_assets,
    agent6_reel_at: videoMeta.agent6_seeded_at,
  };
  await updateCell(draftsTab, draftRow.sheet_row, 'meta', JSON.stringify(pageMeta).slice(0, 50000), draftHeaders);
  console.log(`  ✓ linked content_drafts row ${draftRow.sheet_row}`);

  return { id, status: 'ok', slides: shotList.length };
}

async function main() {
  const { from, to, editorial, dryRun } = parseArgs();
  const env = loadEnv();
  const cfg = loadPublicConfig();
  const sid = sheetId(env, cfg);
  const videoTab = cfg.video_drafts_tab || 'video_drafts';
  const draftsTab = cfg.content_drafts_tab || 'content_drafts';
  const tok = await getSheetToken();

  const calById = new Map(CALENDAR.map((c) => [c.id, c]));
  let ids = [];
  if (editorial) {
    ids = [editorial];
  } else {
    const f = parseInt(from, 10);
    const t = parseInt(to, 10);
    for (let n = f; n <= t; n += 1) ids.push(String(n).padStart(2, '0'));
  }

  const { headers: draftHeaders, rows: drafts } = rowsToObjects(await fetchTab(draftsTab, 'A:N'));
  const results = { ok: 0, skip: 0, no_brief: 0, not_reel: 0, fail: 0 };

  console.log(`Seed reels ${ids[0]}–${ids[ids.length - 1]}${dryRun ? ' (dry-run)' : ''}`);

  for (const id of ids) {
    const cal = calById.get(id);
    if (!cal || cal.format !== 'fb_reels') {
      console.log(`  — #${id} không phải fb_reels — bỏ qua`);
      results.not_reel += 1;
      continue;
    }

    const pageKey = `editorial:page:2026w27:${id}`;
    const draftRow = drafts.find((r) => r.source_normalized_key === pageKey);
    if (!draftRow) {
      console.warn(`  ✗ #${id} — không tìm thấy ${pageKey} trên content_drafts`);
      results.fail += 1;
      continue;
    }

    try {
      const r = await seedOne({
        env,
        cfg,
        tok,
        sid,
        cal,
        draftRow,
        draftHeaders,
        videoTab,
        draftsTab,
        dryRun,
      });
      if (r.status === 'ok' || r.status === 'dry-run') results.ok += 1;
      else if (r.status === 'skip') results.skip += 1;
      else if (r.status === 'no_brief') results.no_brief += 1;
    } catch (e) {
      console.error(`  ✗ #${id}:`, e.message);
      results.fail += 1;
    }
  }

  console.log('\nTổng:', results);
  if (results.fail > 0) process.exit(1);
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
