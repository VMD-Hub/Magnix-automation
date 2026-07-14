# House X — Zalo Mini App Spec (ADR-014)

## IA — 2 lớp + Two Lanes (Khách)

> **Chi tiết:** [MINIAPP_TWO_LANES.md](MINIAPP_TWO_LANES.md) — one brand, two lanes (NOXH / CCTM).

```
┌─────────────────────────────────────┐
│ House X Mini App                    │
├──────────────┬──────────────────────┤
│ /start → lane│ Tab Agent (ẩn nếu chưa│
│ /noxh | /cctm│  có quyền BROKER/CTV) │
├──────────────┼──────────────────────┤
│ Home theo lane│ Hồ sơ NOXH           │
│ Dự án / tin  │ Dịch vụ / Đào tạo    │
│ Công cụ vay  │ Pháp lý BĐS          │
│ Form tư vấn  │ Thông báo / Hoa hồng │
│ Tài khoản    │ Đăng ký CTV / switch │
└──────────────┴──────────────────────┘
         │ Bearer token
         ▼
   https://timnhaxahoi.com/api/*
```

## IA — 2 lớp (legacy diagram)

## Auth flow

```
Mini App                  House X API              Zalo Graph
   │                           │                        │
   │ getAccessToken()          │                        │
   │ getPhoneNumber() → code   │                        │
   │── POST /api/auth/zalo ───►│                        │
   │  { accessToken, phone,    │── GET /v2.0/me ───────►│
   │    phoneToken? }          │◄── { id, name } ───────│
   │                           │ (optional) /me/info    │
   │◄── { token, user } ───────│                        │
   │ storage.setItem(token)    │                        │
   │ Authorization: Bearer …   │                        │
```

### `POST /api/auth/zalo`

**Body**

| Field | Required | Notes |
|-------|----------|-------|
| `accessToken` | yes* | Từ zmp-sdk (`*` hoặc `zaloUserId` khi `ZALO_AUTH_DEV_BYPASS=true`) |
| `phone` | yes | SĐT VN sau khi user đồng ý |
| `phoneToken` | no | Code từ `getPhoneNumber` — server verify nếu có Secret |
| `name` | no | Fallback display name |
| `preferredRole` | no | `CUSTOMER` (default) \| `BROKER` cho account mới |

**Response `200`**

```json
{
  "data": {
    "token": "<session token>",
    "user": { "id", "role", "name", "phoneMasked", "brokerId?", "ctvCode?", ... }
  }
}
```

**Errors:** `401 ZALO_TOKEN_INVALID` · `422 INVALID_PHONE` · `429 RATE_LIMITED`

### Session

- Cùng HMAC token với web (`AUTH_SECRET`).
- Mini App: `Authorization: Bearer <token>`.
- Web: cookie `hx_session` (không đổi).
- `getSessionUser` / `getSessionUserFromRequest` đọc **Bearer trước**, rồi cookie.

## Map account

1. Tìm `UserAccount` theo `zaloUserId`.
2. Nếu không: tìm theo `normalizedPhone` → gắn `zaloUserId`.
3. Nếu không: tạo account mới (CUSTOMER hoặc BROKER theo `preferredRole`), `passwordHash` random unusable, email placeholder `zalo_<id>@users.housex.local`.

## MVP màn hình Phase 1 (Khách) — Two Lanes

| Route (Mini) | API / hành vi |
|--------------|---------------|
| `/` | Redirect → remember lane / `/start` / `?lane=noxh\|cctm` |
| `/start` | Chọn lane (không tabbar) |
| `/noxh` | `GET /api/projects?projectType=NHA_O_XA_HOI&status=DANG_BAN` |
| `/cctm` | `GET /api/projects?projectType=THUONG_MAI&status=DANG_BAN` |
| `/kham-pha` | Hub khi user chưa chắc |
| `/du-an/:slug` | `GET /api/projects/:slug` + `POST /api/leads` |
| `/tu-van` | `POST /api/leads` |
| `/tai-khoan` | Auth + đổi lane + CTA **hồ sơ đầy đủ** (web SoR) |

### Account — Mini Auth + Web SoR

- Đăng nhập / đăng ký: Mini App (`POST /api/auth/zalo`, Bearer `localStorage`).
- Dashboard khách (lead, booking, quà NOXH): **web** `/khach-hang/tai-khoan` — một UI store of record.
- Cầu nối phiên: `POST /api/auth/miniapp-handoff` (Bearer) → one-time `code` → webview `GET /api/auth/miniapp-handoff/consume?code&next=` Set-Cookie `hx_session` + 302.  
  `next` allowlist: `/khach-hang/tai-khoan`, `/moi-gioi/tai-khoan`.

Chi tiết UX: [MINIAPP_TWO_LANES.md](MINIAPP_TWO_LANES.md).

CORS: `/api/projects`, `/api/projects/:slug`, `/api/leads`, `/api/auth/zalo`, `/api/auth/miniapp-handoff` dùng `applyApiCors` + `OPTIONS`.

## Phase 2 (Agent) — scaffolded

| Route | API |
|-------|-----|
| `/agent` | Hub Agent |
| `/agent/ho-so` | `GET/POST /api/ctv/cases` (+ form thả lead) |
| `/agent/ho-so/:id` | `GET /api/ctv/cases/:id` + `POST .../nudge` |
| `/agent/thong-bao` | `GET/PATCH /api/ctv/notifications` |
| `/agent/hoa-hong` | `GET /api/ctv/commissions` |

CORS: toàn bộ `/api/ctv/*` dùng `applyApiCors` + `OPTIONS`.  
Local: login với `preferredRole=BROKER` + `ZALO_AUTH_DEV_BYPASS` (auto `brokerType=CTV` + `ctvCode` DEV*).

## Phase 3 (Đào tạo · Pháp lý · Quản lý dịch vụ)

Catalog `AgentService` (TRAINING / LEGAL / PRODUCT) + `AgentEntitlement` + quiz. Đậu quiz → ACTIVE service đó và auto-unlock product phụ thuộc (`requiresCode`).

| Route | API |
|-------|-----|
| `/agent/dich-vu` | `GET /api/ctv/services` (tab `?tab=product\|training\|legal`) |
| `/agent/dich-vu/:code` | `GET /api/ctv/services/:code` + `POST /api/ctv/quizzes/submit` |
| Thả lead | `POST /api/ctv/cases` yêu cầu entitlement `NOXH_CLAIM` (sau `CTV_ONBOARDING`) |

Seed: `npm run db:seed:agent-services` — `CTV_ONBOARDING`, `LEGAL_BROKER_BASICS`, `NOXH_CLAIM`, `LISTING_POST`.

## Thông báo CTV (chốt kiến trúc 2026-07)

| Sự kiện | Kênh chính | OA API |
|---------|------------|--------|
| Milestone hồ sơ NOXH | In-app `/agent/thong-bao` | Tắt mặc định |
| Xung đột attribution | In-app + Admin queue | Tắt mặc định |
| Chiến dịch Zalo Ads / lead magnet | OA Broadcast / template (sau) | Bật khi cần |

```env
# Production MVP — không cần token OA cho notify hệ thống
ZALO_OA_NOTIFY_ENABLED=false
```

Khi `ZALO_OA_NOTIFY_ENABLED=true`, outbox `noxh_case.milestone_changed` và `attribution.conflict` **có thể** gọi thêm `broker-oa-notify.ts` (best-effort). Khuyến nghị giữ `false` đến phase marketing.

**Ops lead:** wizard HOT tạo `NoxhCase` nhưng **giữ** `Lead.status=NEW`; badge «Hồ sơ NOXH: HX-…» trên `/admin/ops-leads`.

## Repo

```
magnix-automation/
  housex-zalo-miniapp/     # Vite + React + TS
  Proptech-HouseX/         # API + web SEO
  .cursor/ADR-014-zalo-miniapp.md
```

## Checklist trước publish

### Code / DB (làm trước — không cần OA)

- [x] Phase 1–3a Mini App + LMS unlock (`DNA_COMPLETION.md`)
- [x] Two Lanes NOXH/CCTM (`MINIAPP_TWO_LANES.md`)
- [ ] VPS: `db:deploy` + `db:seed:agent-services` + `db:bootstrap:agent-entitlements`
- [x] Production chặn `ZALO_AUTH_DEV_BYPASS`

### Mai — OA / Mini App thật (chờ xác nhận)

- [ ] Mini App xác thực OA
- [ ] Mini App ID trong `app-config.json`
- [ ] `ZALO_APP_ID` / `ZALO_APP_SECRET` / `ZALO_OA_ID` trên VPS
- [ ] Smoke: Simulator login Graph → Bearer → `/api/auth/me`
- [ ] Không hứa duyệt vay trên UI Mini App
