// Chuẩn bị append tab housex_supply_ops (đăng ký thành viên / môi giới / CTV).

const item = $input.first().json;
if (item.skipped || item.duplicate) {
  return [{ json: item }];
}

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__SUPPLY_TAB__';

const append_row = [
  item.record_id,
  item.supply_kind,
  item.role,
  item.contact_name,
  item.contact_phone,
  item.contact_email,
  item.broker_id || '',
  item.customer_id || '',
  item.region,
  item.detail,
  item.public_url,
  item.ops_status,
  item.sla_due_at,
  item.created_at,
  JSON.stringify({
    dedupe_key: item.dedupe_key,
    marketing_opt_in: item.marketing_opt_in === true,
  }).slice(0, 45000),
];

return [{
  json: {
    ...item,
    append_row,
    append_url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!A:O`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    append_body: { values: [append_row] },
  },
}];
