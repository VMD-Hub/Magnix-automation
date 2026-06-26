# Sáp nhập đơn vị hành chính — Ảnh hưởng tư vấn NOXH (Magnix)

> **Trạng thái:** `pending_human` — theo dõi NQ/QH và QĐ chuyển tiếp UBND sau khi sáp nhập có hiệu lực.  
> **Cập nhật KB:** 2026-06-26

---

## Nguyên tắc vàng (trước và sau sáp nhập)

**Dự án NOXH tỉnh/TP nào → áp quy định địa phương của đơn vị có thẩm quyền phê duyệt dự án đó.**

| Không áp theo | Áp theo |
|---------------|---------|
| Nơi khách đang ở (nếu khác tỉnh dự án) | **Tỉnh/TP nơi dự án NOXH** được cấp phép/triển khai |
| Nơi làm việc (trừ điều kiện “có nhà xa nơi làm việc” trong QĐ tỉnh dự án) | QĐ UBND **của tỉnh dự án** (hệ số thu nhập, NQ 201 Đ.9 k2, ưu tiên) |
| Tỉnh có GCN đất thổ cư | **Tỉnh có dự án** — khi xét “chưa có nhà ở” (NĐ 100 Đ.29 + NĐ 54) |

**Ví dụ:** Khách ở Long An, làm việc Bình Dương, đăng ký dự án NOXH **Đồng Nai** → tra **QĐ Đồng Nai** (QĐ 08/2025, Đ.4 k3 nếu đi con đường “có nhà xa nơi làm việc”), **không** tra Bình Dương hay Long An.

---

## Nhóm sáp nhập cần lưu ý (theo chỉ đạo vận hành Magnix)

| `merger_group_id` | Thành phần (trước sáp nhập) | Ghi chú tư vấn NOXH |
|-------------------|----------------------------|---------------------|
| `mega_hcm` | **TP.HCM** + **Bình Dương** + **Bà Rịa - Vũng Tàu** | HCM có QĐ 14/2026 (hệ số thu nhập); BD/BR-VT chưa QĐ hệ số, chưa QĐ 20 km. Sau sáp nhập: chờ QĐ thống nhất — **không** tự gộp mức HCM cho toàn vùng. |
| `mega_tay_ninh` | **Tây Ninh** + **Long An** | Tây Ninh có QĐ 71/2026 (≥20 km nhà→nơi làm việc); Long An (KB) chưa ghi nhận QĐ tương tự. Dự án **Long An** ≠ dự án **Tây Ninh** cho đến khi có văn bản chuyển tiếp. |
| `mega_dong_nai` | **Đồng Nai** + **Bình Phước** | Đồng Nai QĐ 08/2025 (Đ.4 k3); Bình Phước (KB) khung quốc gia. Dự án Bình Phước **không** tự động hưởng QĐ 08. |
| `mega_can_tho` | **Cần Thơ** + **Hậu Giang** + **Sóc Trăng** | Cần Thơ QĐ 44/2026 (chi tiết Luật); chưa QĐ 20 km. Hậu Giang/Sóc Trăng: khung quốc gia. |

---

## Quy tắc 20 km sau sáp nhập

1. **Trước sáp nhập:** Chỉ áp khi **tỉnh của dự án** đã ban hành QĐ theo **NQ 201 Đ.9 k2** (Đồng Nai QĐ 08 k3; Tây Ninh QĐ 71…). Không phải “cách dự án 20 km”.
2. **Sau sáp nhập:** UBND đơn vị mới thường phải **sửa đổi/ban hành lại** QĐ địa phương hoặc QĐ chuyển tiếp. Agent **không** suy diễn QĐ cũ của một tỉnh thành phần áp cho toàn vùng mới.
3. **Dự án đang triển khai (hồ sơ cũ):** Thường theo văn bản và hướng dẫn **tại thời điểm đăng ký** — cần đối chiếu thông báo Sở Xây dựng / CĐT sau sáp nhập (`needs_human_legal_source`).

---

## Checklist agent — có sáp nhập

1. Xác định **địa chỉ / tỉnh phê duyệt dự án NOXH** (không chỉ hỏi “anh ở tỉnh nào”).
2. Tra `registry.json` theo **mã tỉnh dự án** (trước sáp nhập) hoặc mã mới nếu đã có QĐ chuyển tiếp.
3. Nếu khách ở tỉnh **cùng nhóm sáp nhập** nhưng **khác tỉnh dự án** → vẫn tách quy định cho đến khi có văn bản thống nhất.
4. Ghi disclaimer: sáp nhập đang/ sắp diễn ra — cần xác nhận QĐ mới nhất.

---

## Mã tỉnh bổ sung (thành phần nhóm sáp nhập)

| `province_code` | Tên | `merger_group_id` | QĐ NOXH địa phương (KB 06/2026) |
|-----------------|-----|-------------------|--------------------------------|
| `long_an` | Long An | `mega_tay_ninh` | Khung quốc gia |
| `binh_phuoc` | Bình Phước | `mega_dong_nai` | Khung quốc gia |
| `hau_giang` | Hậu Giang | `mega_can_tho` | Khung quốc gia |
| `soc_trang` | Sóc Trăng | `mega_can_tho` | Khung quốc gia |
