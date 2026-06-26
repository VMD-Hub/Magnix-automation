// n8n Code: dedupe by event_id (sent/reminded) then append notification_events

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__NOTIFICATION_EVENTS_TAB__';
const item = $input.first().json;

let existingIds = new Set();
try {
  const res = await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    method: 'GET',
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!A:F`)}`,
    json: true,
  });
  for (const row of res.values || []) {
    const id = String(row[0] || '').trim();
    const status = String(row[5] || '').trim().toLowerCase();
    if (id && (status === 'sent' || status === 'reminded' || status === 'pending')) {
      existingIds.add(id);
    }
  }
} catch {
  existingIds = new Set();
}

if (existingIds.has(item.event_id)) {
  return [{
    json: {
      ...item,
      duplicate: true,
      ok: true,
      skipped: true,
      reason: 'DUPLICATE_EVENT_ID',
    },
  }];
}

const appendRes = await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
  method: 'POST',
  url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!A:L`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
  body: { values: [item.append_row] },
  json: true,
});

let sheet_row = null;
const range = appendRes?.updates?.updatedRange || '';
const m = range.match(/!(?:[A-Z]+)(\d+):/i);
if (m) sheet_row = Number(m[1]);

return [{ json: { ...item, duplicate: false, sheet_logged: true, sheet_row } }];
