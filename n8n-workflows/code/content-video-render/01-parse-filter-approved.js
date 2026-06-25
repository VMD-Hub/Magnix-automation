// n8n Code: lọc video_drafts đã L3 approve, chưa render Creatomate (Agent 7)

const BATCH = __VIDEO_RENDER_BATCH_SIZE__;

const DONE_RENDER = new Set(['rendering', 'ready_for_review', 'published']);

function parseMeta(raw) {
  if (!raw) return {};
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
}

function truthyL3(v) {
  if (v === true || v === 1) return true;
  const s = String(v || '').trim().toLowerCase();
  return s === 'true' || s === '1' || s === 'yes';
}

const data = $getWorkflowStaticData('global');
if (!data.a7_stats) data.a7_stats = {};

const res = $input.first().json;
if (res?.error?.message || (res?.code && res.code >= 400)) {
  data.a7_stats.fetch_error = String(res.error?.message || res.message || res.code).slice(0, 300);
  return [{
    json: {
      empty: true,
      message: 'Fetch video_drafts lỗi — gán credential googleApi trên node Fetch',
      fetch_error: data.a7_stats.fetch_error,
    },
  }];
}

const rows = Array.isArray(res.values) ? res.values : [];
if (rows.length < 2) {
  data.a7_stats.no_candidates = true;
  data.a7_stats.candidate_count = 0;
  return [{ json: { empty: true, message: 'video_drafts trống hoặc Fetch không trả values' } }];
}

const headers = rows[0].map((x) => String(x || '').trim().toLowerCase());
const idx = (name) => headers.indexOf(name);

const col = {
  key: idx('source_normalized_key'),
  platform: idx('platform'),
  segment: idx('segment'),
  title: idx('title'),
  hook: idx('hook_3s'),
  spoken: idx('spoken_script'),
  beats: idx('beats_json'),
  onScreen: idx('on_screen_text'),
  caption: idx('caption'),
  cta: idx('cta_keyword'),
  duration: idx('duration_sec'),
  aspect: idx('aspect_ratio'),
  status: idx('status'),
  l3: idx('l3_approved'),
  meta: idx('meta'),
};

const candidates = [];
const nearMiss = [];

for (let r = 1; r < rows.length; r += 1) {
  const row = rows[r];
  if (!row?.some((c) => String(c || '').trim())) continue;

  const status = String(row[col.status] || '').trim().toLowerCase();
  const l3ok = truthyL3(row[col.l3]);
  const meta = parseMeta(row[col.meta]);
  const renderStatus = String(meta.render_status || '').trim().toLowerCase();
  const title = String(row[col.title] || '').slice(0, 40);
  const sheetRow = r + 1;

  if (status !== 'approved') {
    if (l3ok || status === 'ready_for_review' || meta.render_url) {
      nearMiss.push({ row: sheetRow, reason: `status=${status || '(trống)'} (cần approved)`, title, render_url: meta.render_url || null });
    }
    continue;
  }
  if (!l3ok) {
    nearMiss.push({ row: sheetRow, reason: 'l3_approved chưa tick', title });
    continue;
  }
  if (DONE_RENDER.has(renderStatus)) {
    nearMiss.push({ row: sheetRow, reason: `meta.render_status=${renderStatus} (đã render)`, title, render_url: meta.render_url || null });
    continue;
  }

  candidates.push({
    sheet_row: r + 1,
    source_normalized_key: String(row[col.key] || ''),
    platform: String(row[col.platform] || 'tiktok'),
    segment: String(row[col.segment] || 'general_inbound'),
    title: String(row[col.title] || ''),
    hook_3s: String(row[col.hook] || ''),
    spoken_script: String(row[col.spoken] || ''),
    beats_json: String(row[col.beats] || '[]'),
    on_screen_text: String(row[col.onScreen] || ''),
    caption: String(row[col.caption] || ''),
    cta_keyword: String(row[col.cta] || ''),
    duration_sec: Number(row[col.duration] || 30) || 30,
    aspect_ratio: String(row[col.aspect] || '9:16'),
    meta,
  });
}

// Filter: chỉ render beats Agent 6 v3 (stock_query EN) — tránh Pexels query tiếng Việt
const eligible = [];
for (const c of candidates) {
  const beats = parseBeatsJson(c.beats_json);
  const spec = validateBeatsRenderSpec(beats);
  if (spec.ok) {
    eligible.push(c);
    continue;
  }
  const first = spec.errors[0] || {};
  nearMiss.push({
    row: c.sheet_row,
    reason: `beats v3 invalid: ${first.code || 'INVALID_RENDER_SPEC'}`,
    title: String(c.title || '').slice(0, 40),
    hint: first.hint || 'Re-run Agent 6 production_brief_version 3',
  });
}

candidates.length = 0;
candidates.push(...eligible);

candidates.sort((a, b) => a.sheet_row - b.sheet_row);
const batch = candidates.slice(0, BATCH);

data.a7_stats.candidate_count = candidates.length;
data.a7_stats.batch_count = batch.length;

if (!batch.length) {
  data.a7_stats.no_candidates = true;
  data.a7_stats.near_miss = nearMiss.slice(0, 5);
  if (nearMiss.length) {
    const first = nearMiss[0];
    const extra = first.hint ? ` — ${first.hint}` : '';
    data.a7_stats.skip_hint = `Row ${first.row}: ${first.reason}${extra}${first.render_url ? ' — đã có render_url' : ''}`;
  }
  return [{
    json: {
      empty: true,
      message: 'Không còn video_drafts approved + l3 + beats v3 (stock_query EN) chưa render',
      pending_total: candidates.length,
      near_miss: nearMiss.slice(0, 5),
      skip_hint: data.a7_stats.skip_hint || null,
    },
  }];
}

data.a7_stats.no_candidates = false;
return batch.map((c) => ({ json: { ...c, empty: false } }));
