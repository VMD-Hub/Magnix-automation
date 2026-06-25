// n8n Code node: Auth & Enrich Skeleton
// Mirror: uid-ingest.workflow.json → node "Auth & Enrich Skeleton"

const EXPECTED = $env.MAGNIX_WEBHOOK_TOKEN || '';
const headers = $input.first().json.headers || {};
const auth = headers.authorization || headers.Authorization || '';
if (EXPECTED && auth !== `Bearer ${EXPECTED}`) {
  throw new Error('Unauthorized: invalid MAGNIX_WEBHOOK_TOKEN');
}

const raw = $input.first().json;
const body = raw.body && typeof raw.body === 'object' ? raw.body : raw;

const uid = String(body.uid || '').trim();
const uid_source = String(body.uid_source || 'unknown').trim();
if (!uid) {
  throw new Error('Validation: uid is required');
}

const text = String(body.text ?? body.message ?? '').trim();
const meta = body.meta && typeof body.meta === 'object' ? body.meta : {};
const consent_basis = body.consent_basis || meta.consent_basis || null;

const normalized_key = `${uid_source}:${uid}`;
const captured_at = body.captured_at || new Date().toISOString();

return [{
  json: {
    uid,
    uid_source,
    normalized_key,
    captured_at,
    text,
    meta,
    consent_basis,
    status: 'raw',
  },
}];
