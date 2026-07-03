const item = $input.first().json;
return [{
  json: {
    ok: item.ok !== false,
    workflow: 'housex-noxh-lead-route',
    path: item.path || 'events',
    lead_id: item.lead_id || null,
    event_path: item.event_path || null,
    tier: item.tier || null,
    supply_kind: item.supply_kind || null,
    duplicate: item.duplicate === true,
    skipped: item.skipped === true,
    telegram_sent: item.telegram_sent === true,
    reason: item.reason || item.telegram_skip || null,
    finished_at: new Date().toISOString(),
  },
}];
