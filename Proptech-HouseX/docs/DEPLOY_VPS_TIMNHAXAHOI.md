# Reset VPS & deploy HouseX — timnhaxahoi.com

VPS IP hiện tại (DNS iNET): **103.72.99.131** — giữ nguyên record `@` và `www` trỏ A về IP này.

Brand: **HouseX** · Domain: **timnhaxahoi.com**

---

## 0. DNS iNET — giữ / xóa gì

| Record | Hành động |
|--------|-----------|
| `@` A → `103.72.99.131` | **Giữ** |
| `www` A → `103.72.99.131` | **Giữ** |
| `api` A → `103.72.99.131` | **Xóa** (HouseX dùng `/api/*` trên domain chính) |
| `dangky` A → `103.72.99.131` | **Xóa** (route mới: `/dang-ky`, `/dang-ky/khach-hang`) |
| `@` MX, SPF TXT, DKIM, `mail` A | **Giữ** nếu vẫn dùng hộp thư iNET cho `hotro@` |

Không cần trỏ sang Vercel.

---

## 1. Reset VPS (SSH vào server)

```bash
# Dừng dịch vụ cũ
sudo systemctl stop nginx apache2 php*-fpm mysql mariadb 2>/dev/null || true
docker stop $(docker ps -aq) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

# Xóa site / app cũ (không có dữ liệu quan trọng)
sudo rm -rf /var/www/* ~/apps/* ~/www/*

# Dọn config nginx/apache cũ (tuỳ distro)
sudo rm -f /etc/nginx/sites-enabled/* /etc/nginx/sites-available/default
```

Cài stack mới (Ubuntu/Debian):

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl nginx certbot python3-certbot-nginx

# Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
# logout/login lại để dùng docker không cần sudo

# PM2
sudo npm install -g pm2
```

---

## 2. Clone & cấu hình app

```bash
sudo mkdir -p /opt/housex
sudo chown $USER:$USER /opt/housex
git clone <URL_REPO> /opt/housex
cd /opt/housex/Proptech-HouseX   # nếu monorepo Magnix

cp .env.example .env
nano .env
```

**`.env` production tối thiểu:**

```env
DATABASE_URL="postgresql://housex:YOUR_DB_PASS@127.0.0.1:5432/housex?schema=public"
REDIS_URL="redis://127.0.0.1:6379"
NEXT_PUBLIC_SITE_URL="https://timnhaxahoi.com"
NEXT_PUBLIC_SUPPORT_EMAIL="hotro@timnhaxahoi.com"

AUTH_SECRET="<openssl rand -base64 32>"
ADMIN_SECRET="<openssl rand -base64 32>"
CRON_SECRET="<openssl rand -base64 32>"

SCRAPE_GUARD_ENABLED="true"
MEDIA_PROVIDER="stub"

# Email — Resend hoặc n8n webhook (xem DEPLOY_TIMNHAXAHOI.md)
# RESEND_API_KEY=""
# EMAIL_FROM="HouseX <noreply@timnhaxahoi.com>"
```

**Postgres + Redis:**

```bash
echo "POSTGRES_PASSWORD=YOUR_DB_PASS" > .env.prod
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
docker compose -f docker-compose.prod.yml ps
```

**Build app:**

```bash
npm ci
npm run db:deploy          # migration trong prisma/migrations/
# npm run db:seed         # chỉ staging/demo — bỏ qua prod nếu không cần dữ liệu mẫu
npm run build
pm2 start npm --name housex -- start
pm2 save
pm2 startup              # chạy lệnh sudo mà PM2 in ra
```

App lắng nghe **port 3000** (localhost).

---

## 3. Nginx + SSL

Canonical host: **`https://timnhaxahoi.com`** (khớp `NEXT_PUBLIC_SITE_URL`).  
`www` và `http` phải **301 một hop** về apex — tránh duplicate (Ahrefs) và chuỗi redirect dài.

```bash
sudo tee /etc/nginx/sites-available/timnhaxahoi.com <<'EOF'
# HTTP → HTTPS apex (cả apex lẫn www)
server {
    listen 80;
    listen [::]:80;
    server_name timnhaxahoi.com www.timnhaxahoi.com;
    return 301 https://timnhaxahoi.com$request_uri;
}

# HTTPS www → HTTPS apex
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.timnhaxahoi.com;
    # certbot sẽ gắn ssl_certificate vào đây sau khi chạy certbot
    return 301 https://timnhaxahoi.com$request_uri;
}

# App — apex only
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name timnhaxahoi.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/timnhaxahoi.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d timnhaxahoi.com -d www.timnhaxahoi.com --redirect
```

Sau certbot, kiểm tra:

```bash
curl -sI http://timnhaxahoi.com/ | head -5
curl -sI http://www.timnhaxahoi.com/ | head -5
curl -sI https://www.timnhaxahoi.com/ | head -5
# Cả ba phải Location: https://timnhaxahoi.com/
```

**Ahrefs “3XX redirect”:** HTTP→HTTPS 301 là đúng — có thể ignore/notice. Vấn đề cần xử lý là `www` đang 200 riêng (duplicate), không phải việc bỏ redirect HTTP.

---

## 4. Cron (tuỳ chọn)

```bash
crontab -e
```

```cron
# Hết hạn tin đăng — mỗi giờ
0 * * * * curl -fsS -H "Authorization: Bearer YOUR_CRON_SECRET" https://timnhaxahoi.com/api/cron/expire-listings >/dev/null
```

---

## 5. Smoke test

```bash
export SITE=https://timnhaxahoi.com
curl -sI "$SITE" | head -5
curl -s "$SITE/mua-ban" | grep -i "Mua bán"
curl -s "$SITE/robots.txt"
curl -s "$SITE/sitemap.xml" | head -10
```

Trình duyệt: `/du-an`, đăng ký khách, `/admin/ctv`.

### Landing Vinhomes / commercial — smoke 8 URL `/du-an/*`

Seed ghi vào Postgres; **PM2 đọc env khác seed CLI** nếu có `.env.production`:

```bash
npm run db:deploy
npm run db:seed:vinhomes
npm run db:seed:commercial
npm run db:seed:noxh          # 6 dự án NOXH Long An (tùy chọn)
npm run db:verify:landings          # 8/8 slug trong DB (đọc .env.production merge)
npm run go-live:check-env-files     # .env vs .env.production — phải ✔

# Nếu fail: thường do .env.production còn CHANGE_ME
grep DATABASE_URL .env .env.production 2>/dev/null
# Sửa .env.production cho khớp .env HOẶC: rm .env.production

pm2 restart housex --update-env
curl -s "https://timnhaxahoi.com/api/projects/vinhomes-saigon-park-hoc-mon" | head -c 200
# Phải thấy "data" + "Vinhomes Saigon Park", không phải INTERNAL_ERROR

SITE=https://timnhaxahoi.com npm run go-live:smoke
```

---

## 6. Cập nhật phiên bản sau này

```bash
cd /opt/housex/Proptech-HouseX
git pull
npm ci
npm run db:deploy    # hoặc db:push chỉ khi dev local
npm run build
npm run go-live:check-env-files   # bắt .env.production ghi đè DATABASE_URL
pm2 restart housex --update-env
```

### Ops — backfill `Project.salesRegion` (dual-geo)

Suy từ `province` → registry P0 (`SOUTH` / …). Không đụng `leadLane` / public copy. Dry-run mặc định:

```bash
cd /opt/housex/Proptech-HouseX
npm run db:backfill:sales-region              # xem would_set
npm run db:backfill:sales-region -- --apply   # ghi null → inferred
# npm run db:backfill:sales-region -- --apply --force  # ghi cả khi đã có giá trị khác
```

Province ngoài registry (vd. trước khi mở Bắc) → bỏ qua, log `no_infer`.

### Ops — seed NOXH Hà Nội (Phase 5 lite)

```bash
cd /opt/housex/Proptech-HouseX
git pull
npm run build && pm2 restart housex --update-env   # nếu có code hub ha-noi
npm run db:seed:noxh-hanoi
```

Smoke: `/du-an/nha-o-xa-hoi/ha-noi` + 1 slug (vd. `nha-o-xa-hoi-udic-eco-tower-ha-dinh`). Inventory: `docs/content/HANOI_NOXH_INVENTORY.md`.

### Ops — seed NOXH Đà Nẵng (Phase 5 lite Trung)

```bash
cd /opt/housex/Proptech-HouseX
npm run db:seed:noxh-danang
```

Smoke: `/du-an/nha-o-xa-hoi/da-nang` + `nha-o-xa-hoi-dai-dia-bao-son-tra`. Inventory: `docs/content/DANANG_NOXH_INVENTORY.md`.

### Ops — seed NOXH Đồng Tháp (P0.2)

```bash
cd /opt/housex/Proptech-HouseX
npm run build && pm2 restart housex --update-env   # bật hub dong-thap
npm run db:seed:noxh-dong-thap
```

Smoke: `/du-an/nha-o-xa-hoi/dong-thap` · 308 `/tien-giang` → hub · `nha-o-xa-hoi-rivera-garden-my-tho`.

### Ops — seed NOXH An Giang (P0.2, gồm Kiên Giang cũ)

```bash
cd /opt/housex/Proptech-HouseX
git pull
npm run build && pm2 restart housex --update-env   # bật hub an-giang
# đợi ~5–8s tránh 502
npm run db:seed:noxh-an-giang
```

Smoke: `/du-an/nha-o-xa-hoi/an-giang` · 308 `/kien-giang` → hub · `nha-o-xa-hoi-cic-lan-bien-tay-bac-rach-gia`.  
Inventory: `docs/content/AN_GIANG_NOXH_INVENTORY.md`.

### Ops — seed NOXH Khánh Hòa (P0.5 Trung, gồm Ninh Thuận cũ)

```bash
cd /opt/housex/Proptech-HouseX
git pull
npm run build && pm2 restart housex --update-env   # bật hub khanh-hoa
# đợi ~5–8s tránh 502
npm run db:seed:noxh-khanh-hoa
```

Smoke: `/du-an/nha-o-xa-hoi/khanh-hoa` · 308 `/ninh-thuan` → hub · `nha-o-xa-hoi-happy-home-cam-ranh`.  
Inventory: `docs/content/KHANH_HOA_NOXH_INVENTORY.md`.

### Ops — seed NOXH Lâm Đồng (P0.5, gồm Đắk Nông + Bình Thuận cũ)

```bash
cd /opt/housex/Proptech-HouseX
git pull
npm run build && pm2 restart housex --update-env   # bật hub lam-dong
# đợi ~5–8s tránh 502
npm run db:seed:noxh-lam-dong
```

Smoke: `/du-an/nha-o-xa-hoi/lam-dong` · 308 `/binh-thuan` & `/dak-nong` → hub · `nha-o-xa-hoi-kim-dong-da-lat`.  
Inventory: `docs/content/LAM_DONG_NOXH_INVENTORY.md`.

### Ops — IndexNow (Bing + peers)

Google: GSC Request indexing (tay). Bing/Yandex: IndexNow.

1. Deploy xong, đợi app sẵn (tránh 502 ngay sau pm2 restart), xác nhận key file:
   `curl -s https://timnhaxahoi.com/4d0ed13bac455b1df1eb45dc3dcecd25.txt`
2. Submit hub + silo (script tự dùng `https://timnhaxahoi.com` — không POST localhost dù `.env` có `NEXT_PUBLIC_SITE_URL=localhost`):
```bash
cd /opt/housex/Proptech-HouseX
npm run seo:indexnow -- --apply
# hoặc chỉ 4 hub: npm run seo:indexnow -- --apply --preset=hubs
```
429 TooManyRequests → đợi 10–30 phút rồi chạy lại (lần submit localhost trước cũng bị tính quota).
Bài viết admin status `PUBLISHED` cũng fire-and-forget IndexNow. Tắt: `INDEXNOW_ENABLED=false`.

---

## 7. Backup (nên bật sau go-live)

Chi tiết Phase 3B: [OPS_BACKUP_MIRROR.md](OPS_BACKUP_MIRROR.md)

Postgres volume Docker — backup hàng ngày:

```bash
chmod +x scripts/backup-postgres-vps.sh
./scripts/backup-postgres-vps.sh
# Cron: npm run go-live:print-cron
```

Hoặc sync JSONL lead lên Google Drive (Magnix) — không coi VPS là store duy nhất cho lead quan trọng.

**Sheet mirror:** `MAGNIX_SHEET_MIRROR_ENABLED=true` + `GOOGLE_SHEET_MIRROR_ID` — tab `ops_mirror`.

---

## Kiến trúc trên VPS

```
Internet → nginx:443 → PM2 (Next.js :3000)
                              ↓
                    Postgres + Redis (Docker, localhost only)
```

Email nhận: iNET MX · Email gửi hệ thống: Resend/n8n (thêm record DNS khi bật).
