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
  const res = await invokeMagnixLlm(this, 'classify', {
    system,
    userPayload,
    temperature: 0.2,
    maxTokens: 256,
    jsonMode: true,
  });
  return [{ json: res }];
} catch (e) {
  return [{ json: { error: true, message: e.message } }];
}
