// n8n Code: ghi publish_image_url vào meta (batchUpdate)

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const DRAFTS_TAB = '__CONTENT_DRAFTS_TAB__';

const item = $input.first().json;
const row = item.sheet_row;
if (!row) {
  return [{ json: { ok: false, skip: true, reason: 'NO_SHEET_ROW' } }];
}

const loopRow = $('Loop Cover Candidates').item?.json || {};
const existingMeta = item.meta_parsed || loopRow.meta_parsed || {};

if (item.generate_ok === false || !item.drive_ok || !item.publish_image_url) {
  const errMeta = {
    ...existingMeta,
    cover_generate_error: item.generate_error || item.drive_error || item.drive_message || 'UNKNOWN',
    cover_generate_at: new Date().toISOString(),
    cover_agent: 'content-page-cover',
  };
  return [{
    json: {
      ok: false,
      sheet_row: row,
      normalized_key: item.normalized_key,
      sheet_batch_url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchUpdate`,
      sheet_batch_body: {
        valueInputOption: 'USER_ENTERED',
        data: [
          { range: `${DRAFTS_TAB}!N${row}`, values: [[JSON.stringify(errMeta).slice(0, 50000)]] },
        ],
      },
      cover_ok: false,
    },
  }];
}

const metaPatch = {
  ...existingMeta,
  publish_image_url: item.publish_image_url,
  cover_image_url: item.publish_image_url,
  drive_cover_file_id: item.drive_file_id,
  drive_cover_file_name: item.drive_file_name,
  drive_cover_view_url: item.drive_view_url,
  cover_generated_at: new Date().toISOString(),
  cover_agent: 'content-page-cover',
  cover_gemini_model: item.gemini_model || null,
  publish_image_pending: false,
};

const metaStr = JSON.stringify(metaPatch).slice(0, 50000);

return [{
  json: {
    ok: true,
    sheet_row: row,
    normalized_key: item.normalized_key,
    publish_image_url: item.publish_image_url,
    sheet_batch_url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchUpdate`,
    sheet_batch_body: {
      valueInputOption: 'USER_ENTERED',
      data: [
        { range: `${DRAFTS_TAB}!N${row}`, values: [[metaStr]] },
      ],
    },
    cover_ok: true,
  },
}];
