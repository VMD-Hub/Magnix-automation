# ADR-014 — Zalo Mini App (House X + HouseX Agent)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-08 |
| **Depends on** | ADR-013 (Postgres SoR) |
| **Deciders** | House X / Magnix |

## Context

- Đã có **Zalo OA chính thức** + **Zalo App** (domain `timnhaxahoi.com` verified).
- House X web (`timnhaxahoi.com`) có 2 persona: **CUSTOMER** (tìm nhà) và **BROKER/CTV** (HouseX Agent) — cùng Postgres.
- Zalo Mini App chạy trong Zalo webview (React + zmp-sdk), **không** nhúng Next.js SSR.
- Cookie `hx_session` không tin cậy trong Zalo webview → cần **Bearer token** (cùng format token phiên hiện tại).

## Decision

1. **Một Mini App, hai lớp UI** (Shopee-style):
   - Tab **Khách** (mặc định): dự án NOXH, tin, công cụ, lead.
   - Tab **Agent**: hồ sơ NOXH, thả lead, thông báo, hoa hồng — chỉ hiện khi `role=BROKER` hoặc đã đăng ký CTV.
2. **Frontend riêng:** repo `housex-zalo-miniapp/` (Vite + React + TypeScript + zmp-ui).
3. **Backend giữ Proptech-HouseX:** Postgres SoR; Mini App chỉ gọi JSON API.
4. **Auth:** `POST /api/auth/zalo` verify `accessToken` với Zalo Graph → upsert `UserAccount.zaloUserId` → trả **session token** (Bearer) + profile.
5. **Admin ops** (`/admin`) **không** vào Mini App.
6. **Magnix inbound** không đổi — vẫn ingest Postgres; Mini App chỉ là kênh experience.

## Non-goals (MVP)

- Wrap full website trong `openWebview`.
- ZNS production / thanh toán trong Mini App.
- Dual DB hay sync Sheet cho auth.

## Consequences

### Positive

- CTV + khách trên cùng kênh OA / Mini App.
- Reuse API CTV / listings / leads hiện có.
- Dev song song trong lúc chờ duyệt Mini App (Simulator + mock auth).

### Trade-offs

- Maintain 2 frontend (web SEO + Mini App).
- Cần map phone Zalo ↔ `normalizedPhone` (legal + dedupe).
- Secret App chỉ trên VPS — không commit.

## Phases

| Phase | Scope | Status |
|-------|--------|--------|
| **0** | ADR + scaffold + `POST /api/auth/zalo` + `zaloUserId` | ✅ |
| **1** | Tab Khách: home, dự án, lead, tools | ✅ |
| **2** | Tab Agent: cases, notifications, commissions | ✅ |
| **3a** | Đào tạo / pháp lý / quản lý dịch vụ + quiz unlock | ✅ |
| **3b** | Thông báo CTV: in-app (mặc định); OA CS tùy chọn (marketing) | ✅ in-app / 🔜 OA campaign |

## Thông báo CTV & Zalo OA (chốt 2026-07)

| Kênh | Dùng cho | Mặc định | Phí |
|------|----------|----------|-----|
| **In-app** (`brokerNotification` → `/api/ctv/notifications`) | Milestone NOXH, xung đột attribution, claim blocked | **Bật** | Miễn phí |
| **Zalo OA CS API** (`broker-oa-notify.ts`, `/oa/message/cs`) | Chiến dịch quảng bá / broadcast (phase sau) | **Tắt** (`ZALO_OA_NOTIFY_ENABLED=false`) | Gói OA + hạn mức tin |
| **Push Mini App** (`requestSendNotification`) | Nhắc ngoài app (tùy chọn sau) | Chưa bật | Qua hệ thống OA |

**Quy tắc vận hành:**

1. CTV đăng ký → trách nhiệm mở Mini App / bật thông báo; hệ thống **không** spam OA cho notify Ops.
2. Wizard HOT auto-case **không** đổi `Lead.status` sang `CONTACTED` — giữ `NEW`; fairplay R4 chặn claim qua `NoxhCase` platform active (`brokerId = null`, 20 ngày LV).
3. Nhãn Ops lead: `CONTACTED` = «Đã tiếp nhận»; `QUALIFIED` = «Đã liên hệ» (đã gọi/chăm sóc).
4. Bật OA API chỉ khi chạy marketing — cần gói **Tăng trưởng** trở lên (lỗi `-224` nếu gói Tiêu chuẩn).

**Tài liệu:** `Proptech-HouseX/docs/DNA_COMPLETION.md` · `NOXH_CASE_PIPELINE.md` · `LEAD_ATTRIBUTION_CONFLICT_RULES.md` §7.

## Env

```env
ZALO_APP_ID=
ZALO_APP_SECRET=
ZALO_OA_ID=
# Client Mini App:
# app-config.json → app.appId = Mini App ID (điền khi Zalo cấp — mai)
# Production: KHÔNG bật ZALO_AUTH_DEV_BYPASS
```
