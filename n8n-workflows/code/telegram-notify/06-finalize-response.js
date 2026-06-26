// n8n Code: finalize response sau HTTP PUT (hoặc pass-through duplicate)

const item = $input.first().json;
const prep = $('Prepare Status PUT').item?.json;

if (prep?.response) {
  return [{ json: prep.response }];
}

if (item.skipped || item.duplicate) {
  return [{
    json: {
      ok: true,
      event_id: item.event_id,
      event_type: item.event_type,
      telegram_sent: false,
      duplicate: true,
      skipped: true,
      reason: item.reason || 'DUPLICATE_EVENT_ID',
      finished_at: new Date().toISOString(),
    },
  }];
}

return [{ json: item }];
