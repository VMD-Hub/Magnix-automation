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
  editorial_brief_v1: editorial,
  intake_v1: intake,
  legal_retrieval_pack: legalPack,
  reference_url: String(row.post_url || '').slice(0, 500),
  requires_legal_qa: requiresLegal,
  listen_score: Number(row.score || 0),
});

try {
  if ($env.DEEPSEEK_API_KEY) {
    const res = await this.helpers.httpRequest({
      method: 'POST',
      url: $env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions',
      headers: {
        Authorization: `Bearer ${$env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: {
        model: $env.DEEPSEEK_MODEL || 'deepseek-chat',
        temperature: 0.4,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userPayload },
        ],
      },
      json: true,
    });
    return [{ json: res }];
  }

  if ($env.ANTHROPIC_API_KEY) {
    const model = $env.ANTHROPIC_VIDEO_MODEL || $env.ANTHROPIC_DRAFT_MODEL || '${ANTHROPIC_VIDEO_MODEL}';
    const res = await this.helpers.httpRequest({
      method: 'POST',
      url: 'https://api.anthropic.com/v1/messages',
      headers: {
        'x-api-key': $env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: {
        model,
        max_tokens: 4096,
        temperature: 0.4,
        system,
        messages: [{ role: 'user', content: userPayload }],
      },
      json: true,
    });
    return [{ json: res }];
  }

  throw new Error('Thiếu DEEPSEEK_API_KEY hoặc ANTHROPIC_API_KEY');
} catch (e) {
  return [{ json: { error: true, message: e.message } }];
}
