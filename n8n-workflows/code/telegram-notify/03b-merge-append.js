// n8n Code: parse sheet_row sau HTTP POST append

const item = $('Dedupe Check').item?.json || {};
const postRes = $input.first().json || {};
const sheetError =
  postRes.error?.message ||
  postRes.message ||
  null;

let sheet_row = null;
const range = postRes?.updates?.updatedRange || '';
const m = range.match(/!(?:[A-Z]+)(\d+):/i);
if (m) sheet_row = Number(m[1]);

return [{
  json: {
    ...item,
    sheet_logged: !sheetError && Number.isInteger(sheet_row),
    sheet_error: sheetError || (!sheet_row ? 'SHEET_APPEND_NO_UPDATED_RANGE' : null),
    sheet_row,
    duplicate: false,
    skipped: false,
  },
}];
