/**
 * Cẩm nang phân tích pháp lý BĐS (nhà đất + căn hộ).
 * Source: docs/agent/cam-nang-phap-ly-bds.md
 * Catalog: VAY_03_PHAP_LY_BDS → AgentService `PHAP_LY_BDS`
 */
export const PHAP_LY_BDS_SERVICE_CODE = "PHAP_LY_BDS" as const;

export const PHAP_LY_BDS_SERVICE_META = {
  code: PHAP_LY_BDS_SERVICE_CODE,
  category: "TRAINING" as const,
  name: "3. Phân tích hồ sơ pháp lý bất động sản",
  description:
    "Cẩm nang đọc GCN nhà đất & căn hộ: cấu trúc 4 trang, bản vẽ hiện trạng theo tỉnh, GPXD, hạn chế rủi ro khi thẩm định.",
  sortOrder: 22,
};

export const PHAP_LY_BDS_CONTENT_MARKDOWN = `# Cẩm nang phân tích pháp lý bất động sản

**House X Agent — Đào tạo nội bộ** · Version 2.3 (biên soạn lại)

## 1. Phân tích pháp lý nhà đất

### 1.1 Bốn loại hồ sơ pháp lý phổ biến

1. **Chưa cấp GCN** — HĐMB / góp vốn / đầu tư / thuê từ CĐT  
2. **Sổ đỏ** — GCN Quyền sử dụng đất  
3. **Sổ hồng mẫu cũ** — GCN Quyền sở hữu nhà ở và QSDĐ ở  
4. **Sổ hồng mẫu mới** — GCN QSDĐ, quyền sở hữu nhà ở và tài sản khác gắn liền với đất  

### 1.2 Cấu trúc Giấy chứng nhận

**Trang 01 — Định danh & chủ sở hữu:** Tên chủ, CCCD, địa chỉ; đơn sở hữu / đồng sở hữu; mã số bìa.

**Trang 02 — Thửa đất, nhà & tài sản gắn liền:**

- Thửa: số thửa/tờ, địa chỉ, diện tích, hình thức & mục đích SD (ODT, LNK…), thời hạn, nguồn gốc  
- Nhà/CTXD: DTXD, DT sàn, kết cấu, số tầng, năm hoàn thành  
- **Ghi chú (Mục 6):** diện tích không công nhận / hành lang AT; lộ giới & quy hoạch; tách/gộp thửa; sổ cũ thay thế  

**Trang 03 — Sơ đồ thửa:** Hình học, cạnh, hướng, hẻm/đường, chỉ giới đỏ (lộ giới), yếu tố bất lợi (mộ, miếu, trạm điện…).

**Trang 04 — Biến động pháp lý:** Nghĩa vụ tài chính; CTXD mới/cải tạo; đổi địa chỉ/địa giới; chuyển nhượng/thừa kế; quy hoạch mới; tách/hợp thửa; **thế chấp / xóa chấp**.

**Trang bổ sung:** Khi Trang 04 hết chỗ — bắt buộc kiểm tra đủ; thiếu thì yêu cầu KH bổ sung mặt trước/sau.

### 1.3 Bản vẽ hiện trạng & văn bản đi kèm

| Mẫu | Tên | Khu vực thường gặp |
|---|---|---|
| 01 | Bản vẽ hiện trạng vị trí | TP.HCM |
| 02 | Bản vẽ sơ đồ nhà, đất | TP.HCM |
| 03 | Trích lục và biên vẽ thửa đất | Đồng Nai |
| 04 | Mảnh trích lục địa chính | Bình Dương |
| 05 | Mảnh trích lục bản đồ địa chính | Long An |

Kiểm tra: đồng bộ số tờ/thửa với GCN; lộ giới & DT ảnh hưởng quy hoạch; cơ quan phê duyệt / đơn vị đo đạc.

**Hồ sơ CTXD:** GPXD + bản vẽ xin phép + nghiệm thu / hoàn công.

- *GPXD chính thức* — phù hợp quy hoạch lâu dài  
- *GPXD tạm* — quy hoạch treo; rủi ro tháo dỡ **không đền bù** phần tạm  

**Bổ sung:** Văn bản chứng nhận số nhà; tờ khai lệ phí trước bạ (làm rõ mục đích SD đất / đơn giá / địa chỉ khi sổ cũ mơ hồ).

---

## 2. Phân tích pháp lý căn hộ

### 2.1 Ba nhóm pháp lý

1. Chưa GCN — HĐMB / góp vốn với CĐT  
2. Sổ hồng căn hộ mẫu cũ  
3. Sổ hồng căn hộ mẫu mới  

### 2.2 Kết cấu GCN căn hộ

- **T1:** Định danh, mã series, chủ sở hữu  
- **T2:** Đất chung tòa nhà; căn hộ (tòa, tầng, số căn, DT thông thủy — sổ cũ có thể tim tường)  
- **T3:** Sơ đồ vị trí trên mặt bằng tầng  
- **T4:** Chuyển nhượng, đính chính CCCD / mã căn  

### 2.3 Hạn chế rủi ro cho chuyên viên House X

1. Sao đủ T1–T4 + trang bổ sung; ảnh rõ — mờ thì yêu cầu bổ sung trước/tại khảo sát  
2. Đối chiếu chéo tờ/thửa/diện tích: GCN ↔ bản vẽ ↔ dữ liệu quy hoạch  
3. Lệch số tầng/căn giữa sổ/HĐMB và thực tế (±1 tầng do trệt/lửng hoặc bỏ 13, 14) — ghi nhận rõ trong đánh giá  
`;
