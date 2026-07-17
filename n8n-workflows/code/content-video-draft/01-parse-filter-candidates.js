// n8n Code: lọc content_queue → candidate video script (Agent 6) — chỉ video formats

const MIN_SCORE = __VIDEO_DRAFT_MIN_SCORE__;
const BATCH = __VIDEO_DRAFT_BATCH_SIZE__;
const FORMAT_ROUTING = __FORMAT_ROUTING_JSON__;

const ALLOW_SEGMENTS = new Set([
  'noxh_income', 'valuation', 'sme_credit', 'general_inbound',
]);

const VIDEO_FORMATS = new Set([
  ...(FORMAT_ROUTING.agent6_video_formats || []),
  'tiktok', 'tt', 'fb', 'fb_page', 'fb_group', 'fb_reels', 'reels', 'instagram', 'youtube_shorts', 'shorts',
]);

function parseMeta(raw) {
  if (!raw) return {};
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
}

function normPlatform(raw) {
  const key = String(raw || 'tiktok').trim().toLowerCase();
  const map = {
    tt: 'tiktok',
    fb: 'fb_reels',
    fb_group: 'fb_reels',
    reels: 'fb_reels',
    page: 'fb_page',
    shorts: 'youtube_shorts',
    yt_shorts: 'youtube_shorts',
  };
  return map[key] || key;
}

function resolveFormat(meta, row) {
  return String(
    meta.content_format
    || meta.product_type
    || row.product_type
    || meta.editorial_brief_v1?.content_format
    || row.platform
    || 'fb_reels',
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
  return 999999;
}

const res = $input.first().json;
const rows = Array.isArray(res.values) ? res.values : [];
if (rows.length < 2) {
  return [{ json: { empty: true, message: 'content_queue trống' } }];
}

const headers = rows[0].map((x) => String(x ?? '').trim().toLowerCase());
const pool = [];
const blockers = { no_brief: 0, already_draft: 0, bad_segment: 0, low_score: 0, not_classified: 0, bad_format: 0, short_text: 0 };

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
  const platformRaw = String(row.platform || fmt || 'tiktok').trim().toLowerCase();

  if (meta.video_draft_created === true) { blockers.already_draft += 1; continue; }
  if (!ALLOW_SEGMENTS.has(segment)) { blockers.bad_segment += 1; continue; }
  if (score < MIN_SCORE) { blockers.low_score += 1; continue; }
  if (status !== 'classified' && row.claude_verdict !== 'qualified') { blockers.not_classified += 1; continue; }

  const isVideoFormat = VIDEO_FORMATS.has(fmt) || VIDEO_FORMATS.has(platformRaw) || VIDEO_FORMATS.has(normPlatform(platformRaw));
  if (!isVideoFormat) { blockers.bad_format += 1; continue; }

  const text = String(row.text || '').trim();
  if (text.length < 20) { blockers.short_text += 1; continue; }

  if (!meta.editorial_brief_v1) { blockers.no_brief += 1; continue; }

  const LEGAL_SEGMENTS = new Set(['noxh_income', 'valuation', 'sme_credit']);
  if (LEGAL_SEGMENTS.has(segment)) {
    const pack = meta.legal_retrieval_pack;
    const legalValidation = validateLegalPack(pack);
    if (!legalValidation.valid) {
      blockers.no_legal_pack = (blockers.no_legal_pack || 0) + 1;
      continue;
    }
    row.legal_retrieval_pack = pack;
    row.legal_pack_validation = legalValidation;
  }

  const ensured = ensureIntakeV1(
    { ...row, segment, score, intake_stub_source: 'agent6_filter' },
    meta
  );

  row.target_platform = normPlatform(platformRaw === fmt ? platformRaw : fmt);
  if (row.target_platform === 'fb_page' || row.target_platform === 'fb_group') {
    row.target_platform = 'fb_reels';
  }

  row.meta_parsed = ensured.meta;
  row.intake_v1 = ensured.intake_v1;
  row.intake_stubbed = ensured.stubbed;
  row.editorial_brief_v1 = meta.editorial_brief_v1;
  row.format_type = 'video_script';
  row.editorial_priority = editorialPriority(meta);
  pool.push(row);
}

pool.sort((a, b) => a.editorial_priority - b.editorial_priority);
const out = pool.slice(0, BATCH).map((row) => ({ json: row }));

if (!out.length) {
  return [{
    json: {
      empty: true,
      message: 'Không còn candidate video — cần format video + editorial_brief_v1 + classified score≥70',
      blockers,
    },
  }];
}

return out;
