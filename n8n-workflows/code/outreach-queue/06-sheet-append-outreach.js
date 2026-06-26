// n8n Code: append outreach_queue

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__OUTREACH_QUEUE_TAB__';

const item = $input.first().json;
if (!item.ok || !item.append_row) {
  return [{ json: { ok: false, error: 'SKIP_APPEND' } }];
}

const res = await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
  method: 'POST',
  url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!A:M`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
  body: { values: [item.append_row] },
  json: true,
});

let outreach_sheet_row = null;
const m = String(res.updatedRange || '').match(/!A(\d+)/i);
if (m) outreach_sheet_row = Number(m[1]);

const data = $getWorkflowStaticData('global');
if (!data.a4_stats) data.a4_stats = { outreach_ok: 0, outreach_fail: 0 };
data.a4_stats.outreach_ok += 1;

return [{
  json: {
    ok: true,
    storage: 'outreach_queue',
    normalized_key: item.source_normalized_key,
    outreach_sheet_row,
  },
}];
