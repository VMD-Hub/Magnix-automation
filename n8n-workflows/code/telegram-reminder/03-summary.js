// n8n Code: build summary after reminder batch

const items = $input.all().map((i) => i.json);
const sent = items.filter((j) => j.ok && j.event_id).length;
const empty = items.some((j) => j.empty);

return [{
  json: {
    ok: true,
    workflow: 'telegram-reminder',
    reminders_sent: sent,
    empty: empty && sent === 0,
    finished_at: new Date().toISOString(),
  },
}];
