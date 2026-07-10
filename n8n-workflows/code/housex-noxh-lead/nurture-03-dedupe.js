// Dedupe theo dedupe_key trên tab housex_leads_nurture (cột A).

const item = $('Prepare Nurture Append').item?.json || $input.first().json;
const getRes = $input.first().json || {};
const rows = getRes.values || [];

const existing = new Set();
for (let i = 1; i < rows.length; i++) {
  const key = String(rows[i][0] || '').trim();
  if (key) existing.add(key);
}

if (existing.has(item.dedupe_key)) {
  return [{
    json: {
      ...item,
      duplicate: true,
      skipped: true,
      ok: true,
      reason: 'DUPLICATE_NURTURE_KEY',
    },
  }];
}

return [{ json: { ...item, duplicate: false, skipped: false } }];
