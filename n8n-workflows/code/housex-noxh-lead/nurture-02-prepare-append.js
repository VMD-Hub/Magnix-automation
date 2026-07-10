// Chuẩn bị append tab housex_leads_nurture — queue nurture auto từ HouseX outbox.

const item = $input.first().json;
if (item.skipped || item.duplicate) {
  return [{ json: item }];
}

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__NURTURE_TAB__';

const append_row = [
  item.dedupe_key,
  item.lead_id,
  item.nurture_script_id,
  item.script_label,
  item.channel,
  item.trigger,
  item.segment,
  item.source,
  item.contact_name,
  item.contact_phone,
  item.contact_email,
  item.ops_note,
  item.ops_status,
  item.channel_action,
  item.script_description,
  item.created_at,
  JSON.stringify({
    dedupe_key: item.dedupe_key,
    channel_action: item.channel_action,
  }).slice(0, 45000),
];

return [{
  json: {
    ...item,
    append_row,
    append_url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!A:Q`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    append_body: { values: [append_row] },
  },
}];
