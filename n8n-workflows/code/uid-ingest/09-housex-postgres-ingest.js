// n8n Code: POST merged UID record → House X Postgres (ADR-013)
// Env: HOUSEX_PUBLIC_URL, MAGNIX_INGEST_SECRET (cùng giá trị HouseX .env)

const base = String(
  $env.HOUSEX_PUBLIC_URL || $env.NEXT_PUBLIC_SITE_URL || 'https://timnhaxahoi.com',
).replace(/\/$/, '');
const secret = String($env.MAGNIX_INGEST_SECRET || '').trim();
const url = `${base}/api/ingest/magnix-lead`;

if (!secret) {
  throw new Error('MAGNIX_INGEST_SECRET is required for Postgres ingest');
}

const results = [];

for (const item of $input.all()) {
  const raw = item.json;

  if (!raw.ok) {
    results.push({
      json: {
        ok: false,
        error: raw.error || 'SKIP_INGEST',
        message: raw.message || 'Classify or merge failed',
        normalized_key: raw.normalized_key || null,
      },
    });
    continue;
  }

  const record =
    raw.data && typeof raw.data === 'object'
      ? raw.data
      : raw.record && typeof raw.record === 'object'
        ? raw.record
        : null;

  if (!record?.normalized_key) {
    results.push({
      json: { ok: false, error: 'MISSING_RECORD', message: 'No merged UID record' },
    });
    continue;
  }

  const payload = {
    uid: String(record.uid ?? ''),
    uid_source: String(record.uid_source ?? 'unknown'),
    normalized_key: String(record.normalized_key),
    captured_at: String(record.captured_at ?? new Date().toISOString()),
    text: record.text ?? null,
    segment: String(record.segment ?? 'unclassified'),
    score: Number(record.score ?? 0),
    interest_key: record.interest_key ?? null,
    tags: Array.isArray(record.tags) ? record.tags : [],
    meta: record.meta && typeof record.meta === 'object' ? record.meta : {},
    classify_method: String(record.classify_method ?? 'regex'),
    consent_basis: record.consent_basis ?? null,
    status: String(record.status ?? 'classified'),
  };

  const nk = payload.normalized_key;

  try {
    const res = await this.helpers.httpRequest({
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'application/json',
        'x-magnix-ingest-secret': secret,
      },
      body: payload,
      json: true,
      timeout: 20000,
    });

    const row = res?.data ?? res;
    results.push({
      json: {
        ok: true,
        storage: 'postgres_housex',
        action: 'upsert',
        id: row?.id ?? null,
        normalized_key: row?.normalized_key ?? nk,
        status: row?.status ?? payload.status,
        record: payload,
      },
    });
  } catch (e) {
    const status = e.statusCode ?? e.httpCode ?? null;
    results.push({
      json: {
        ok: false,
        error: 'HOUSEX_INGEST_FAILED',
        message: String(e.message || 'HouseX ingest request failed'),
        http_status: status,
        normalized_key: nk,
      },
    });
  }
}

return results;
