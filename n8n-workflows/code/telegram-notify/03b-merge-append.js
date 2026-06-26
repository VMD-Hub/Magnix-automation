// n8n Code: parse sheet_row sau HTTP POST append

const item = $('Dedupe Check').item?.json || {};
const postRes = $input.first().json || {};

let sheet_row = null;
const range = postRes?.updates?.updatedRange || '';
const m = range.match(/!(?:[A-Z]+)(\d+):/i);
if (m) sheet_row = Number(m[1]);

return [{
  json: {
    ...item,
    sheet_logged: true,
    sheet_row,
    duplicate: false,
    skipped: false,
  },
}];
