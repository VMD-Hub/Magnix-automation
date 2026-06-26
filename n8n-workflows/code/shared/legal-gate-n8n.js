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
    return { required: false, pass: true, block_reason: null };
  }
  if (!pack) {
    return {
      required: true,
      pass: false,
      block_reason: 'MISSING_LEGAL_PACK',
      needs_human_legal_source: true,
    };
  }
  if (pack.needs_human_legal_source === true) {
    return {
      required: true,
      pass: false,
      block_reason: 'NEEDS_HUMAN_LEGAL_SOURCE',
      needs_human_legal_source: true,
    };
  }
  if (!Array.isArray(pack.facts) || pack.facts.length === 0) {
    return {
      required: true,
      pass: false,
      block_reason: 'EMPTY_LEGAL_FACTS',
      needs_human_legal_source: true,
    };
  }
  return {
    required: true,
    pass: true,
    block_reason: null,
    needs_human_legal_source: false,
    fact_count: pack.facts.length,
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
