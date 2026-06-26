// n8n Code: send reminder Telegram + update meta on notification_events row

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__NOTIFICATION_EVENTS_TAB__';
const item = $input.first().json;

if (item.empty) return [{ json: item }];

const token = $env.TELEGRAM_BOT_TOKEN || '';
let tgOk = false;
let tgMessageId = '';

try {
  const tgRes = await this.helpers.httpRequest({
    method: 'POST',
    url: `https://api.telegram.org/bot${token}/sendMessage`,
    body: { chat_id: item.chat_id, text: item.message },
    json: true,
    timeout: 15000,
  });
  tgOk = Boolean(tgRes?.ok);
  tgMessageId = tgRes?.result?.message_id ? String(tgRes.result.message_id) : '';
} catch (e) {
  return [{ json: { ok: false, event_id: item.event_id, error: e.message || 'TELEGRAM_FAIL' } }];
}

const meta = {
  ...(item.meta || {}),
  reminder_count: item.reminder_count,
  last_reminded_at: new Date().toISOString(),
};

try {
  await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    method: 'PUT',
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!F${item.sheet_row}:L${item.sheet_row}`)}?valueInputOption=USER_ENTERED`,
    body: {
      values: [['reminded', item.message, item.chat_id, tgMessageId, '', '', JSON.stringify(meta)]],
    },
    json: true,
  });
} catch {
  // non-fatal
}

return [{
  json: {
    ok: tgOk,
    event_id: item.event_id,
    reminder_count: item.reminder_count,
    telegram_message_id: tgMessageId,
  },
}];
