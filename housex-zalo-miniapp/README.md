# House X — Zalo Mini App (ADR-014)

Frontend riêng cho Zalo Mini App: **Tab Khách** + **Tab Agent**.

Docs: `../Proptech-HouseX/docs/ZALO_MINIAPP_SPEC.md` · ADR: `../.cursor/ADR-014-zalo-miniapp.md`

## Setup

```bash
cd housex-zalo-miniapp
npm install
```

Sửa `src/config.ts`:

- `HOUSEX_API_BASE` → `https://timnhaxahoi.com` (prod) hoặc `http://localhost:3000`
- `app-config.json` → gắn **Mini App ID** khi Zalo cấp (qua ZMP Extension / CLI)

## Dev (browser / Vite)

```bash
# Terminal 1 — House X API (Proptech-HouseX)
# .env: ZALO_AUTH_DEV_BYPASS=true (chỉ local)

# Terminal 2
npm run dev
```

Login mock: màn **Tài khoản** → nhập SĐT → gọi `POST /api/auth/zalo` với `zaloUserId` (dev bypass).

## Zalo Simulator

1. VS Code extension **Zalo Mini App**
2. Mở folder này, gắn Mini App ID
3. Run → Simulator
4. Tắt `ZALO_AUTH_DEV_BYPASS` trên VPS; dùng `getAccessToken` + `getPhoneNumber` thật

## Env API (VPS Proptech-HouseX)

```env
ZALO_APP_ID=
ZALO_APP_SECRET=
ZALO_OA_ID=
AUTH_SECRET=   # bắt buộc production
```

## Phase 2 (Agent) — đã scaffold

| Route | API |
|-------|-----|
| `/agent` | Hub + unread notifications |
| `/agent/ho-so` | `GET/POST /api/ctv/cases` |
| `/agent/ho-so/:id` | `GET .../cases/:id` + nudge |
| `/agent/thong-bao` | `GET/PATCH /api/ctv/notifications` |
| `/agent/hoa-hong` | `GET /api/ctv/commissions` |

Local test: Tài khoản → tick **Đăng nhập Agent (CTV thử nghiệm)** (cần `ZALO_AUTH_DEV_BYPASS` trên API).
