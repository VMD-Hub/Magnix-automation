// n8n Code: parse outreach JSON

function extractJsonString(raw) {
  if (raw == null) throw new Error('EMPTY_LLM_OUTPUT');
  const s = typeof raw === 'string' ? raw : JSON.stringify(raw);
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (fenced ? fenced[1] : s).trim();
}

const res = $input.first().json;
const raw =
  res.choices?.[0]?.message?.content ??
  res.content?.[0]?.text ??
  res.message?.content ??
  res;

try {
  const parsed = JSON.parse(extractJsonString(raw));
  const required = ['segment', 'variant_a_cold', 'variant_b_after_engagement', 'variant_c_follow_up'];
  for (const k of required) {
    if (!parsed[k] || !String(parsed[k]).trim()) throw new Error(`MISSING_${k.toUpperCase()}`);
  }
  return [{
    json: {
      ok: true,
      outreach: {
        segment: String(parsed.segment),
        variant_a_cold: String(parsed.variant_a_cold).slice(0, 500),
        variant_b_after_engagement: String(parsed.variant_b_after_engagement).slice(0, 1500),
        variant_c_follow_up: String(parsed.variant_c_follow_up).slice(0, 1000),
        ghost_check_passed: parsed.ghost_check_passed !== false,
        compliance_note: String(parsed.compliance_note || '').slice(0, 500),
      },
    },
  }];
} catch (e) {
  return [{ json: { ok: false, parse_error: e.message, raw_preview: String(raw).slice(0, 200) } }];
}
