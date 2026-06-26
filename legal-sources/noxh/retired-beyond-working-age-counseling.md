# Người hết tuổi lao động / nghỉ hưu — Có được mua NOXH không? (Magnix)

> **Trạng thái:** `human_verified` — 2026-06-26 · L3 duyệt (vẫn `disclaimer_required`)  
> **Căn cứ:** Luật Nhà ở 2023 Đ.76 k5, Đ.78 · NĐ 100 Đ.29, Đ.30 · NĐ 54 · NĐ 136 · Bộ luật Lao động (tham chiếu tuổi nghỉ — **không** là điều kiện loại trừ NOXH)  
> **Ghi chú:** Phản hồi Cục Quản lý nhà & TT BĐS (Bộ Xây dựng) qua báo chí: người **đã nghỉ chế độ** không bị loại khỏi chính sách nếu đủ điều kiện nhà ở và thu nhập — cần đối chiếu văn bản hướng dẫn/CĐT từng dự án.

---

## Kết luận tư vấn (đọc trước)

| Câu hỏi | Trả lời |
|---------|---------|
| **Hết tuổi lao động theo Bộ luật Lao động có bị cấm mua NOXH?** | **Không** — Luật Nhà ở 2023 **không** quy định trần tuổi tối đa để mua/thuê mua NOXH |
| **Người đã nghỉ hưu có được xem xét?** | **Có** — nếu đủ điều kiện **nhà ở** (tại tỉnh dự án) và **thu nhập** |
| **Tick nhóm đối tượng nào trên đơn?** | Thường **khoản 5** (người thu nhập thấp khu vực đô thị) — ghi rõ **“nghỉ hưu”** / thu nhập từ lương hưu nếu form có ô |
| **Còn tick k6 (công nhân, LĐ) hay k8 (CBCCVC)?** | **Thường không** nếu **đã nghỉ hẳn**, không còn quan hệ lao động / không còn là CCVC đang công tác |

**Một câu nhớ:** *Hết tuổi lao động ≠ hết quyền mua NOXH. Vấn đề là **còn thuộc nhóm Đ.76 nào** và **thu nhập + nhà ở có đạt không**.*

---

## Pháp lý — vì sao không bị loại vì tuổi?

### Luật Nhà ở 2023

- **Điều 76** liệt kê **nhóm đối tượng** (k5 thu nhập thấp, k6 công nhân/LĐ, k8 CBCCVC…) — **không** có khoản “độ tuổi từ … đến …”.
- **Điều 78** điều kiện mua/thuê mua: **nhà ở** + **thu nhập** (với các nhóm tương ứng) — **không** điều kiện “đang trong độ tuổi lao động”.
- So với Luật 2014: cũng **không** có trần tuổi tối đa cho người mua NOXH thương mại/xã hội theo hướng dẫn hiện hành trong KB.

### Bộ luật Lao động — chỉ liên quan **phân loại**, không phải “cấm mua”

| Khái niệm BLĐ | Ảnh hưởng NOXH |
|---------------|----------------|
| **Tuổi nghỉ hưu** (nam ~60, nữ ~55, lộ trình tăng dần) | Hết “tuổi lao động” theo BLĐ — **không** tự động mất quyền mua NOXH |
| **Người lao động** (quan hệ HĐLĐ) | Còn HĐLĐ, đi làm → có thể **k6**; **nghỉ hưu hẳn** → thường chuyển sang **k5** |
| **Làm việc sau tuổi nghỉ** (có thỏa thuận) | Vẫn có thể là **k6** nếu DN xác nhận thu nhập — `needs_human_legal_source` nếu CĐT hỏi thêm |

---

## Phân nhánh tư vấn theo tình huống

### A) Đã nghỉ hưu / nghỉ chế độ — **không** còn đi làm

| Mục | Cách xử lý |
|-----|------------|
| **Đối tượng đơn** | **k5** — người thu nhập thấp khu vực đô thị |
| **Mục 11** | **11.1** — trần 25 / 35 / 50 triệu (+ hệ số tỉnh) theo hôn nhân |
| **Thu nhập tính** | **Lương hưu** + thu nhập khác (nếu có) — bình quân **12 tháng** từ thời điểm xác nhận (NĐ 136) |
| **Giấy xác nhận** | Thực tế hành chính: **BHXH** đang chi trả lương hưu **hoặc** **Công an cấp xã** (k5 không HĐLĐ — NĐ 54) — **đối chiếu mẫu CĐT/Sở XD địa phương** |
| **Ghi trên đơn** | Nghỉ hưu / hưởng lương hưu — **không** tick k8 “cán bộ” chỉ vì trước đây là công chức |

### B) Hết tuổi lao động nhưng **vẫn đang làm** (HĐLĐ, hợp đồng thuê lại)

| Mục | Cách xử lý |
|-----|------------|
| **Đối tượng** | Có thể **k6** (công nhân, LĐ tại DN) nếu **còn** quan hệ lao động thực tế |
| **Mục 11** | **11.1** |
| **Giấy xác nhận** | **Đơn vị** (DN) — Bảng tiền công 12 tháng |
| **Lưu ý** | Một số CĐT có thể hỏi thêm — nếu tranh chấp → `needs_human_legal_source` |

### C) Vừa hưu vừa có **thu nhập khác** (cho thuê nhỏ, hỗ trợ con…)

| Mục | Cách xử lý |
|-----|------------|
| **Thu nhập** | **Cộng tất cả** nguồn thực nhận — không chỉ lương hưu |
| **Trần** | Vẫn 25/35/50 (hoặc Đại tá nếu k7) — **vượt trần = không đủ điều kiện thu nhập** |
| **Kê khai** | Trung thực — có hậu kiểm (NĐ 54) |

### D) Vợ chồng — một người nghỉ hưu, một người đi làm

| Mục | Cách xử lý |
|-----|------------|
| **Đứng đơn** | Theo quy tắc **nhóm đối tượng** — xem `married-mixed-object-counseling.md` |
| **Thu nhập** | **Cộng** lương hưu + lương người đi làm |
| **Đối tượng tick** | Theo **người đứng đơn** (vd chồng k6 đi làm → k6; vợ hưu chỉ cộng thu nhập) |

---

## Điều kiện vẫn phải đạt (không miễn vì tuổ cao)

| Điều kiện | Ghi chú |
|-----------|---------|
| **Nhà ở** tại tỉnh dự án | Chưa có nhà trên GCN / không có thông tin nhà ở (NĐ 54) / hoặc &lt;15 m²/người / hoặc QĐ tỉnh (xa nơi làm việc) |
| **Thu nhập** | Trong trần k5 (11.1) — lương hưu **cao** có thể **không đủ** dù “thu nhập thấp” về mặt cảm tình |
| **Một dự án** | NĐ 54 — không đăng ký song song |
| **Chưa hưởng** chính sách nhà ở khác | Cam kết trên đơn |
| **Năng lực dân sự** | Thông thường **≥18 tuổi** đứng đơn — người già đủ năng lực vẫn được; giám hộ nếu có vấn đề năng lực → `needs_human_legal_source` |

---

## Lỗi thường gặp

| Lỗi | Hậu quả |
|-----|---------|
| Nghỉ hưu nhưng tick **k8** (vì trước là công chức) | Sai đối tượng — không còn CCVC đang công tác |
| Nghỉ hưu tick **k6** không còn HĐLĐ | Sai — thiếu xác nhận đơn vị |
| Chỉ khai lương hưu, bỏ thu nhập cho thuê | Sai sự thật — hậu kiểm |
| CĐT từ chối vì “quá tuổi” | **Không đúng** khung Luật 2023 — yêu cầu đối chiếu hướng dẫn Bộ XD / khiếu nại theo quy trình |
| Nghĩ hết tuổi lao động = không còn là “người thu nhập thấp” | Sai — **k5** gắn **mức thu nhập**, không gắn tuổi |

---

## Ưu tiên bốc thăm (không phải điều kiện đủ mua)

Một số QĐ tỉnh (vd Đồng Nai QĐ 08) bổ sung ưu tiên người **trên 35 tuổi** — người lớn tuổi/nghỉ hưu **có thể** hưởng **ưu tiên** khi bốc thăm, **không** thay điều kiện nhà ở/thu nhập.

---

## Vay ngân hàng (tách khỏi đủ điều kiện NOXH)

Ngân hàng có thể giới hạn **tuổi vay tối đa** / thời hạn trả nợ — **khác** với đủ điều kiện mua NOXH. Tư vấn khách: đủ đối tượng NOXH **chưa chắc** được duyệt vay.

---

## Liên kết

- `counseling-topic-index.md`
- `mau-01-section-11-income.md`
- `object-classification-cbccvc-hdld.md`
- `application-form-mau-01-guide.md`

---

## Câu tư vấn 30 giây

*“Luật nhà ở **không cấm** người hết tuổi lao động hay **đã nghỉ hưu** mua NOXH. Bác/chị cần đủ điều kiện **nhà ở tại tỉnh dự án** và **thu nhập** trong trần — thường tick **khoản 5** (thu nhập thấp đô thị), mục **11.1**, xác nhận **lương hưu** qua BHXH hoặc **Công an xã** theo hướng dẫn dự án. **Không** tick công nhân hay công chức nếu đã nghỉ hẳn.”*
