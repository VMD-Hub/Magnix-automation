// n8n Code: chuẩn bị body append Google Sheets (1 dòng)

const item = $input.first().json;
if (!item.ok || !item.normalized_key) {
  return [{ json: { ok: false, error: item.error || 'SKIP_SHEET_APPEND' } }];
}

return [{
  json: {
    ok: true,
    normalized_key: item.normalized_key,
    sheet_body: {
      values: [[
        item.normalized_key,
        item.post_id,
        item.platform,
        item.post_url,
        item.author_id,
        item.text,
        item.segment,
        item.score,
        item.claude_verdict,
        item.interest_key,
        item.status,
        item.captured_at,
        item.source,
        item.tags,
        item.meta,
      ]],
    },
  },
}];
