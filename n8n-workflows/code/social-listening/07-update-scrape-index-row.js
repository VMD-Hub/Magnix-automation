// n8n Code: chuẩn bị append scrape_index sau khi ghi content_queue

const item = $input.first().json;
const record = $('Normalize Content Record').item?.json?.record;
const nk = item.normalized_key || record?.normalized_key;
if (!nk || !record) {
  return [{ json: { ok: false, skip_index: true } }];
}

const eng = record.meta?.engagement || record.meta?.apify_preview || {};

return [{
  json: {
    ok: true,
    index_body: {
      values: [[
        nk,
        String(record.post_id ?? ''),
        String(record.platform ?? ''),
        String(record.source ?? 'apify_social_listen'),
        new Date().toISOString(),
        JSON.stringify({ score: record.score, claude_verdict: record.claude_verdict }).slice(0, 500),
      ]],
    },
    normalized_key: nk,
  },
}];
