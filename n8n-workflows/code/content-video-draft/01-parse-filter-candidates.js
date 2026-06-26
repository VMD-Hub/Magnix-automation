// n8n Code: lọc content_queue → candidate video script (Agent 6)

const MIN_SCORE = __VIDEO_DRAFT_MIN_SCORE__;
const BATCH = __VIDEO_DRAFT_BATCH_SIZE__;

const ALLOW_SEGMENTS = new Set([
  'noxh_income', 'valuation', 'sme_credit', 'general_inbound',
]);

const VIDEO_PLATFORMS = new Set([
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

const res = $input.first().json;
const rows = Array.isArray(res.values) ? res.values : [];
if (rows.length < 2) {
  return [{ json: { empty: true, message: 'content_queue trống' } }];
}

const headers = rows[0].map((x) => String(x ?? '').trim().toLowerCase());
const out = [];
const blockers = { no_brief: 0, already_draft: 0, bad_segment: 0, low_score: 0, not_classified: 0, bad_platform: 0, short_text: 0 };

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
  const platformRaw = String(row.platform || 'tiktok').trim().toLowerCase();
  if (meta.video_draft_created === true) { blockers.already_draft += 1; continue; }
  if (!ALLOW_SEGMENTS.has(segment)) { blockers.bad_segment += 1; continue; }
  if (score < MIN_SCORE) { blockers.low_score += 1; continue; }
  if (status !== 'classified' && row.claude_verdict !== 'qualified') { blockers.not_classified += 1; continue; }
  if (!VIDEO_PLATFORMS.has(platformRaw) && !VIDEO_PLATFORMS.has(normPlatform(platformRaw))) { blockers.bad_platform += 1; continue; }

  const text = String(row.text || '').trim();
  if (text.length < 20) { blockers.short_text += 1; continue; }

  if (!meta.editorial_brief_v1) { blockers.no_brief += 1; continue; }

  const LEGAL_SEGMENTS = new Set(['noxh_income', 'valuation', 'sme_credit']);
  if (LEGAL_SEGMENTS.has(segment)) {
    const pack = meta.legal_retrieval_pack;
    if (!pack || pack.needs_human_legal_source === true) {
      blockers.no_legal_pack = (blockers.no_legal_pack || 0) + 1;
      continue;
    }
    row.legal_retrieval_pack = pack;
  }

  const ensured = ensureIntakeV1(
    { ...row, segment, score, intake_stub_source: 'agent6_filter' },
    meta
  );

  row.target_platform = normPlatform(platformRaw);
  if (row.target_platform === 'fb_page' || row.target_platform === 'fb_group') {
    row.target_platform = 'fb_reels';
  }

  row.meta_parsed = ensured.meta;
  row.intake_v1 = ensured.intake_v1;
  row.intake_stubbed = ensured.stubbed;
  row.editorial_brief_v1 = meta.editorial_brief_v1;
  out.push({ json: row });
  if (out.length >= BATCH) break;
}

if (!out.length) {
  return [{
    json: {
      empty: true,
      message: 'Không còn candidate video — cần editorial_brief_v1 (chạy Layer B) + classified score≥70',
      blockers,
    },
  }];
}

return out;
