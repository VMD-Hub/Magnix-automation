// n8n Code: lọc content_queue → candidate carousel (Agent 3b) — chỉ carousel_image

const MIN_SCORE = __CAROUSEL_DRAFT_MIN_SCORE__;
const BATCH = __CAROUSEL_DRAFT_BATCH_SIZE__;
const FORMAT_ROUTING = __FORMAT_ROUTING_JSON__;

const ALLOW_SEGMENTS = new Set([
  'noxh_income', 'valuation', 'sme_credit', 'general_inbound',
]);

const CAROUSEL_FORMATS = new Set(FORMAT_ROUTING.carousel_formats || ['carousel_image']);

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
    || 'carousel_image',
  ).trim().toLowerCase();
}

function editorialPriority(meta) {
  const scheduled = meta.scheduled_publish_at || meta.editorial_brief_v1?.scheduled_publish_at;
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
const pool = [];
const blockers = { no_brief: 0, already_draft: 0, bad_format: 0, low_score: 0 };

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
  const fmt = resolveFormat(meta, row);

  if (meta.carousel_draft_created === true || meta.draft_created === true) {
    blockers.already_draft += 1;
    continue;
  }
  if (!ALLOW_SEGMENTS.has(segment)) continue;
  if (score < MIN_SCORE) { blockers.low_score += 1; continue; }
  if (status !== 'classified' && row.claude_verdict !== 'qualified') continue;
  if (!CAROUSEL_FORMATS.has(fmt)) { blockers.bad_format += 1; continue; }

  const text = String(row.text || '').trim();
  if (text.length < 20) continue;

  if (!meta.editorial_brief_v1) { blockers.no_brief += 1; continue; }

  const LEGAL_SEGMENTS = new Set(['noxh_income', 'valuation', 'sme_credit']);
  if (LEGAL_SEGMENTS.has(segment)) {
    const pack = meta.legal_retrieval_pack;
    if (!pack || pack.needs_human_legal_source === true) continue;
    row.legal_retrieval_pack = pack;
  }

  row.meta_parsed = meta;
  row.editorial_brief_v1 = meta.editorial_brief_v1;
  row.format_type = 'carousel';
  row.editorial_priority = editorialPriority(meta);
  pool.push(row);
}

pool.sort((a, b) => a.editorial_priority - b.editorial_priority);
const out = pool.slice(0, BATCH).map((row) => ({ json: row }));

if (!out.length) {
  return [{
    json: {
      empty: true,
      message: 'Không còn candidate carousel — cần carousel_image + editorial_brief_v1 + score≥70',
      blockers,
    },
  }];
}

return out;
