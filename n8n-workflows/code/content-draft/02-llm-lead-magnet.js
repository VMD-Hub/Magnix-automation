// n8n Code: LLM lead magnet draft (Anthropic / DeepSeek)

const row = $('Loop Draft Candidates').item?.json || $input.first().json;

const system = `Growth Copywriter Magnix — Value-First Hook.
[/matrix] [/artifacts] [/deconstruct]
Chỉ trả JSON hợp lệ, không markdown bọc ngoài:
{"title":"","hook_line":"","segment":"","artifact_markdown":"","source_refs":[],"cta_opt_in":"","disclaimer":"","export_hint":"pdf|excel|both"}
- hook_line ≤25 từ
- artifact_markdown: ≥1 bảng Markdown so sánh
- Không cam kết lãi suất cụ thể, không hứa duyệt vay`;

const segment = String(row.segment || 'general_inbound');
const pain = String(row.text || '').slice(0, 2000);
const assetMap = {
  noxh_income: 'checklist_ho_so_noxh',
  valuation: 'checklist_tham_dinh',
  sme_credit: 'checklist_vay_dn',
  general_inbound: 'checklist_mua_nha',
};
const userPayload = JSON.stringify({
  segment,
  pain,
  asset_type: assetMap[segment] || 'checklist',
  angle: 'pain_from_social_listen',
  reference_url_or_text: String(row.post_url || '').slice(0, 500),
  requires_legal_qa: ['noxh_income', 'valuation', 'sme_credit'].includes(segment),
  interest_key: row.interest_key || '',
  source_normalized_key: row.normalized_key,
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
