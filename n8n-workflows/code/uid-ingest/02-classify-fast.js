// n8n Code node: Classify Fast (regex)
// LLM only when needs_llm === true (score 40–59 or unclassified with text)

const RULES = [
  { segment: 'noxh_income', score: 80, interest_key: 'thu_nhap_noxh', patterns: [/thu nhập|lương|vay ngân hàng|noxh|nhà ở xã hội/i] },
  { segment: 'valuation', score: 70, interest_key: 'dinh_gia_tham_dinh', patterns: [/định giá|thẩm định|chứng thư/i] },
  { segment: 'sme_credit', score: 75, interest_key: 'room_tin_dung_sme', patterns: [/room tín dụng|doanh nghiệp|\bsme\b/i] },
  { segment: 'general_inbound', score: 55, interest_key: 'quan_tam_bds', patterns: [/giá|\bcăn\b|m²|m2|block|dự án/i] },
];

function classifyText(text) {
  const t = (text || '').normalize('NFC').toLowerCase();
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

const items = $input.all();
return items.map((item) => {
  const text = item.json.text ?? '';
  const result = classifyText(text);
  const needs_llm =
    (result.segment === 'unclassified' && text.length > 0) ||
    (result.score >= 40 && result.score <= 59);
  return {
    json: {
      ...item.json,
      ...result,
      needs_llm,
    },
  };
});
