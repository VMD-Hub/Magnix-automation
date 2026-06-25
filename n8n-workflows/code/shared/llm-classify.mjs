/**
 * LLM classify — parse + validate (parity uid-ingest / JSON_PARSE_LAYER)
 */

export const SEGMENTS = new Set([
  'noxh_income',
  'valuation',
  'sme_credit',
  'general_inbound',
  'unclassified',
]);

export function extractJsonString(raw) {
  if (raw == null) throw new Error('EMPTY_LLM_OUTPUT');
  const s = typeof raw === 'string' ? raw : JSON.stringify(raw);
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (fenced ? fenced[1] : s).trim();
}

export function parseLlmClassify(raw) {
  const parsed = JSON.parse(extractJsonString(raw));
  if (parsed == null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('JSON_NOT_OBJECT');
  }
  if (!SEGMENTS.has(parsed.segment)) throw new Error('INVALID_SEGMENT');
  const score = Number(parsed.score);
  if (!Number.isFinite(score) || score < 0 || score > 100) throw new Error('INVALID_SCORE');
  if (typeof parsed.interest_key !== 'string' || !parsed.interest_key) {
    throw new Error('INVALID_INTEREST_KEY');
  }
  return {
    segment: parsed.segment,
    score,
    interest_key: parsed.interest_key,
  };
}

export const CLASSIFY_SYSTEM = `Bạn là bộ phận phân loại Magnix (BĐS/tài chính VN).
[/focus] [/silent] Chỉ trả JSON hợp lệ, không markdown:
{"segment":"noxh_income|valuation|sme_credit|general_inbound|unclassified","score":0-100,"interest_key":"snake_case"}
- noxh_income: thu nhập, vay NOXH, hồ sơ mua nhà xã hội
- valuation: định giá, thẩm định
- sme_credit: room tín dụng DN
- general_inbound: BĐS chung
- unclassified: ngoài ngách hoặc spam
Score: 80+ pain rõ; 60-79 warm; 40-59 mơ hồ; <40 cold/spam`;

export function applyLlmClassify(existingMeta, classify) {
  let status = 'classified';
  let claude_verdict = 'qualified';
  if (classify.segment === 'unclassified' || classify.score < 40) {
    status = 'raw';
    claude_verdict = 'reject';
  } else if (classify.score < 60) {
    status = 'review';
    claude_verdict = 'maybe';
  } else if (classify.score < 70) {
    claude_verdict = 'maybe';
  }

  let base = {};
  if (typeof existingMeta === 'string' && existingMeta.trim()) {
    try {
      base = JSON.parse(existingMeta);
    } catch {
      base = {};
    }
  }

  const meta = JSON.stringify({
    ...base,
    classify_method: 'llm',
    classified_at: new Date().toISOString(),
    needs_llm: false,
  }).slice(0, 50000);

  return {
    segment: classify.segment,
    score: classify.score,
    interest_key: classify.interest_key,
    status,
    claude_verdict,
    tags: classify.segment !== 'unclassified' ? classify.segment : 'unclassified',
    meta,
  };
}
