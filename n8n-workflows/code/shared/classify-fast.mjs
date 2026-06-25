/**
 * CLASSIFY_FAST — dùng chung batch script + Agent 2 n8n
 * Rule engine trước LLM (ARCHITECTURE §3.1, uid-ingest parity)
 */

export const RULES = [
  {
    segment: 'noxh_income',
    score: 80,
    interest_key: 'thu_nhap_noxh',
    patterns: [
      /thu nhập|lương|vay ngân hàng|vay mua nhà|noxh|nhà ở xã hội|nha o xa hoi|hồ sơ noxh|điều kiện mua noxh/i,
    ],
  },
  {
    segment: 'valuation',
    score: 70,
    interest_key: 'dinh_gia_tham_dinh',
    patterns: [/định giá|thẩm định|chứng thư|dinh gia|tham dinh/i],
  },
  {
    segment: 'sme_credit',
    score: 75,
    interest_key: 'room_tin_dung_sme',
    patterns: [/room tín dụng|room tin dung|doanh nghiệp|\bsme\b|vay doanh nghiệp/i],
  },
  {
    segment: 'general_inbound',
    score: 55,
    interest_key: 'quan_tam_bds',
    patterns: [/giá|\bcăn\b|m²|m2|block|dự án|du an|bds|bất động sản|bat dong san|mua nhà|mua nha/i],
  },
];

export function classifyText(text) {
  const t = String(text || '')
    .normalize('NFC')
    .toLowerCase();
  let best = { segment: 'unclassified', score: 0, interest_key: 'unknown', matched: [] };

  for (const rule of RULES) {
    for (const re of rule.patterns) {
      if (re.test(t)) {
        if (rule.score > best.score) {
          best = {
            segment: rule.segment,
            score: rule.score,
            interest_key: rule.interest_key,
            matched: [re.source],
          };
        }
        break;
      }
    }
  }
  return best;
}

export function classifyContentRow({ text, meta = {} }) {
  const result = classifyText(text);
  const needs_llm =
    (result.segment === 'unclassified' && String(text || '').trim().length > 0) ||
    (result.score >= 40 && result.score <= 59);

  let status = 'raw';
  let claude_verdict = 'pending';

  if (result.segment !== 'unclassified') {
    status = result.score >= 60 ? 'classified' : 'review';
    claude_verdict = result.score >= 70 ? 'qualified' : 'maybe';
  }

  return {
    ...result,
    needs_llm,
    status,
    claude_verdict,
    classify_method: 'regex',
    tags: result.segment !== 'unclassified' ? result.segment : 'unclassified',
    meta_patch: {
      classify_method: 'regex',
      classify_matched: result.matched,
      classified_at: new Date().toISOString(),
      needs_llm,
      engagement: meta?.engagement || null,
    },
  };
}

export function mergeMeta(existingMeta, patch) {
  let base = {};
  if (typeof existingMeta === 'string' && existingMeta.trim()) {
    try {
      base = JSON.parse(existingMeta);
    } catch {
      base = { raw_meta: existingMeta.slice(0, 500) };
    }
  } else if (existingMeta && typeof existingMeta === 'object') {
    base = { ...existingMeta };
  }
  return JSON.stringify({ ...base, ...patch }).slice(0, 50000);
}
