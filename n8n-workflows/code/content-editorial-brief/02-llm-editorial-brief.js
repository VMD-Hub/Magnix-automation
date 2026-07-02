// n8n Code: LLM editorial brief (Layer B)

const CONTEXT_STORE = __CONTEXT_SUMMARIES_JSON__;
const CONTENT_TYPE_RULES = __CONTENT_TYPE_RULES_JSON__;

function resolveEnrichmentContentType(segment, contentType) {
  const types = new Set(['NOXH_LEGAL', 'LOAN_FINANCE', 'VALUATION', 'GENERAL_POLICY']);
  const raw = String(contentType || '').toUpperCase();
  if (types.has(raw)) return raw;
  const map = CONTENT_TYPE_RULES.segment_default || {};
  return map[String(segment || '').toLowerCase()] || 'GENERAL_POLICY';
}

function buildContextEnrichment(segment, contentType) {
  const ct = resolveEnrichmentContentType(segment, contentType);
  const entry = CONTEXT_STORE.by_content_type?.[ct] || {};
  const summary = entry.status === 'ready' ? entry.context_summary : null;
  return {
    content_type: ct,
    context_enrichment_status: summary ? 'ready' : (entry.status || 'waiting_for_context'),
    context_summary: summary,
  };
}

const row = $('Loop Brief Candidates').item?.json || $input.first().json;

const system = `__EDITORIAL_BRIEF_SYSTEM__`;

function normPlatform(raw) {
  const key = String(raw || 'tiktok').trim().toLowerCase();
  const map = {
    tt: 'tiktok',
    fb: 'fb_reels',
    fb_group: 'fb_reels',
    fb_page: 'fb_reels',
    reels: 'fb_reels',
    shorts: 'youtube_shorts',
  };
  return map[key] || key;
}

const legalPack = row.legal_retrieval_pack || null;
const legalGate = row.legal_gate || { required: false, pass: true };
const enrichment = buildContextEnrichment(row.segment, row.meta_parsed?.content_type);

const userPayload = JSON.stringify({
  normalized_key: row.normalized_key,
  platform: row.platform,
  target_platform: normPlatform(row.platform),
  segment: row.segment,
  score: Number(row.score || 0),
  text: String(row.text || '').slice(0, 8000),
  intake_v1: row.intake_v1 || row.meta_parsed?.intake_v1,
  pattern_refs: row.meta_parsed?.pattern_refs || [],
  legal_retrieval_pack: legalPack,
  legal_gate: legalGate,
  requires_legal_kb: legalGate.required === true,
  content_type: enrichment.content_type,
  context_enrichment_status: enrichment.context_enrichment_status,
  context_summary: enrichment.context_summary,
});

try {
  const res = await invokeMagnixLlm(this, 'editorial_brief', {
    system,
    userPayload,
    temperature: 0.35,
    maxTokens: 4096,
    jsonMode: true,
  });
  return [{ json: res }];
} catch (e) {
  return [{ json: { error: true, message: e.message } }];
}
