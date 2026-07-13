# Khoảng trống & roadmap — Công cụ vận hành Personal Brand Vũ Nguyễn

> **Vấn đề:** Magnix và House X đã có (hoặc sắp có) stack kỹ thuật.  
> **Thiếu:** Bộ công cụ **riêng** hỗ trợ vận hành nhân hiệu cá nhân — tài liệu, trình bày, network, content, sale kit.  
> **Mục tiêu doc:** Liệt kê gap · ưu tiên build · không trùng lặp Magnix/House X.

---

## 1. Ma trận: Đã có vs Thiếu

| Hạng mục | Magnix | House X | Personal Brand Vũ Nguyễn |
|----------|--------|---------|---------------------------|
| Tìm lead / inbound AI | ✅ | ✅ (wizard, form) | ⬜ Network tracker |
| Nurture / alert | ✅ n8n | ✅ Admin SLA | ⬜ Script Zalo cá nhân + cadence duyệt tay |
| CRM pipeline | ✅ Airtable | ✅ ops-leads, NOXH case | ⬜ **CRM quan hệ cá nhân** (30–50 VIP) |
| Công cụ NOXH / vay | — | ✅ Mini App | ⬜ Cách **trình bày** công cụ khi gặp mặt |
| Thương hiệu visual | — | ✅ brand/zalo, hero | ⬜ **Identity kit Vũ Nguyễn** |
| Content SEO / landing | — | ✅ docs/content | ⬜ **Content cá nhân** (case, video) |
| Sale kit in | — | — | ⬜ **Template PDF in** |
| Deck trình bày gặp khách | — | — | ⬜ **Slide 10–15 trang** |
| Case proof library | — | — | ⬜ **Sổ case** (luật → BĐS) |
| Playbook đàm phán | — | — | ✅ [04](./04-negotiation-playbook.md) (doc) |
| Offline lịch tuần | — | — | ✅ [09](./09-OFFLINE-OPS-PARALLEL.md) (doc) |
| Đo referral / deal cá nhân | một phần CRM | một phần commission | ⬜ **Dashboard KPI Vũ** |

**Kết luận:** Lớp 3 có **chiến lược (doc)** nhưng thiếu **asset & workflow số hóa** phục vụ hàng ngày.

---

## 2. Bộ Personal Brand Ops Stack (đề xuất build)

### Nhóm A — Identity & trình bày (P0 — tuần 1–2)

| # | Deliverable | Mô tả | Vị trí đề xuất |
|---|-------------|-------|----------------|
| A1 | **Identity kit 1 trang** | Tên, chức danh, one-liner, màu, font, ảnh chuẩn | `personal-brand/assets/IDENTITY-KIT.md` |
| A2 | **Name card + NFC** | Vũ · Co-Founder House X · QR/NFC → `/vu-nguyen` | `public/brand/vu-nguyen/` |
| A3 | **Email / Zalo signature** | Copy-paste | `personal-brand/assets/SIGNATURES.md` |
| A4 | **Ảnh profile** | Chụp chuyên nghiệp — 3 crop (Zalo, FB, slide) | `public/brand/vu-nguyen/` |
| A5 | **Trang profile `/vu-nguyen`** | Digital name card · vCard · video hero · CTA | route Next.js + [13](./13-DIGITAL-PROFILE-NFC-CONTENT-POLICY.md) |

### Nhóm B — Bán hàng & gặp mặt (P0 — tuần 2–3)

| # | Deliverable | Mô tả |
|---|-------------|-------|
| B1 | **Checklist NOXH PDF** | In A4/A5 + tick tay — đồng bộ nội dung House X |
| B2 | **Bảng tính lãi in** | Khung trống điền tay + QR app |
| B3 | **Sổ case** | 3–5 case ẩn danh — template half-page |
| B4 | **Folder meeting prep** | Checklist 15 phút trước buổi gặp (1 trang) |
| B5 | **HĐ mẫu có chú thích lề** | Scan/PDF — highlight điều khoản rủi ro |

*Chi tiết món: [05-sale-kit-hardcopy.md](./05-sale-kit-hardcopy.md)*

### Nhóm C — Network & pipeline cá nhân (P1 — tuần 3–4)

| # | Deliverable | Mô tả |
|---|-------------|-------|
| C1 | **Network list 50** | Sheet/Airtable view riêng — không trộn lead lạ |
| C2 | **Script gọi 3 biến thể** | Network cũ / referral / follow-up sau gặp |
| C3 | **Cadence 1-3-7-14** | Template tin nhắn — draft AI, gửi tay |
| C4 | **Tag nguồn** | `network_vu` · `referral_*` · đồng bộ Magnix `referral_source` |

### Nhóm D — Content cá nhân (P1 — tuần 4+)

| # | Deliverable | Mô tả |
|---|-------------|-------|
| D1 | **Content calendar 90 ngày** | 2–3 bài/tháng — 3 trụ [10](./10-CHANNEL-CONTENT-VU-NGUYEN.md) |
| D2 | **Template bài case Q&A** | H2/H3 = câu hỏi — khớp Magnix editorial |
| D3 | **Video script 3 phút** | Outline quay điện thoại — không cần studio |
| D4 | **Disclaimer pháp lý** | 1 đoạn chuẩn mọi checklist/bài |

### Nhóm E — Đo lường (P1)

| # | Deliverable | Mô tả |
|---|-------------|-------|
| E1 | **KPI sheet tuần** | Gặp · QUALIFIED · cọc · referral |
| E2 | **Retro 90 ngày** | Template so target [08](./08-MASTER-PLAN-INTEGRATED.md) |

---

## 3. Nguyên tắc build — không trùng Magnix / House X

| Làm ở Personal Brand | Không làm (đã có nơi khác) |
|----------------------|----------------------------|
| Face Vũ, Zalo cá nhân, deck gặp mặt | Wizard NOXH, Mini App code |
| Network VIP 50, script gọi | n8n inbound webhook Magnix |
| PDF in mang theo túi | Landing SEO dự án House X |
| Video Vũ kể case | Banner Zalo OA House X |
| KPI deal của Vũ | Admin ops toàn hệ thống |

**Tích hợp điểm chạm:**
- QR name card → House X (lớp 2)
- Lead wizard HOT → Vũ gọi (lớp 3) — SLA từ House X Admin
- `referral_source` → Magnix sheet (lớp 1) — field chung, view riêng cho Vũ

---

## 4. Cấu trúc thư mục đề xuất (khi triển khai asset)

```
docs/strategy/personal-brand/
├── 00-INDEX.md
├── 11-ARCHITECTURE-THREE-LAYERS.md
├── 12-PERSONAL-BRAND-OPS-GAP.md          ← file này
├── assets/
│   ├── IDENTITY-KIT.md
│   ├── SIGNATURES.md
│   └── DISCLAIMERS.md
├── deck/
│   └── VU-NGUYEN-MEETING-DECK-outline.md
├── sale-kit/
│   ├── checklist-noxh-print.md           → export PDF
│   └── case-book-template.md
├── scripts/
│   ├── network-call.md
│   └── zalo-follow-up-1-3-7-14.md
└── content/
    ├── calendar-90d.md
    └── case-post-template.md

public/brand/vu-nguyen/                   ← file visual
├── name-card/
├── profile/
└── sale-kit-pdf/
```

*Chưa tạo hết folder — tạo dần theo P0 khi bạn duyệt.*

---

## 5. Roadmap ưu tiên (4 tuần)

| Tuần | Việc | Output |
|------|------|--------|
| **1** | Identity kit + name card + chữ ký Zalo/email | Gặp network với nhận diện thống nhất |
| **2** | Checklist NOXH PDF + meeting prep 1 trang | Sale kit tối thiểu |
| **3** | Network list 50 + script gọi + deck outline | Bắt đầu blitz network |
| **4** | Content calendar + case template + KPI sheet | Vòng content + đo deal |

**Song song (không chờ):** Mỗi buổi gặp thật → nhập House X Admin (lớp 2) → Magnix tag (lớp 1).

---

## 6. Việc còn thiếu trong tài liệu hiện tại (cần bổ sung)

| # | Thiếu | Hành động |
|---|-------|-----------|
| 1 | Identity kit chi tiết (màu, font, ảnh) | Viết `assets/IDENTITY-KIT.md` |
| 2 | Deck 12 slide nội dung từng trang | Viết `deck/VU-NGUYEN-MEETING-DECK-outline.md` |
| 3 | Checklist NOXH nội dung 8–10 điểm in | Viết `sale-kit/checklist-noxh-print.md` |
| 4 | Template sổ case half-page | Viết `sale-kit/case-book-template.md` |
| 5 | Network tracker (sheet mẫu) | CSV/Airtable spec |
| 6 | Content calendar 90 ngày điền sẵn chủ đề | `content/calendar-90d.md` |
| 7 | Ảnh profile thật | Chụp — ngoài repo |
| 8 | Target deal số (cọc/VND) | User điền §9 master plan |

---

## 7. Quyết định cần bạn duyệt

1. **Tách repo asset:** `public/brand/vu-nguyen/` trong Proptech-HouseX — OK?
2. **Network CRM:** Sheet riêng hay view Airtable trong Magnix? (đề xuất: view riêng, 1 base)
3. **Checklist NOXH:** Đồng bộ nội dung với M1–M5 House X Admin — cần đọc `NOXH_CASE_PIPELINE.md` khi viết
4. **Bước build tiếp theo:** P0 nào trước — name card · checklist PDF · deck?
