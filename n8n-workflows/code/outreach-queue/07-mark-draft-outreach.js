// n8n Code: mark content_drafts meta outreach_created

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__CONTENT_DRAFTS_TAB__';

const merge = $('Merge Outreach Row').item?.json || $input.first().json;
if (!merge.draft_sheet_row || !merge.draft_meta_patch) {
  return [{ json: { ok: false, skip: true } }];
}

const row = merge.draft_sheet_row;
let existing = {};
try {
  const getRes = await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    method: 'GET',
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!N${row}`)}`,
    json: true,
  });
  const cell = getRes.values?.[0]?.[0];
  if (cell) existing = JSON.parse(cell);
} catch {
  existing = {};
}

const meta = JSON.stringify({ ...existing, ...merge.draft_meta_patch }).slice(0, 50000);

await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
  method: 'PUT',
  url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!N${row}`)}?valueInputOption=USER_ENTERED`,
  body: { values: [[meta]] },
  json: true,
});

return [{ json: { ok: true, draft_row_updated: row } }];
