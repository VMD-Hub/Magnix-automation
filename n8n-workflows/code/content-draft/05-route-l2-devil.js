// n8n Code: route L2 /devil — segment pháp lý hoặc content_type legal (QA_TIERS.md)

const LEGAL_SEGMENTS = new Set(['noxh_income', 'valuation', 'sme_credit']);
const LEGAL_CONTENT_TYPES = new Set(['NOXH_LEGAL', 'LOAN_FINANCE', 'VALUATION']);

const item = $input.first().json;
const source = $('Loop Draft Candidates').item?.json || {};

if (!item.l0_pass || !item.draft) {
  return [{ json: { ...item, needs_l2_devil: false, l2_skip_reason: 'NO_DRAFT' } }];
}

const segment = String(item.draft.segment || source.segment || '').trim().toLowerCase();
const contentType = String(item.draft.content_type || item.disclaimer_injection?.content_type || '').trim().toUpperCase();
const meta = source.meta_parsed || {};

const needs_l2_devil =
  LEGAL_CONTENT_TYPES.has(contentType)
  || LEGAL_SEGMENTS.has(segment)
  || item.requires_legal_review === true
  || meta.requires_legal_qa === true;

return [{
  json: {
    ...item,
    needs_l2_devil,
    l2_segment: segment,
    l2_content_type: contentType || null,
    l2_legal_pack: source.legal_retrieval_pack || meta.legal_retrieval_pack || null,
    editorial_brief_v1: source.editorial_brief_v1 || meta.editorial_brief_v1 || null,
  },
}];
