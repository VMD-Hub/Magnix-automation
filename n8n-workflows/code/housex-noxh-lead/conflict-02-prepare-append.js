// Chuẩn bị append tab housex_attribution_conflicts — mirror queue xung đột Ops vs CTV.

const item = $input.first().json;
if (item.skipped || item.duplicate) {
  return [{ json: item }];
}

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__CONFLICT_TAB__';

const append_row = [
  item.dedupe_key,
  item.conflict_id,
  item.phase,
  item.kind,
  item.kind_label,
  item.phone_masked,
  item.broker_id,
  item.customer_name,
  item.reject_reason,
  item.reject_label,
  item.resolution,
  item.resolution_label,
  item.platform_lead_source,
  item.noxh_case_code,
  item.ops_status,
  item.created_at,
  JSON.stringify({
    dedupe_key: item.dedupe_key,
    phase: item.phase,
    kind: item.kind,
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
