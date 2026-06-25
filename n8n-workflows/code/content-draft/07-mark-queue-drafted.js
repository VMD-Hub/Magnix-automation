// n8n Code: cập nhật content_queue meta sau draft

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__CONTENT_QUEUE_TAB__';

const merge = $('Merge Draft Row').item?.json || $input.first().json;
if (!merge.queue_sheet_row || !merge.queue_meta_patch) {
  return [{ json: { ok: false, skip: true } }];
}

const row = merge.queue_sheet_row;
let existing = {};
try {
  const getRes = await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    method: 'GET',
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!O${row}`)}`,
    json: true,
  });
  const cell = getRes.values?.[0]?.[0];
  if (cell) existing = JSON.parse(cell);
} catch {
  existing = {};
}

const meta = JSON.stringify({ ...existing, ...merge.queue_meta_patch }).slice(0, 50000);

await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
  method: 'PUT',
  url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!O${row}`)}?valueInputOption=USER_ENTERED`,
  body: { values: [[meta]] },
  json: true,
});

return [{ json: { ok: true, queue_row_updated: row } }];
