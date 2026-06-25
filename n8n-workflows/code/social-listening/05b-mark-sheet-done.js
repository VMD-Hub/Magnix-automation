// n8n Code: đánh dấu ghi Sheet OK + cập nhật stats execution

const data = $getWorkflowStaticData('global');
if (!data.sl_stats) {
  data.sl_stats = { sheet_ok: 0, sheet_fail: 0, qualified: 0, apify_empty: 0, not_qualified: 0 };
}

const row = $input.first().json;
const nk = row.normalized_key || $('Prepare Sheet Append').item?.json?.normalized_key;

if (nk) {
  data.sl_stats.sheet_ok += 1;
  return [{
    json: {
      ok: true,
      storage: 'sheet_content_queue',
      normalized_key: nk,
      action: row.action || 'upsert',
    },
  }];
}

data.sl_stats.sheet_fail += 1;
return [{ json: { ok: false, error: 'SHEET_UPSERT', message: 'Google Sheets node returned no normalized_key' } }];
