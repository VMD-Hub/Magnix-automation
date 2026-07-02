// n8n Code: lọc content_queue cần editorial brief (Layer B)

const MIN_SCORE = __EDITORIAL_BRIEF_MIN_SCORE__;
const BATCH = __EDITORIAL_BRIEF_BATCH_SIZE__;

const ALLOW_SEGMENTS = new Set([
  'noxh_income', 'valuation', 'sme_credit', 'general_inbound',
]);

function parseMeta(raw) {
  if (!raw) return {};
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
}

const res = $input.first().json;
const rows = Array.isArray(res.values) ? res.values : [];
if (rows.length < 2) {
  return [{ json: { empty: true, message: 'content_queue trống' } }];
}

const headers = rows[0].map((x) => String(x ?? '').trim().toLowerCase());
const editorial = [];
const general = [];

function isEditorialRow(row, meta) {
  if (String(row.source || '').trim() === 'editorial_calendar') return true;
  if (meta.editorial_page_key || meta.editorial_calendar_id) return true;
  return String(row.normalized_key || '').startsWith('editorial:queue:');
}

for (let i = 1; i < rows.length; i += 1) {
  const cells = rows[i];
  if (!cells?.some((c) => String(c ?? '').trim())) continue;

  const row = { sheet_row: i + 1 };
  headers.forEach((key, j) => {
    if (key) row[key] = cells[j] ?? '';
  });

  const meta = parseMeta(row.meta);
  if (meta.editorial_brief_v1) continue;

  const segment = String(row.segment || '').trim().toLowerCase();
  const score = Number(row.score || 0);
  const status = String(row.status || '').trim().toLowerCase();
  const verdict = String(row.claude_verdict || '').trim().toLowerCase();

  if (score < MIN_SCORE) continue;
  if (!ALLOW_SEGMENTS.has(segment)) continue;
  if (status !== 'classified' && verdict !== 'qualified') continue;

  const text = String(row.text || '').trim();
  if (text.length < 20) continue;

  const ensured = ensureIntakeV1(
    { ...row, segment, score, intake_stub_source: 'layer_b_filter' },
    meta
  );

  row.meta_parsed = ensured.meta;
  row.intake_v1 = ensured.intake_v1;
  row.intake_stubbed = ensured.stubbed;
  const bucket = isEditorialRow(row, meta) ? editorial : general;
  row.editorial_priority = (() => {
    const scheduled = meta.scheduled_publish_at || meta.publish_at;
    if (scheduled) {
      const t = new Date(scheduled).getTime();
      if (!Number.isNaN(t)) return t;
    }
    const calId = String(meta.editorial_calendar_id || '').trim();
    if (calId) {
      const num = Number(calId.split(':').pop());
      if (Number.isFinite(num)) return num;
    }
    return isEditorialRow(row, meta) ? 0 : 500000;
  })();
  bucket.push(row);
}

editorial.sort((a, b) => a.editorial_priority - b.editorial_priority);
general.sort((a, b) => a.editorial_priority - b.editorial_priority);

const out = [...editorial, ...general].slice(0, BATCH).map((row) => ({ json: row }));

if (!out.length) {
  return [{
    json: {
      empty: true,
      message: 'Không còn dòng cần editorial brief (classified score≥70 + chưa editorial_brief_v1)',
    },
  }];
}

return out;
