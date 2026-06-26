// n8n Code: mark notification_events row resolved

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__NOTIFICATION_EVENTS_TAB__';
const item = $input.first().json;

if (item.empty) return [{ json: item }];

try {
  await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    method: 'PUT',
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!F${item.event_sheet_row}`)}?valueInputOption=USER_ENTERED`,
    body: { values: [['resolved']] },
    json: true,
  });
  await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    method: 'PUT',
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!K${item.event_sheet_row}`)}?valueInputOption=USER_ENTERED`,
    body: { values: [[item.resolved_at]] },
    json: true,
  });
} catch (e) {
  return [{ json: { ok: false, event_id: item.event_id, error: e.message } }];
}

return [{ json: { ok: true, event_id: item.event_id, resolved_at: item.resolved_at } }];
