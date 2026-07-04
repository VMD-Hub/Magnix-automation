# Go-live House X — Checklist nội dung & vận hành

Tài liệu ưu tiên đưa site lên production sớm. CTV/LMS chi tiết ở phase sau.

**Domain tạm:** `timnhaxahoi.com` · Brand: **House X** · Deploy chi tiết: [DEPLOY_TIMNHAXAHOI.md](DEPLOY_TIMNHAXAHOI.md) · VPS: [DEPLOY_VPS_TIMNHAXAHOI.md](DEPLOY_VPS_TIMNHAXAHOI.md)

---

## Ưu tiên 1 — Go-live auth & DB (đang triển khai)

### Local (Windows / macOS — cần Docker Desktop)

```bash
npm run go-live:p1-local
npm run dev
SITE=http://localhost:3000 npm run go-live:smoke-auth
```

### VPS Linux (`/opt/housex/Proptech-HouseX`)

> **Lưu ý:** Dùng cú pháp bash, không dùng `$env:SITE=…` (PowerShell).

```bash
cd /opt/housex/Proptech-HouseX
git pull                          # lấy script go-live:p1-vps, go-live:smoke-auth
npm ci
npm run go-live:sync-db-url       # DATABASE_URL khớp .env.prod (fix auth fail PM2)
npm run go-live:verify-db         # test Prisma login thật (khác check-env-files)
npm run go-live:p1-vps            # db:deploy (Postgres đã chạy trên VPS)
npm run build
npm start &                         # hoặc pm2 restart housex — port 3000
SITE=http://127.0.0.1:3000 npm run go-live:smoke-auth
SITE=https://timnhaxahoi.com npm run go-live:smoke
```

Dev trên VPS (nếu port 3000 bận → Next dùng 3001):

```bash
npm run dev -- --port 3001
SITE=http://127.0.0.1:3001 npm run go-live:smoke-auth
```

| Script | Mục đích |
|--------|----------|
| `npm run go-live:secrets` | Sinh `AUTH_SECRET`, `ADMIN_SECRET`, `CRON_SECRET` |
| `npm run go-live:p1-local` | Docker Postgres + `db:deploy` |
| `npm run go-live:smoke-auth` | API test: đăng ký khách/MG, verify email, login, logout |
| `NODE_ENV=production npm run go-live:check-env` | Validate env trước deploy VPS |

Email local: không cần Resend — `[email:dev]` log ra console khi đăng ký.

### Production VPS — checklist

- [ ] Copy `.env.production.example` → `.env` trên VPS (không dùng mật khẩu `postgres:postgres`)
- [ ] `npm run go-live:secrets` → điền secret vào `.env`
- [ ] Cấu hình **một** email provider: `RESEND_API_KEY` + `EMAIL_FROM` **hoặc** `EMAIL_WEBHOOK_URL` (n8n)
- [ ] `REDIS_URL` + `DATABASE_URL` production
- [ ] `npm run db:deploy` (không `db:push`)
- [ ] `NODE_ENV=production npm run go-live:check-env`
- [ ] Smoke: đăng ký khách → email verify thật → reveal SĐT tin đăng
- [ ] Smoke: đăng ký môi giới → `/moi-gioi/tai-khoan` → nộp CTV → `/admin/ctv`

---

## Ưu tiên 1 — Go-live (lộ trình đầy đủ)

### Bước 1 — Hạ tầng & env

| # | Việc | Lệnh / ghi chú |
|---|------|----------------|
| 1.1 | DNS `@` + `www` → VPS | Giữ A record iNET → `103.72.99.131` |
| 1.2 | Postgres + Redis trên VPS | `docker compose -f docker-compose.prod.yml --env-file .env.prod up -d` |
| 1.3 | Copy env production | `cp .env.production.example .env` → điền giá trị |
| 1.4 | Sinh secret | `npm run go-live:secrets` |
| 1.5 | Kiểm tra env | `npm run go-live:check-env` (trên VPS sau khi set biến) |
| 1.6 | Email gửi | Resend **hoặc** n8n `EMAIL_WEBHOOK_URL` — verify SPF/DKIM domain |

Biến **bắt buộc:** `DATABASE_URL`, `REDIS_URL`, `NEXT_PUBLIC_SITE_URL`, `AUTH_SECRET`, `ADMIN_SECRET`, `CRON_SECRET`, email provider.

### Bước 2 — Database

```bash
npm ci
npx prisma generate
npm run db:deploy          # migration init đã có trong prisma/migrations/
# Seed: chỉ staging / lần đầu có dữ liệu mẫu
# npm run db:seed
```

> Trước đây dùng `db:push` — production nên dùng `db:deploy` để có lịch sử migration.

### Bước 3 — Build & chạy

```bash
npm run build
pm2 start npm --name housex -- start    # VPS — xem DEPLOY_VPS
pm2 save && pm2 startup
```

Hoặc Vercel: root `Proptech-HouseX`, build command `npm run build`, set env trong dashboard.

### Bước 4 — SSL + nginx

Certbot + proxy `:3000` — mẫu config trong [DEPLOY_VPS_TIMNHAXAHOI.md](DEPLOY_VPS_TIMNHAXAHOI.md) §3.

### Bước 5 — Smoke test

```bash
SITE=https://timnhaxahoi.com npm run go-live:smoke
```

Kiểm tra thủ công:

- [ ] Đăng ký khách → email verify (Resend / n8n)
- [ ] OG preview đúng URL `timnhaxahoi.com`
- [ ] Footer / Liên hệ — `NEXT_PUBLIC_SUPPORT_EMAIL`
- [ ] `/admin/ctv` — login `ADMIN_SECRET`
- [ ] Logo: upload file tĩnh sau (tạm dùng SVG hiện tại)

### Bước 6 — SEO

- [ ] Search Console — property `https://timnhaxahoi.com`
- [ ] Submit `https://timnhaxahoi.com/sitemap.xml`

### Bước 7 — Nội dung trước index (song song)

- [ ] **Ảnh thật** cho 3–5 dự án NOXH ưu tiên (seed đang placeholder)
- [ ] Rà soát copy giá / tiến độ — nguồn Sở XĐ / CĐT

### Bước 8 — Cron (sau khi site ổn)

```cron
0 * * * * curl -fsS -H "Authorization: Bearer $CRON_SECRET" https://timnhaxahoi.com/api/cron/expire-listings
```

---

## Script tiện ích (repo)

| Lệnh | Mục đích |
|------|----------|
| `npm run go-live:secrets` | Sinh AUTH / ADMIN / CRON secret |
| `npm run go-live:p1-local` | Docker + `db:deploy` (local P1) |
| `npm run go-live:sync-db-url` | Đồng bộ `DATABASE_URL` từ `.env.prod` → `.env` + `.env.production` |
| `npm run go-live:smoke-auth` | Smoke đăng ký khách + môi giới (`SITE=…`) |
| `npm run go-live:check-env` | Validate env bắt buộc |
| `npm run go-live:smoke` | SSR smoke test (`SITE=https://...`) |
| `npm run db:seed:vinhomes` | Seed 3 landing Vinhomes → `/du-an` — xem [DEPLOY_VINHOMES.md](DEPLOY_VINHOMES.md) |

---

## Quy tắc CTV (đã ghi nhận — triển khai LMS sau)

| Bước | Trạng thái |
|------|------------|
| Môi giới có tài khoản đăng tin | ✅ API |
| Nộp đơn CTV (`/moi-gioi/dang-ky-ctv`) | ✅ |
| **Khóa đào tạo hội nhập** | 🔜 Phase sau |
| Admin duyệt + cấp `HX-CTV-xxxxxx` | ✅ |
| LMS → `trainingCompletedAt` | 🔜 |

---

## Lớp 1 — Launch (nội dung public)

| Hạng mục | Trạng thái |
|----------|------------|
| Trang chủ + design system | ✅ |
| `/mua-ban`, `/cho-thue` SSR + filter | ✅ |
| `/du-an` danh sách dự án | ✅ |
| `/tin-dang/[code]`, `/du-an/[slug]` | ✅ |
| Auth + verify email | ✅ (cần email provider prod) |
| Che SĐT + reveal sau verify | ✅ |
| Trang pháp lý | ✅ |
| `sitemap.xml`, `robots.txt` | ✅ |

---

## Ưu tiên 2 — Sau launch (copy vs sản phẩm)

- Form **báo cáo tin sai** (copy đã hứa, chưa có UI/API)
- Badge **verification tier** T0–T3 trên listing
- **UI đăng tin** broker (API có, form chưa)
- Admin **duyệt tin**

---

## Smoke test go-live (thủ công)

```bash
npm run build
npm run db:deploy

SITE=https://timnhaxahoi.com npm run go-live:smoke
```
