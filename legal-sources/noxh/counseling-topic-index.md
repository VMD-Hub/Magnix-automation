# Chỉ mục chủ đề tư vấn NOXH — Mẫu 01 & hồ sơ (Magnix)

> **Trạng thái:** `human_verified` — 2026-06-26 · L3 duyệt toàn module Mẫu 01 / CT07 + vay/CIC  
> **Mục đích:** Điểm vào thống nhất cho agent/copywriter — mọi thắc mắc tư vấn đăng ký nên tra file tương ứng trước khi trả lời khách.

---

## Ba kênh phục vụ (cùng một KB)

| Kênh | Ai dùng | Playbook |
|------|---------|----------|
| **1 — AIO/SEO** | Viết bài website & Page | `../channels/aio-seo.md` |
| **2 — Inbox** | Chat tư vấn khách Page | `../channels/inbox-counseling.md` |
| **3 — Staff** | NV tra cứu & mẫu hồ sơ | `../channels/staff-ops.md` |

Chi tiết: `docs/NOXH_THREE_CHANNEL_ARCHITECTURE.md` · `buildChannelPack('aio_seo'|'inbox_counseling'|'staff_ops')`

---

## Bảng tra nhanh

| Chủ đề khách hỏi | File tư vấn | Claim / Q&A chính |
|------------------|-------------|-------------------|
| Điền Mẫu 01 từng phần · L3 ✓ | `application-form-mau-01-guide.md` | `mau01_core_bundle_001` |
| **Viết tay / nơi cấp / xuống dòng / mục 9** · L3 ✓ 2026-06-26 | `mau-01-handwriting-sample-guide.md` | `mau01_qa_handwriting_place_issue_001` · mẫu: `samples/mau-01-sample-filled-reference.md` |
| **Số bộ hồ sơ / checklist giấy tờ** · L3 ✓ | `application-dossier-checklist.md` | `mau01_one_dossier_per_project_001`, `mau01_qa_dossier_sets_001` — **số bộ tùy CĐT từng dự án** |
| Mục 11 thu nhập (11.1 / 11.2) · L3 ✓ | `mau-01-section-11-income.md` | `mau01_section_11_1_k568_001`, `mau01_section_11_2_k7_001` |
| k7 vs k8, quốc phòng vs CBCCVC · L3 ✓ | `object-classification-cbccvc-hdld.md` | `luat76_k7_vs_k8_distinction_001` |
| Vợ chồng **khác nhóm** đối tượng — ai đứng đơn · L3 ✓ | `married-mixed-object-counseling.md` | `married_mixed_object_applicant_k7_001`, `mau01_qa_married_mixed_object_001` |
| Vợ chồng **khác nơi cư trú** — CT07 · L3 ✓ | `spouses-different-residence-counseling.md` | `spouses_different_residence_001`, `mau01_qa_ct07_spouses_residence_001` |
| **CT07 — xác nhận cư trú** (làm online / CA xã) · L3 ✓ | `ct07-residence-confirmation-guide.md` | `ct07_residence_confirmation_001`, `mau01_qa_ct07_001`, `mau01_qa_ct07_online_vneid_001` |
| **Mẫu CT07 — các mục & khai gia đình** · L3 ✓ | `ct07-form-fields-declaration-guide.md` | `ct07_form_fields_household_001`, `mau01_qa_ct07_form_fields_001` |
| **Nộp CT07 cho CĐT** (scan vs sao y) · L3 ✓ | `ct07-submission-to-cdt.md` | `ct07_residence_confirmation_001` — **tùy CĐT từng dự án** |
| **Lý lịch tư pháp (LLTP)** — khác CT07 · L3 ✓ | `lltp-online-counseling.md` | `ct07_lltp_online_vneid_001` |
| **VNeID vs CCCD** — khai theo nguồn nào · L3 ✓ | `vneid-vs-cccd-counseling.md` | `vneid_cccd_identity_hierarchy_001`, `mau01_qa_vneid_vs_cccd_001` |
| **Hết tuổi LĐ / nghỉ hưu** — có mua NOXH? · L3 ✓ | `retired-beyond-working-age-counseling.md` | `noxh_no_max_age_purchase_001`, `mau01_qa_retired_working_age_001` |
| **Vay NHCSXH / hỗ trợ CP** · L3 ✓ | `noxh-loan-nhcsxh-counseling.md` | `atomic-claims.loan.json` + `nd261_loan_rate_54pct_001` |
| **CIC, nợ xấu, DTI, room** · L3 ✓ | `bank-credit-appraisal-counseling.md` | `bank_*` trong `atomic-claims.loan.json` |
| **Tự tra CIC** · L3 ✓ | `cic-self-check-citizen-guide.md` | `cic_self_check_citizen_001` |
| **Con ≥18 thu nhập cao**, chung hộ khẩu · L3 ✓ | `parent-adult-child-household-income-counseling.md` | `income_adult_child_not_counted_001`, `mau01_qa_adult_child_income_001` |
| **Khai thành viên hộ** — CCCD/GKSN · L3 ✓ | `household-members-declaration-counseling.md` | `mau01_spouse_only_mandatory_members_001`, `mau01_qa_household_members_001` |
| QĐ tỉnh, 20 km, hệ số thu nhập | `../local-policy/COUNSELING_FRAMEWORK.md` | `counseling_project_province_jurisdiction_001` |
| Intake trước khi soạn đơn | `registration-intake-schema.json` | — |

---

## Thứ tự hỏi tư vấn (agent)

1. **Tỉnh dự án NOXH** (không chỉ nơi ở / nơi làm)
2. **Hình thức:** mua / thuê mua / thuê
3. **Đối tượng Đ.76** (k5–k8, k7…)
4. **Tình trạng hôn nhân** + vợ chồng có **khác nhóm** / **khác cư trú** không
5. **Nhà ở** tại tỉnh dự án (chưa có / 15 m² / xa nơi làm việc)
6. **Thu nhập** → mục 11.1 hay 11.2
7. **Đồng bộ VNeID/CCCD** trước khi khai đơn / CT07
8. **Số bộ photo hồ sơ** — đọc thông báo **đúng CĐT/dự án** (`dossier_copy_sets`); không chốt 3/4 nếu `unknown`
9. **CT07** (xác nhận cư trú) — online VNeID hoặc CA xã/phường; hỏi CĐT **scan vs sao y** (`ct07_acceptance_format`)
10. **Vay** — có/không vay; kênh NHCSXH vs NH liên kết (`loan_intent`); nhắc **hai tầng** đủ NOXH ≠ được vay (`noxh-loan-nhcsxh-counseling.md`)
11. **CIC / nợ xấu / DTI** — đã tra CIC? (`cic_checked`); nợ quá hạn? (`bank-credit-appraisal-counseling.md`)

---

## Atomic claims & Q&A

- Claims: `atomic-claims.application-form.json`, `atomic-claims.batch2.json`, `atomic-claims.batch3.json`, `atomic-claims.nd100.json`, `atomic-claims.loan.json` — **verified L3 2026-06-26**
- Q&A: `qa-knowledge.application-form.json`, `qa-knowledge.batch2.json`, `qa-knowledge.batch3.json`, `qa-knowledge.loan.json`, `qa-knowledge.nd100.json`
- Retrieval: `scripts/lib/legal-retrieval-pack.mjs`
- Registry: `legal-sources/registry.json` → `application_form.verified_by: human`

**Publish ra ngoài:** mọi claim vẫn kèm `disclaimer_required` — L3 duyệt cho tư vấn agent, không thay cam kết pháp lý tuyệt đối.
