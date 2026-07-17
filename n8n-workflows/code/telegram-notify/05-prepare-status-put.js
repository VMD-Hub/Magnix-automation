// n8n Code: chuẩn bị HTTP PUT status sau Telegram send

const item = $input.first().json;
const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__NOTIFICATION_EVENTS_TAB__';

if (!item.sheet_logged || item.duplicate || item.skipped || !item.sheet_row) {
  const reason =
    item.sheet_error ||
    item.reason ||
    item.telegram_skip ||
    item.telegram_error ||
    null;
  return [{
    json: {
      ok: item.ok !== false && !item.sheet_error,
      event_id: item.event_id,
      event_type: item.event_type,
      telegram_sent: item.telegram_sent === true,
      duplicate: item.duplicate === true,
      skipped: item.skipped === true,
      reason,
      sheet_row: item.sheet_row || null,
      finished_at: new Date().toISOString(),
    },
  }];
}

const status = item.sheet_status || (item.telegram_sent ? 'sent' : 'failed');
const row = item.sheet_row;

return [{
  json: {
    ...item,
    put_url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!F${row}:I${row}`)}?valueInputOption=USER_ENTERED`,
    put_body: {
      values: [[status, item.message, item.telegram_chat_id || '', item.telegram_message_id || '']],
    },
    response: {
      ok: item.ok !== false,
      event_id: item.event_id,
      event_type: item.event_type,
      telegram_sent: item.telegram_sent === true,
      duplicate: false,
      skipped: false,
      reason: item.telegram_error || null,
      sheet_row: row,
      sheet_status: status,
      finished_at: new Date().toISOString(),
    },
  },
}];
