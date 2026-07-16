# Taxonomy mẫu biểu NOXH — Single source of truth (Magnix / HouseX)

> **Trạng thái:** `human_verified` — 2026-07-16 · L3 nội bộ (vẫn `disclaimer_required` khi publish)  
> **Phạm vi:** Chỉ nhà ở xã hội — **không** dẫn mẫu địa chính, mẫu thẩm định BĐS thường, hay mẫu ngoài luồng mua/thuê mua dự án.  
> **Liên quan:** `NOXH_HANDBOOK_JOURNEY_MAP.md` · `counseling-topic-index.md`

---

## 1. Ba hệ mẫu — không trộn lẫn

| Hệ | Văn bản gốc | Dùng trong silo NOXH? |
|----|-------------|------------------------|
| **A — Đơn & thủ tục** | NĐ 100/2024/NĐ-CP (+ NĐ 54, 136, 261 sửa) | **Có** — lõi hồ sơ |
| **B — Giấy chứng minh đối tượng / điều kiện** | Thông tư **05/2024/TT-BXD** Phụ lục I (+ TT 32/2025 nếu sửa) | **Có** — kèm đơn |
| **C — Bản vẽ địa chính** | Mẫu 01–05 theo từng tỉnh (TP.HCM, Đồng Nai, Bình Dương…) | **Không** — thẩm định BĐS, không phải hồ sơ đăng ký NOXH |

**Cảnh báo nội bộ:** `docs/agent/cam-nang-phap-ly-bds.md` mục 1.3 liệt kê Mẫu 04/05 **địa chính** — **cấm** trích sang bài NOXH / inbox tư vấn hồ sơ.

**Cảnh báo đánh số:** Có **hai “Mẫu 01”** khác văn bản:

| Tên gọi HouseX | Văn bản | Ý nghĩa |
|----------------|---------|---------|
| **Mẫu 01 đăng ký** | NĐ 100 **Phụ lục II** | Đơn đăng ký mua/thuê mua/thuê NOXH |
| **Mẫu 01 đối tượng (TT)** | TT 05 **Phụ lục I** | Giấy chứng minh đối tượng (một số nhóm k5–k11) |

Luôn ghi đủ: *“Mẫu 01 NĐ 100”* hoặc *“Mẫu 01 TT 05”* — không viết *“Mẫu 01”* đơn lẻ.

---

## 2. Mã nội bộ (dùng trong agent, content map, checklist)

| Mã Magnix | Tên hiển thị (copy công khai) | Văn bản | Mục đích |
|-----------|-------------------------------|---------|----------|
| `NOXH-FORM-01-NĐ100` | Đơn đăng ký NOXH (Mẫu 01) | NĐ 100 Phụ lục II | Đơn chính — tick Đ.76, nhà ở, cam kết, **mục 11** |
| `NOXH-FORM-11.1` | Mục 11.1 trên đơn | Trên Mẫu 01 NĐ 100 | Khai thu nhập k5, k6, k8 — trần 25/35/50 (+ hệ số tỉnh) |
| `NOXH-FORM-11.2` | Mục 11.2 trên đơn | Trên Mẫu 01 NĐ 100 | Khai thu nhập k7 — Đ.67 (Đại tá), không dùng 25/35/50 |
| `NOXH-FORM-TT05-01` | Mẫu 01 (TT 05) | TT 05 Phụ lục I | Chứng minh đối tượng k5,k6,k8,k9,k10,k11 |
| `NOXH-FORM-TT05-02` | Mẫu 02 (TT 05) | TT 05 Phụ lục I | Nhà ở: **chưa có** nhà tại tỉnh dự án |
| `NOXH-FORM-TT05-03` | Mẫu 03 (TT 05) | TT 05 Phụ lục I | Nhà ở: **có nhà** nhưng &lt; 15 m² sàn/người |
| `NOXH-FORM-TT05-04` | Mẫu 04 (TT 05) | TT 05 Phụ lục I | Thu nhập: k5,k6,**k7**,k8 có đơn vị / HĐLĐ |
| `NOXH-FORM-TT05-05` | Mẫu 05 (TT 05) | TT 05 Phụ lục I | Thu nhập: **k5 không HĐLĐ** — CA cấp xã (NĐ 54) |
| `NOXH-FORM-TT05-06` | Mẫu 06 (TT 05) | TT 05 Phụ lục I | Vay **tự xây/sửa** qua NHCSXH — **không** thuộc hồ sơ mua căn dự án |
| `NOXH-FORM-BQP-BCA` | Mẫu đơn vị BQP/BCA | TT 94-BQP, TT 56-BCA | Chứng minh **đối tượng k7** + xác nhận công tác |
| `NOXH-FORM-CT07` | Giấy xác nhận cư trú | TT 66/2023 BCA | Giấy kèm (vay / một số CĐT); **không** thay đơn NĐ 100 |

---

## 3. Bảng tra theo tình huống người mua

### 3.1 Đơn và khai trên đơn

| Tình huống | Dùng gì |
|------------|---------|
| Mọi hồ sơ mua/thuê mua | `NOXH-FORM-01-NĐ100` |
| Công nhân, CBCCVC, thu nhập thấp (k5,k6,k8) | Mục **11.1** + thường kèm `NOXH-FORM-TT05-04` |
| Quân nhân, CA đương nhiệm (k7) | Mục **11.2** + `NOXH-FORM-BQP-BCA` — **không** dùng trần 25/35/50 |
| Người có công, nghèo, thu hồi đất (k1–k4, k9, k10) | Miễn trần — giấy đối tượng riêng, **không** Mẫu 04/05 thu nhập |

### 3.2 Điều kiện nhà ở (hay bị trả hồ sơ)

| Tình huống | Mẫu TT 05 | Cơ quan xác nhận |
|------------|-----------|------------------|
| Chưa có tên / không có thông tin nhà ở trên GCN tỉnh dự án | **Mẫu 02** | VPĐK đất đai / cơ quan cấp GCN (07 ngày) |
| Có nhà, diện tích &lt; 15 m²/người | **Mẫu 03** | UBND cấp xã (07 ngày) |
| Có nhà xa nơi làm việc | Mẫu 02/03 + QĐ tỉnh | Thêm xác nhận đơn vị (vd Đồng Nai QĐ 08) |

### 3.3 Thu nhập — Mẫu 04 vs 05

| Tình huống | Mẫu | Thẩm quyền ký (sau NĐ 54) |
|------------|-----|---------------------------|
| Có HĐLĐ / làm tại DN, cơ quan (k5,k6,k8; k7 qua đơn vị) | **Mẫu 04** | Đơn vị, DN nơi làm việc |
| k5 **không** HĐLĐ (tự do, shipper…) | **Mẫu 05** | **Công an cấp xã** — kê khai + cam kết, có hậu kiểm |

**Lỗi thường gặp:** Gọi Mẫu 03 TT 05 là “xác nhận thu nhập” — **sai**; Mẫu 03 TT 05 là **nhà ở (có nhà)**.

### 3.4 k7 — không dùng Mẫu 06

| Sai | Đúng |
|-----|------|
| “Mẫu 06 dành cho lực lượng vũ trang” | Mẫu 06 TT 05 = vay tự xây/sửa nhà (Đ.9 TT 05) |
| Dùng Mẫu 04/05 như công nhân cho k7 | Mục **11.2** + mẫu **BQP/BCA**; thu nhập theo **Đ.67** |

---

## 4. Khối disclaimer — chèn đầu mọi bài / inbox NOXH hồ sơ

```markdown
> **Phạm vi mẫu biểu:** Chỉ mẫu NOXH theo NĐ 100/2024/NĐ-CP và Thông tư 05/2024/TT-BXD (Phụ lục I).
> Không nhầm với mẫu bản vẽ địa chính (thẩm định BĐS) hay Mẫu 06 TT 05 (vay tự xây/sửa nhà).
> Danh mục chi tiết và số bộ hồ sơ — đối chiếu thông báo tiếp nhận của từng chủ đầu tư. Mẫu biểu viết tay ký sống từng bản; giấy kèm bản sao/photo theo CĐT.
```

---

## 5. File tư vấn Magnix theo mã mẫu

| Mã | File KB |
|----|---------|
| `NOXH-FORM-01-NĐ100` | `application-form-mau-01-guide.md`, `mau-01-handwriting-sample-guide.md` |
| `NOXH-FORM-11.*` | `mau-01-section-11-income.md` |
| `NOXH-FORM-TT05-02/03` | `application-form-mau-01-guide.md` Phần D |
| `NOXH-FORM-TT05-04/05` | `mau-01-section-11-income.md`, `application-dossier-checklist.md` |
| `NOXH-FORM-BQP-BCA` | `income-exemption-and-llvt-counseling.md`, `object-classification-cbccvc-hdld.md` |
| `NOXH-FORM-CT07` | `ct07-residence-confirmation-guide.md`, `ct07-form-fields-declaration-guide.md` |
| Số bộ photo | `application-dossier-checklist.md` |

---

## 6. Lịch sử sửa nhãn (2026-07-16)

- Thống nhất: **không** dùng cụm “Mẫu số 03 thu nhập” — Mẫu 03 TT 05 = nhà ở có nhà.
- Thu nhập dân sự: **Mẫu 04 / Mẫu 05 TT 05** hoặc “mục 11.1 Mẫu 01 NĐ 100”.
- Tách hẳn mẫu địa chính (`cam-nang-phap-ly-bds.md`) khỏi silo NOXH.

---

*Magnix Legal KB — cập nhật khi TT 05/32/08 BXD hoặc NĐ sửa đổi. Publish ra ngoài: L2 `/devil` + L3 human.*
