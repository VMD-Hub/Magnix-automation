/**
 * ADR-018 Wave 1 — Module CTV: tìm khách thuê & hoa hồng (Lớp 2).
 * Source SOP: docs/ops/RENTAL_LEASING_COMMISSION_SOP.md
 */

export const RENTAL_LEASING_CTV_SERVICE_CODE = "RENTAL_LEASING_CTV" as const;

export const RENTAL_LEASING_CTV_SERVICE_META = {
  code: RENTAL_LEASING_CTV_SERVICE_CODE,
  category: "TRAINING" as const,
  name: "Cho thuê — tìm khách & hoa hồng",
  description:
    "Lớp 2 ADR-018: đăng tin QC, tìm khách thuê, thỏa thuận hoa hồng Minh An/CTV, pain tag — không quản lý vận hành, không thuê lại.",
  sortOrder: 25,
};

export const RENTAL_LEASING_CTV_CONTENT_MARKDOWN = `# Cho thuê — tìm khách & hoa hồng (Lớp 2)

**House X · Minh An Land** — Đào tạo CTV  
Theo ADR-018 và \`docs/ops/RENTAL_LEASING_COMMISSION_SOP.md\`.

## 1. Ba lớp dịch vụ (nhớ đúng)

| Lớp | Việc | Kiếm tiền |
|-----|------|-----------|
| **1** | Nền tảng QC tin thuê (House X) | Phí gói ads (phụ) |
| **2** | **Tìm khách / bán phòng** (bạn làm) | **Hoa hồng** khi chốt |
| **3** | Quản lý vận hành | **Chưa mở** — chỉ ghi \`NEED_PM\` |

**Cấm:** thuê lại căn để kinh doanh · hứa «quản lý thu tiền / sửa chữa» khi chưa có HĐ Lớp 3.

## 2. Lead \`rentalIntent\`

| Intent | Nghĩa | Việc CTV/Ops |
|--------|--------|--------------|
| \`LANDLORD\` | Chủ cần tìm khách | SLA ≤ **4 giờ** giờ hành chính; chốt hoa hồng trước khi đẩy tin |
| \`TENANT\` | Khách thuê | Match tin / dẫn xem |
| \`TAX_HELP\` | Thuế / kế toán | Referral — không tư vấn thuế thay luật |
| \`NEED_PM\` | Quan tâm QL sau | Waitlist Sense — **không bán** Lớp 3 |

## 3. Pain tag (mọi cuộc gọi)

\`P1\` tin rác · \`P2\` trống căn · \`P3\` thuế · \`P4\` cần QL · \`P7\` mất trust  

LOST: \`no_response\` | \`price\` | \`tax_fear\` | \`want_pm_only\` | \`legal_block\` | \`other\`

## 4. Checklist trước nhận lead LANDLORD

1. Đọc intent trên board Ops  
2. Xác nhận khu vực / loại căn / giá  
3. Thỏa thuận hoa hồng (0,5–1 tháng thuê hoặc %) **trước** đẩy lead nóng  
4. Copy với chủ: kết nối tin + tìm khách — **không** đang quản lý căn  
5. Khi chốt: ghi deal hoa hồng trên Ops (\`RENTAL_COMMISSION\`)  

## 5. Công cụ & hub

- Hub công khai: \`/cho-thue\`  
- Ước tính dòng tiền + thuế: \`/cong-cu/dong-tien-cho-thue\`  
- SOP đầy đủ: \`docs/ops/RENTAL_LEASING_COMMISSION_SOP.md\`  
`;
