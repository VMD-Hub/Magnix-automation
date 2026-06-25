// n8n Code: tìm row trống đầu tiên (cột A + E) rồi PUT thay vì append cuối sheet

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__VIDEO_DRAFTS_TAB__';

const prep = $('Prepare Video Put').item?.json || $('Merge Video Row').item?.json || {};
const getRes = $input.first().json || {};

if (!prep.ok || !prep.append_row) {
  return [{ json: { ok: false, skip: true } }];
}

const rows = getRes.values || [];
let targetRow = 2;

for (let i = 0; i < rows.length; i += 1) {
  const key = String(rows[i]?.[0] ?? '').trim();
  const title = String(rows[i]?.[4] ?? '').trim();
  if (!key && !title) {
    targetRow = i + 2;
    break;
  }
  targetRow = i + 3;
}

return [{
  json: {
    ok: true,
    target_row: targetRow,
    put_url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!A${targetRow}:V${targetRow}`)}?valueInputOption=USER_ENTERED`,
    put_body: { values: [prep.append_row] },
    source_normalized_key: prep.source_normalized_key,
    queue_sheet_row: prep.queue_sheet_row,
    queue_meta_patch: prep.queue_meta_patch,
  },
}];
