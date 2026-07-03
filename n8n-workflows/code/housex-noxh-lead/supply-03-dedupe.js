// Dedupe theo record_id trên tab housex_supply_ops (cột A).

const item = $('Prepare Supply Append').item?.json || $input.first().json;
const getRes = $input.first().json || {};
const rows = getRes.values || [];

const existing = new Set();
for (let i = 1; i < rows.length; i++) {
  const id = String(rows[i][0] || '').trim();
  if (id) existing.add(id);
}

if (existing.has(item.record_id)) {
  return [{
    json: {
      ...item,
      duplicate: true,
      skipped: true,
      ok: true,
      reason: 'DUPLICATE_RECORD_ID',
    },
  }];
}

return [{ json: { ...item, duplicate: false, skipped: false } }];
