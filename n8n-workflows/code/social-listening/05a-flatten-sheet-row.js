// n8n Code: flatten content_queue record → cột Sheet (trước Google Sheets node)

const item = $input.first().json;
if (!item.ok || !item.record) {
  return [{ json: { ok: false, error: item.error || 'SKIP_SHEET', message: item.message } }];
}

const r = item.record;
const tags = Array.isArray(r.tags) ? r.tags.join(',') : String(r.tags ?? '');
const meta = typeof r.meta === 'string' ? r.meta : JSON.stringify(r.meta ?? {}).slice(0, 50000);

return [{
  json: {
    ok: true,
    normalized_key: String(r.normalized_key ?? ''),
    post_id: String(r.post_id ?? ''),
    platform: String(r.platform ?? ''),
    post_url: String(r.post_url ?? ''),
    author_id: String(r.author_id ?? ''),
    text: String(r.text ?? '').slice(0, 50000),
    segment: String(r.segment ?? 'unclassified'),
    score: Number(r.score ?? 0),
    claude_verdict: String(r.claude_verdict ?? ''),
    interest_key: String(r.interest_key ?? 'unknown'),
    status: String(r.status ?? 'raw'),
    captured_at: String(r.captured_at ?? ''),
    source: String(r.source ?? 'apify_social_listen'),
    tags,
    meta,
  },
}];
