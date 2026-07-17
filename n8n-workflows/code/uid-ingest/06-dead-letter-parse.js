// n8n Code node: Dead Letter (parse LLM fail) — không log uid/PII

const skeleton = $('Auth & Enrich Skeleton').first().json;
const parse = $input.first().json;

const nk = String(skeleton.normalized_key || '').trim();
const parseError = String(parse.parse_error || 'PARSE_JSON').slice(0, 120);
const sourceMeta =
  skeleton.meta && typeof skeleton.meta === 'object' && !Array.isArray(skeleton.meta)
    ? skeleton.meta
    : {};

return [{
  json: {
    ok: false,
    error: parseError,
    message: 'LLM output parse failed; inbound record persisted for review',
    retryable: false,
    uid: skeleton.uid,
    uid_source: skeleton.uid_source,
    normalized_key: nk,
    captured_at: skeleton.captured_at,
    text: skeleton.text || '',
    segment: 'unclassified',
    score: 0,
    interest_key: null,
    tags: ['unclassified'],
    meta: {
      ...sourceMeta,
      ingest_failure: {
        stage: 'llm_parse',
        code: parseError,
      },
    },
    status: 'failed',
    classify_method: 'llm',
    consent_basis: skeleton.consent_basis ?? null,
  },
}];
