# Go-live House X — Checklist nội dung & vận hành

Tài liệu ưu tiên đưa site lên production sớm. LMS Agent: Mini App Phase 3 — xem [DNA_COMPLETION.md](DNA_COMPLETION.md) · [ZALO_MINIAPP_SPEC.md](ZALO_MINIAPP_SPEC.md).

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
- [ ] Sau pull LMS: `npm run db:seed:agent-services` + `npm run db:bootstrap:agent-entitlements`
- [ ] **Mai:** điền `ZALO_APP_*` + Mini App ID (không bật `ZALO_AUTH_DEV_BYPASS`) — [DNA_COMPLETION.md](DNA_COMPLETION.md)

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
| 1.6 | Email gửi | Resend **hoặc** n8n `EMAIL_WEBHOOK_URL` — verify SPF/DKIM/**DMARC** domain (xem Bước 9 + ADR-017) |

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

In crontab mẫu (đọc `CRON_SECRET` từ `.env`):

```bash
npm run go-live:print-cron
# copy output → crontab -e trên VPS
```

Hoặc dán thủ công (thay `$CRON_SECRET` và domain):

```cron
0 * * * * curl -fsS -H "Authorization: Bearer $CRON_SECRET" https://timnhaxahoi.com/api/cron/expire-listings
* * * * * curl -fsS -H "Authorization: Bearer $CRON_SECRET" https://timnhaxahoi.com/api/cron/dispatch-events
0 */6 * * * curl -fsS -H "Authorization: Bearer $CRON_SECRET" https://timnhaxahoi.com/api/cron/recompute-ranking
15 * * * * curl -fsS -H "Authorization: Bearer $CRON_SECRET" https://timnhaxahoi.com/api/cron/expire-unit-bookings
```

`dispatch-events` cần `EVENTS_WEBHOOK_URL` (n8n) — không có thì event chỉ log nội bộ.

### Bước 9 — Email production

**Resend (khuyến nghị):**

1. Tạo API key tại [resend.com](https://resend.com)
2. Verify domain `timnhaxahoi.com` (**SPF + DKIM + DMARC**)
   - Transactional: `noreply@…` (OTP, listing) — giữ như hiện tại.
   - Marketing nurture (ADR-017): ưu tiên subdomain riêng (`m.` / `mail.`) khi scale
     blast; P0 có thể cùng domain nếu volume thấp nhưng **DMARC bắt buộc**.
   - DMARC gợi ý: `v=DMARC1; p=none; rua=mailto:dmarc@timnhaxahoi.com` (monitor
     trước, siết `p=quarantine` sau khi sạch).
3. Trên VPS `.env`:
   ```bash
   RESEND_API_KEY=re_...
   EMAIL_FROM="House X <noreply@timnhaxahoi.com>"
   NEXT_PUBLIC_EDITORIAL_EMAIL="hotro@timnhaxahoi.com"
   # Optional: tách secret ký link hủy đăng ký marketing (mặc định = AUTH_SECRET)
   # EMAIL_UNSUBSCRIBE_SECRET=...
   pm2 restart housex --update-env
   ```
4. Test transactional:
   ```bash
   EMAIL_TEST_TO=your@email.com npm run go-live:smoke-email
   ```
5. **ADR-017 P0 — marketing consent / unsubscribe (chưa gửi drip):**
   - Tool NOXH checkbox → `ConsentRecord` `purpose=marketing` + `channel=email`
   - One-click: `/huy-dang-ky-email?token=…` → `POST /api/consent/email-unsubscribe`
   - Spec: `.cursor/ADR-017-email-nurture-channel.md`
6. **ADR-017 P1 — Welcome drip (kill switch):**
   ```bash
   EMAIL_NURTURE_SEND_ENABLED=true   # VPS — chỉ khi SPF/DKIM/DMARC OK
   EMAIL_NURTURE_SEND_ENABLED=1 npm run go-live:smoke-email-nurture
   ```
   - DeliveryAdapter: `type=marketing.email` + `unsubscribe_url` (webhook/Resend/dev_log)
   - Auto E1 sau tool opt-in khi kill switch bật; E2/E3 gọi `dispatchNoxhWelcomeEmailStep` (n8n Wait sau)
   - Agent 8 prompt: `ai-agents-prompts/n8n__email-sequence-draft.md` (L3 trước blast)
7. **ADR-017 P2 — newsletter / waitlist digest / bounce / KPI:**
   ```bash
   npx prisma migrate deploy
   EMAIL_NURTURE_SEND_ENABLED=1 npm run go-live:smoke-email-nurture-p2
   npm run go-live:kpi-email-nurture
   ```
   - Waitlist form: checkbox email digest → ConsentRecord + enroll digest/newsletter
   - Cron: `POST /api/cron/email-nurture-weekly` (Bearer CRON_SECRET)
   - Webhook: `POST /api/webhooks/email-provider` (bounce/complaint → suppress)
   - A/B subject ~15% deterministic
8. **ADR-017 P3 — ESP sync / inactive / CCTM:**
   ```bash
   EMAIL_ESP_ADAPTER=dry_run npm run go-live:sync-esp-audience
   EMAIL_NURTURE_SEND_ENABLED=1 EMAIL_ESP_ADAPTER=dry_run npm run go-live:smoke-email-nurture-p3
   ```
   - Cron: `POST /api/cron/email-nurture-hygiene?task=all`
   - Brevo thật: `EMAIL_ESP_ADAPTER=brevo` + `BREVO_API_KEY` (+ optional `BREVO_LIST_ID`)
   - Audience SoR vẫn là Postgres — ESP chỉ mirror outbound

**n8n webhook (Magnix):** set `EMAIL_WEBHOOK_URL` + `EMAIL_WEBHOOK_SECRET` — payload transactional `{ type: "transactional.email", … }` hoặc marketing `{ type: "marketing.email", unsubscribe_url, sequence_id, step_index, … }`. Inbound events: cùng secret vào `/api/webhooks/email-provider`.

---

## Script tiện ích (repo)

| Lệnh | Mục đích |
|------|----------|
| `npm run go-live:secrets` | Sinh AUTH / ADMIN / CRON secret |
| `npm run go-live:p1-local` | Docker + `db:deploy` (local P1) |
| `npm run go-live:sync-db-url` | Đồng bộ `DATABASE_URL` từ `.env.prod` → `.env` + `.env.production` |
| `npm run go-live:smoke-auth` | Smoke đăng ký khách + môi giới (`SITE=…`) |
| `npm run go-live:check-env` | Validate env bắt buộc |
| `npm run go-live:smoke-listings` | Smoke gửi duyệt tin + admin approve |
| `npm run go-live:smoke-email` | Test email prod (Resend/webhook) |
| `npm run go-live:smoke-email-nurture` | ADR-017 P1 Welcome smoke |
| `npm run go-live:smoke-email-nurture-p2` | ADR-017 P2 newsletter + bounce suppress |
| `npm run go-live:smoke-email-nurture-p3` | ADR-017 P3 CCTM + reengage + ESP dry_run |
| `npm run go-live:sync-esp-audience` | Sync audience House X → ESP adapter |
| `npm run go-live:kpi-email-nurture` | KPI sent/open/CTR/unsub (aggregate) |
| `npm run go-live:print-cron` | In crontab mẫu VPS |
| `npm run db:seed:vinhomes` | Seed 3 landing Vinhomes → `/du-an` — xem [DEPLOY_VINHOMES.md](DEPLOY_VINHOMES.md) |
| `npm run db:seed:agent-services` | Catalog + quiz Agent (`CTV_ONBOARDING`, `LEGAL_BROKER_BASICS`, `HOUSEX_AGENT_GUIDE`, `NGUON_KHACH_VAY`, `PHAP_LY_BDS`, `HOUSEX_INSURANCE`, `THAM_DINH_BDS`, `NOXH_CLAIM`, `LISTING_POST`) |
| `npm run db:bootstrap:agent-entitlements` | Gắn entitlement cho mọi CTV đã duyệt |

---

## Quy tắc CTV + LMS Agent

| Bước | Trạng thái |
|------|------------|
| Môi giới có tài khoản đăng tin | ✅ API + entitlement `LISTING_POST` (mặc định ACTIVE) |
| Nộp đơn CTV (`/moi-gioi/dang-ky-ctv`) | ✅ |
| Admin duyệt + cấp `HX-CTV-xxxxxx` | ✅ + `ensureBrokerEntitlements` |
| **Khóa đào tạo hội nhập** | ✅ Mini App `/agent/dich-vu` · quiz `CTV_ONBOARDING` |
| LMS → `trainingCompletedAt` | ✅ trên `AgentEntitlement` khi đậu quiz |
| Thả lead NOXH | ✅ cần `NOXH_CLAIM` (auto sau đậu hội nhập) |

**Chờ mai (OA):** secrets Mini App + duyệt Zalo — không chặn LMS local/code.

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

- Form **báo cáo tin sai** — ✅ nút trên `/tin-dang/[code]` + `POST /api/listings/:code/report`
- Badge **verification tier** T0–T3 trên listing
- **UI đăng tin** broker — ✅ `/moi-gioi/dang-tin`, upload ảnh, gửi duyệt
- Admin **duyệt tin** — ✅ `/admin/listings`

---

## Smoke test go-live (thủ công)

```bash
npm run build
npm run db:deploy

SITE=https://timnhaxahoi.com npm run go-live:smoke
```
