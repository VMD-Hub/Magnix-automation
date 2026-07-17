// Shared legal_retrieval_pack contract validator — inlined into n8n Code nodes.

const LEGAL_PACK_READY_STATUSES = new Set(['active', 'ready', 'verified']);

function validateLegalPack(pack) {
  const errors = [];

  if (!pack || typeof pack !== 'object' || Array.isArray(pack)) {
    return {
      valid: false,
      status: 'blocked',
      errors: ['MISSING_LEGAL_PACK'],
      fact_count: 0,
    };
  }

  if (pack.needs_human_legal_source === true) {
    errors.push('NEEDS_HUMAN_LEGAL_SOURCE');
  } else if (pack.needs_human_legal_source !== false) {
    errors.push('MISSING_NEEDS_HUMAN_STATUS');
  }

  if (
    pack.status != null
    && !LEGAL_PACK_READY_STATUSES.has(String(pack.status).trim().toLowerCase())
  ) {
    errors.push('LEGAL_PACK_STATUS_NOT_READY');
  }

  const facts = Array.isArray(pack.facts) ? pack.facts : [];
  if (facts.length === 0) {
    errors.push('EMPTY_LEGAL_FACTS');
  }

  const seenClaimIds = new Set();
  for (const fact of facts) {
    const claimId = String(fact?.claim_id || '').trim();
    if (!claimId) {
      errors.push('FACT_MISSING_CLAIM_ID');
    } else if (seenClaimIds.has(claimId)) {
      errors.push('DUPLICATE_CLAIM_ID');
    } else {
      seenClaimIds.add(claimId);
    }

    const refs = Array.isArray(fact?.source_refs)
      ? fact.source_refs.map((ref) => String(ref || '').trim()).filter(Boolean)
      : [];
    if (refs.length === 0) errors.push('FACT_MISSING_SOURCE_REFS');
  }

  const forbidden = Array.isArray(pack.forbidden_claims)
    ? pack.forbidden_claims.map((claim) => String(claim || '').trim()).filter(Boolean)
    : [];
  if (forbidden.length === 0) errors.push('MISSING_FORBIDDEN_CLAIMS');

  if (pack.disclaimer_required !== true) {
    errors.push('DISCLAIMER_REQUIRED_NOT_TRUE');
  }

  const uniqueErrors = [...new Set(errors)];
  return {
    valid: uniqueErrors.length === 0,
    status: uniqueErrors.length === 0 ? 'ready' : 'blocked',
    errors: uniqueErrors,
    fact_count: facts.length,
    claim_ids: [...seenClaimIds],
    source_ref_count: facts.reduce(
      (count, fact) => count + (
        Array.isArray(fact?.source_refs)
          ? fact.source_refs.map((ref) => String(ref || '').trim()).filter(Boolean).length
          : 0
      ),
      0,
    ),
  };
}
