# Deploy production — timnhaxahoi.com (tạm thời)

Brand sản phẩm vẫn là **HouseX**; tên miền `timnhaxahoi.com` dùng làm kênh go-live và SEO wedge NOXH cho đến khi có `housex.vn`.

## 1. DNS & hosting

| Bước | Việc cần làm |
|------|----------------|
| DNS | `@` + `www` A → IP VPS (vd. `103.72.99.131`) **hoặc** Vercel |
| SSL | Let's Encrypt (nginx) hoặc Vercel |
| Redirect | Chọn **một** canonical: `www` → apex hoặc ngược lại |

**VPS iNET (reset server cũ):** xem **[DEPLOY_VPS_TIMNHAXAHOI.md](DEPLOY_VPS_TIMNHAXAHOI.md)** — giữ DNS A hiện tại, xóa subdomain `api`/`dangky` cũ.

**Vercel (managed, không tự quản VPS):**

1. Import repo → Framework Preset: Next.js  
2. Root directory: `Proptech-HouseX` (nếu monorepo Magnix)  
3. Build: `npm run build` · Output: default  
4. Thêm domain `timnhaxahoi.com` + `www.timnhaxahoi.com` trong Project Settings → Domains  

## 2. Biến môi trường production

Copy từ `.env.example`, điền tối thiểu:

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SITE_URL="https://timnhaxahoi.com"
NEXT_PUBLIC_SUPPORT_EMAIL="hotro@timnhaxahoi.com"
AUTH_SECRET="<random 32+ bytes>"
ADMIN_SECRET="<random>"
CRON_SECRET="<random>"

# Email — chọn một trong hai:
RESEND_API_KEY="re_..."
EMAIL_FROM="HouseX <noreply@timnhaxahoi.com>"
# hoặc
EMAIL_WEBHOOK_URL="https://n8n.../webhook/..."
EMAIL_WEBHOOK_SECRET="..."

REDIS_URL="redis://..."   # bắt buộc production (rate limit, scrape guard)
SCRAPE_GUARD_ENABLED="true"
```

**Resend:** verify domain `timnhaxahoi.com` (SPF + DKIM) trước khi bật verify email khách.

## 3. Database

```bash
npm run db:deploy    # migrate production
# Seed chỉ chạy lần đầu / staging — không seed demo lên prod nếu không cần
```

Dùng Postgres managed (Neon, Supabase, Railway) hoặc Docker trên VPS — bật backup.

## 4. Smoke test sau deploy

```bash
SITE=https://timnhaxahoi.com npm run go-live:smoke
```

Hoặc thủ công:
curl -sI "$SITE" | head -5
curl -s "$SITE/mua-ban" | grep -i "Mua bán"
curl -s "$SITE/du-an" | grep -i "Dự án"
curl -s "$SITE/robots.txt"
curl -s "$SITE/sitemap.xml" | head -20
curl -s "$SITE/tin-dang/MX-SEED0001" | grep "application/ld+json"   # nếu còn tin seed
```

Kiểm tra thủ công:

- [ ] Đăng ký khách → email verify (Resend / n8n)  
- [ ] OG preview (Facebook Debugger / Telegram) hiển thị đúng URL `timnhaxahoi.com`  
- [ ] Footer / Liên hệ hiển thị `hotro@timnhaxahoi.com`  
- [ ] `/admin/ctv` login bằng `ADMIN_SECRET`  

## 5. Search Console

1. Thêm property `https://timnhaxahoi.com`  
2. Verify DNS hoặc HTML tag  
3. Submit `https://timnhaxahoi.com/sitemap.xml`  

## 6. Khi có housex.vn (migrate sau)

1. Deploy cùng codebase với `NEXT_PUBLIC_SITE_URL=https://housex.vn`  
2. Verify email `@housex.vn` trên Resend  
3. **301** toàn bộ `timnhaxahoi.com/*` → `housex.vn/*` (giữ SEO)  
4. Hoặc giữ `timnhaxahoi.com` làm landing NOXH riêng, trỏ `/du-an` NOXH  

Không cần đổi brand trong code — chỉ env + DNS + redirect.
