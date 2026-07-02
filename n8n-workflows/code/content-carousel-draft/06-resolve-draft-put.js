// n8n Code: tìm row theo key hoặc slot trống → PUT content_drafts

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__CONTENT_DRAFTS_TAB__';

const merge = $('Merge Carousel Row').item?.json || {};
const getRes = $input.first().json || {};
const values = Array.isArray(getRes.values) ? getRes.values : [];

if (!merge.ok || !merge.update_row) {
  return [{ json: { ok: false, skip: true } }];
}

const targetKey = String(merge.source_normalized_key || '').trim();
let targetRow = null;

for (let i = 0; i < values.length; i += 1) {
  const key = String(values[i]?.[0] ?? '').trim();
  if (key === targetKey) {
    targetRow = i + 2;
    break;
  }
}

if (!targetRow) {
  for (let i = 0; i < values.length; i += 1) {
    const key = String(values[i]?.[0] ?? '').trim();
    const title = String(values[i]?.[3] ?? '').trim();
    if (!key && !title) {
      targetRow = i + 2;
      break;
    }
    targetRow = i + 3;
  }
}

return [{
  json: {
    ok: true,
    target_row: targetRow,
    put_url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!A${targetRow}:N${targetRow}`)}?valueInputOption=USER_ENTERED`,
    put_body: { values: [merge.update_row] },
    source_normalized_key: targetKey,
    queue_sheet_row: merge.queue_sheet_row,
    queue_meta_patch: merge.queue_meta_patch,
  },
}];
