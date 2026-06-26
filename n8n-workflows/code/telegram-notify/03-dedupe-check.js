// n8n Code: dedupe từ HTTP GET events (không gọi Sheet API trong Code)

const item = $('Format Message').item?.json || $input.first().json;
const getRes = $input.first().json || {};
const rows = getRes.values || [];

const existingIds = new Set();
for (const row of rows) {
  const id = String(row[0] || '').trim();
  const status = String(row[5] || '').trim().toLowerCase();
  if (id && ['sent', 'reminded', 'pending'].includes(status)) {
    existingIds.add(id);
  }
}

if (existingIds.has(item.event_id)) {
  return [{
    json: {
      ...item,
      duplicate: true,
      skipped: true,
      ok: true,
      reason: 'DUPLICATE_EVENT_ID',
    },
  }];
}

return [{
  json: {
    ...item,
    duplicate: false,
    skipped: false,
    append_body: { values: [item.append_row] },
  },
}];
