// n8n Code: ghi title_rejected vào content_queue meta — không tạo draft

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__CONTENT_QUEUE_TAB__';

const source = $('Loop Draft Candidates').item?.json || {};
const item = $input.first().json;
const row = item.queue_sheet_row || source.sheet_row;

if (!row) {
  return [{ json: { ok: false, skip: true, reason: 'NO_QUEUE_ROW' } }];
}

let existing = {};
try {
  const getRes = await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    method: 'GET',
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!O${row}`)}`,
    json: true,
  });
  const cell = getRes.values?.[0]?.[0];
  if (cell) existing = JSON.parse(cell);
} catch {
  existing = {};
}

const patch = {
  qa_status: item.qa_status || 'title_rejected',
  title_qa_reason: String(item.title_qa_reason || '').slice(0, 500),
  title_qa: item.title_qa || null,
  title_rejected_at: new Date().toISOString(),
  draft_created: false,
};

const meta = JSON.stringify({ ...existing, ...patch }).slice(0, 50000);

await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
  method: 'PUT',
  url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!O${row}`)}?valueInputOption=USER_ENTERED`,
  body: { values: [[meta]] },
  json: true,
});

return [{
  json: {
    ok: true,
    title_rejected: true,
    normalized_key: String(source.normalized_key || '').slice(0, 120),
    queue_row_updated: row,
    qa_status: patch.qa_status,
    title_qa_reason: patch.title_qa_reason,
  },
}];
