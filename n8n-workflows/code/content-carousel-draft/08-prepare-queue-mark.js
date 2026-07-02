// n8n Code: prepare queue meta PUT (Agent 3b)

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__CONTENT_QUEUE_TAB__';

const item = $('Resolve Draft Put Row').item?.json || $input.first().json || {};
if (!item.queue_sheet_row || !item.queue_meta_patch) {
  return [{ json: { ok: false, skip: true } }];
}

const row = item.queue_sheet_row;
const getUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!O${row}`)}`;
const putUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!O${row}`)}?valueInputOption=USER_ENTERED`;

return [{
  json: {
    ok: true,
    queue_sheet_row: row,
    queue_meta_patch: item.queue_meta_patch,
    get_url: getUrl,
    put_url: putUrl,
    normalized_key: item.source_normalized_key,
  },
}];
