# Deploy DNA — không cần Zalo Callback URL

Phần có thể go-live ngay khi **chưa** đăng ký Official Account Callback URL.

---

## 1. Pull & build VPS

```bash
cd /opt/housex
git pull

cd Proptech-HouseX
npm ci
npx prisma generate
npm run db:deploy
npm run db:seed:agent-services
npm run db:bootstrap:agent-entitlements
npm run build
pm2 restart housex --update-env
```

## 2. Env DNA-D (API Explorer — không Callback)

Trên `developers.zalo.me` → app `1837365611738849660` → **API Explorer** → **OA Access Token**.

```env
ZALO_APP_ID=1837365611738849660
ZALO_APP_SECRET=<secret từ developers>
ZALO_OA_NOTIFY_ENABLED=false
# Chỉ bật true khi chạy tin quảng bá/chiến dịch qua OA — không dùng cho notify hệ thống CTV.
# ZALO_OA_ACCESS_TOKEN=<token từ API Explorer>  # khi bật OA
# Không set placeholder ZALO_OA_REFRESH_TOKEN
```

```bash
pm2 restart housex --update-env
npm run go-live:smoke-zalo-oa
```

Gửi tin thật (user đã follow OA):

```bash
ZALO_OA_TEST_USER_ID=<zalo_user_id> npm run go-live:smoke-zalo-oa
```

Hoặc qua Admin API (cookie `/admin/login`):

```http
GET  /api/admin/zalo-oa/smoke
POST /api/admin/zalo-oa/smoke
{ "zaloUserId": "..." }
```

## 3. n8n DNA-C (Telegram)

```bash
# Trên máy dev hoặc VPS có node
cd /opt/housex
node n8n-workflows/build-housex-noxh-lead.mjs
```

Re-import `n8n-workflows/housex-noxh-lead-route.workflow.json` trên n8n.

Env n8n:

```env
TELEGRAM_NOXH_CASE_ENABLED=true
TELEGRAM_CHAT_ID_NOXH_CASE_OPS=<chat_id>
```

## 4. Smoke end-to-end NOXH case

1. Wizard HOT → `noxhCaseCode` (DNA-B)
2. Admin đổi milestone → Telegram ops (DNA-C) + Zalo OA CTV (DNA-D)
3. CTV cần `zaloUserId` (login Mini App) + đã follow OA

## 5. P4 — Subdomain campaign (DNS + nginx)

Code redirect sẵn trong `middleware.ts`:

| Host | Đích |
|------|------|
| `noxh.timnhaxahoi.com` | `/du-an/nha-o-xa-hoi?utm_*` |
| `cctm.timnhaxahoi.com` | `/du-an/thuong-mai?utm_*` |

**Nginx** (cùng upstream `housex`):

```nginx
server {
  server_name noxh.timnhaxahoi.com cctm.timnhaxahoi.com;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

DNS: A record `noxh` / `cctm` → IP VPS.

## 6. Việc chờ Callback (không chặn MVP)

- `ZALO_OA_REFRESH_TOKEN` lâu dài qua `/api/zalo/oa/authorize` (sau khi đăng ký Callback)
- Renew `ZALO_OA_ACCESS_TOKEN` ~mỗi 20h nếu chưa có refresh token

---

*DNA-A/B/C/D + P4 lane redirect — 2026-07-09*
