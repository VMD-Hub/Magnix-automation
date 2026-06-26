# Mẫu 01 — Mục 11: “Tôi có mức thu nhập hàng tháng là” (11.1 & 11.2)

> **Trạng thái:** `human_verified` — 2026-06-26 · L3 duyệt (vẫn `disclaimer_required`)  
> **Căn cứ:** Phụ lục II NĐ 100/2024 (Mẫu 01) · NĐ 136 sửa mức 25/35/50 · NĐ 54 sửa k5 không HĐLĐ → Công an cấp xã · Đ.67 (k7)  
> **Lưu ý:** Bản in cũ trên mạng có thể vẫn ghi **15/30 triệu** — từ **07/04/2026** áp **25/35/50** (+ hệ số tỉnh nếu có). Luôn dùng Mẫu 01/Công báo mới nhất.

---

## Bước 0 — Xác định tick 11.1 hay 11.2 (quan trọng nhất)

Mục 11 **không** thay mục đối tượng ở đầu đơn — nhưng **phải khớp** với nhóm người đứng đơn đã khai ở **mục đối tượng Điều 76**:

| Người đứng đơn thuộc Đ.76 | Phần thu nhập trên đơn |
|---------------------------|------------------------|
| **Khoản 5, 6 hoặc 8** (thu nhập thấp đô thị; CN/LĐ DN-KCN; CBCCVC) | Chỉ tick **11.1** — **không** tick 11.2 |
| **Khoản 7** (LLVT, công an, quốc phòng, cơ yếu…) | Chỉ tick **11.2** — **không** tick 11.1 |
| Khoản 2, 3, 4 (hộ nghèo/cận nghèo) | **Không** dùng bảng 25/50 triệu — xét chuẩn nghèo (mục khác trên đơn) |
| Khoản 10 (thu hồi đất) | Thu nhập theo nhóm áp dụng — thường vẫn qua 11.1 nếu đồng thời thuộc k5/k6/k8 |

**Câu hỏi tư vấn:** *“Anh/chị đăng ký với tư cách **công nhân (k6)**, **cán bộ (k8)**, **thu nhập thấp đô thị (k5)** hay **bộ đội/công an (k7)**?”*

---

## Mục 11.1 — Đối tượng khoản 5, 6, 8 Điều 76

### Ý nghĩa

Khai **mức thu nhập thực nhận bình quân hàng tháng** (theo **Bảng tiền công, tiền lương**) và **chọn đúng ô** độc thân / đã kết hôn để CĐT đối chiếu **trần NĐ 30** (sau NĐ 136).

### Trần tham chiếu (từ 07/04/2026, chưa hệ số tỉnh)

| Tình trạng trên đơn | Trần tổng thu nhập |
|---------------------|-------------------|
| **Độc thân** / chưa kết hôn | ≤ **25 triệu**/tháng |
| **Độc thân nuôi con** dưới 18 tuổi | ≤ **35 triệu**/tháng |
| **Đã kết hôn** | **Tổng** người đứng đơn + vợ/chồng ≤ **50 triệu**/tháng |

Có **QĐ hệ số tỉnh** (vd TP.HCM QĐ 14/2026): nhân hệ số lên 25/35/50 — tra `local-policy/registry.json`.

**Thời gian tính:** **12 tháng liền kề** từ thời điểm cơ quan có thẩm quyền **xác nhận** (NĐ 136).

---

### 11.1 — Độc thân: khai thế nào?

1. Tick ô **“Trường hợp là người độc thân”** (hoặc ô tương đương trên bản Mẫu 01 đang dùng).
2. Ghi số thu nhập **của bản thân** (bình quân tháng, theo cách xác nhận).
3. **Không** cộng thu nhập **con ≥18 tuổi**, anh chị em trưởng thành (dù chung hộ khẩu) — xem `parent-adult-child-household-income-counseling.md`.
4. Nếu **độc thân nhưng đang nuôi con dưới 18 tuổi** → dùng mức **35 triệu** (NĐ 136) nếu đơn có ô riêng; nếu đơn chỉ có 2 ô độc thân/vợ chồng → cần đối chiếu **Mẫu 01 sau NĐ 136** hoặc hướng dẫn CĐT.

**Giấy xác nhận:**

| Tình huống | Cơ quan xác nhận |
|------------|------------------|
| Có HĐLĐ (k5/k6/k8 tùy nghề) | **Cơ quan, đơn vị, doanh nghiệp** nơi làm việc |
| **k5 không HĐLĐ** (lao động tự do, buôn bán, shipper…) | **Công an cấp xã** (NĐ 54) — kê khai + cam kết, có hậu kiểm |

---

### 11.1 — Đã kết hôn: khai thế nào?

1. Tick ô **“Trường hợp đã kết hôn theo quy định pháp luật”**.
2. Thu nhập = **tổng thực nhận của người đứng đơn + vợ/chồng** trong 12 tháng (bình quân/tháng).
3. **Bắt buộc** đã khai thông tin vợ/chồng ở phần đầu đơn — dù vợ/chồng không đứng tên mua.
4. Vợ/chồng **không đi làm** → thu nhập = 0; vẫn tick “đã kết hôn”, tổng = thu nhập người đi làm.
5. Vợ/chồng **có thu nhập** (kể cả tự do) → **cộng hết** vào tổng; vượt 50 triệu (hoặc mức có hệ số) → không đủ điều kiện.

**Giấy xác nhận khi kết hôn:**

- Người có HĐLĐ: đơn vị từng người xác nhận **hoặc** bảng tổng hợp theo hướng dẫn CĐT.
- Một vợ/chồng **k5 không HĐLĐ**: **Công an cấp xã** cho người đó (NĐ 54 Đ.30 k2).
- Cả hai đều CBCCVC (k8): xác nhận của từng cơ quan.

---

### Vợ chồng **cùng** nhóm k5/k6/k8 vs **khác** nhóm

| Tình huống | Tick mục đối tượng (đầu đơn) | Mục 11 |
|------------|------------------------------|--------|
| Chồng CN KCN (k6), vợ CN KCN (k6) | Người đứng đơn tick **k6** | **11.1** — kết hôn — **tổng 2 lương** ≤ 50 triệu |
| Chồng k6, vợ k8 (cán bộ xã) | Người đứng đơn tick **nhóm của chính họ** (vd chồng đứng đơn → k6) | Vẫn **11.1** — kết hôn — **tổng thu nhập 2 người** |
| Một người k5 tự do, một người k6 có HĐLĐ | Đứng đơn theo nhóm **người nộp đơn** | **11.1** + xác nhận CA cho người không HĐLĐ + xác nhận DN cho người có HĐLĐ |

**Nguyên tắc:** Khác nhóm k5/k6/k8 **không** đổi sang 11.2 — **11.2 chỉ dành cho k7**. Khác nhóm chỉ ảnh hưởng **giấy tờ chứng minh đối tượng** (mỗi người một loại xác nhận), còn **trần thu nhập vẫn là tổng vợ chồng** theo 11.1.

---

### Lao động tự do / không HĐLĐ (hay nhầm với k8)

| Đúng | Sai |
|------|-----|
| **k5** — người thu nhập thấp khu vực đô thị, **không** HĐLĐ | Tick **k8** (CBCCVC) vì “không đi làm công ty” |
| Mục 11.1 + đơn **Công an cấp xã** (chú thích 9/10 trên Mẫu 01 bản NĐ 100) | Chỉ ghi lương tự kê không có xác nhận |

**Script tư vấn:** *“Anh/chị buôn bán/shipper/tự do → thuộc **khoản 5 không HĐLĐ**, mục **11.1**, làm xác nhận ở **Công an xã/phường**, không phải mục 11.2.”*

---

### Cha/mẹ mua cho con **dưới 18 tuổi**, con chưa lao động

| Điểm cần làm rõ | Hướng dẫn tư vấn |
|-----------------|------------------|
| Ai là người đứng đơn? | Thông thường **cha/mẹ đủ 18 tuổi** đứng đơn với tư cách đối tượng Đ.76 (k5/k6/k8…), **không** đứng tên con nhỏ là người mua nếu con không đủ điều kiện pháp lý |
| Con dưới 18 không có thu nhập | Không ghi thu nhập cho con ở 11.1; nhà ở vẫn xét **cả vợ chồng** tại tỉnh dự án |
| Độc thân nuôi con &lt; 18 | Tick **độc thân nuôi con** → trần **35 triệu** (NĐ 136), không phải 25 |
| Mục đích “mua cho con ở” | Trên đơn vẫn khai **đúng đối tượng của người đứng đơn**; sau này căn ở theo HĐ và quy định CĐT — **không** tick nhóm con đang học phổ thông trừ khi thuộc diện **k11 thuê** (mua/thuê mua khác thuê) |

**Cảnh báo:** Nếu khách muốn **con là người đứng đơn** dưới 18 tuổi → `needs_human_legal_source` + hỏi CĐT/Sở XD; không hướng dẫn chắc.

### Cha/mẹ — con **≥18 tuổi**, thu nhập cao, chung hộ khẩu / con ở riêng chưa tách sổ

| Điểm | Hướng dẫn |
|------|-----------|
| Thu nhập con ≥18 | **Không cộng** vào 11.1 của cha/mẹ |
| Trần cha/mẹ độc thân | **25 triệu** — không dùng 35 triệu “nuôi con” |
| Chưa tách hộ khẩu | **Không** cấm mua NOXH; khai đúng VNeID |
| Chi tiết | `parent-adult-child-household-income-counseling.md` |

---

## Mục 11.2 — Đối tượng khoản 7 Điều 76 (LLVT)

Chỉ tick khi người **đứng đơn** thuộc **k7** (sĩ quan, QNCN, hạ sĩ quan, CN công an, CC/VC quốc phòng, cơ yếu…).

### 11.2 — Độc thân (k7)

- Tick ô độc thân trong **11.2**.
- Trần: thu nhập thực nhận ≤ **tổng thu nhập sĩ quan hàm Đại tá** (lương cơ bản + phụ cấp, **gồm phụ cấp khu vực** — NĐ 136).
- Xác nhận: cơ quan, đơn vị nơi công tác.

### 11.2 — Đã kết hôn (k7)

Chọn **một** trong hai nhánh con:

| Nhánh | Điều kiện | Trần tổng vợ chồng (NĐ 136) |
|-------|-----------|------------------------------|
| **Cả hai thuộc k7** | Tick “tôi và vợ/chồng **đều** thuộc k7” | ≤ **2,0 lần** mức thu nhập Đại tá |
| **Vợ/chồng không thuộc k7** | Tick “vợ/chồng **không** thuộc k7” | ≤ **mức Đại tá + 25 triệu** (điểm a khoản 1 Đ.30) |

Nếu vợ/chồng là dân sự (k5/k6/k8): vẫn **11.2** (vì người đứng đơn là k7), nhưng tính trần **nhánh vợ/chồng không k7** — **không** dùng trần 50 triệu của 11.1.

**Vợ/chồng k5 không HĐLĐ** trong hôn nhân với k7: người dân sự vẫn xác nhận thu nhập qua **Công an cấp xã** (NĐ 54).

---

## Sơ đồ quyết định nhanh (tư vấn)

```
Người đứng đơn thuộc k7?
├─ CÓ → Mục 11.2
│   ├─ Độc thân → ≤ Đại tá
│   └─ Kết hôn
│       ├─ Cả hai k7 → ≤ 2× Đại tá
│       └─ Vợ/chồng không k7 → ≤ Đại tá + 25 triệu
└─ KHÔNG (k5/k6/k8) → Mục 11.1
    ├─ Độc thân → ≤ 25 triệu (35 nếu nuôi con <18)
    ├─ Độc thân nuôi con <18 → ≤ 35 triệu
    └─ Kết hôn → TỔNG vợ chồng ≤ 50 triệu
        └─ k5 không HĐLĐ? → thêm xác nhận Công an cấp xã
```

---

## Lỗi hay gặp ở mục 11

| Lỗi | Hậu quả |
|-----|---------|
| CN (k6) nhưng tick **11.2** vì “làm trong quân đội” nhầm | Sai mục — trả hồ sơ |
| Kết hôn nhưng chỉ ghi lương bản thân | Tổng thực tế vượt trần → loại |
| Khai độc thân trong khi có vợ/chồng trên GCN/hộ khẩu | Sai sự thật — hậu kiểm |
| Lao động tự do tick k8 | Sai đối tượng |
| Dùng mẫu in **15/30 triệu** sau 07/04/2026 | Sai trần — cần Mẫu 01 cập nhật NĐ 136 |
| Vợ k7 + chồng dân sự nhưng tick trần **50 triệu** (11.1) | Sai — phải **11.2** nhánh không k7 |

---

## Câu tư vấn 30 giây (mục 11)

*“Mục 11 chia hai nhánh: **11.1** cho công nhân, cán bộ, thu nhập thấp đô thị — **11.2** chỉ cho bộ đội, công an, quốc phòng. Độc thân thì một mình; **đã kết hôn thì cộng thu nhập cả hai**. Tự do không HĐLĐ vẫn đi **11.1** nhưng xác nhận ở **Công an xã**, không tick nhầm sang 11.2.”*

---

## Disclaimer

Đối chiếu **Mẫu 01 Phụ lục II** bản hiện hành và thông báo tiếp nhận hồ sơ của **chủ đầu tư dự án**. Số liệu Đại tá và hệ số tỉnh lấy theo văn bản tại thời điểm xác nhận thu nhập.

---

## Phân biệt k7 (mục 11.2) và k8 (mục 11.1) — hai nhóm **khác nhau**

Luật **tách riêng** khoản 7 và khoản 8 Điều 76. Nhầm nhóm → sai mục 11, sai giấy xác nhận, sai trần thu nhập.

### Căn cứ pháp lý

| Nội dung | k7 → **11.2** | k8 → **11.1** |
|----------|---------------|---------------|
| **Luật Nhà ở Đ.76** | Khoản **7** — lực lượng vũ trang | Khoản **8** — cán bộ, công chức, viên chức (Luật CBCCVC) |
| **Thu nhập** | NĐ 100 **Đ.67** — trần **Đại tá** | NĐ 100 **Đ.30** (NĐ 136) — **25/35/50 triệu** |
| **Mẫu chứng minh đối tượng** | **BQP / BCA** ban hành riêng (Đ.78 k9, Đ.101 k2 Luật) | Thông tư **Bộ Xây dựng** — Mẫu chung (vd Mẫu 04 thu nhập Phụ lục I) |
| **Ai xác nhận** | Thủ trưởng đơn vị **quân đội/công an** (vd từ cấp trung đoàn tương đương — TT **94/2024/TT-BQP**; CA tỉnh/huyện — TT **56/2024/TT-BCA**) | Thủ trưởng **cơ quan hành chính/sự nghiệp** chủ quản (Sở, UBND, trường, bệnh viện công…) |

### Ai thuộc k7 (tick 11.2)?

Theo **khoản 7 Điều 76** Luật Nhà ở 2023 — **đang phục vụ tại ngũ / đang công tác** trong:

- **Quân đội nhân dân:** sĩ quan, quân nhân chuyên nghiệp, hạ sĩ quan  
- **Công chức, công nhân, viên chức quốc phòng** — nhưng **đang phục vụ tại ngũ** (thuộc BQP), không phải CBCCVC dân sự  
- **Công an nhân dân:** sĩ quan, hạ sĩ quan, **công nhân công an**… (theo phạm vi BCA)  
- **Cơ yếu** hưởng lương từ ngân sách nhà nước, đang công tác (Ban Cơ yếu Chính phủ / BQP)

**Dấu hiệu thực tế:** biên chế **quân đội / công an / quốc phòng / cơ yếu**; lương theo **quân hàm, chức danh LLVT**; xác nhận qua **mẫu BQP hoặc BCA** (không phải mẫu Sở/UBND thông thường).

### Ai thuộc k8 (tick 11.1)?

**Cán bộ, công chức, viên chức** theo **Luật Cán bộ, công chức** và **Luật Viên chức** — làm việc tại:

- Cơ quan hành chính nhà nước (bộ, ngành, Sở, Phòng, **UBND xã/phường**)  
- Đơn vị sự nghiệp công lập (trường học, bệnh viện, viện…)  
- **Không** thuộc biên chế **đang tại ngũ** quân đội/công an

**Ví dụ k8:** công chức Sở Xây dựng, viên chức trường THPT công lập, cán bộ xã, công chức tòa án (dân sự).

### Chỗ hay nhầm — cần hỏi rõ khách

| Khách nói | Thường là | Không phải |
|-----------|-----------|------------|
| “Tôi là **công chức**” | Hỏi thêm: ở **Sở/UBND/trường/bệnh viện** → **k8, 11.1** | Tự suy là k7 |
| “Tôi là **công chức quốc phòng**” | Nếu **đang tại ngũ** BQP → **k7, 11.2** | k8 |
| “Tôi làm **công an**” | Chiến sĩ/CN trong CA → **k7, 11.2** | k8 |
| “Tôi làm **nhà nước**” | Chưa đủ — phải xác định **LLVT hay CBCCVC** | |
| “Hưu quân nhân / đã rồi ngũ” | **Thường không còn k7** — cần đối chiếu tình trạng **đang phục vụ tại ngũ** tại thời điểm đăng ký | Tick 11.2 chắc chắn |

### Cơ sở xác nhận đối tượng k7 (để tick 11.2)

1. **Luật Nhà ở 2023** Đ.76 k7 + Đ.78 k1b (điều kiện thu nhập Đ.67) + **Đ.78 k9** (BQP, BCA ban hành mẫu).  
2. **NĐ 100/2024** Đ.30 k4 + **Đ.67** (mức Đại tá).  
3. **Thông tư BQP 94/2024/TT-BQP** — mẫu + thẩm quyền xác nhận trong quân đội.  
4. **Thông tư BCA 56/2024/TT-BCA** — Mẫu **NOCA** + thẩm quyền (Giám đốc CA tỉnh, Trưởng CA huyện…).  
5. Trên **Mẫu 01**: tick **11.2** + đính kèm **giấy chứng minh đối tượng k7** (không thay bằng xác nhận thu nhập của cơ quan dân sự).

### Cơ sở xác nhận đối tượng k8 (để tick 11.1)

1. **Luật Nhà ở** Đ.76 k8 + Đ.78.  
2. **NĐ 100** Đ.30 k1 (25/35/50).  
3. **Thông tư Bộ Xây dựng** hướng dẫn mẫu giấy tờ (Mẫu 04 thu nhập… cho k5, k6, **k7 và k8** — nhưng k7 vẫn kèm mẫu BQP/BCA cho **đối tượng**).  
4. Thủ trưởng **cơ quan, đơn vị** nơi làm việc xác nhận **Bảng tiền công, tiền lương**.

### Câu tư vấn phân nhóm

*“Anh/chị thuộc **biên chế quân đội, công an, quốc phòng đang tại ngũ** hay **công chức/viên chức** ở cơ quan hành chính, trường, bệnh viện, UBND? Nhóm đầu → **mục 11.2** và giấy xác nhận **Bộ Quốc phòng/Công an**; nhóm sau → **mục 11.1** và xác nhận **cơ quan chủ quản**, trần **25/35/50 triệu**.”*

> L3 duyệt 2026-06-26 — chi tiết mẫu số và thẩm quyền từng đơn vị: đối chiếu TT 94-BQP, TT 56-BCA, Thông tư Bộ Xây dựng khi publish ra ngoài.

