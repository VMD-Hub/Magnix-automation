// Shared legal gate config — inlined into n8n Code nodes (no imports).

/** Segments that must have legal_retrieval_pack before content production */
const SEGMENTS_REQUIRING_LEGAL_KB = new Set([
  'noxh_income',
  'valuation',
  'sme_credit',
]);

/** Magnix classify segment → legal-sources topic */
const SEGMENT_TO_LEGAL_TOPIC = {
  noxh_income: 'noxh_income',
  valuation: 'valuation_certificate',
  sme_credit: 'loan_dti',
};

const DEFAULT_FORBIDDEN = [
  'Cam kết duyệt',
  'Chắc chắn mua được',
  'Lãi suất cố định áp dụng cho tất cả',
  '100% thành công',
];

function segmentRequiresLegalKb(segment) {
  return SEGMENTS_REQUIRING_LEGAL_KB.has(String(segment || '').trim().toLowerCase());
}

function segmentToLegalTopic(segment) {
  const key = String(segment || '').trim().toLowerCase();
  return SEGMENT_TO_LEGAL_TOPIC[key] || null;
}

function detectProvinceFromText(text) {
  const t = String(text || '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
  const aliases = {
    tp_ho_chi_minh: ['tp hcm', 'hcm', 'ho chi minh', 'tphcm', 'sai gon'],
    dong_nai: ['dong nai', 'bien hoa'],
    binh_duong: ['binh duong', 'thu dau mot'],
    ba_ria_vung_tau: ['vung tau', 'ba ria'],
    tp_can_tho: ['can tho'],
  };
  for (const [code, list] of Object.entries(aliases)) {
    for (const a of list) {
      if (t.includes(a.normalize('NFD').replace(/\p{M}/gu, ''))) return code;
    }
  }
  return null;
}
