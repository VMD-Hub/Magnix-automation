const item = $input.first().json;
if (item.skipped) return [{ json: item }];

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__NOXH_DETAIL_TAB__';

const append_row = [
  item.lead_id,
  item.tier,
  item.object_group,
  item.marital_status,
  item.applicant_income,
  item.spouse_income,
  item.owns_home ? 'yes' : 'no',
  item.area_per_person ?? '',
  item.intend_to_borrow ? 'yes' : 'no',
  item.existing_debt,
  item.card_limit,
  item.bad_debt,
  item.timeframe,
  item.dti ?? '',
  item.evaluation_reasons,
  item.credit_reasons,
  item.next_steps,
  item.rules_version,
  item.contact_name,
  item.contact_phone,
  item.contact_email,
  item.created_at,
];

return [{
  json: {
    ...item,
    append_row,
    append_url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!A:V`)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    append_body: { values: [append_row] },
  },
}];
