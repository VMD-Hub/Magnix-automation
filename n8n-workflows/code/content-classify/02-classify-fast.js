// n8n Code: Classify Fast — rule engine trước LLM (parity uid-ingest)

const RULES = [
  { segment: 'noxh_income', score: 80, interest_key: 'thu_nhap_noxh', patterns: [/thu nhập|lương|vay ngân hàng|vay mua nhà|noxh|nhà ở xã hội|nha o xa hoi|hồ sơ noxh|điều kiện mua noxh/i] },
  { segment: 'valuation', score: 70, interest_key: 'dinh_gia_tham_dinh', patterns: [/định giá|thẩm định|chứng thư|dinh gia|tham dinh/i] },
  { segment: 'sme_credit', score: 75, interest_key: 'room_tin_dung_sme', patterns: [/room tín dụng|room tin dung|doanh nghiệp|\bsme\b|vay doanh nghiệp/i] },
  { segment: 'general_inbound', score: 55, interest_key: 'quan_tam_bds', patterns: [/giá|\bcăn\b|m²|m2|block|dự án|du an|bds|bất động sản|bat dong san|mua nhà|mua nha/i] },
];

function classifyText(text) {
  const t = String(text || '').normalize('NFC').toLowerCase();
  let best = { segment: 'unclassified', score: 0, interest_key: 'unknown', matched: [] };
  for (const rule of RULES) {
    for (const re of rule.patterns) {
      if (re.test(t)) {
        if (rule.score > best.score) {
          best = { segment: rule.segment, score: rule.score, interest_key: rule.interest_key, matched: [re.source] };
        }
        break;
      }
    }
  }
  return best;
}

return $input.all().map((item) => {
  const j = item.json;
  const text = j.text ?? '';
  const result = classifyText(text);
  const needs_llm =
    (result.segment === 'unclassified' && String(text).trim().length > 0) ||
    (result.score >= 40 && result.score <= 59);

  return {
    json: {
      ...j,
      ...result,
      needs_llm,
    },
  };
});
