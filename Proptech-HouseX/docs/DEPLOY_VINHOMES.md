# Deploy 3 landing Vinhomes — preview → `/du-an`

Promote nội dung từ preview (mock, noindex) sang URL production công khai trên Postgres.

## Dự án

| Preview (noindex) | Production URL | Loại |
|-------------------|----------------|------|
| `/preview/du-an/vinhomes-saigon-park-hoc-mon` | `/du-an/vinhomes-saigon-park-hoc-mon` | Nhà phố Hóc Môn |
| `/preview/du-an/vinhomes-green-paradise-can-gio` | `/du-an/vinhomes-green-paradise-can-gio` | Siêu đô thị biển Cần Giờ |
| `/preview/du-an/vinhomes-grand-park-quan-9` | `/du-an/vinhomes-grand-park-quan-9` | Căn hộ Quận 9 |

Preview giữ nguyên để duyệt layout không cần DB. Production lấy dữ liệu từ Postgres (`overviewData` landing).

## Vì sao prod hiện 404?

Prod đã có ~17 dự án NOXH trong DB → trang `/du-an` **không** fallback demo. Vinhomes chưa seed → slug không tồn tại → 404.

## Deploy trên VPS

```bash
cd /opt/housex/Proptech-HouseX
git pull                    # hoặc rsync code mới
npm ci
npm run db:deploy           # migration nếu có
npm run build
pm2 restart housex

# Seed chỉ 3 dự án Vinhomes (idempotent — chạy lại an toàn)
npm run db:seed:vinhomes
```

Hoặc seed toàn bộ (staging / lần đầu):

```bash
npm run db:seed
```

## Smoke test

```bash
SITE=https://timnhaxahoi.com npm run go-live:smoke
```

Script kiểm tra thêm 3 URL Vinhomes (expect tên dự án trong HTML).

## Sau seed — kiểm tra thủ công

- [ ] `/du-an?projectType=THUONG_MAI` — 3 card Vinhomes xuất hiện
- [ ] Mỗi `/du-an/[slug]` — hero, gallery, FAQ, không banner “dự án mẫu”
- [ ] `/sitemap.xml` — 3 slug Vinhomes (từ DB)
- [ ] OG preview (Facebook Debugger) — ảnh hero load được
- [ ] Preview vẫn `noindex` tại `/preview/du-an/*`

## Ảnh CDN (khuyến nghị trước index rộng)

Ảnh hiện hotlink từ site CĐT (`vinhomessaigonpark-hcm.com`, `vinhomesvingroup.com.vn`, `vinhomesland.vn`). Nên host lên CDN HouseX — xem comment trong `lib/content/vinhomes-*-images.ts`.

## Code liên quan

| File | Vai trò |
|------|---------|
| `lib/seed/vinhomes-projects.ts` | Upsert developer + 3 project |
| `scripts/seed-vinhomes-projects.ts` | CLI `npm run db:seed:vinhomes` |
| `lib/preview/vinhomes-*-mock.ts` | Landing content + preview listings |
| `lib/preview/demo-projects.ts` | Fallback demo khi DB offline |
