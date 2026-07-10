# House X — Lead Ops vs Affiliate: Rule xung đột & map hệ thống

> **Trạng thái:** Chốt nghiệp vụ (2026-07-10) — triển khai code theo phase bên dưới.  
> **Liên quan:** [NOXH_CASE_PIPELINE.md](NOXH_CASE_PIPELINE.md) · [MINIAPP_TWO_LANES.md](MINIAPP_TWO_LANES.md) · `lib/noxh-case/attribution-claim.ts` · `lib/rules/attribution-lock.ts`

---

## 1. Hai pipeline — một khóa định danh

| Pipeline | Ai sở hữu | Nguồn lead | Mục tiêu |
|----------|-----------|------------|----------|
| **A — Ops / Inbound sàn** | Team vận hành House X | Zalo Ads, Fanpage, form web, tool NOXH, Magnix UID, admin nhập tay | Phân loại → kịch bản chăm sóc → tư vấn / hồ sơ nền tảng |
| **B — Affiliate (MG / CTV)** | CTV/MG đã khai báo | CTV thả lead Mini App / web (`POST /api/ctv/cases`) | Giữ quyền giới thiệu trong khung thời gian + cập nhật lịch/tiến độ tư vấn |

**Khóa chính:** `normalizedPhone` (SĐT VN chuẩn hóa).  
**Nguyên tắc:** Một khách — **một chủ sở hữu tư vấn** tại một thời điểm (Ops **hoặc** CTV, không song song chen ngang).

---

## 2. Thực thể hệ thống

| Thực thể | Pipeline | Ghi chú |
|----------|----------|---------|
| `Lead` (`assignedBrokerId = null`) | A — Ops | `status`: NEW → CONTACTED → QUALIFIED → WON/LOST |
| `InboundUidLead` | A — Ops (Magnix) | UID thô → Ops nhập SĐT → tạo Lead / NoxhCase |
| `NoxhCase` (`brokerId = null`) | A — Ops | Hồ sơ nền tảng (wizard HOT, inbound) |
| `NoxhCase` (`brokerId = CTV`) | B — Affiliate | Fairplay lock 20 ngày LV |
| `AttributionLock` | B — Referral web | Cookie/ref link — 30 ngày (calendar) |

---

## 3. Nguồn lead Ops (phân loại)

| `Lead.source` (đề xuất) | Mô tả | Ai gán |
|-------------------------|--------|--------|
| `zalo_ads` | Form / landing từ Zalo Ads | Tự động (UTM) |
| `fanpage` | Facebook Fanpage → form / inbox | Tự động hoặc Ops |
| `tool:noxh-check` | Wizard `/cong-cu/dieu-kien-noxh` | Tự động |
| `miniapp:consult` | Form tư vấn Mini App | Tự động |
| `web:lead` | Form web chung | Tự động |
| `magnix:inbound` | UID Magnix → Admin inbound | Ops |
| `ops:manual` | Admin nhập tay | Ops |

**Kênh liên hệ** (lưu trên Lead/Customer meta — phase CRM-2): `phone`, `zalo`, `email`, `facebook` — phục vụ kịch bản nurture, không thay SĐT khóa chính.

---

## 4. Bảng rule xung đột (chốt)

### 4.1 Khi CTV affiliate **thả lead** (claim SĐT)

Thứ tự kiểm tra (`evaluateCtvClaim`):

| # | Điều kiện | Kết quả | Mã lỗi (hiện có) |
|---|-----------|---------|------------------|
| R1 | SĐT = SĐT của chính CTV | **Từ chối** | `SELF_REFERRAL` |
| R2 | CTV chưa unlock `NOXH_CLAIM` | **Từ chối** | `BROKER_NOT_CTV` |
| R3 | `NoxhCase` ACTIVE, `brokerId` ≠ CTV này, còn lock | **Từ chối** | `ACTIVE_CASE_OTHER_CTV` |
| R4 | `Lead` sàn Ops `CONTACTED`/`QUALIFIED`, `assignedBrokerId = null`, trong **20 ngày LV** | **Từ chối** | `PLATFORM_LEAD_ACTIVE` |
| R5 | Không rơi R1–R4 | **Cho claim** + lock 20 ngày LV | — |

**Thông báo CTV (R4):** *"Khách đang được House X tư vấn. Thử lại sau khi hết thời gian chờ hoặc liên hệ Ops."*

### 4.2 Khi Ops **nhận lead mới** (ads / form) — SĐT đã có CTV claim

| Điều kiện | Kết quả | Hành động Ops |
|-----------|---------|---------------|
| `NoxhCase` ACTIVE + CTV lock còn hạn | **Không ghi đè** CTV | Tạo `Lead` Ops gắn `customerId`, trạng thái chờ; mở **Conflict queue** |
| CTV lock **hết hạn** + không có tiến độ tư vấn (phase CRM-2) | Ops **ưu tiên** | Release lock (cron) → Ops tiếp quản |
| `UnitBooking` đã cọc (`convertedAt`) | CTV **giữ vĩnh viễn** | Ops chỉ hỗ trợ hậu kỳ, không đổi attribution |

### 4.3 CTV vs CTV (hai affiliate cùng SĐT)

| Điều kiện | Kết quả |
|-----------|---------|
| CTV A đã claim, lock còn hạn | CTV B **từ chối** (`ACTIVE_CASE_OTHER_CTV`) |
| CTV A lock hết hạn, không M3+ | CTV B **có thể** claim (first valid claim) |
| Ops quyết định tranh chấp | Admin override (phase CRM-2) — ghi `AttributionEvent` |

### 4.4 Referral link web (cookie) vs Ops

| Điều kiện | Kết quả |
|-----------|---------|
| Khách vào qua link CTV, tạo `Lead` trong 30 ngày | `assignedBrokerId` = CTV (`attribution-lock`) |
| Ops đã `CONTACTED+` trước khi có referral | **Giữ Ops** — referral ghi audit `conflict_kept` |
| Self-referral (CTV = SĐT khách) | Bỏ referral (`self_referral_blocked`) |

---

## 5. Thời hạn & env

| Tham số | Mặc định | Ý nghĩa |
|---------|----------|---------|
| `CTV_CLAIM_LOCK_BUSINESS_DAYS` | **20** (T2–T6) | CTV giữ quyền affiliate sau claim |
| `PLATFORM_LEAD_ACTIVE_BUSINESS_DAYS` | **20** (T2–T6) | Ops `CONTACTED+` chặn claim CTV |
| `ATTRIBUTION_LOCK_DAYS` | **30** (calendar) | Lock referral web |

Cron: `noxh-case-maintenance` — release lock hết hạn, SLA M1.

---

## 6. Nghĩa vụ CTV affiliate (giữ quyền)

Khai báo tối thiểu khi claim:

| Field | Bắt buộc | Ghi chú |
|-------|----------|---------|
| `normalizedPhone` | Có | Khóa chính |
| `customerName` | Có | Tên gọi — **chưa cần** trùng CMND 100% |
| `message` | Khuyến nghị | Bối cảnh giới thiệu |

**Giữ lock** (phase CRM-2 — bổ sung code):

| Hành vi | Tần suất | Nếu thiếu |
|---------|----------|-----------|
| Cập nhật **lịch tư vấn** (`consultScheduledAt`) | Khi claim + mỗi lần đổi lịch | Cảnh báo D-3 trước hết lock |
| Ghi **tiến độ tư vấn** (`CaseAssistLog` / NOTE) | ≥ 1 lần / 7 ngày LV nếu case ACTIVE | Lock không gia hạn; Ops có thể release sớm |
| Nudge Ops | Tùy chọn | Đã có `POST .../nudge` |

---

## 7. Ops inbound — kịch bản chăm sóc

| `Lead.status` | Ops làm gì | Ảnh hưởng claim CTV |
|---------------|------------|---------------------|
| `NEW` | Phân loại nguồn + segment; gán kịch bản | Chưa chặn CTV |
| `CONTACTED` | Đã liên hệ lần 1 — ghi kênh (Zalo/email/FB) | **Bật R4** trong 20 ngày LV |
| `QUALIFIED` | Đủ điều kiện tư vấn sâu / hồ sơ | **Bật R4** |
| `WON` | Chuyển hồ sơ / HĐMB | Ops giữ pipeline chính |
| `LOST` | Nurture lại sau X ngày | Hết R4 → CTV có thể claim (nếu không case khác) |

**Kịch bản nurture** (phase CRM-2): map `segment` (NOXH/CCTM) + `source` + tier tool → template OA/Telegram nội bộ.

---

## 8. Xử lý xung đột có người (Ops queue)

Khi R4 hoặc Ops-vs-CTV tranh chấp:

```
CTV claim bị chặn / Ops phát hiện trùng
        │
        ▼
  Admin → Hàng đợi Xung đột (phase CRM-2)
        │
        ├─ Giữ Ops (mặc định nếu CONTACTED+ trong hạn)
        ├─ Chuyển CTV (hiếm — cần lý do + Ops lead)
        ├─ Chia lane (NOXH Ops / CCTM CTV) — chỉ khi 2 intent khác nhau
        └─ Đóng cả hai (khách trùng spam / sai SĐT)
        │
        ▼
  Ghi AttributionEvent + thông báo CTV (Mini App + OA)
```

| Quyết định | Ai duyệt | Audit |
|------------|----------|-------|
| Giữ Ops | Ops lead | `conflict_kept_platform` |
| Chuyển CTV | Ops lead + ghi chú | `conflict_release_to_ctv` |
| Gia hạn lock CTV | Ops (CTV đủ tiến độ) | `lock_extended` |

---

## 9. Map màn hình

### Admin (Proptech-HouseX)

| Màn hình | Pipeline | Việc |
|----------|----------|------|
| `/admin/inbound-leads` | A | UID Magnix → SĐT → Lead / NoxhCase |
| `/admin/inbound-leads` (mở rộng) | A | Nguồn: zalo_ads / fanpage / manual |
| `/admin/noxh-cases` | A + B | Milestone; `brokerId` null = Ops |
| **Conflict queue** (mới) | A∩B | Duyệt xung đột SĐT |
| Lead board (mới) | A | Danh sách ads lead, status, nurture |

### Mini App Agent (`housex-zalo-miniapp`)

| Route | Pipeline | Việc |
|-------|----------|------|
| `/agent/ho-so` | B | Thả lead — chạy R1–R5 |
| `/agent/ho-so/:id` | B | Tiến độ, checklist, lịch tư vấn (CRM-2) |
| `/agent/thong-bao` | B | Bị chặn claim / milestone |
| `/agent` dashboard (CRM-1) | B | Tóm tắt + share ref |

**Khách** (tab Khách): không thấy pipeline Ops/CTV — chỉ tool + form.

---

## 10. Phase triển khai code

| Phase | Việc | File / API gợi ý |
|-------|------|------------------|
| **CRM-R0** | ✅ Rule R1–R5 | `lib/noxh-case/attribution-claim.ts` |
| **CRM-R1** | Chuẩn hóa `Lead.source` enum + UTM | `lib/leads/source.ts`, `POST /api/leads` |
| **CRM-R2** | Conflict queue Admin | `AttributionConflict` table + `/admin/conflicts` |
| **CRM-R3** | CTV lịch + tiến độ bắt buộc | `NoxhCase.consultScheduledAt`, validate trước gia hạn lock |
| **CRM-R4** | Ops lead board + nurture meta | Lead `meta.channels`, `meta.nurtureScriptId` |
| **CRM-R5** | OA notify xung đột | `broker-oa-notify.ts` + event `attribution.conflict` |

---

## 11. Tóm tắt một dòng

> **Ops sở hữu lead marketing; CTV sở hữu quyền affiliate qua claim + tiến độ; SĐT trùng → rule tự động chặn + Ops duyệt ngoại lệ.**
