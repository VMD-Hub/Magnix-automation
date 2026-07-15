/**
 * Hướng dẫn House X Insurance — bảo hiểm kèm khoản vay.
 * Source: docs/agent/huong-dan-house-x-insurance.md
 * Catalog: VAY_04_BAO_HIEM → AgentService `HOUSEX_INSURANCE`
 */
export const HOUSEX_INSURANCE_SERVICE_CODE = "HOUSEX_INSURANCE" as const;

export const HOUSEX_INSURANCE_SERVICE_META = {
  code: HOUSEX_INSURANCE_SERVICE_CODE,
  category: "TRAINING" as const,
  name: "4. Hướng dẫn bảo hiểm khoản vay",
  description:
    "House X Insurance: workflow 3 bước (Agent tư vấn → tiếp nhận → chốt/mua BH) và hoa hồng BH nhà ở 20% / xe 15%.",
  sortOrder: 23,
};

export const HOUSEX_INSURANCE_CONTENT_MARKDOWN = `# Hướng dẫn dịch vụ House X Insurance

**House X** — Đào tạo Agent

## 1. Tổng quan

**House X Insurance** phục vụ bảo hiểm cho khách vay thế chấp trên **House X Mortgages** — liền mạch từ chọn gói vay đến mua bảo hiểm nhà ở; mở rộng thêm sản phẩm bảo hiểm khác trong hệ sinh thái House X.

---

## 2. Workflow 3 bước

### Bước 1 — Agent tư vấn gói vay

1. Sơ loại khoản vay + tư vấn chi phí liên quan  
2. Nhận diện gói **bắt buộc BH nhà ở** (ICON trên hệ thống)  
3. Tư vấn sơ bộ yêu cầu & phí tạm tính House X Insurance  
4. Khi nộp đơn: popup *"Đã tư vấn BH House X Insurance chưa?"*  
   - **Đã tư vấn** → đủ điều kiện hoa hồng khi bán BH thành công  
   - **Chưa tư vấn** → không hưởng hoa hồng BH hồ sơ đó  

### Bước 2 — House X Insurance tiếp nhận

- Hệ thống tự tạo HĐ bảo hiểm khi nộp đơn vay bắt buộc BH tài sản  
- CVKD House X Insurance tư vấn chuyên sâu thay Agent  
- Phí trên app lúc này = **phí tạm tính** (theo giá sơ bộ / số tiền vay)  

### Bước 3 — Chốt & mua

- Có giá định giá / hạn mức vay cuối → tính **phí chính thức**  
- Chốt HĐ, thanh toán (QR / cổng thanh toán House X trên app)  
- Xuất **GCN bảo hiểm nhà tư nhân** điện tử qua đối tác (vd. MIC)  
- Lưu GCN trên hợp đồng BH để tra cứu  

---

## 3. Hoa hồng Agent (theo dõi trên House X Agent)

| Loại BH | Tỷ lệ | Điều kiện |
|---| :---: |---|
| Bảo hiểm nhà ở | **20%** | Đã tư vấn sơ bộ + xác nhận trên hệ thống |
| Bảo hiểm vật chất xe ô tô | **15%** | Giới thiệu khách mua BH xe cho House X Insurance |

Đối chiếu bảng phí / chính sách mới nhất trên ứng dụng.

---

*House X — Real estate made simple*
`;
