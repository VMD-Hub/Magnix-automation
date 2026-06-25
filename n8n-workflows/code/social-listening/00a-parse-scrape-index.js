// n8n Code: parse scrape_index tab → dedupe_keys trong staticData

const res = $input.first().json;
const rows = Array.isArray(res.values) ? res.values : [];
const keys = {};

for (let i = 1; i < rows.length; i++) {
  const nk = String(rows[i][0] ?? '').trim();
  if (nk) keys[nk] = true;
  const pid = String(rows[i][1] ?? '').trim();
  if (pid) keys[pid] = true;
}

const data = $getWorkflowStaticData('global');
data.dedupe_keys = keys;

return [{
  json: {
    ok: true,
    dedupe_count: Object.keys(keys).length,
    tab: 'scrape_index',
  },
}];
