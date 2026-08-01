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
| LMS | `/agent/dich-vu`, `/agent/dich-vu/:code` (đào tạo · pháp lý · dịch vụ — gồm `THAM_DINH_BDS`) |

## Development vs Testing (quan trọng)

| Status | Ai mở được | Khi nào dùng |
|--------|------------|--------------|
| **Development** | Chủ yếu tài khoản **Developer / Admin** trên console Mini App | Debug nhanh 1 máy |
| **Testing** | **Mọi tài khoản Zalo** quét QR phiên bản đó | Test nhiều máy / nhiều người — **mặc định của House X** |
| Live (`zalo.me/s/<appId>/`) | Bản đã duyệt / public | Không dùng để xem bản vừa deploy |

Quota bạn đang luôn **Testing = 0** → các lần deploy Development nên các Zalo khác / máy khác không thấy UI mới.

Nhận biết bundle đúng (mục **Tài khoản**): có **«1. Khách mua nhà»** và **«2. Cộng đồng môi giới House X»**; **không** còn «CTV thử nghiệm» / stamp `House X · hx…`.

## Deploy Testing trên VPS (khuyên dùng)

**Trắng màn:** nếu log còn `mock-agent.html` = Dist đang là source root → JS `assets/` không upload đúng. Script tạo **`.zmp-dist/`** (chỉ bundle) rồi deploy từ đó.

```bash
cd /opt/housex && git pull
cd housex-zalo-miniapp

# Chẩn đoán (nền vàng SMOKE OK) — log KHÔNG được nhắc mock-agent.html:
bash scripts/deploy-smoke-testing.sh

# Bản thật:
bash scripts/deploy-testing.sh
```

Khi CLI hỏi Dist: gõ **`.`** (cwd = `.zmp-dist`). Status = **Testing**.  
Sau deploy: nếu vẫn thấy warning `mock-agent.html` → Dist sai, dừng lại báo lại.

Sau deploy: **force-stop Zalo** → quét **QR Testing** trên terminal.

**Tài khoản:** Mini đăng nhập → **Xem hồ sơ đầy đủ** → webview handoff cookie.

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
