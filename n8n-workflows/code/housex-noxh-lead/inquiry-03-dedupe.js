// Dedupe theo lead_id trên tab housex_leads_inquiry (cột A).

const item = $('Prepare Inquiry Append').item?.json || $input.first().json;
const getRes = $input.first().json || {};
const rows = getRes.values || [];

const existing = new Set();
for (let i = 1; i < rows.length; i++) {
  const id = String(rows[i][0] || '').trim();
  if (id) existing.add(id);
}

if (existing.has(item.lead_id)) {
  return [{
    json: {
      ...item,
      duplicate: true,
      skipped: true,
      ok: true,
      reason: 'DUPLICATE_LEAD_ID',
    },
  }];
}

return [{ json: { ...item, duplicate: false, skipped: false } }];
