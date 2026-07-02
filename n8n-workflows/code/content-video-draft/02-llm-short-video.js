// n8n Code: LLM production brief (Layer C) — Agent 6

const row = $('Loop Video Candidates').item?.json || $input.first().json;

const system = `__PRODUCTION_BRIEF_SYSTEM__`;

const segment = String(row.segment || 'general_inbound');
const platform = String(row.target_platform || row.platform || 'tiktok');
const editorial = row.editorial_brief_v1 || row.meta_parsed?.editorial_brief_v1;
const intake = row.intake_v1 || row.meta_parsed?.intake_v1;
const legalPack =
  row.legal_retrieval_pack
  || editorial?.legal_retrieval_pack
  || row.meta_parsed?.legal_retrieval_pack
  || null;

if (!editorial || !intake) {
  return [{ json: { error: true, message: 'MISSING_EDITORIAL_OR_INTAKE' } }];
}

const requiresLegal = ['noxh_income', 'valuation', 'sme_credit'].includes(segment);
if (requiresLegal && (!legalPack || legalPack.needs_human_legal_source === true)) {
  return [{ json: { error: true, message: 'MISSING_OR_BLOCKED_LEGAL_PACK' } }];
}

const userPayload = JSON.stringify({
  normalized_key: row.normalized_key,
  platform,
  segment,
  format_type: 'video_script',
  editorial_brief_v1: editorial,
  intake_v1: intake,
  legal_retrieval_pack: legalPack,
  reference_url: String(row.post_url || '').slice(0, 500),
  requires_legal_qa: requiresLegal,
  listen_score: Number(row.score || 0),
  target_length_seconds: 30,
});

try {
  const res = await invokeMagnixLlm(this, 'video_draft', {
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
