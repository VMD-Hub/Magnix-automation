# Kiến trúc 3 lớp — Magnix · House X · Vũ Nguyễn

> **Bản chốt:** 2026-07-11  
> **Nguyên tắc:** Hai lớp đầu là **công cụ** cho lớp thứ ba. Lớp thứ ba là **nhân tố quyết định chốt deal**.

---

## 1. Sơ đồ tổng thể

```
                    ┌─────────────────────────────────────┐
                    │  LỚP 3 — PERSONAL BRAND             │
                    │  VŨ NGUYỄN                          │
                    │  Đại diện thương hiệu House X        │
                    │  Thổi hồn · chốt deal · giá trị thật │
                    └──────────────────┬──────────────────┘
                                       │ nhận lead đã nuôi
                                       │ xuất hiện · đàm phán · chốt
                    ┌──────────────────▼──────────────────┐
                    │  LỚP 2 — HOUSE X (Proptech)         │
                    │  Thương hiệu tổ chức / quy mô       │
                    │  AI nền tảng · hệ sinh thái         │
                    │  Công cụ môi giới & người mua nhà   │
                    └──────────────────┬──────────────────┘
                                       │ lead có cấu trúc
                                       │ utility · case · Mini App
                    ┌──────────────────▼──────────────────┐
                    │  LỚP 1 — MAGNIX-AUTOMATION          │
                    │  AI tìm khách · social · nurture    │
                    │  Phát triển khách hàng (inbound)    │
                    └─────────────────────────────────────┘
```

**Luồng giá trị:**

```
Magnix (tìm + nuôi) → House X (đo + công cụ + uy tín tổ chức) → Vũ Nguyễn (tin tưởng + chốt)
```

---

## 2. Định nghĩa từng lớp

### Lớp 1 — Magnix-automation

| Khía cạnh | Nội dung |
|-----------|----------|
| **Bản chất** | Công cụ AI vận hành inbound |
| **Chức năng** | Tìm kiếm khách · social · phát triển khách hàng · nurture · dedupe |
| **Stack** | n8n · Airtable · Google Sheet · webhook · agent workflow |
| **Đầu ra** | Lead có `normalized_key`, tier HOT/WARM, sẵn sàng vào pipeline |
| **Không làm** | Thay mặt Vũ Nguyễn gặp khách hoặc chốt deal |

**Repo:** `Magnix-automation/` (root monorepo) — tách biên với Proptech-HouseX theo `.cursorrules`.

---

### Lớp 2 — House X (Proptech)

| Khía cạnh | Nội dung |
|-----------|----------|
| **Bản chất** | Thương hiệu đại diện **tổ chức** — quy mô & chuyên nghiệp ngành BĐS |
| **Chức năng** | Nền tảng AI · mở rộng hệ sinh thái kinh doanh · tiện ích Proptech |
| **Đối tượng** | Môi giới · người mua nhà · CTV — *khai thác tiện ích, kiếm tiền cùng House X* |
| **Kênh** | timnhaxahoi.com · Zalo Mini App · Zalo OA · Admin |
| **Pháp nhân** | Công ty TNHH Minh An Land |
| **Đầu ra** | Lead wizard có data · hồ sơ NOXH M1–M5 · công cụ vay/checklist |

**Repo:** `Proptech-HouseX/` — DNA, ops playbook, landing dự án.

**Không nhầm:** House X = thương hiệu **công ty / nền tảng** — không thay thế face Vũ Nguyễn trong buổi chốt.

---

### Lớp 3 — Personal Brand · Vũ Nguyễn

| Khía cạnh | Nội dung |
|-----------|----------|
| **Bản chất** | Nhân hiệu đại diện House X — **người** khách nhớ và tin |
| **Chức năng** | Thổi hồn vào dự án · nhân tố quyết định chốt deal · xử lý vấn đề phức tạp |
| **Thế mạnh** | Luật sư · 45 tuổi · rủi ro pháp lý & tài chính · đàm phán · đồng hành thủ tục |
| **Kênh** | Gặp mặt · Zalo cá nhân · network · content cá nhân (FB/LinkedIn) |
| **Đầu ra** | Cọc · HĐ · referral · case proof · giá trị thật cho khách |

**Repo (tài liệu):** `docs/strategy/personal-brand/` — **tách riêng** để tối ưu vấn đề cốt lõi xây nhân hiệu.

---

## 3. Quan hệ giữa 3 lớp

| Câu hỏi | Trả lời |
|---------|---------|
| Magnix phục vụ ai? | House X pipeline + Vũ Nguyễn (lead đã lọc) |
| House X phục vụ ai? | Thị trường rộng (môi giới, người mua) + làm nền cho Vũ đại diện |
| Vũ Nguyễn phục vụ ai? | Khách cần **tin một người** trước khi xuống tiền |
| Ai chốt deal? | **Vũ Nguyễn** — Magnix/House X không chốt thay |
| Có tách rời không? | **Tách tài liệu & ops cá nhân** · **Không tách luồng giá trị** |

**Ẩn dụ đã chốt:**

| Lớp | Vai trò |
|-----|---------|
| Magnix | Radar + hệ thống nuôi cá |
| House X | Cảng chuyên nghiệp + công cụ hàng hải |
| Vũ Nguyễn | Thuyền trưởng — quyết định ra khơi và cập bến |

---

## 4. Ranh giới thương hiệu (tránh lẫn)

| Tình huống | House X nói | Vũ Nguyễn nói |
|------------|-------------|---------------|
| Zalo OA / Mini App | Công cụ, wizard, dự án | — (chuyển sang Vũ khi QUALIFIED) |
| Gặp khách / cọc | Hỗ trợ bằng app & hồ sơ | "Tôi đồng hành rà rủi ro và chốt" |
| Content blog SEO | Q&A NOXH, landing dự án | Case ẩn danh, video kể chuyện |
| Quảng cáo | Proptech, tiện ích | Luật sư cố vấn — invite 15 phút |
| Hợp đồng | Minh An Land | Vũ ký vai trò môi giới / đại diện theo quy định |

---

## 5. Khoảng trống đã nhận diện

**Hai lớp đầu đã/đang có công cụ kỹ thuật.**  
**Lớp 3 chưa có bộ công cụ vận hành nhân hiệu cá nhân.**

Chi tiết gap & roadmap: [12-PERSONAL-BRAND-OPS-GAP.md](./12-PERSONAL-BRAND-OPS-GAP.md)

---

## 6. Cấu trúc thư mục chiến lược

```
docs/strategy/
└── personal-brand/          ← LỚP 3 — tài liệu & ops Vũ Nguyễn (repo này)
    ├── 00-INDEX.md
    ├── 11-ARCHITECTURE-THREE-LAYERS.md   (file này)
    ├── 12-PERSONAL-BRAND-OPS-GAP.md
    └── … playbook, sale kit, content

Magnix-automation/           ← LỚP 1 — workflows, sheet, inbound
Proptech-HouseX/             ← LỚP 2 — app, brand, admin
```

**Tách riêng lớp 3** = tập trung identity, trình bày, offline, content cá nhân — không trộn vào task kỹ thuật House X hay Magnix.
