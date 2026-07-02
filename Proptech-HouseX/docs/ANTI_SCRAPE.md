# Chống scrape — Phase 1 (trong codebase)

Lớp bảo vệ giai đoạn 1: rate limit, chặn bot UA rõ ràng, Turnstile trước reveal SĐT.

## Đã triển khai

| Lớp | Mô tả |
|-----|--------|
| **Middleware** | Chặn User-Agent scraper (`scrapy`, `curl`, `python-requests`…) trên `/cho-thue`, `/mua-ban`, `/tin-dang`, `/api/search` — vẫn cho Googlebot/Bingbot |
| **Rate limit browse** | SSR pages: mặc định 180 req/IP/phút (Redis hoặc in-memory dev) |
| **Rate limit API** | `/api/search/listings`, `GET /api/listings`: 60 req/IP/phút |
| **Turnstile** | Trước khi reveal SĐT môi giới — POST `/api/listings/:code/contact` |
| **SĐT (cũ)** | Đăng nhập + email verified + rate limit reveal |

## Biến môi trường

```env
# Tắt toàn bộ guard (dev): SCRAPE_GUARD_ENABLED=false
SCRAPE_GUARD_ENABLED=true

BROWSE_RATE_MAX=180
BROWSE_RATE_WINDOW_SEC=60
SEARCH_API_RATE_MAX=60
SEARCH_API_RATE_WINDOW_SEC=60
LISTINGS_API_RATE_MAX=60
LISTINGS_API_RATE_WINDOW_SEC=60

# Cloudflare Turnstile — https://dash.cloudflare.com → Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
TURNSTILE_SECRET_KEY=""

REDIS_URL=""   # Bắt buộc production nhiều instance
```

**Dev:** Không set Turnstile → reveal SĐT vẫn dùng GET như cũ.

**Production:** Set cả site key + secret → client POST kèm token; GET contact trả 405.

## Phase 2 — Cloudflare (vận hành, ngoài repo)

1. Trỏ DNS domain qua Cloudflare (proxy orange cloud).
2. **Security → Bots → Bot Fight Mode** (hoặc Super Bot Fight Mode trên plan trả phí).
3. **WAF → Rate limiting rule:** URI `/cho-thue*`, `/mua-ban*`, `/api/search*` — ví dụ 100 req/10s/IP → challenge/block.
4. **Turnstile** widget domain khớp production URL.
5. Log **Security Events** — theo dõi IP bị challenge.

Cloudflare bổ sung middleware (edge) — không thay rate limit Redis trong app.

## Giới hạn

- HTML tin đăng công khai vẫn index được (SEO) — scraper headless giả lập Chrome khó chặn 100%.
- PII (SĐT) là mục tiêu bảo vệ chính; giá/mô tả/ảnh vẫn hiển thị công khai.
