// n8n Code: lọc content_queue → candidate lead magnet (Agent 3)

const MIN_SCORE = __DRAFT_MIN_SCORE__;
const BATCH = __DRAFT_BATCH_SIZE__;

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
const out = [];

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

  if (meta.draft_created === true) continue;
  if (!ALLOW_SEGMENTS.has(segment)) continue;
  if (score < MIN_SCORE) continue;
  if (status !== 'classified' && row.claude_verdict !== 'qualified') continue;

  const text = String(row.text || '').trim();
  if (text.length < 20) continue;

  out.push({ json: row });
  if (out.length >= BATCH) break;
}

if (!out.length) {
  return [{ json: { empty: true, message: 'Không còn candidate draft (score≥70, classified, chưa draft)' } }];
}

return out;
