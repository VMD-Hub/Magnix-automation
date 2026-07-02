// n8n Code: prepare Google Sheet append — housex_articles

const item = $input.first().json;
if (!item.ok || !item.append_row) {
  return [{ json: item }];
}

const sheetId = '__GOOGLE_SHEET_ID__';
const tab = '__HOUSEX_ARTICLES_TAB__';

return [{
  json: {
    ...item,
    append_url: `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(`${tab}!A:N`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
  },
}];
