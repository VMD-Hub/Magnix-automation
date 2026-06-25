// n8n Code: gọi LLM classify (DeepSeek ưu tiên, fallback Anthropic)

const row = $('Loop Pending Rows').item?.json || $input.first().json;

const system = `Bạn là bộ phận phân loại Magnix (BĐS/tài chính VN).
[/focus] [/silent] Chỉ trả JSON hợp lệ, không markdown:
{"segment":"noxh_income|valuation|sme_credit|general_inbound|unclassified","score":0-100,"interest_key":"snake_case"}
Score: 80+ pain rõ; 60-79 warm; 40-59 mơ hồ; <40 cold/spam`;

let metaObj = {};
try {
  metaObj = row.meta ? JSON.parse(row.meta) : {};
} catch {
  metaObj = {};
}

const userPayload = JSON.stringify({
  post_id: row.post_id,
  platform: row.platform,
  text: String(row.text || '').slice(0, 4000),
  meta: metaObj,
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
        temperature: 0.2,
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
    const model = $env.ANTHROPIC_CLASSIFY_MODEL || 'claude-haiku-4-5-20251001';
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
        max_tokens: 256,
        temperature: 0.2,
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
