// n8n Code: parse content_queue + lọc dòng chờ classify (Agent 2)

const BATCH = __CLASSIFY_BATCH_SIZE__;

function parseMeta(raw) {
  if (!raw) return {};
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
}

function isPending(row, headers) {
  const h = {};
  headers.forEach((key, i) => {
    if (key) h[key] = String(row[i] ?? '').trim();
  });

  const segment = (h.segment || '').toLowerCase();
  const status = (h.status || '').toLowerCase();
  const meta = parseMeta(h.meta);

  if (meta.classify_method === 'llm') return false;
  if (status === 'classified' && segment && segment !== 'unclassified') return false;

  const text = h.text || '';
  if (!text.trim()) return false;

  if (!segment || segment === 'unclassified') return true;
  if (status === 'review') return true;
  if (meta.needs_llm === true) return true;

  return false;
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
  if (!isPending(cells, headers)) continue;

  const row = { sheet_row: i + 1 };
  headers.forEach((key, j) => {
    if (key) row[key] = cells[j] ?? '';
  });
  out.push({ json: row });
  if (out.length >= BATCH) break;
}

if (!out.length) {
  return [{ json: { empty: true, message: 'Không còn dòng pending classify' } }];
}

return out;
