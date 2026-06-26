/**
 * Legal Retrieval Pack — Layer K (Magnix)
 * Loads atomic claims + Q&A from legal-sources/; filters by topic, province, intent.
 * See docs/LEGAL_KB_ARCHITECTURE.md §3.4
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');
const LEGAL_ROOT = join(REPO_ROOT, 'legal-sources');

const CLAIM_FILES = [
  'noxh/atomic-claims.nd100.json',
  'noxh/atomic-claims.batch2.json',
  'noxh/atomic-claims.batch3.json',
  'noxh/atomic-claims.application-form.json',
  'noxh/atomic-claims.loan.json',
];

const QA_FILES = [
  'noxh/qa-knowledge.nd100.json',
  'noxh/qa-knowledge.batch2.json',
  'noxh/qa-knowledge.batch3.json',
  'noxh/qa-knowledge.application-form.json',
  'noxh/qa-knowledge.loan.json',
];

const PROVINCE_ALIASES = {
  tp_ho_chi_minh: ['tp hcm', 'hcm', 'ho chi minh', 'tp.hcm', 'sài gòn', 'sai gon', 'tphcm'],
  dong_nai: ['dong nai', 'đồng nai', 'bien hoa', 'biên hòa'],
  binh_duong: ['binh duong', 'bình dương', 'thu dau mot', 'thủ dầu một'],
  ba_ria_vung_tau: ['ba ria', 'vung tau', 'vũng tàu', 'br-vt', 'brvt', 'ba ria vung tau'],
  tp_can_tho: ['can tho', 'cần thơ'],
  tay_ninh: ['tay ninh', 'tây ninh'],
  long_an: ['long an', 'long an'],
  binh_phuoc: ['binh phuoc', 'bình phước', 'dong xoai', 'đồng xoài'],
  hau_giang: ['hau giang', 'hậu giang', 'vi thanh', 'vị thanh'],
  soc_trang: ['soc trang', 'sóc trăng'],
};

/** @type {Record<string, string>} province_code → merger_group_id */
const MERGER_GROUP_BY_PROVINCE = {
  tp_ho_chi_minh: 'mega_hcm',
  binh_duong: 'mega_hcm',
  ba_ria_vung_tau: 'mega_hcm',
  tay_ninh: 'mega_tay_ninh',
  long_an: 'mega_tay_ninh',
  dong_nai: 'mega_dong_nai',
  binh_phuoc: 'mega_dong_nai',
  tp_can_tho: 'mega_can_tho',
  hau_giang: 'mega_can_tho',
  soc_trang: 'mega_can_tho',
};

function loadJson(relPath) {
  const abs = join(LEGAL_ROOT, relPath);
  if (!existsSync(abs)) return [];
  return JSON.parse(readFileSync(abs, 'utf8'));
}

function loadAllClaims() {
  return CLAIM_FILES.flatMap((f) => loadJson(f));
}

function loadAllQa() {
  return QA_FILES.flatMap((f) => loadJson(f));
}

/**
 * @param {string} text
 * @returns {string|null}
 */
export function detectProvinceCode(text) {
  if (!text) return null;
  const t = text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
  for (const [code, aliases] of Object.entries(PROVINCE_ALIASES)) {
    for (const a of aliases) {
      const norm = a.normalize('NFD').replace(/\p{M}/gu, '');
      if (t.includes(norm)) return code;
    }
  }
  return null;
}

/**
 * @param {object} claim
 * @param {string} [asOf] ISO date YYYY-MM-DD
 */
export function isClaimEffective(claim, asOf) {
  if (!asOf) return true;
  const from = claim.effective_from;
  const to = claim.effective_to;
  if (from && asOf < from) return false;
  if (to && asOf > to) return false;
  return true;
}

/**
 * @param {object} opts
 * @param {string} [opts.topic]
 * @param {string} [opts.province_code]
 * @param {string} [opts.intent]
 * @param {string} [opts.as_of] YYYY-MM-DD
 * @param {number} [opts.max_facts=7]
 */
export function buildLegalRetrievalPack(opts = {}) {
  const {
    topic,
    province_code,
    intent = 'short_legal_explainer',
    as_of,
    max_facts = 7,
  } = opts;

  const allClaims = loadAllClaims();
  const forbidden = new Set();
  const facts = [];

  const scored = allClaims
    .filter((c) => isClaimEffective(c, as_of))
    .filter((c) => {
      if (!province_code) return true;
      if (!c.province_code) return true;
      return c.province_code === province_code;
    })
    .map((c) => {
      let score = 0;
      if (topic && c.topic === topic) score += 3;
      if (province_code && c.province_code === province_code) score += 5;
      if (province_code && !c.province_code && c.topic !== 'local_policy') score += 1;
      if (topic === 'local_policy' && c.topic === 'local_policy' && !province_code) score += 1;
      return { c, score };
    })
    .filter(({ score, c }) => {
      if (!topic && !province_code) return true;
      if (score > 0) return true;
      if (topic && c.topic === topic) return true;
      return false;
    })
    .sort((a, b) => b.score - a.score);

  for (const { c } of scored) {
    if (facts.length >= max_facts) break;
    if (facts.some((f) => f.claim_id === c.claim_id)) continue;
    facts.push({
      claim_id: c.claim_id,
      claim: c.claim,
      source_refs: c.source_refs || [],
      usage_rule: (c.usage_rules && c.usage_rules[0]) || 'Không kết luận chắc chắn đủ điều kiện.',
      risk_level: c.risk_level || 'medium',
    });
    (c.forbidden_claims || []).forEach((fc) => forbidden.add(fc));
  }

  const hasProvinceClaim = province_code
    && facts.some((f) => {
      const claim = allClaims.find((c) => c.claim_id === f.claim_id);
      return claim?.province_code === province_code;
    });

  const needsHuman =
    facts.length === 0
    || (topic === 'local_policy' && province_code && !hasProvinceClaim);

  const pack = {
    topic: topic || 'noxh_eligibility',
    intent,
    province_code: province_code || null,
    merger_group_id: province_code ? (MERGER_GROUP_BY_PROVINCE[province_code] || null) : null,
    project_jurisdiction_note: province_code
      ? 'Áp QĐ theo tỉnh/TP của dự án NOXH — xem counseling_project_province_jurisdiction_001'
      : 'Cần xác định tỉnh dự án trước khi tra QĐ địa phương',
    as_of: as_of || null,
    facts,
    forbidden_claims: [...forbidden].slice(0, 12),
    disclaimer_required: true,
    needs_human_legal_source: needsHuman && topic === 'local_policy',
  };

  if (pack.facts.length === 0) {
    pack.needs_human_legal_source = true;
  }

  return pack;
}

/**
 * Match Q&A entries for AIO / brief enrichment.
 * @param {object} opts
 * @param {string} [opts.topic]
 * @param {string} [opts.province_code]
 * @param {number} [opts.limit=3]
 */
export function retrieveQaHints(opts = {}) {
  const { topic, province_code, limit = 3 } = opts;
  const all = loadAllQa();
  return all
    .filter((q) => {
      if (topic && q.topic !== topic) return false;
      if (province_code && q.province_code && q.province_code !== province_code) return false;
      return true;
    })
    .slice(0, limit)
    .map((q) => ({
      qa_id: q.qa_id,
      question: q.question,
      short_answer: q.short_answer,
      source_refs: q.source_refs,
    }));
}

/**
 * One-shot: topic + optional province from free text.
 */
export function buildPackFromQuery(query, options = {}) {
  const province_code = options.province_code || detectProvinceCode(query);
  let topic = options.topic;
  if (!topic) {
    const q = (query || '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
    if (/thu nhap|luong|trieu/.test(q)) topic = province_code ? 'local_policy' : 'noxh_income';
    else if (/vneid|cccd|cu tru|cu trú|ho khau|hộ khẩu|ct07|xac nhan cu tru|xác nhận cư trú|mau ct07|mẫu ct07|thanh vien ho|thành viên hộ|ly lich|lý lịch|lltp|tu phap|tư pháp|sao y|chung thuc|chứng thực|viet tay|viết tay|noi cap|nơi cấp|xuong dong|xuống dòng|mau dien|mẫu điền|dien mau|điền mẫu/.test(q)) topic = 'noxh_documents';
    else if (/nghi huu|nghỉ hưu|het tuoi|hết tuổi|lao dong|lao động|ve huu|về hưu|luong huu|lương hưu/.test(q)) topic = 'noxh_eligibility';
    else if (/con tren 18|con trên 18|tach ho|tách hộ|ho khau con|thu nhap con|thu nhập con/.test(q)) topic = 'noxh_income';
    else if (/vo chong khac|vợ chồng khác|khac nhom|khác nhóm|dung don|đứng đơn/.test(q)) topic = 'noxh_eligibility';
    else if (/bo ho so|bộ hồ sơ|may bo|mấy bộ|photo|ban sao|bản sao|3 bo|4 bo/.test(q)) topic = 'noxh_documents';
    else if (/vay|lai suat|dti|nhcsxh|ngan hang chinh sach|ho tro.*(lai|vay)|5[,.]4|cic|no xau|diem tin dung|room tin dung|phan loai no|tra cuu cic|kiem tra cic/.test(q)) topic = 'loan_dti';
    else if (/ho so|dang ky|online/.test(q)) topic = 'noxh_online_submission';
    else if (/ban lai|chuyen nhuong/.test(q)) topic = 'noxh_transfer_restrictions';
    else topic = 'noxh_eligibility';
  }
  const pack = buildLegalRetrievalPack({ ...options, topic, province_code });
  pack.qa_hints = retrieveQaHints({ topic, province_code, limit: 2 });
  return pack;
}
