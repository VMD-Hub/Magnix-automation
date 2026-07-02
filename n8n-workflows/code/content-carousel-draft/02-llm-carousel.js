// n8n Code: LLM carousel draft — Agent 3b

const CAROUSEL_CFG = __CAROUSEL_TEMPLATES_JSON__;

const row = $('Loop Carousel Candidates').item?.json || $input.first().json;
const system = `__CAROUSEL_DRAFT_SYSTEM__`;

const segment = String(row.segment || 'noxh_income');
const editorial = row.editorial_brief_v1 || row.meta_parsed?.editorial_brief_v1;
const legalPack =
  row.legal_retrieval_pack
  || editorial?.legal_retrieval_pack
  || row.meta_parsed?.legal_retrieval_pack
  || null;

if (!editorial) {
  return [{ json: { error: true, message: 'MISSING_EDITORIAL_BRIEF' } }];
}

const requiresLegal = ['noxh_income', 'valuation', 'sme_credit'].includes(segment);
if (requiresLegal && (!legalPack || legalPack.needs_human_legal_source === true)) {
  return [{ json: { error: true, message: 'MISSING_OR_BLOCKED_LEGAL_PACK' } }];
}

const userPayload = JSON.stringify({
  normalized_key: row.normalized_key,
  segment,
  format_type: 'carousel',
  product_type: 'carousel_image',
  editorial_brief_v1: editorial,
  legal_retrieval_pack: legalPack,
  cta_keyword: row.meta_parsed?.cta_keyword || editorial.cta_keyword || 'CHECKLIST',
  slide_count_target: CAROUSEL_CFG.slide_count_max || 6,
  reference_url: String(row.post_url || '').slice(0, 500),
});

try {
  const res = await invokeMagnixLlm(this, 'carousel_draft', {
    system,
    userPayload,
    temperature: 0.4,
    maxTokens: 4096,
    jsonMode: true,
  });
  return [{ json: res }];
} catch (e) {
  return [{ json: { error: true, message: e.message } }];
}
