# House X — Zalo Mini App Spec (ADR-014)

## IA — 2 lớp

```
┌─────────────────────────────────────┐
│ House X Mini App                    │
├──────────────┬──────────────────────┤
│ Tab Khách    │ Tab Agent (ẩn nếu chưa│
│ (default)    │  có quyền BROKER/CTV) │
├──────────────┼──────────────────────┤
│ Home NOXH    │ Hồ sơ NOXH           │
│ Dự án / tin  │ Thả lead             │
│ Công cụ vay  │ Thông báo            │
│ Form tư vấn  │ Hoa hồng             │
│ Tài khoản    │ Đăng ký CTV / switch │
└──────────────┴──────────────────────┘
         │ Bearer token
         ▼
   https://timnhaxahoi.com/api/*
```

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

## MVP màn hình Phase 1 (Khách)

| Route (Mini) | API |
|--------------|-----|
| `/` Home | `GET /api/projects?projectType=NHA_O_XA_HOI&status=DANG_BAN` |
| `/du-an/:slug` | `GET /api/projects/:slug` + form `POST /api/leads` |
| `/tu-van` | `POST /api/leads` ( chọn `projectId` ) |
| `/tai-khoan` | `GET /api/auth/me` · `POST /api/auth/zalo` |

CORS: `/api/projects`, `/api/projects/:slug`, `/api/leads` dùng `applyApiCors` + `OPTIONS`.

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

## Repo

```
magnix-automation/
  housex-zalo-miniapp/     # Vite + React + TS
  Proptech-HouseX/         # API + web SEO
  .cursor/ADR-014-zalo-miniapp.md
```

## Checklist trước publish

- [ ] Mini App xác thực OA
- [ ] `ZALO_APP_ID` / `ZALO_APP_SECRET` trên VPS
- [ ] Migrate `zalo_user_id` đã apply
- [ ] Smoke: Simulator login → Bearer → `/api/auth/me`
- [ ] Không hứa duyệt vay trên UI Mini App
