// n8n Code: chuẩn bị URLs cập nhật Sheet sau render (Agent 7) — không auth trong Code

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__VIDEO_DRAFTS_TAB__';
const META_COL = 'V';
const STATUS_COL = 'Q';

const item = $input.first().json;
if (!item.render_ok || !item.sheet_row) {
  return [{ json: { ok: false, skip: true, reason: item.error || 'NO_RENDER' } }];
}

const row = item.sheet_row;

const render_meta_patch = {
  render_status: 'ready_for_review',
  render_id: item.render_id,
  render_url: item.render_url,
  render_provider: 'creatomate_renderscript_v2',
  render_engine: item.render_engine || 'creatomate_renderscript_v2',
  tts_provider: item.tts_provider || null,
  beats_rendered: item.beats_count || null,
  render_platform: item.platform,
  render_background_url: item.background_url || null,
  rendered_at: new Date().toISOString(),
  agent: 'agent-7',
};

if (item.drive_ok && item.drive_file_id) {
  render_meta_patch.drive_file_id = item.drive_file_id;
  render_meta_patch.drive_file_name = item.drive_file_name;
  render_meta_patch.drive_view_url = item.drive_view_url;
  render_meta_patch.drive_download_url = item.drive_download_url;
  render_meta_patch.drive_folder = 'ready_for_review';
  render_meta_patch.drive_archived_at = new Date().toISOString();
}

return [{
  json: {
    ok: true,
    sheet_row: row,
    get_meta_url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!${META_COL}${row}`)}`,
    put_meta_url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!${META_COL}${row}`)}?valueInputOption=USER_ENTERED`,
    put_status_url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!${STATUS_COL}${row}`)}?valueInputOption=USER_ENTERED`,
    render_meta_patch,
    existing_meta: item.existing_meta || {},
    render_url: item.render_url,
    source_normalized_key: item.source_normalized_key,
  },
}];
