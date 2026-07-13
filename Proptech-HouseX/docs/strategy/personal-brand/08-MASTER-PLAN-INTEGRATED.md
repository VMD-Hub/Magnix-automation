# Master Plan — Vũ Nguyễn × House X × Magnix

> **Kiến trúc 3 lớp:** [11-ARCHITECTURE-THREE-LAYERS.md](./11-ARCHITECTURE-THREE-LAYERS.md)  
> **Chủ thể Lớp 3:** **Vũ Nguyễn** — đại diện House X · chốt deal · giá trị thật  
> **Lớp 1–2:** Magnix + House X = công cụ cho Lớp 3  
> **Mục tiêu cuối:** **Chốt thật nhiều deal BĐS**

---

## 1. Mô hình tổng thể — ba lớp

```
┌──────────────────────────────────────────────────────────────────┐
│  LỚP 3 — PERSONAL BRAND · VŨ NGUYỄN                               │
│  Đại diện House X · thổi hồn · chốt deal · vấn đề phức tạp        │
│  ⚠️ Thiếu bộ ops/asset riêng → [12-PERSONAL-BRAND-OPS-GAP](./12-PERSONAL-BRAND-OPS-GAP.md) │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│  LỚP 2 — HOUSE X (Proptech)                                       │
│  Thương hiệu tổ chức · AI nền tảng · hệ sinh thái · tiện ích      │
│  Mini App · wizard · Admin · Zalo OA                              │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│  LỚP 1 — MAGNIX-AUTOMATION                                        │
│  AI tìm khách · social · phát triển khách · nurture               │
│  n8n · Airtable · Sheet                                           │
└────────────────────────────┬─────────────────────────────────────┘
                             ▼
                        CHỐT DEAL (Vũ Nguyễn)
```

**Ẩn dụ:** Magnix = radar nuôi cá · House X = cảng & công cụ · Vũ Nguyễn = thuyền trưởng.

---

## 2. Vai trò từng lớp (đã chốt)

| Lớp | Thành phần | Vai trò |
|-----|------------|---------|
| **1** | Magnix-automation | Tìm khách · social · nurture · phát triển pipeline |
| **2** | House X | Thương hiệu tổ chức · Proptech · tiện ích môi giới & người mua |
| **3** | Vũ Nguyễn | Đại diện House X · chốt deal · xử lý phức tạp · giá trị thật |
| — | Minh An Land | Pháp nhân ký HĐ, hoa hồng (dưới House X) |

**Thông điệp khách nhìn thấy:**
- Gặp Vũ Nguyễn → *"Luật sư — cố vấn rủi ro pháp lý & tài chính, đại diện House X"*
- Dùng nền tảng → *"House X — Proptech chuyên nghiệp, AI làm nền tảng"*
- Lớp 1–2 phục vụ Lớp 3 — không thay Vũ khi chốt.

---

## 3. Flywheel chốt deal (vòng lặp tăng trưởng)

```
Network cũ + content Vũ Nguyễn
        ↓
Buổi "rà soát 15 phút" / giới thiệu
        ↓
Khách dùng House X (wizard, tính vay) → lead có data
        ↓
Magnix/Airtable tag + n8n nurture (draft → Vũ duyệt gửi)
        ↓
Gặp offline + sale kit → đàm phán → cọc
        ↓
NOXH case M1→M5 (House X Admin) — Vũ đồng hành thủ tục
        ↓
Chốt + referral + case study (ẩn danh)
        ↓
(quay lại đầu — mạnh hơn)
```

Mỗi vòng quay **tăng 3 tài sản:** (1) deal closed, (2) case proof, (3) referral.

---

## 4. KPI — đo theo deal, không đo vanity

### Bảng điều khiển 90 ngày (đề xuất target — chỉnh sau khi bạn xác nhận)

| Tầng | Chỉ số | Target 90 ngày | Nguồn đo |
|------|--------|----------------|----------|
| **Đầu vào** | Network đã kích hoạt 1-1 | 30–50 người | Checklist cá nhân |
| **Đầu vào** | Buổi rà soát / tư vấn đầu | 15–25 buổi | Calendar + CRM |
| **Pipeline** | Lead QUALIFIED (có nhu cầu + khả năng) | 20–40 | Admin `/admin/ops-leads` |
| **Pipeline** | Hồ sơ NOXH M1+ mở | 8–15 | `/admin/noxh-cases` |
| **Chốt** | **Cọc / HĐ mua bán ký** | **3–8 deal** | CRM + hợp đồng |
| **Chốt** | Doanh thu hoa hồng (gross) | *(bạn điền mục tiêu VND)* | Commission log |
| **Flywheel** | Referral có nguồn ghi nhận | ≥30% lead mới | `referral_source` |
| **Flywheel** | Case study publish | 6–9 bài | Content log |

**Chỉ số phụ (không ưu tiên):** view, follower, số bài — chỉ theo dõi nếu đã đủ chỉ số deal.

---

## 5. Lộ trình 90 ngày — 3 pha

### Pha A — Tuần 1–3: Bật xung lực cá nhân (offline trước)

| Việc | Chi tiết | Output |
|------|----------|--------|
| Identity lock | Name card, Zalo cá nhân, chữ ký email — **Vũ Nguyễn LS** | Bộ nhận diện 1 trang |
| Network blitz | 30–50 cuộc gọi/gặp — script [10-CHANNEL-CONTENT](./10-CHANNEL-CONTENT-VU-NGUYEN.md) | ≥20 cuộc hẹn |
| Sale kit | 4 món tối thiểu [05](./05-sale-kit-hardcopy.md) | Sẵn sàng mọi buổi gặp |
| Checklist NOXH | In + PDF trên House X | Lead magnet |

**Không:** đăng content hàng ngày, mua ads, thêm tool.

### Pha B — Tuần 4–8: Nối online ↔ offline

| Việc | Chi tiết | Output |
|------|----------|--------|
| Mỗi buổi gặp | Cho khách quét QR House X / Zalo OA | Lead vào pipeline |
| n8n alert | Im lặng 14 ngày, HOT wizard | Draft → Vũ gửi tay |
| Content | 2 bài/tháng case luật → chuyển BĐS khi có | Proof tăng dần |
| Ops song song | [09-OFFLINE-OPS](./09-OFFLINE-OPS-PARALLEL.md) hàng ngày | Không rơi lead |

### Pha C — Tuần 9–12: Tối ưu chốt

| Việc | Chi tiết | Output |
|------|----------|--------|
| Review pipeline | Lọc lead "ảo" — tập trung QUALIFIED | Tỷ lệ cọc ↑ |
| Referral ask | Sau mỗi milestone M3+ | Nguồn giới thiệu |
| Case BĐS đầu tiên | Vào sổ case + 1 video ngắn | Social proof thật |
| 90-day retro | So KPI bảng §4 | Plan Q2 |

---

## 6. Phân công: Human vs Agent

| Việc | Vũ Nguyễn (human) | House X / Magnix (agent) |
|------|-------------------|--------------------------|
| Gọi network cũ | ✅ | — |
| Rà soát pháp lý, đàm phán, chốt giá | ✅ | — |
| Soạn nháp Zalo follow-up | Duyệt + gửi | AI/n8n draft |
| Wizard NOXH, tính vay | Giải thích kết quả | App tự tính |
| Checklist M1–M5 | Review từng mốc | Admin + notify |
| Content case study | Ghi âm / kể chuyện | AI draft bài |
| Broadcast Zalo hàng loạt | ❌ | ❌ |

---

## 7. Ranh giới tuân thủ (Luật sư + Môi giới)

- **Được nhấn mạnh:** Kinh nghiệm luật, rà soát rủi ro, đồng hành thủ tục, tư vấn tài chính mua nhà.
- **Tránh claim:** "Đại diện pháp lý trong tranh chấp" / "kiểm định độc lập" nếu không nằm trong phạm vi dịch vụ đã đăng ký.
- **Lead magnet:** Disclaimer 1 dòng — rà soát sơ bộ hỗ trợ quyết định mua BĐS, không thay hợp đồng dịch vụ luật riêng.
- **Chứng chỉ môi giới:** Mang theo sale kit khi gặp khách (tín hiệu kép: LS + MG).

---

## 8. Deliverable triển khai (theo thứ tự)

| # | Hạng mục | File / hành động |
|---|----------|------------------|
| 1 | Master plan (file này) | ✅ |
| 2 | Kênh & content Vũ Nguyễn | [10-CHANNEL-CONTENT-VU-NGUYEN.md](./10-CHANNEL-CONTENT-VU-NGUYEN.md) |
| 3 | Vận hành offline song song | [09-OFFLINE-OPS-PARALLEL.md](./09-OFFLINE-OPS-PARALLEL.md) |
| 4 | Checklist NOXH PDF + landing House X | Repo `docs/content/` + route |
| 5 | Name card / QR Vũ Nguyễn → House X | `public/brand/` |
| 6 | n8n silence-14d + referral field | Magnix workflows |
| 7 | Zalo OA menu "Rà soát 15 phút" | `ZALO_OA_COPY_PASTE.md` |

---

## 9. Câu hỏi khóa mục tiêu deal (cần bạn điền)

1. **Target deal 90 ngày:** ___ cọc · ___ chốt hoàn tất · ___ VND hoa hồng?
2. **Phân khúc chính:** NOXH / CCTM / cả hai?
3. **Khu vực:** TP.HCM + tỉnh nào?
4. **Chứng chỉ MG:** đã có chưa?
5. **Ops:** bạn tự chạy Admin hay có người hỗ trợ pipeline?

Trả lời → calibrate target bảng §4 và bắt đầu Pha A.
