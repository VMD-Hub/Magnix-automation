// n8n Code: LLM outreach script (Zalo/Messenger)
// resolveOutreachContext() — prepended từ code/shared/resolve-outreach-context.js lúc build

const row = $('Loop Outreach Candidates').item?.json || $input.first().json;
const { warmth, context } = resolveOutreachContext(row);

const system = `Trợ lý Magnix — Value-First outreach. [/ghost] [/brief]
Chỉ trả JSON hợp lệ:
{"segment":"","variant_a_cold":"","variant_b_after_engagement":"","variant_c_follow_up":"","ghost_check_passed":true,"compliance_note":""}
- variant_a_cold: ≤3 dòng, ≤280 ký tự (cold open)
- variant_b_after_engagement: ≤4 câu (sau comment/DM/opt-in)
- variant_c_follow_up: nhẹ, thoát gracefully
- context=${context}: ưu tiên biến thể phù hợp context nhưng vẫn sinh đủ 3 variant
- Cấm: "Trong kỷ nguyên số", "Hơn nữa", "Tóm lại", "cam kết", "Đừng bỏ lỡ"`;

const userPayload = JSON.stringify({
  segment: row.segment || 'general_inbound',
  pain: String(row.hook_line || '').slice(0, 500),
  lead_magnet_title: row.title,
  context,
  warmth,
  channel: 'zalo',
  source_normalized_key: row.source_normalized_key,
});

try {
  const res = await invokeMagnixLlm(this, 'outreach', {
    system,
    userPayload,
    temperature: 0.5,
    maxTokens: 1024,
    jsonMode: true,
  });
  return [{ json: { ...res, outreach_warmth: warmth, outreach_context: context } }];
} catch (e) {
  return [{ json: { error: true, message: e.message } }];
}
