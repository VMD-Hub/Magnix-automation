/**
 * NOXH Application Form Draft — hỗ trợ tư vấn điền Mẫu 01 từ intake (không lưu PII).
 * Xem legal-sources/noxh/application-form-mau-01-guide.md
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildLegalRetrievalPack } from './legal-retrieval-pack.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LEGAL_ROOT = join(__dirname, '..', '..', 'legal-sources');

const LOCAL_POLICY_REGISTRY = join(LEGAL_ROOT, 'local-policy', 'registry.json');

const DISTANCE_RULE_PROVINCES = new Set([
  'dong_nai',
  'tay_ninh',
]);

const INCOME_COEFFICIENT_PROVINCES = {
  tp_ho_chi_minh: { base: [25, 35, 50], coeff: 1.25, coeff_3deps: 1.35 },
};

function loadRegistry() {
  if (!existsSync(LOCAL_POLICY_REGISTRY)) return { sources: [] };
  return JSON.parse(readFileSync(LOCAL_POLICY_REGISTRY, 'utf8'));
}

/**
 * @param {object} intake — theo registration-intake-schema.json (không cần đủ field)
 * @param {object} [opts]
 * @param {string} [opts.as_of] YYYY-MM-DD
 */
export function buildApplicationCounselingPack(intake = {}, opts = {}) {
  const as_of = opts.as_of || new Date().toISOString().slice(0, 10);
  const province = intake.project_province_code || null;

  const legalPack = buildLegalRetrievalPack({
    topic: 'noxh_documents',
    province_code: province,
    as_of,
    max_facts: 8,
  });

  const warnings = [];
  const checklist = [];
  const section_guidance = [];

  if (!province) {
    warnings.push({
      code: 'missing_project_province',
      message: 'Chưa xác định tỉnh dự án — không thể hướng dẫn QĐ địa phương và mục nhà ở.',
      severity: 'block',
    });
  }

  if (intake.has_other_noxh_registration === true) {
    warnings.push({
      code: 'dual_registration',
      message: 'Không được đăng ký đồng thời nhiều dự án (NĐ 54 Đ.38).',
      severity: 'block',
    });
  }

  // Phần C — đối tượng
  const clause = intake.article_76_clause;
  if (clause === 'k5_hdld') {
    section_guidance.push({
      section: 'C_doi_tuong',
      action: 'Tick khoản 5 Đ.76 — có HĐLĐ',
      explain: 'Chuẩn bị Bảng tiền công, tiền lương do đơn vị nơi làm việc xác nhận.',
      attachments: ['bang_tien_cong_don_vi'],
    });
  } else if (clause === 'k8_no_hdld') {
    section_guidance.push({
      section: 'C_doi_tuong',
      action: 'Tick khoản 8 Đ.76 — không HĐLĐ',
      explain: 'Đơn đề nghị xác nhận tại Công an cấp xã; kê khai cam kết thu nhập (NĐ 54).',
      attachments: ['don_cong_an_cap_xa'],
    });
  } else if (clause === 'k7_llvt') {
    section_guidance.push({
      section: 'C_doi_tuong',
      action: 'Tick khoản 7 Đ.76 — lực lượng vũ trang',
      explain: 'Thu nhập theo Đ.67 NĐ 100 (NĐ 136) — trần Đại tá, công thức vợ/chồng riêng.',
      attachments: ['xac_nhan_co_quan_llvt'],
    });
  }

  // Phần D — nhà ở
  const housing = intake.housing_path;
  if (housing === 'chua_co_nha_gcn' || housing === 'dat_tho_cu_chua_xay') {
    section_guidance.push({
      section: 'D_nha_o',
      action: 'Khai chưa có nhà ở tại tỉnh dự án',
      explain: housing === 'dat_tho_cu_chua_xay'
        ? 'GCN chỉ ghi đất ở, không ghi nhà — xin xác nhận cơ quan cấp GCN (NĐ 54).'
        : 'Không có tên / không có thông tin nhà ở trên GCN tại tỉnh dự án.',
      attachments: ['xac_nhan_chua_co_nha'],
    });
  } else if (housing === 'co_nha_xa_noi_lam_viec') {
    const hasRule = province && DISTANCE_RULE_PROVINCES.has(province);
    section_guidance.push({
      section: 'D_nha_o',
      action: hasRule
        ? 'Khai có nhà xa nơi làm việc theo QĐ tỉnh dự án'
        : 'Cần xác minh QĐ tỉnh dự án trước khi khai mục này',
      explain: hasRule
        ? 'Đồng Nai/Tây Ninh: ≥20 km nhà→nơi làm việc (không phải cách dự án); kèm xác nhận đơn vị.'
        : 'Tỉnh dự án chưa ghi nhận QĐ NQ 201 Đ.9 k2 trong KB — không tư vấn chắc.',
      attachments: hasRule ? ['xac_nhan_don_vi_khoang_cach'] : [],
    });
    if (!hasRule) {
      warnings.push({
        code: 'no_local_distance_rule',
        message: `Tỉnh ${province} chưa có QĐ 20 km trong KB — cân nhắc con đường chưa có nhà hoặc <15 m².`,
        severity: 'review',
      });
    }
    if (intake.employer_confirmation_available === false) {
      warnings.push({
        code: 'missing_employer_confirm',
        message: 'Thiếu xác nhận đơn vị nơi làm việc — không đủ Đ.4 k3 (Đồng Nai) / QĐ tương tự.',
        severity: 'block',
      });
    }
  }

  // Phần E — thu nhập
  const marital = intake.marital_status;
  let incomeCaps = [25, 35, 50];
  if (province && INCOME_COEFFICIENT_PROVINCES[province]) {
    const c = INCOME_COEFFICIENT_PROVINCES[province];
    incomeCaps = c.base.map((x) => x * c.coeff);
  }
  const capMap = {
    doc_than: incomeCaps[0],
    doc_than_nuoi_con: incomeCaps[1],
    vo_chong: incomeCaps[2],
  };
  if (marital && capMap[marital]) {
    section_guidance.push({
      section: 'E_thu_nhap',
      action: `So sánh thu nhập với trần ${capMap[marital]} triệu/tháng`,
      explain: 'Khai theo Bảng tiền công thực nhận 12 tháng — không chỉ lương trên HĐLĐ.',
      attachments: clause === 'k8_no_hdld' ? ['don_cong_an_cap_xa'] : ['bang_tien_cong_don_vi'],
    });
    if (
      typeof intake.income_declaration_monthly === 'number'
      && intake.income_declaration_monthly > capMap[marital]
    ) {
      warnings.push({
        code: 'income_over_cap',
        message: `Thu nhập khai ${intake.income_declaration_monthly} triệu vượt trần ${capMap[marital]} triệu — cần rà soát trước khi nộp.`,
        severity: 'review',
      });
    }
  }

  if (marital === 'vo_chong') {
    checklist.push('Khai đầy đủ thông tin vợ/chồng trên Mẫu 01');
  }

  checklist.push(
    'Đơn Mẫu 01 ký đủ trang',
    'CCCD bản sao (người đứng đơn + vợ/chồng nếu có)',
    'Giấy xác nhận còn hiệu lực trong 12 tháng',
    'Cam kết chưa hưởng hỗ trợ nhà ở + chỉ một dự án',
  );

  const dossierSets = intake.dossier_copy_sets;
  if (!dossierSets || dossierSets === 'unknown') {
    warnings.push({
      code: 'dossier_copy_sets_unknown',
      message: 'Chưa xác định số bộ photo theo thông báo CĐT — hỏi kỹ từng dự án trước khi photo; chỉ nêu ~3/~4 bộ như tham khảo.',
      severity: 'review',
    });
  } else if (dossierSets !== 'online_only') {
    checklist.push(`Photo đủ ${dossierSets === '5_plus' ? '5+' : dossierSets} bộ theo thông báo CĐT`);
  }

  const ct07Format = intake.ct07_acceptance_format;
  if (intake.cdt_requires_ct07 !== 'not_required' && (!ct07Format || ct07Format === 'unknown')) {
    warnings.push({
      code: 'ct07_acceptance_unknown',
      message: 'Chưa xác định CĐT chấp nhận CT07 dạng scan VNeID hay bản gốc/sao y — hỏi thông báo dự án trước khi nộp.',
      severity: 'review',
    });
  } else if (ct07Format === 'scan_vneid_print') {
    checklist.push('CT07/LLTP: có thể dùng bản tải/in từ VNeID — xác nhận lại với CĐT đúng dự án');
  } else if (ct07Format === 'original_only' || ct07Format === 'certified_copy') {
    checklist.push('CT07: chuẩn bị bản gốc hoặc sao y chứng thực theo thông báo CĐT');
  }

  if (intake.registration_type === 'thue' && province === 'dong_nai') {
    section_guidance.push({
      section: 'note_local',
      action: 'Đồng Nai — đăng ký thuê',
      explain: 'QĐ 08: đối tượng thuê có thể không phải nộp xác nhận thu nhập và nhà ở — đối chiếu QĐ tỉnh.',
      attachments: [],
    });
  }

  const registry = loadRegistry();
  const localSource = registry.sources?.find((s) => s.province_code === province);

  return {
    schema: 'noxh_application_counseling_pack_v1',
    as_of,
    project_province_code: province,
    project_name: intake.project_name || null,
    local_policy_status: localSource?.status || 'unknown',
    section_guidance,
    checklist,
    warnings,
    legal_facts: legalPack.facts,
    forbidden_claims: legalPack.forbidden_claims,
    disclaimer_required: true,
    needs_human_legal_source: legalPack.needs_human_legal_source || warnings.some((w) => w.severity === 'block'),
    guide_path: 'legal-sources/noxh/application-form-mau-01-guide.md',
    counseling_guides: {
      topic_index: 'legal-sources/noxh/counseling-topic-index.md',
      married_mixed_object: 'legal-sources/noxh/married-mixed-object-counseling.md',
      spouses_different_residence: 'legal-sources/noxh/spouses-different-residence-counseling.md',
      vneid_vs_cccd: 'legal-sources/noxh/vneid-vs-cccd-counseling.md',
      retired_beyond_working_age: 'legal-sources/noxh/retired-beyond-working-age-counseling.md',
      dossier_checklist: 'legal-sources/noxh/application-dossier-checklist.md',
      ct07_residence: 'legal-sources/noxh/ct07-residence-confirmation-guide.md',
      ct07_form_fields: 'legal-sources/noxh/ct07-form-fields-declaration-guide.md',
      ct07_submission: 'legal-sources/noxh/ct07-submission-to-cdt.md',
      lltp: 'legal-sources/noxh/lltp-online-counseling.md',
      loan_nhcsxh: 'legal-sources/noxh/noxh-loan-nhcsxh-counseling.md',
      bank_credit_appraisal: 'legal-sources/noxh/bank-credit-appraisal-counseling.md',
      cic_self_check: 'legal-sources/noxh/cic-self-check-citizen-guide.md',
      handwriting_sample: 'legal-sources/noxh/mau-01-handwriting-sample-guide.md',
      handwriting_sample_filled: 'legal-sources/noxh/samples/mau-01-sample-filled-reference.md',
    },
  };
}
