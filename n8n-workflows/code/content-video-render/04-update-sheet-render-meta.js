// n8n Code: cập nhật video_drafts meta + status sau Creatomate (Agent 7)

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__VIDEO_DRAFTS_TAB__';
const META_COL = 'V';
const STATUS_COL = 'Q';

const item = $input.first().json;
if (!item.render_ok || !item.sheet_row) {
  return [{ json: { ok: false, skip: true, reason: item.error || 'NO_RENDER' } }];
}

const row = item.sheet_row;
let existing = item.existing_meta || {};
try {
  const getRes = await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    method: 'GET',
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!${META_COL}${row}`)}`,
    json: true,
  });
  const cell = getRes.values?.[0]?.[0];
  if (cell) existing = JSON.parse(cell);
} catch {
  existing = item.existing_meta || {};
}

const metaPatch = {
  render_status: 'ready_for_review',
  render_id: item.render_id,
  render_url: item.render_url,
  render_provider: 'creatomate',
  render_platform: item.platform,
  render_background_url: item.background_url || null,
  rendered_at: new Date().toISOString(),
  agent: 'agent-7',
};

if (item.drive_ok && item.drive_file_id) {
  metaPatch.drive_file_id = item.drive_file_id;
  metaPatch.drive_file_name = item.drive_file_name;
  metaPatch.drive_view_url = item.drive_view_url;
  metaPatch.drive_download_url = item.drive_download_url;
  metaPatch.drive_folder = 'ready_for_review';
  metaPatch.drive_archived_at = new Date().toISOString();
}

const meta = JSON.stringify({ ...existing, ...metaPatch }).slice(0, 50000);

await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
  method: 'PUT',
  url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!${META_COL}${row}`)}?valueInputOption=USER_ENTERED`,
  body: { values: [[meta]] },
  json: true,
});

await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
  method: 'PUT',
  url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!${STATUS_COL}${row}`)}?valueInputOption=USER_ENTERED`,
  body: { values: [['ready_for_review']] },
  json: true,
});

const data = $getWorkflowStaticData('global');
if (!data.a7_stats) data.a7_stats = { render_ok: 0, render_fail: 0 };
data.a7_stats.render_ok += 1;

return [{
  json: {
    ok: true,
    sheet_row: row,
    render_id: item.render_id,
    render_url: item.render_url,
    drive_view_url: item.drive_view_url || null,
    source_normalized_key: item.source_normalized_key,
  },
}];
