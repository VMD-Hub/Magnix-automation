// n8n Code node: Merge UID Record (full Sheet schema §3.1)

const skeleton = $('Auth & Enrich Skeleton').first().json;
const item = $input.first().json;

if (!item.ok || !item.classify) {
  throw new Error('Merge skipped: classify not ok');
}

const { segment, score, interest_key } = item.classify;
const method = item.classify_method || 'regex';

const FORBIDDEN = [
  /cam kết.*duyệt/i,
  /lãi suất\s*\d+([.,]\d+)?\s*%/i,
];

const text = skeleton.text || '';
const l0_hits = FORBIDDEN.filter((re) => re.test(text)).map((re) => re.source);

let status = 'classified';
if (score < 60) status = 'review';
if (l0_hits.length > 0) status = 'review';

const record = {
  uid: skeleton.uid,
  uid_source: skeleton.uid_source,
  normalized_key: skeleton.normalized_key,
  captured_at: skeleton.captured_at,
  text,
  segment,
  score,
  interest_key,
  tags: [segment],
  meta: skeleton.meta ?? {},
  classify_method: method,
  consent_basis: skeleton.consent_basis ?? null,
  status,
  l0_forbidden_hits: l0_hits,
};

return [{ json: { ok: true, data: record } }];
