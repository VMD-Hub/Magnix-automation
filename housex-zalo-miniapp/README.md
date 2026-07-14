# House X — Zalo Mini App (ADR-014)

Frontend riêng cho Zalo Mini App: **Tab Khách** + **Tab Agent**.

Docs: `../Proptech-HouseX/docs/ZALO_MINIAPP_SPEC.md` · **Two Lanes:** `../Proptech-HouseX/docs/MINIAPP_TWO_LANES.md` · ADR: `../.cursor/ADR-014-zalo-miniapp.md`

## Setup

```bash
cd housex-zalo-miniapp
npm install
cp .env.example .env
```

- `VITE_HOUSEX_API_BASE` → local `http://localhost:3000` · prod `https://timnhaxahoi.com`
- `app-config.json` → `app.appId` = `1554712272702750699` (House X Mini App)

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
| Khách (two lanes) | `/start`, `/noxh`, `/cctm`, `/kham-pha`, `/du-an/:slug`, `/tu-van`, `/cong-cu` |
| Agent | `/agent`, hồ sơ, thông báo, hoa hồng |
| LMS | `/agent/dich-vu`, `/agent/dich-vu/:code` (đào tạo · pháp lý · dịch vụ) |

## Build production (ZMP deploy)

```bash
# .env.production hoặc export trước khi build:
# VITE_HOUSEX_API_BASE=https://timnhaxahoi.com
# VITE_AUTH_DEV_BYPASS=false

npm run build:zmp    # → www/assets/index-*.js + index-*.css (có hash chống cache)
zmp login
zmp deploy
# Mini App ID: 1554712272702750699
# dist folder: www
#
# QUAN TRỌNG — xem bản vừa deploy:
# 1) Phải chạy `npm run build:zmp` trước `zmp deploy` (www không có trong git).
# 2) Chọn Version status = Testing (không chỉ Development).
# 3) Quét đúng QR trên terminal lần deploy đó — đóng hẳn Zalo rồi mở lại.
# 4) KHÔNG mở bằng OA / link https://zalo.me/s/<appId>/ (đó là bản Live đã duyệt — cũ).
# 5) Vào lane NOXH; teaser phải có mã build dạng "KHUYẾN MÃI NOXH · hx…".
```

`app-config.json` được sync từ `www/index.html` — luôn khai báo đúng `listCSS` / `listAsyncJS` sau `build:zmp`.

## Deploy checklist (VPS)

```bash
cd /opt/housex && git pull
cd housex-zalo-miniapp
npm run build:zmp   # phải in: verify-promo-bundle: OK
grep -o 'Quay là có quà' www/assets/*.js
cat app-config.json
zmp deploy          # chọn Testing
```

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
