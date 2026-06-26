// n8n Code: summary after resolver batch

const items = $input.all().map((i) => i.json);
const resolved = items.filter((j) => j.ok && j.event_id && !j.empty).length;
const empty = items.some((j) => j.empty);

return [{
  json: {
    ok: true,
    workflow: 'telegram-resolver',
    resolved_count: resolved,
    empty: empty && resolved === 0,
    finished_at: new Date().toISOString(),
  },
}];
