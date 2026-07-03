// Chuẩn bị append tab housex_leads_inquiry (form dự án / tin đăng).

const item = $input.first().json;
if (item.skipped || item.duplicate) {
  return [{ json: item }];
}

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__INQUIRY_TAB__';

const append_row = [
  item.lead_id,
  item.kind,
  item.project_type,
  item.entity_name,
  item.slug || item.listing_code,
  item.province,
  item.contact_name,
  item.contact_phone,
  item.contact_email,
  item.message,
  item.source,
  item.public_url,
  item.assigned_broker_id,
  item.ops_status,
  item.sla_due_at,
  item.created_at,
  JSON.stringify({ dedupe_key: item.dedupe_key }).slice(0, 45000),
];

return [{
  json: {
    ...item,
    append_row,
    append_url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!A:Q`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    append_body: { values: [append_row] },
  },
}];
