// n8n Code: update notification_events row status after Telegram send

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__NOTIFICATION_EVENTS_TAB__';
const item = $input.first().json;

function buildResponse(extra = {}) {
  return [{
    json: {
      ok: item.ok !== false,
      event_id: item.event_id,
      event_type: item.event_type,
      telegram_sent: item.telegram_sent === true,
      duplicate: item.duplicate === true,
      skipped: item.skipped === true,
      reason: item.reason || item.telegram_skip || item.telegram_error || null,
      sheet_row: item.sheet_row || null,
      finished_at: new Date().toISOString(),
      ...extra,
    },
  }];
}

if (!item.sheet_logged || item.duplicate) {
  return buildResponse();
}

const targetRow = Number(item.sheet_row || 0);
if (!targetRow) {
  return buildResponse({ sheet_update_skipped: 'NO_SHEET_ROW' });
}

const status = item.sheet_status || (item.telegram_sent ? 'sent' : 'failed');
try {
  await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    method: 'PUT',
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!F${targetRow}:I${targetRow}`)}?valueInputOption=USER_ENTERED`,
    body: {
      values: [[status, item.message, item.telegram_chat_id || '', item.telegram_message_id || '']],
    },
    json: true,
  });
} catch {
  return buildResponse({ sheet_update_skipped: 'PUT_FAIL' });
}

return buildResponse({ sheet_status: status });
