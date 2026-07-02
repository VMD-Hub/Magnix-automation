// n8n Code: lọc content_queue → candidate lead magnet (Agent 3) — chỉ text_post formats

const MIN_SCORE = __DRAFT_MIN_SCORE__;
const BATCH = __DRAFT_BATCH_SIZE__;
const FORMAT_ROUTING = __FORMAT_ROUTING_JSON__;

const ALLOW_SEGMENTS = new Set([
  'noxh_income', 'valuation', 'sme_credit', 'general_inbound',
]);

const TEXT_FORMATS = new Set(FORMAT_ROUTING.agent3_text_post_formats || []);
const VIDEO_FORMATS = new Set(FORMAT_ROUTING.agent6_video_formats || []);
const CAROUSEL_FORMATS = new Set(FORMAT_ROUTING.carousel_formats || []);

function parseMeta(raw) {
  if (!raw) return {};
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
}

function resolveFormat(meta, row) {
  return String(
    meta.content_format
    || meta.product_type
    || row.product_type
    || meta.editorial_brief_v1?.content_format
    || 'fb_page_post_image',
  ).trim().toLowerCase();
}

function editorialPriority(meta) {
  const scheduled = meta.scheduled_publish_at
    || meta.editorial_brief_v1?.scheduled_publish_at
    || meta.publish_at;
  if (scheduled) {
    const t = new Date(scheduled).getTime();
    if (!Number.isNaN(t)) return t;
  }
  const calId = String(meta.editorial_calendar_id || '').trim();
  if (calId) {
    const num = Number(calId.split(':').pop());
    if (Number.isFinite(num)) return num;
  }
  const pageKey = String(meta.editorial_page_key || '').trim();
  if (pageKey) {
    const num = Number(pageKey.split(':').pop());
    if (Number.isFinite(num)) return num;
  }
  return 999999;
}

const res = $input.first().json;
const rows = Array.isArray(res.values) ? res.values : [];
if (rows.length < 2) {
  return [{ json: { empty: true, message: 'content_queue trống' } }];
}

const headers = rows[0].map((x) => String(x ?? '').trim().toLowerCase());
const candidates = [];

for (let i = 1; i < rows.length; i++) {
  const cells = rows[i];
  if (!cells?.some((c) => String(c ?? '').trim())) continue;

  const row = { sheet_row: i + 1 };
  headers.forEach((key, j) => {
    if (key) row[key] = cells[j] ?? '';
  });

  const segment = String(row.segment || '').trim().toLowerCase();
  const score = Number(row.score || 0);
  const status = String(row.status || '').trim().toLowerCase();
  const meta = parseMeta(row.meta);
  row.meta_parsed = meta;

  if (meta.draft_created === true) continue;
  if (!ALLOW_SEGMENTS.has(segment)) continue;
  if (score < MIN_SCORE) continue;
  if (status !== 'classified' && row.claude_verdict !== 'qualified') continue;

  const fmt = resolveFormat(meta, row);
  if (VIDEO_FORMATS.has(fmt)) continue;
  if (CAROUSEL_FORMATS.has(fmt)) continue;
  if (!TEXT_FORMATS.has(fmt) && fmt !== 'fb_page_post_image') {
    if (VIDEO_FORMATS.has(fmt) || CAROUSEL_FORMATS.has(fmt)) continue;
  }

  const LEGAL_SEGMENTS = new Set(['noxh_income', 'valuation', 'sme_credit']);
  if (LEGAL_SEGMENTS.has(segment)) {
    if (!meta.editorial_brief_v1) continue;
    const pack = meta.legal_retrieval_pack;
    if (!pack || pack.needs_human_legal_source === true) continue;
    row.legal_retrieval_pack = pack;
    row.editorial_brief_v1 = meta.editorial_brief_v1;
  }

  row.channel = meta.channel || null;
  row.target_channel = meta.target_channel || meta.editorial_brief_v1?.target_channel || null;
  row.product_type = meta.product_type || meta.content_format || fmt;
  row.format_type = 'text_post';
  row.editorial_priority = editorialPriority(meta);

  const text = String(row.text || '').trim();
  if (text.length < 20) continue;

  candidates.push(row);
}

candidates.sort((a, b) => a.editorial_priority - b.editorial_priority);
const out = candidates.slice(0, BATCH).map((row) => ({ json: row }));

if (!out.length) {
  return [{ json: { empty: true, message: 'Không còn candidate draft (score≥70, text_post format, chưa draft)' } }];
}

return out;
