// Cập nhật meta cột O — đánh dấu nurture_sent_at sau khi gửi thành công.

const item = $input.first().json;
if (!item.email_sent || !item.sheet_row) {
  return [{ json: { ...item, sheet_updated: false } }];
}

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__NOXH_OPS_TAB__';
const row = item.sheet_row;
const col = 'O';

const meta = { ...(item.meta_parsed || {}), nurture_sent_at: new Date().toISOString(), nurture_tier: item.tier };
const metaStr = JSON.stringify(meta).slice(0, 45000);

return [{
  json: {
    ...item,
    meta_updated: metaStr,
    put_url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!${col}${row}`)}?valueInputOption=USER_ENTERED`,
    put_body: { values: [[metaStr]] },
  },
}];
