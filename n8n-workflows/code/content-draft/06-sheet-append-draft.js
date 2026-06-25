// n8n Code: append content_drafts + googleApi

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__CONTENT_DRAFTS_TAB__';

const item = $input.first().json;
if (!item.ok || !item.append_row) {
  return [{ json: { ok: false, error: 'SKIP_APPEND' } }];
}

await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
  method: 'POST',
  url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!A:N`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
  body: { values: [item.append_row] },
  json: true,
});

const data = $getWorkflowStaticData('global');
if (!data.a3_stats) data.a3_stats = { draft_ok: 0, draft_fail: 0, l0_fail: 0 };
data.a3_stats.draft_ok += 1;

return [{ json: { ok: true, storage: 'content_drafts', normalized_key: item.source_normalized_key } }];
