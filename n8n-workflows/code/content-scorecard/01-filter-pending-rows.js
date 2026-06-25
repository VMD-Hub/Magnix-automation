// n8n Code: filter Sheet rows chưa score (scorecard_status != done)

const SKIP_STATUSES = new Set(['done', 'analyzed', 'skip']);

function isPending(row) {
  const status = String(row.scorecard_status || row.status || '').trim().toLowerCase();
  if (SKIP_STATUSES.has(status)) return false;
  const analyzed = String(row.analyzed_at || '').trim();
  if (analyzed && analyzed !== 'null' && analyzed !== 'undefined') return false;
  const postId = String(row.post_id || '').trim();
  const platform = String(row.platform || '').trim();
  return Boolean(postId && platform);
}

const pending = $input.all().filter((item) => isPending(item.json));

if (!pending.length) {
  return [{ json: { ok: true, empty: true, message: 'No pending rows to score', count: 0 } }];
}

return pending.map((item) => ({
  json: {
    ...item.json,
    _sheet_row_number: item.json.row_number ?? item.json.rowNumber ?? null,
  },
}));
