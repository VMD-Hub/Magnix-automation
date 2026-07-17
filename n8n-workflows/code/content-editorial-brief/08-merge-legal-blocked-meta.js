// n8n Code: persist legal block metadata without creating an editorial brief.

const prep = $('Prepare Legal Block').item?.json || {};
const getRes = $input.first().json || {};

const MAX_META_CHARS = 50000;
const MAX_FREE_TEXT_CHARS = 1000;
const MAX_VALIDATION_ERRORS = 20;
const MAX_VALIDATION_CODE_CHARS = 120;
const MAX_VALIDATION_MESSAGE_CHARS = 240;

function boundedText(value, max = MAX_FREE_TEXT_CHARS) {
  const text = String(value ?? '');
  const suffix = '…[truncated]';
  if (text.length <= max && JSON.stringify(text).length <= max + 2) return text;
  let low = 0;
  let high = Math.min(text.length, Math.max(0, max - suffix.length));
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    const candidate = `${text.slice(0, mid)}${suffix}`;
    if (JSON.stringify(candidate).length <= max + 2) low = mid;
    else high = mid - 1;
  }
  return low > 0 ? `${text.slice(0, low)}${suffix}` : '';
}

function boundedList(value, maxItems, map) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).map(map);
}

function compactLegalPack(pack) {
  if (!pack || typeof pack !== 'object' || Array.isArray(pack)) return pack ?? null;
  return {
    topic: boundedText(pack.topic, 200),
    intent: boundedText(pack.intent, 200),
    status: boundedText(pack.status, 100),
    pack_id: boundedText(pack.pack_id, 300),
    version: boundedText(pack.version, 100),
    needs_human_legal_source: pack.needs_human_legal_source === true,
    block_reason: boundedText(pack.block_reason, 500),
    facts: boundedList(pack.facts, 8, (fact) => ({
      claim_id: boundedText(fact?.claim_id, 200),
      claim: boundedText(fact?.claim, 500),
      source_refs: boundedList(fact?.source_refs, 6, (ref) => boundedText(ref, 300)),
    })),
    forbidden_claims: boundedList(
      pack.forbidden_claims,
      20,
      (claim) => boundedText(claim, 300),
    ),
    disclaimer_required: pack.disclaimer_required === true,
    _bounded_for_sheet: true,
  };
}

function compactLegalGate(gate) {
  const value = gate && typeof gate === 'object' && !Array.isArray(gate) ? gate : {};
  return {
    required: value.required === true,
    pass: value.pass === true,
    status: boundedText(value.status, 100),
    block_reason: boundedText(value.block_reason, 200),
    validation_errors: boundedList(
      value.validation_errors,
      MAX_VALIDATION_ERRORS,
      (error) => {
        if (error && typeof error === 'object' && !Array.isArray(error)) {
          return {
            code: boundedText(
              error.code ?? error.error_code ?? 'LEGAL_VALIDATION_ERROR',
              MAX_VALIDATION_CODE_CHARS,
            ),
            message: boundedText(
              error.message ?? error.detail ?? '',
              MAX_VALIDATION_MESSAGE_CHARS,
            ),
          };
        }
        return boundedText(error, MAX_VALIDATION_CODE_CHARS);
      },
    ),
    needs_human_legal_source: value.needs_human_legal_source === true,
    fact_count: Number(value.fact_count || 0),
    claim_ids: boundedList(value.claim_ids, 40, (id) => boundedText(id, 200)),
    source_ref_count: Number(value.source_ref_count || 0),
  };
}

function boundedExisting(value, depth = 0) {
  if (typeof value === 'string') return boundedText(value);
  if (value == null || typeof value !== 'object') return value;
  if (depth >= 5) return '[omitted:depth_limit]';
  if (Array.isArray(value)) {
    return value.slice(0, 50).map((entry) => boundedExisting(entry, depth + 1));
  }
  return Object.fromEntries(
    Object.entries(value)
      .slice(0, 100)
      .map(([key, entry]) => [key, boundedExisting(entry, depth + 1)]),
  );
}

let fromSheet = {};
try {
  const cell = getRes.values?.[0]?.[0];
  if (cell) fromSheet = JSON.parse(cell);
} catch {
  fromSheet = {};
}

const blockedAt = new Date().toISOString();
const existing = boundedExisting({
  ...(prep.existing_meta || {}),
  ...fromSheet,
});
delete existing.editorial_brief_v1;
delete existing.legal_retrieval_pack;
delete existing.legal_gate;
delete existing.editorial_brief_status;
delete existing.legal_blocked_at;
delete existing.legal_blocked_identity;
delete existing.legal_gate_retry_requested;

const required = {
  legal_retrieval_pack: compactLegalPack(prep.legal_retrieval_pack),
  legal_gate: compactLegalGate(prep.legal_gate),
  editorial_brief_status: 'blocked_legal_source',
  legal_blocked_at: blockedAt,
  legal_blocked_identity: {
    normalized_key: String(prep.normalized_key || ''),
    sheet_row: Number(prep.sheet_row || 0),
  },
};

const meta = { ...required };
for (const [key, value] of Object.entries(existing)) {
  const candidate = { [key]: value, ...meta };
  if (JSON.stringify(candidate).length <= MAX_META_CHARS) {
    Object.assign(meta, { [key]: value });
  }
}

const serializedMeta = JSON.stringify(meta);
if (serializedMeta.length > MAX_META_CHARS) {
  throw new Error('BOUNDED_LEGAL_META_EXCEEDS_SHEET_LIMIT');
}

return [{
  json: {
    ...prep,
    blocked_at: blockedAt,
    meta_body: { values: [[serializedMeta]] },
  },
}];
