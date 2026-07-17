// Chuẩn bị append row tab noxh_leads_ops + URL Google Sheet.

const item = $input.first().json;
if (item.skipped || item.duplicate) {
  return [{ json: item }];
}

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__NOXH_OPS_TAB__';

const append_row = [
  item.lead_id,
  item.tier,
  item.overall,
  item.credit_flag,
  item.reason_codes_csv,
  item.recommended_action,
  item.rules_version,
  item.contact_name,
  item.contact_phone,
  item.contact_email,
  item.ops_status,
  item.assigned_to,
  item.sla_due_at,
  item.created_at,
  JSON.stringify({
    has_credit_blocker: item.has_credit_blocker,
    has_credit_caution: item.has_credit_caution,
    dedupe_key: item.dedupe_key,
  }).slice(0, 45000),
];

return [{
  json: {
    ...item,
    append_row,
    append_url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!A:O`)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    append_body: { values: [append_row] },
  },
}];
