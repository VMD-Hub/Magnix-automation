// n8n Code node: Dead Letter (parse LLM fail)

const skeleton = $('Auth & Enrich Skeleton').first().json;
const parse = $input.first().json;

return [{
  json: {
    ok: false,
    error: parse.parse_error || 'PARSE_JSON',
    message: parse.parse_error || 'LLM output parse failed',
    retryable: false,
    uid: skeleton.uid,
    uid_source: skeleton.uid_source,
    normalized_key: skeleton.normalized_key,
    captured_at: skeleton.captured_at,
    status: 'failed',
    classify_method: 'llm',
    parse_error: parse.parse_error,
    raw_preview: parse.raw_preview,
  },
}];
