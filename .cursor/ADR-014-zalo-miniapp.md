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

| Phase | Scope |
|-------|-------|
| **0 (now)** | ADR + scaffold Mini App + `POST /api/auth/zalo` + `zaloUserId` |
| **1** | Tab Khách: home, dự án, lead form |
| **2** | Tab Agent: cases, notifications, commissions |
| **3** | OA deep link + ZNS push (sau approve) |

## Env

```env
ZALO_APP_ID=
ZALO_APP_SECRET=
ZALO_OA_ID=
# Client Mini App:
# app-config.json → app.appId = Mini App ID
```
