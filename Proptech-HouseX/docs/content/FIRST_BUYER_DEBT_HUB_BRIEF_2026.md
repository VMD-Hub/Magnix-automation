# Cluster mua nhà lần đầu + đảo nợ / DTI — Brief biên tập (House X)

> Trạng thái: **Draft brief** · 07/2026 · Tài liệu vận hành, **không** render lên `timnhaxahoi.com`  
> Phạm vi: **2 pillar + 8 spoke** (Bài 1 + Bài 2 đã chốt). Bài 3–4 hub “portfolio / kênh đầu tư” **không** nằm trong phase này (xem §9).  
> Payload `editorial_brief_v1`: `docs/content/FIRST_BUYER_DEBT_HUB_BRIEFS_V1.json`

## 1. Positioning

House X viết từ góc **người mua lần đầu để ở** và **chuẩn bị hồ sơ vay** — giải thích quy trình, chỉ số DTI/CIC, checklist tự kiểm.  
**Không** nhận vai môi giới chốt căn, không cam kết duyệt vay, không so sánh crypto/cổ phiếu.

| Nhóm đọc | Nỗi đau | Vai của bài |
|----------|---------|-------------|
| Người mua lần đầu | Analysis paralysis, sợ bị từ chối vay | Khung 4 lớp: điều kiện → vay → thương lượng → chi phí ẩn |
| Đủ điều kiện NOXH nhưng nợ tiêu dùng cao | Sợ DTI / CIC chặn vay | Phân biệt nợ tốt/nợ xấu + lộ trình 6–12 tháng |
| Đang cân NOXH vs CCTM | Không biết cửa nào khớp hồ sơ | Cầu nối tool `noxh-check` + hub `/vay-mua-nha` |
| Đã đọc cluster thẩm định vay | Cần góc “đảo nợ trước khi mua” | Spoke mới — không trùng pillar thẩm định |

## 2. Ràng buộc hệ thống

| Hạng mục | Giá trị |
|----------|---------|
| `channel` | `blog_seo` (`meta.target_channel` → `website_article`) |
| `content_type` | Pillar/spoke **điều kiện–hồ sơ NOXH** → `NOXH_LEGAL`; **DTI/đảo nợ/vay** → `LOAN_FINANCE` |
| `segment` | `noxh_income` (điều kiện) · `sme_credit` hoặc `noxh_income` khi góc vay/DTI |
| CTA gate | Đúng 1 `cta_tool_id` ∈ `noxh-check` \| `noxh-loan-quick` |
| Soft tools (trong body, không thay gate) | `/tinh-tra-gop` · `/cong-cu/tinh-han-muc-vay` · `/vay-mua-nha#tu-van` · `/wiki-nha-o-xa-hoi/cai-bay-dti` |
| QA | L0 + **L2 `/devil`** toàn cluster + **L3** trước publish |
| Nest URL | Bài nằm dưới `/tin-tuc/[slug]` · **không** tạo hub song song cạnh `/vay-mua-nha` |
| Hub affiliate | Link soft về `/vay-mua-nha` (canonical vay) — tránh cannibalization |

### 2.1 CTA theo bài

| Slug (rút) | `content_type` | `cta_tool_id` | Lead magnet / soft |
|------------|----------------|---------------|--------------------|
| Pillar mua lần đầu | `NOXH_LEGAL` | `noxh-check` | Checklist hồ sơ NOXH (Drive) |
| NOXH vs CCTM | `NOXH_LEGAL` | `noxh-check` | Checklist đối chiếu đối tượng |
| Hồ sơ bị từ chối vay | `LOAN_FINANCE` | `noxh-loan-quick` | Excel dòng tiền (`DONGTIEN`) |
| Chi phí ẩn + timeline | `NOXH_LEGAL` | `noxh-check` | Bảng phí trước/sau ký |
| Pillar đảo nợ / DTI | `LOAN_FINANCE` | `noxh-loan-quick` | Excel dòng tiền + case DTI |
| Nợ tốt vs nợ xấu | `LOAN_FINANCE` | `noxh-loan-quick` | Checklist CIC |
| Sắp xếp nợ tiêu dùng | `LOAN_FINANCE` | `noxh-loan-quick` | Timeline 6–12 tháng |
| Nợ xấu còn vay được không | `LOAN_FINANCE` | `noxh-loan-quick` | Link CIC + bài nợ nhóm 2 |

### 2.2 Citation bắt buộc

Mỗi bài tối thiểu khi viện dẫn pháp lý / vay:

1. Luật Nhà ở 2023 (Đ.76–79) và/hoặc NĐ 100/2024 (+ NĐ 261/136 nếu thu nhập) — điều/khoản + link.
2. Claim vay: `legal-sources/noxh/atomic-claims.loan.json` (`claim_id` trong `source_refs`).
3. Q&A: `qa-knowledge.loan.json` / `qa-knowledge.nd100.json` khi khớp câu hỏi.

Disclaimer cuối bài (chuẩn cluster vay):

> *Thông tin mang tính tham khảo theo quy định hiện hành; thẩm định và phê duyệt thuộc tổ chức tín dụng / cơ quan có thẩm quyền. House X không cam kết duyệt vay.*

## 3. Quy tắc tiêu đề & heading

- H1/H2/H3 là **câu hỏi viết đủ** (AIO).  
  Đúng: *"Nên chọn nhà ở xã hội hay căn hộ thương mại khi mua lần đầu?"*  
  Sai: *"NOXH vs CCTM — Nên chọn cái nào?"*
- Title/meta: **sentence case** tiếng Việt; whitelist `NOXH`, `DTI`, `CIC`, `TP.HCM`, `NHCSXH` (`.cursor/title_whitelist.json`).
- Không Title Case kiểu Anh; không năm **2024** (dùng **2026**).
- Không nhét jargon chưa dịch vào H1 (`LTV`, `DSCR`, `ROI`) — dịch hoặc chú thích trong body.
- Mỗi H2 mở bằng đáp ngắn **40–60 từ** (featured snippet), rồi bullet chi tiết.

## 4. Inventory 2 + 8 (gap-fill — không trùng cluster đã publish)

Đã có sẵn (chỉ **link**, không viết lại):

| Vai trò | Slug đã có |
|---------|------------|
| Pillar thẩm định vay | `tham-dinh-khoan-vay-mua-nha-o-xa-hoi` |
| CIC / nợ nhóm 2 / hồ sơ vay / checklist cọc | cluster `noxh-loan-cluster-map-2026` |
| Myth mua lần đầu | `hieu-sai-mua-nha-dung-cho-du-tien`, `sai-lam-tai-chinh-tuong-du-tien-mua-nha` |
| Case DTI | `/wiki-nha-o-xa-hoi/cai-bay-dti` (redirect từ `/vu-nguyen/case/cai-bay-dti`) |

### Bài mới (phase này)

| # | Vai trò | Slug đề xuất | Ưu tiên | CTA tool |
|---|---------|--------------|---------|----------|
| A0 | Pillar | `huong-dan-mua-nha-lan-dau-2026-tu-chon-nha-den-ky-hop-dong` | P0 | `noxh-check` |
| A1 | Spoke | `nen-chon-nha-o-xa-hoi-hay-can-ho-thuong-mai-khi-mua-lan-dau` | P0 | `noxh-check` |
| A2 | Spoke | `ho-so-tai-chinh-the-nao-thi-de-bi-ngan-hang-tu-choi-vay-mua-nha` | P0 | `noxh-loan-quick` |
| A3 | Spoke | `chi-phi-an-khi-mua-nha-lan-dau-va-tien-trinh-giao-dich` | P1 | `noxh-check` |
| B0 | Pillar | `dao-no-va-co-cau-no-truoc-khi-vay-mua-nha-chien-luoc-nao-phu-hop` | P0 | `noxh-loan-quick` |
| B1 | Spoke | `no-tot-va-no-xau-khac-nhau-the-nao-khi-chuan-bi-vay-mua-nha` | P0 | `noxh-loan-quick` |
| B2 | Spoke | `sap-xep-no-tieu-dung-truoc-khi-vay-mua-nha-mat-bao-lau` | P1 | `noxh-loan-quick` |
| B3 | Spoke | `no-xau-cic-con-vay-mua-nha-duoc-khong-lo-trinh-6-12-thang` | P1 | `noxh-loan-quick` |

Thứ tự ship: **A0 → A1 → B0 → B1 → A2 → B2 → A3 → B3**.  
Tag: `noxh`, `phap-ly` (A*) · `noxh`, `tham-dinh-vay` (B* + A2).

## 5. Outline từng bài

### A0 — Pillar: Cẩm nang mua nhà lần đầu

**H1:** Cẩm nang mua nhà lần đầu: Giải mã pháp lý, tài chính và bẫy chi phí ẩn

**Body đã chốt:** `docs/content/drafts/huong-dan-mua-nha-lan-dau-2026.md`  
**Upsert (kể cả đã PUBLISHED):** `npm run db:upsert:first-buyer-pillar`

**one_line_insight:** Rủi ro lớn nhất khi mua nhà lần đầu không nằm ở căn đẹp hay xấu — mà ở mù mờ pháp lý và năng lực tài chính thực tế.

**Cấu trúc H2 (owner rewrite):**

1. Mua nhà lần đầu: Phân định rõ nhà ở thương mại và nhà ở xã hội (NOXH)
2. Bài toán đòn bẩy: Vay bao nhiêu là đủ và vì sao hồ sơ dễ bị từ chối?
3. Các chi phí ẩn và timeline thực tế từ khi ký hợp đồng đến nhận nhà
4. Checklist trước khi xuống tiền đặt cọc
5. Kiểm tra nhanh (+ liên kết hữu ích)

Chức năng hub: mỗi H2 link xuống A1–A3 + cluster thẩm định vay + `/vay-mua-nha`.

**source_refs gợi ý:** `noxh_loan_two_tier_001`, claims Đ.76–78 (nd100/batch2), Q&A `noxh_qa_loan_overview_001`.

---

### A1 — NOXH vs CCTM

**H1:** Nên chọn nhà ở xã hội hay căn hộ thương mại khi mua lần đầu?

**Body đã chốt:** `docs/content/drafts/nen-chon-noxh-hay-cctm-lan-dau.md`  
**Upsert (kể cả đã PUBLISHED):** `npm run db:upsert:first-buyer-a1`

**one_line_insight:** NOXH giá thấp hơn nhưng ràng buộc đối tượng, thu nhập và chuyển nhượng — chọn sai cửa mất thời gian hồ sơ, không chỉ tiền cọc.

**Cấu trúc H2 (owner rewrite):**

1. Khác biệt pháp lý cốt lõi: nhà ở xã hội và căn hộ thương mại
2. Ai thực sự đủ điều kiện mua NOXH và bài toán trần thu nhập?
3. Khi nào nên chọn căn hộ thương mại dù giá cao hơn?
4. Bóc tách hồ sơ và thời gian chờ: hai thế giới khác nhau
5. Checklist trước khi giữ suất mua

**CTA:** `noxh-check` → `/cong-cu/dieu-kien-noxh`  
**Internal links (canonical):** `/cong-cu/dieu-kien-noxh` · pillar A0 wiki · `/wiki-nha-o-xa-hoi/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat` · `/vay-mua-nha`  
**source_refs:** claims thu nhập NĐ 136 / local HCM; `noxh_loan_two_tier_001`.

---

### A2 — Hồ sơ vay bị từ chối

**H1:** Hồ sơ vay mua nhà — những lỗi nào thường bị từ chối hồ sơ?

**Body đã chốt:** `docs/content/drafts/ho-so-vay-bi-tu-choi.md`  
**Upsert (kể cả đã PUBLISHED):** `npm run db:upsert:first-buyer-a2`  
**Slug giữ nguyên** (SEO): `ho-so-tai-chinh-the-nao-thi-de-bi-ngan-hang-tu-choi-vay-mua-nha`

**one_line_insight:** Đủ điều kiện mua NOXH không đồng nghĩa được ngân hàng duyệt vay — tầng thẩm định tài chính vận hành theo bộ tiêu chí độc lập.

**Cấu trúc H2 (owner rewrite):**

1. Đủ điều kiện mua NOXH có chắc chắn được ngân hàng duyệt vay không?
2. DTI là gì và ngân hàng thường đánh giá tỷ lệ này như thế nào?
3. Những lỗi chứng minh thu nhập nào hay làm hồ sơ bị trả lại?
4. Nợ thẻ tín dụng và trả góp tiêu dùng ảnh hưởng duyệt vay ra sao?
5. Nên tự kiểm tra hạn mức và khả năng trả góp thế nào trước khi nộp hồ sơ?

**CTA:** `noxh-loan-quick` → `/cong-cu/kiem-tra-vay-noxh`  
**Internal links (canonical):** case DTI · kiểm tra vay · hạn mức · trả góp · wiki thẩm định · wiki đảo nợ  
**source_refs:** `bank_dti_income_appraisal_001`, `noxh_loan_two_tier_001`, `noxh_qa_dti_income_001`.

---

### A3 — Thuế, phí & chi phí ẩn mua nhà lần đầu

**H1:** Các loại thuế, phí và khoản đóng góp người mua nhà lần đầu cần biết rõ

**Body đã chốt:** `docs/content/drafts/chi-phi-an-mua-nha-lan-dau.md`  
**Upsert (kể cả đã PUBLISHED):** `npm run db:upsert:first-buyer-a3`  
**Slug canonical:** `chi-phi-an-khi-mua-nha-lan-dau-va-tien-trinh-giao-dich`  
**Redirect 308 từ slug cũ:** `…-va-timeline-tu-ky-den-so-huu`

**one_line_insight:** Bỡ ngỡ lớn nhất khi mua nhà lần đầu thường không phải chọn căn — mà là hệ thống thuế, phí phát sinh trong và sau giao dịch.

**Cấu trúc H2 (owner rewrite):**

1. Bức tranh tổng quan: Ai là người trả thuế và phí?
2. Chi tiết thuế và phí khi mua nhà liền thổ / nhà phố
3. Cẩm nang chi phí khi mua căn hộ chung cư (một lần + hàng tháng)
4. Tiến trình giao dịch từ ký đến sở hữu — vì sao không có một con số cố định?
5. Lời khuyên trước khi xuống tiền

**CTA:** `noxh-check` → `/cong-cu/dieu-kien-noxh`  
**Soft links:** `/vay-mua-nha/bao-hiem-tai-san` · pillar A0 · `/vay-mua-nha` · A1  
**Lằn ranh:** tỷ lệ 0,5% / 2% / phí m² là **tham khảo**; không cam kết mức cố định mọi địa phương.

---

### B0 — Pillar: Đảo nợ & cơ cấu nợ trước khi vay mua nhà

**H1:** Đảo nợ và cơ cấu nợ trước khi vay mua nhà — chiến lược nào thực sự phù hợp?

**Body đã chốt:** `docs/content/drafts/dao-no-co-cau-no-truoc-vay.md`  
**Upsert (kể cả đã PUBLISHED):** `npm run db:upsert:first-buyer-b0`  
**Slug giữ nguyên:** `dao-no-va-co-cau-no-truoc-khi-vay-mua-nha-chien-luoc-nao-phu-hop`

**one_line_insight:** Ngân hàng không cho vay vì lãi brochure rẻ — họ cho vay theo khả năng trả nợ thực tế. Chủ động sắp xếp nợ hiện hữu là chìa khóa để hồ sơ đủ cửa duyệt vốn.

**Cấu trúc H2 (owner rewrite):**

1. Đảo nợ khác cơ cấu nợ ở điểm nào khi chuẩn bị vay mua nhà?
2. Vì sao tỷ lệ DTI quyết định nhiều hơn lãi suất trên brochure?
3. Thứ tự ưu tiên xử lý nợ tiêu dùng trước khi nộp hồ sơ vay nhà
4. Khi nào nên refinance / kéo dài kỳ hạn — và rủi ro cần tránh?
5. Lộ trình nào cho hồ sơ có lịch sử nợ xấu hoặc quá hạn?

**CTA:** `noxh-loan-quick` → `/cong-cu/kiem-tra-vay-noxh`  
**Internal links (canonical wiki):** cai-bay-dti · tra CIC · nợ nhóm 2 · cẩm nang A0 · tools hạn mức / trả góp  
**source_refs:** `bank_dti_income_appraisal_001`, `bank_cic_credit_history_001`, `bank_npl_classification_001`.

---

### B1 — Nợ tốt vs nợ xấu

**H1:** Nợ tốt và nợ xấu khác nhau thế nào khi chuẩn bị vay mua nhà?

**Body đã chốt:** `docs/content/drafts/no-tot-va-no-xau.md`  
**Upsert (kể cả đã PUBLISHED):** `npm run db:upsert:first-buyer-b1`  
**Slug giữ nguyên:** `no-tot-va-no-xau-khac-nhau-the-nao-khi-chuan-bi-vay-mua-nha`

**one_line_insight:** Có dư nợ trả góp là bình thường khi vay mua nhà — quan trọng là phân định nợ có kiểm soát với nợ xấu/quá hạn đang cản cửa thẩm định.

**Cấu trúc H2 (owner rewrite):**

1. Nợ tốt và nợ xấu được hiểu thế nào trong bối cảnh chuẩn bị vay mua nhà?
2. Ngân hàng phân loại nợ trên CIC theo những nhóm nào?
3. Khoản trả góp nhà hoặc ô tô đang trả đúng hạn có phải luôn là điểm trừ không?
4. Thẻ tín dụng quay vòng ảnh hưởng đến tỷ lệ DTI ra sao?
5. Trước khi vay mua nhà, làm thế nào để tự kiểm tra CIC an toàn?

**CTA:** `noxh-loan-quick` → `/cong-cu/kiem-tra-vay-noxh`  
**Internal links (canonical):** tra CIC · đảo nợ B0 · nợ nhóm 2 · CreditConnect (external)  
**source_refs:** `bank_npl_classification_001`, `bank_cic_credit_history_001`, Q&A `noxh_qa_cic_bad_debt_001`.

---

### B2 — Sắp xếp nợ tiêu dùng

**H1:** Lộ trình sắp xếp nợ tiêu dùng trước khi vay mua nhà: Mất bao lâu để dữ liệu CIC được cập nhật?

**Body đã chốt:** `docs/content/drafts/sap-xep-no-tieu-dung.md`  
**Upsert (kể cả đã PUBLISHED):** `npm run db:upsert:first-buyer-b2`  
**Slug giữ nguyên:** `sap-xep-no-tieu-dung-truoc-khi-vay-mua-nha-mat-bao-lau`

**one_line_insight:** Hợp nhất hoặc tất toán đúng thứ tự trong vài tháng thường giúp DTI dễ thở hơn là vay thêm để đảo lung tung — và cần chừa thời gian để CIC cập nhật.

**Cấu trúc H2 (owner rewrite v3):**

1. Nên ưu tiên tất toán khoản nợ nào trước khi nộp hồ sơ vay nhà?
2. Hợp nhất nợ khác gì với đảo nợ sang tổ chức tín dụng khác?
3. Sau khi tất toán xong, dữ liệu mới trên hệ thống CIC được cập nhật mất bao lâu?
4. Làm sao tự ước tính chỉ số DTI trước và sau khi giảm nợ tiêu dùng?
5. Khi nào nên tạm dừng kế hoạch mua nhà 6 đến 12 tháng?

**CTA:** `noxh-loan-quick` → `/cong-cu/kiem-tra-vay-noxh`  
**Soft tools:** `/cong-cu/tinh-han-muc-vay` · `/tinh-tra-gop` · wiki đảo nợ · cai-bay-dti  
**source_refs:** `bank_dti_income_appraisal_001`, `bank_cic_credit_history_001`.

---

### B3 — Nợ xấu còn vay được không

**H1:** Nợ xấu CIC còn vay mua nhà được không? Lộ trình phục hồi hồ sơ từ 6 đến 12 tháng

**Body đã chốt:** `docs/content/drafts/no-xau-cic-lo-trinh-phuc-hoi.md`  
**Upsert (kể cả đã PUBLISHED):** `npm run db:upsert:first-buyer-b3`  
**Slug giữ nguyên:** `no-xau-cic-con-vay-mua-nha-duoc-khong-lo-trinh-6-12-thang`

**one_line_insight:** Đủ đối tượng NOXH không xóa nợ xấu trên CIC — thường cần tất toán, chờ dữ liệu cập nhật và lộ trình phục hồi 6–12 tháng trước khi nộp vay nhà.

**Cấu trúc H2 (owner rewrite):**

1. Nợ xấu nhóm nào thường làm hồ sơ vay mua nhà đối diện nguy cơ từ chối cao?
2. Vừa tất toán xong nợ xấu có được ngân hàng cho vay ngay không?
3. Lộ trình từ 6 đến 12 tháng để phục hồi hồ sơ gồm những bước nào?
4. Nợ nhóm 2 khác gì so với nhóm 3–5 đối với người mua nhà?
5. Trước khi quyết định đặt cọc, nên tham khảo thêm tài liệu nào?

**CTA:** `noxh-loan-quick` → `/cong-cu/kiem-tra-vay-noxh`  
**Internal links (canonical wiki):** nợ nhóm 2 · tra CIC · thẩm định vay · checklist cọc  
**source_refs:** `bank_npl_classification_001`, `noxh_qa_cic_bad_debt_001`.

## 6. Liên kết nội bộ

```
/vay-mua-nha  (hub affiliate — soft CTA form)
/tinh-tra-gop · /cong-cu/tinh-han-muc-vay · /cong-cu/dieu-kien-noxh · /cong-cu/kiem-tra-vay-noxh

A0 (pillar mua lần đầu)
├── A1 (NOXH vs CCTM) → /cong-cu/dieu-kien-noxh
├── A2 (từ chối vay) → B0 + case DTI + pillar thẩm định vay
├── A3 (chi phí ẩn) → checklist cọc đã publish
└── myth pair first-buyer (đã publish)

B0 (pillar đảo nợ / DTI)
├── B1 (nợ tốt/xấu) → CIC article
├── B2 (sắp xếp nợ) → hạn mức vay tool
├── B3 (nợ xấu 6–12 tháng) → nợ nhóm 2 article
└── /wiki-nha-o-xa-hoi/cai-bay-dti  (case E-E-A-T · 308 từ /vu-nguyen/case/cai-bay-dti)

Cluster thẩm định vay (đã publish) ←→ A2, B0, B3 (hai chiều)
```

Mỗi spoke link ngược pillar của mình ở đoạn mở; hai pillar link chéo A0 ↔ B0 một lần (không chuỗi 1→2→3→4 tuyến tính).

## 7. Lằn ranh compliance

| Cấm | Lý do |
|-----|-------|
| Cam kết “chắc được duyệt / lãi X% cố định mọi NH” | L0 + forbidden_claims loan pack |
| Bảng lãi suất NH “cập nhật tháng 7/2026” như số vĩnh viễn | Lãi thay đổi — chỉ dạy *cách so sánh* + ngày nguồn |
| So sánh BĐS vs crypto/cổ phiếu/quỹ “sinh lời” | Ranh giới Magnix vs trading-intelligence |
| Con số ROI / rental yield kỳ vọng | L0 cấm cam kết lợi nhuận |
| Urgency giả (“chốt tuần này”) | Trái Value-First |
| Jargon LTV/DSCR trong H1 chưa dịch | Title/AIO Việt |

## 8. Quy trình vận hành

1. Brief này + JSON `FIRST_BUYER_DEBT_HUB_BRIEFS_V1.json` → nạp `content_queue` / Layer B (`meta.editorial_brief_v1`).
2. Attach `legal_retrieval_pack` topic `loan_dti` hoặc `noxh_income` theo `legal_topic` từng row.
3. Agent 3 / prompt `housex__website-article-pr.md` · `channel=blog_seo` · `product_type=website_article`.
4. Title QA Gate → Content Type Router (CTA + disclaimer) → L0 → L2 `/devil` → L3 `/admin/content-queue` (`cta_tool_id` + checklist 3 mục).
5. Publish web → cập nhật inventory §4 + thêm slug vào `noxh-loan-cluster-map-2026.ts` RELATED map (backlog code).

### Checklist L3 (nhắc lại)

1. Nỗi đau NƠXH / vay nào?  
2. `cta_tool_id` đúng allowlist?  
3. Câu CTA trên bài khớp tool?

## 9. Ngoài phase (đã thống nhất)

| Trụ gốc | Quyết định |
|---------|------------|
| Bài 3 — tối ưu danh mục BĐS | **Cắt / hoãn** — chỉ mở lại nếu góc thuần `VALUATION` + `DINHGIA`, bỏ tax/M&A đất |
| Bài 4 — kênh đầu tư sinh lời | **Không làm trong Magnix** — reframe sau thành `GENERAL_POLICY` “ở vs cho thuê” *hoặc* tách trading-intelligence |

## 10. Backlog phát sinh

| Ưu tiên | Việc | Ghi chú |
|---------|------|---------|
| P0 | Seed 8 row queue từ JSON briefs | Script hoặc Super nhập tay Admin |
| P1 | Wire RELATED_SLUGS cho A0–B3 trong `noxh-loan-cluster-map-2026.ts` | Sau khi có slug publish |
| P1 | FAQPage JSON-LD trên A0 + B0 | Giống hub NOXH |
| P2 | Lead magnet Excel dòng tiền gắn CTA `DONGTIEN` | Drive pack đã có hướng vay |
| P3 | Reframe Bài 4 “ở vs cho thuê” nếu cần traffic | `GENERAL_POLICY`, không yield hype |
