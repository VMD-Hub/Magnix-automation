// n8n Code: lọc content_drafts → candidate outreach (Agent 4)

const BATCH = __OUTREACH_BATCH_SIZE__;

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
  return [{ json: { empty: true, message: 'content_drafts trống' } }];
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

  const status = String(row.status || '').trim().toLowerCase();
  const meta = parseMeta(row.meta);

  if (meta.outreach_created === true) continue;
  if (status !== 'draft' && status !== 'approved') continue;

  const title = String(row.title || '').trim();
  const hook = String(row.hook_line || '').trim();
  if (!title || !hook) continue;

  out.push({ json: row });
  if (out.length >= BATCH) break;
}

if (!out.length) {
  return [{ json: { empty: true, message: 'Không còn draft chờ outreach (status=draft, chưa outreach)' } }];
}

return out;
