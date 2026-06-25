// n8n Code: parse channel_state tab → map handle → last_scraped_at (ISO, lấy mới nhất)

const res = $input.first().json;
const rows = Array.isArray(res.values) ? res.values : [];
const byHandle = {};

for (let i = 1; i < rows.length; i++) {
  const handle = String(rows[i][0] ?? '').trim().toLowerCase();
  if (!handle) continue;
  const at = String(rows[i][1] ?? '').trim();
  const pid = String(rows[i][2] ?? '').trim();
  const prev = byHandle[handle];
  if (!prev?.last_scraped_at) {
    byHandle[handle] = { last_scraped_at: at, last_post_id: pid };
    continue;
  }
  const prevT = Date.parse(prev.last_scraped_at);
  const rowT = Date.parse(at);
  if (Number.isFinite(rowT) && (!Number.isFinite(prevT) || rowT >= prevT)) {
    byHandle[handle] = { last_scraped_at: at, last_post_id: pid };
  }
}

const data = $getWorkflowStaticData('global');
data.channel_state = byHandle;

return [{
  json: {
    ok: true,
    channel_count: Object.keys(byHandle).length,
    tab: 'channel_state',
  },
}];
