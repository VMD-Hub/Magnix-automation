// n8n Code: append video_drafts + googleApi (Agent 6)

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__VIDEO_DRAFTS_TAB__';

const item = $input.first().json;
if (!item.ok || !item.append_row) {
  return [{ json: { ok: false, error: 'SKIP_APPEND' } }];
}

await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
  method: 'POST',
  url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!A:V`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
  body: { values: [item.append_row] },
  json: true,
});

const data = $getWorkflowStaticData('global');
if (!data.a6_stats) data.a6_stats = { video_ok: 0, video_fail: 0, l0_fail: 0 };
data.a6_stats.video_ok += 1;

return [{ json: { ok: true, storage: 'video_drafts', normalized_key: item.source_normalized_key } }];
