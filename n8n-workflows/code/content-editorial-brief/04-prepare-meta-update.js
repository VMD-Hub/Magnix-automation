// n8n Code: chuẩn bị URL cập nhật meta + interest_key (Layer B)

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__CONTENT_QUEUE_TAB__';

const item = $input.first().json;
if (!item.ok || !item.editorial_brief_v1 || !item.sheet_row) {
  return [{ json: { ok: false, skip: true, reason: item.parse_error || 'NO_BRIEF' } }];
}

const row = item.sheet_row;

return [{
  json: {
    ok: true,
    sheet_row: row,
    normalized_key: item.normalized_key,
    interest_key: item.interest_key,
    editorial_brief_v1: item.editorial_brief_v1,
    legal_retrieval_pack: item.legal_retrieval_pack || null,
    legal_gate: item.legal_gate || null,
    existing_meta: item.existing_meta || {},
    get_meta_url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!O${row}`)}`,
    put_meta_url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!O${row}`)}?valueInputOption=USER_ENTERED`,
    put_interest_url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!J${row}`)}?valueInputOption=USER_ENTERED`,
  },
}];
