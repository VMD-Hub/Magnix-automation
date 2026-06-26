// n8n Code: LLM editorial brief (Layer B)

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
        temperature: 0.35,
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
    const model = $env.ANTHROPIC_DRAFT_MODEL || 'claude-sonnet-4-6';
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
        temperature: 0.35,
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
