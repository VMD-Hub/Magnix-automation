// n8n Code: merge editorial brief vào meta (Layer B)

const prep = $('Prepare Meta Update').item?.json || $input.first().json || {};
const getRes = $input.first().json || {};

if (!prep.ok || !prep.editorial_brief_v1) {
  return [{ json: { ok: false, skip: true } }];
}

let fromSheet = {};
try {
  const cell = getRes.values?.[0]?.[0];
  if (cell) fromSheet = JSON.parse(cell);
} catch {
  fromSheet = {};
}

const prepMeta = prep.existing_meta || {};
const existing = { ...fromSheet, ...prepMeta };

const MAX_META_CHARS = 50000;

function fitJsonValue(value, maxChars, depth = 0) {
  if (value == null) return null;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    if (JSON.stringify(value).length <= maxChars) return value;
    let low = 0;
    let high = value.length;
    while (low < high) {
      const mid = Math.ceil((low + high) / 2);
      const candidate = `${value.slice(0, mid)}…[truncated]`;
      if (JSON.stringify(candidate).length <= maxChars) low = mid;
      else high = mid - 1;
    }
    return low > 0 ? `${value.slice(0, low)}…[truncated]` : '';
  }
  if (depth >= 6) return '[omitted:depth_limit]';
  if (Array.isArray(value)) {
    const result = [];
    for (const entry of value.slice(0, 100)) {
      const remaining = maxChars - JSON.stringify(result).length - 1;
      if (remaining < 4) break;
      const bounded = fitJsonValue(entry, Math.min(remaining, 6000), depth + 1);
      const candidate = [...result, bounded];
      if (JSON.stringify(candidate).length > maxChars) break;
      result.push(bounded);
    }
    return result;
  }
  if (typeof value === 'object') {
    const result = {};
    for (const [key, entry] of Object.entries(value).slice(0, 150)) {
      const remaining = maxChars - JSON.stringify(result).length - JSON.stringify(key).length - 2;
      if (remaining < 4) continue;
      const bounded = fitJsonValue(entry, Math.min(remaining, 8000), depth + 1);
      const candidate = { ...result, [key]: bounded };
      if (JSON.stringify(candidate).length <= maxChars) result[key] = bounded;
    }
    return result;
  }
  return String(value);
}

delete existing.legal_gate_retry_requested;
delete existing.editorial_brief_v1;
delete existing.editorial_brief_at;
delete existing.legal_retrieval_pack;
delete existing.legal_retrieval_pack_at;
delete existing.legal_gate;

const meta = {
  editorial_brief_v1: fitJsonValue(prep.editorial_brief_v1, 20000),
  editorial_brief_at: new Date().toISOString(),
};
if (prep.legal_retrieval_pack) {
  meta.legal_retrieval_pack = fitJsonValue(prep.legal_retrieval_pack, 14000);
  meta.legal_retrieval_pack_at = new Date().toISOString();
}
if (prep.legal_gate) {
  meta.legal_gate = fitJsonValue(prep.legal_gate, 8000);
}
if (prepMeta.intake_v1 && !fromSheet.intake_v1) {
  meta.intake_v1_from = meta.intake_v1_from || 'stub_layer_b';
}

for (const [key, value] of Object.entries(existing)) {
  const bounded = fitJsonValue(value, 4000);
  const candidate = { ...meta, [key]: bounded };
  if (JSON.stringify(candidate).length <= MAX_META_CHARS) meta[key] = bounded;
}

const metaStr = JSON.stringify(meta);
if (metaStr.length > MAX_META_CHARS) {
  throw new Error('BOUNDED_SUCCESS_META_EXCEEDS_SHEET_LIMIT');
}

return [{
  json: {
    ok: true,
    put_meta_url: prep.put_meta_url,
    put_interest_url: prep.put_interest_url,
    meta_body: { values: [[metaStr]] },
    interest_body: { values: [[prep.interest_key || 'unknown']] },
    sheet_row: prep.sheet_row,
    normalized_key: prep.normalized_key,
  },
}];
