// n8n Code: LLM outreach script (Zalo/Messenger)

const row = $('Loop Outreach Candidates').item?.json || $input.first().json;

const system = `Trợ lý Magnix — Value-First outreach. [/ghost] [/brief]
Chỉ trả JSON hợp lệ:
{"segment":"","variant_a_cold":"","variant_b_after_engagement":"","variant_c_follow_up":"","ghost_check_passed":true,"compliance_note":""}
- variant_a_cold: ≤3 dòng, ≤280 ký tự
- variant_b_after_engagement: ≤4 câu
- Cấm: "Trong kỷ nguyên số", "Hơn nữa", "Tóm lại", "cam kết", "Đừng bỏ lỡ"`;

const userPayload = JSON.stringify({
  segment: row.segment || 'general_inbound',
  pain: String(row.hook_line || '').slice(0, 500),
  lead_magnet_title: row.title,
  context: 'cold',
  channel: 'zalo',
  source_normalized_key: row.source_normalized_key,
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
        temperature: 0.5,
        max_tokens: 1024,
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
    const model = $env.ANTHROPIC_DRAFT_MODEL || '${ANTHROPIC_DRAFT_MODEL}';
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
        max_tokens: 1024,
        temperature: 0.5,
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
