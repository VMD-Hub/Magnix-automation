// n8n Code node: Dead Letter (parse LLM fail) — không log uid/PII

const skeleton = $('Auth & Enrich Skeleton').first().json;
const parse = $input.first().json;

const nk = String(skeleton.normalized_key || '').trim();

return [{
  json: {
    ok: false,
    error: parse.parse_error || 'PARSE_JSON',
    message: parse.parse_error || 'LLM output parse failed',
    retryable: false,
    normalized_key: nk || null,
    uid_source: skeleton.uid_source ? String(skeleton.uid_source) : null,
    captured_at: skeleton.captured_at,
    status: 'failed',
    classify_method: 'llm',
    parse_error: parse.parse_error,
    raw_preview: parse.raw_preview,
  },
}];
