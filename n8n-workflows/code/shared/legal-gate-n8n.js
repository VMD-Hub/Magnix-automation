// Legal gate runtime — bundle injected at build: __LEGAL_PACK_BUNDLE_JSON__

const LEGAL_PACK_BUNDLE = __LEGAL_PACK_BUNDLE_JSON__;

function resolvePackFromBundle(segment, text) {
  const topic = segmentToLegalTopic(segment);
  if (!topic) return null;

  const bySegment = LEGAL_PACK_BUNDLE.packs_by_segment || {};
  const byTopic = LEGAL_PACK_BUNDLE.packs_by_topic || {};
  let pack = bySegment[segment] || byTopic[topic];
  if (!pack) return null;

  const province = detectProvinceFromText(text);
  if (province && Array.isArray(LEGAL_PACK_BUNDLE.packs_by_topic)) {
    // no-op: province-specific packs use topic_local keys when present
  }
  const localKey = province ? `${topic}__${province}` : null;
  if (localKey && byTopic[localKey]) {
    pack = byTopic[localKey];
  }

  return JSON.parse(JSON.stringify(pack));
}

function assessLegalGate(segment, pack) {
  const required = segmentRequiresLegalKb(segment);
  if (!required) {
    return {
      required: false,
      pass: true,
      status: 'not_required',
      block_reason: null,
      validation_errors: [],
    };
  }

  const validation = validateLegalPack(pack);
  return {
    required: true,
    pass: validation.valid,
    status: validation.status,
    block_reason: validation.errors[0] || null,
    validation_errors: validation.errors,
    needs_human_legal_source: !validation.valid,
    fact_count: validation.fact_count,
    claim_ids: validation.claim_ids || [],
    source_ref_count: validation.source_ref_count || 0,
  };
}

function buildMinimalBlockedPack(segment, reason) {
  return {
    topic: segmentToLegalTopic(segment) || 'unknown',
    intent: 'short_legal_explainer',
    facts: [],
    forbidden_claims: DEFAULT_FORBIDDEN,
    disclaimer_required: true,
    needs_human_legal_source: true,
    block_reason: reason,
  };
}
