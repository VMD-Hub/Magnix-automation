# House X — Zalo Mini App (ADR-014)

Frontend riêng cho Zalo Mini App: **Tab Khách** + **Tab Agent**.

Docs: `../Proptech-HouseX/docs/ZALO_MINIAPP_SPEC.md` · ADR: `../.cursor/ADR-014-zalo-miniapp.md` · DNA: `../Proptech-HouseX/docs/DNA_COMPLETION.md`

## Setup

```bash
cd housex-zalo-miniapp
npm install
cp .env.example .env
```

- `VITE_HOUSEX_API_BASE` → local `http://localhost:3000` · prod `https://timnhaxahoi.com`
- `app-config.json` → **`appId` chờ mai** khi Zalo cấp Mini App ID

## Dev (browser / Vite)

```bash
# Terminal 1 — House X API (Proptech-HouseX)
# .env: ZALO_AUTH_DEV_BYPASS=true (chỉ local, NODE_ENV≠production)

# Terminal 2
npm run dev
```

Login mock: **Tài khoản** → SĐT → `POST /api/auth/zalo` với `zaloUserId` (dev bypass).

## Phase đã có

| Phase | Routes |
|-------|--------|
| Khách | `/`, `/du-an/:slug`, `/tu-van`, `/cong-cu` |
| Agent | `/agent`, hồ sơ, thông báo, hoa hồng |
| LMS | `/agent/dich-vu`, `/agent/dich-vu/:code` (đào tạo · pháp lý · dịch vụ) |

## Mai — OA / Mini App thật (chờ xác nhận)

1. Điền Mini App ID vào `app-config.json`
2. VPS: `ZALO_APP_ID` / `ZALO_APP_SECRET` / `ZALO_OA_ID` — **tắt** `ZALO_AUTH_DEV_BYPASS`
3. Build: `VITE_HOUSEX_API_BASE=https://timnhaxahoi.com`, không bypass
4. Simulator + Graph token thật → smoke `/api/auth/me`

## Env API (VPS Proptech-HouseX)

```env
ZALO_APP_ID=
ZALO_APP_SECRET=
ZALO_OA_ID=
AUTH_SECRET=
# KHÔNG: ZALO_AUTH_DEV_BYPASS=true
```
