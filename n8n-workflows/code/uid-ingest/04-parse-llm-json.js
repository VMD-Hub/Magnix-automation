// n8n Code node: Parse LLM JSON (after HTTP LLM node) — không emit uid vào error branch

const SEGMENTS = new Set([
  'noxh_income', 'valuation', 'sme_credit', 'general_inbound', 'unclassified',
]);

function extractJsonString(raw) {
  if (raw == null) throw new Error('EMPTY_LLM_OUTPUT');
  const s = typeof raw === 'string' ? raw : JSON.stringify(raw);
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (fenced ? fenced[1] : s).trim();
}

function parseLlmJson(raw) {
  const parsed = JSON.parse(extractJsonString(raw));
  if (parsed == null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('JSON_NOT_OBJECT');
  }
  return parsed;
}

function validateClassify(obj) {
  if (!SEGMENTS.has(obj.segment)) throw new Error('INVALID_SEGMENT');
  const score = Number(obj.score);
  if (!Number.isFinite(score) || score < 0 || score > 100) throw new Error('INVALID_SCORE');
  if (typeof obj.interest_key !== 'string' || !obj.interest_key) {
    throw new Error('INVALID_INTEREST_KEY');
  }
  return { segment: obj.segment, score, interest_key: obj.interest_key };
}

const skeleton = $('Auth & Enrich Skeleton').first().json;
const nk = String(skeleton?.normalized_key || '').trim();

const res = $input.first().json;
const raw =
  res.choices?.[0]?.message?.content ??
  res.message?.content ??
  res.text ??
  res.output ??
  res;

try {
  const parsed = parseLlmJson(raw);
  const classify = validateClassify(parsed);
  return [{ json: { ok: true, classify, classify_method: 'llm', parse_error: null } }];
} catch (e) {
  return [{
    json: {
      ok: false,
      classify: null,
      classify_method: 'llm',
      parse_error: e.message,
      raw_preview: String(raw).slice(0, 200),
      normalized_key: nk || null,
    },
  }];
}
