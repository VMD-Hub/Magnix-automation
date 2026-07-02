# Proptech HouseX

Sàn liên kết bất động sản đa phương (Developer / Broker free / Broker CTV / Customer).
Module lõi: `Project · Listing · Broker · Referral`.

> **Phạm vi hiện tại: Phase 1 + 2 + 3 đã hoàn thành (toàn bộ module).**
> - Phase 1: `Developer`, `Project`, `ProjectUnitType`, `ProjectLegalDoc` + trang
>   dự án SSR `/du-an/[slug]` (JSON-LD).
> - Phase 2: `Broker`, `Listing`, `ListingMedia` + trang `/tin-dang/[code]` SSR +
>   marketplace "ký gửi" trên trang dự án.
> - Phase 3: `Customer`, `Lead`, `Referral`, `Commission` + attribution first-touch
>   (cookie) + trigger hoa hồng khi WON + dashboard `/broker/[id]/hoa-hong`.

## Kiến trúc & lộ trình tối ưu

Định hướng nâng cấp từ MVP lên nền tảng tối ưu (chống lộn cò, dedup nội dung,
ranking, search/geo, media pipeline) — xem **[docs/ARCHITECTURE_OPTIMIZATION.md](docs/ARCHITECTURE_OPTIMIZATION.md)**.

Mô hình nền tảng cấp chiến lược (sàn lai: managed exchange + classifieds; 3 trục
`Source × Verification × Track` × 3 journey `Advertising / Secondary / Primary F1` +
legal gate theo Luật KDBĐS 2023) — xem **[docs/ARCHITECTURE_PLATFORM_MODEL.md](docs/ARCHITECTURE_PLATFORM_MODEL.md)** (ADR-009→013).
Quyết định media đã chốt: video host bằng managed video (Cloudflare Stream / Bunny
Stream) + YouTube chỉ marketing; watermark/thumbnail dùng tính năng nhà cung cấp.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- Prisma 6 + PostgreSQL
- Validation: Zod

## Cài đặt

```bash
npm install
```

Tạo file `.env` (copy từ `.env.example`):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/housex?schema=public"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

## Database

**Một lệnh (Docker Desktop bật):** bật Postgres, đồng bộ schema, nạp seed.

```bash
npm run db:setup
```

Chi tiết từng bước:

```bash
npm run db:up       # docker compose up -d --wait (Postgres 16, port 5432)
npm run db:push     # local dev nhanh
npm run db:deploy   # production — áp migration
npm run db:seed     # Riverside + DTA Happy Home NOXH + HouseX An Cư + tin mẫu
npm run db:down     # dừng container (giữ volume dữ liệu)
npm run db:generate # prisma generate
npm run db:migrate  # tạo migration file khi đổi schema (dev)
npm run db:studio   # Prisma Studio
```

> Local: `db:setup` = docker + push + seed. Production: `db:deploy` — xem [docs/GO_LIVE.md](docs/GO_LIVE.md).

## Dev

```bash
npm run dev
# http://localhost:3000
# http://localhost:3000/preview/du-an/dta-happy-home-nhon-trach  (duyệt giao diện, không cần DB)
# http://localhost:3000/du-an/solena-green-town-binh-tan  (căn hộ TM mẫu, demo/seed)
# http://localhost:3000/du-an/the-prive-nam-rach-chiec  (The Privé Nam Rạch Chiếc, demo/seed)
# http://localhost:3000/du-an/iki-village  (căn hộ wellness TM, demo/seed)
# http://localhost:3000/du-an/dta-happy-home-nhon-trach  (NOXH, sau seed)
# http://localhost:3000/du-an/eco-residence-long-binh-tan  (NOXH Eco Residence, demo/seed)
# http://localhost:3000/du-an/chung-cu-phuc-loc-tho-noxh  (NOXH Phúc Lộc Thọ Block C, demo/seed)
# http://localhost:3000/du-an/dragon-e-home-phu-huu  (NOXH Dragon E-Home Phú Long, demo/seed)
# http://localhost:3000/du-an/thu-thiem-green-house-thu-duc  (NOXH Thủ Thiêm Green House, demo/seed)
# http://localhost:3000/du-an/nha-o-xa-hoi-ly-thuong-kiet  (NOXH Lý Thường Kiệt / Phú Thọ DMC, demo/seed)
# http://localhost:3000/du-an/noxh-kdc-chang-song-phuoc-tan  (NOXH KDC Chàng Sông Phước Tân, demo/seed)
# http://localhost:3000/du-an/nha-o-xa-hoi-nam-long-2-can-tho  (NOXH Nam Long 2 Cần Thơ, demo/seed)
# http://localhost:3000/du-an/nha-o-xa-hoi-nam-long-hong-phat-can-tho  (NOXH Nam Long – Hồng Phát, bàn giao 2020)
# http://localhost:3000/du-an/noxh-la-home-luong-hoa-ben-luc  (NOXH LA Home Bến Lức, demo/seed)
# http://localhost:3000/du-an/nha-o-xa-hoi-my-hanh-duc-hoa  (NOXH Mỹ Hạnh Bee Home, demo/seed)
# http://localhost:3000/du-an/the-ori-phuong-mai-my-hanh  (NOXH The Ori Phương Mai, demo/seed)
# http://localhost:3000/du-an/noxh-kdt-hau-nghia-duc-hoa  (NOXH KĐT Hậu Nghĩa / Green Nestera, demo/seed)
# http://localhost:3000/du-an/noxh-kdt-phuoc-vinh-tay-can-giuoc  (NOXH Phước Vĩnh Tây, demo/seed)
# http://localhost:3000/du-an/noxh-phu-an-thanh-ben-luc  (NOXH Phú An Thạnh, demo/seed)
# http://localhost:3000/tin-tuc  (hub tin tức NOXH / dự án)
# http://localhost:3000/tin-tuc/gia-nha-o-xa-hoi-ly-thuong-kiet-cong-bo-6-2026  (bài mẫu)
# http://localhost:3000/admin/articles  (quản trị tin tức, sau đăng nhập admin)
# http://localhost:3000/du-an/housex-riverside   (sau khi seed)
```

## Kiểm tra SSR/SEO (rule #7) — bắt buộc không client-only

Nội dung chính phải có trong HTML đầu tiên, kiểm tra bằng curl (không chạy JS):

```bash
curl -s http://localhost:3000/du-an/housex-riverside | grep -i "HouseX Riverside"
curl -s http://localhost:3000/du-an/housex-riverside | grep -i "application/ld+json"
curl -s http://localhost:3000/tin-dang/MX-SEED0001 | grep -i "application/ld+json"
```

## API

**Phase 1 — Projects**

| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/projects` | List, filter `province/district/projectType/status` + phân trang |
| GET | `/api/projects/:slug` | Chi tiết dự án (+ unitTypes + legalDocs) — chấp nhận slug hoặc id |
| GET | `/api/projects/:slug/units` | **Phase A** — giỏ hàng/bảng hàng read-only (`status`, `block`, `unitTypeId`, giá, tầng + phân trang) |
| GET | `/api/projects/:slug/units/:unitRef` | **Phase A** — chi tiết 1 căn (`unitRef` = uuid hoặc mã căn) |
| POST | `/api/projects/:slug/units/:unitRef/bookings` | **Phase B** — giữ suất mua (không lock căn; nhiều suất/căn) |
| POST | `/api/projects` | Tạo dự án (kèm nested unitTypes/legalDocs tuỳ chọn) |
| PATCH | `/api/projects/:id/status` | Đổi status — áp dụng **rule #6** (NOXH legal gate) |

**Phase 2 — Listings / Brokers**

| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/listings` | List, filter `province/district/propertyType/transactionType/projectId/status` (mặc định ACTIVE) |
| POST | `/api/listings` | Tạo tin — **rule #1 + #2**. `brokerId` lấy từ body hoặc header `x-broker-id` |
| PATCH | `/api/listings/:id` | Sửa tin — re-check rule #1/#2 khi đổi project/unit/tier; **P2** publish gate khi → ACTIVE; **P3** ghi status history |
| DELETE | `/api/listings/:id` | **P3** — soft delete (giữ bản ghi, ẩn khỏi public, gỡ search index) |
| DELETE | `/api/projects/:slug` | **P3** — soft delete dự án |
| POST | `/api/brokers` | Tạo broker (helper; onboarding thật thuộc Auth service) |
| POST | `/api/cron/expire-listings` | **Rule #5** — cron set ACTIVE+hết hạn → EXPIRED (bảo vệ bằng `CRON_SECRET`) |
| POST | `/api/cron/recompute-ranking` | **P2** — cron tính lại `rankScore` (freshness decay), bảo vệ bằng `CRON_SECRET` |
| POST | `/api/cron/dispatch-events` | **P2** — cron xử lý outbox (notify async), bảo vệ bằng `CRON_SECRET` |

**Phase 3 — Referral / Lead / Commission**

| Method | Path | Mô tả |
|---|---|---|
| POST | `/api/referrals` | Broker tạo mã giới thiệu — **rule #2** (CTV cần licenseVerified) |
| GET | `/api/referrals/:code/redirect` | **Rule #3** — clickCount++ + set cookie first-touch + redirect |
| POST | `/api/leads` | Khách submit form — **rule #3** (gán referralId từ cookie) |
| PATCH | `/api/leads/:id/status` | Đổi trạng thái — **rule #4** (tạo Commission khi → WON) |
| GET | `/api/brokers/:id/commissions` | Dashboard hoa hồng (JSON) |
| GET | `/api/customer/me` | Khách đăng nhập — lead + giữ suất của mình |

**Phase B — Giữ suất F1 (Journey P)**

| Method | Path | Mô tả |
|---|---|---|
| POST | `/api/projects/:slug/units/:unitRef/bookings` | Khách giữ suất mua — **không lock căn**; nhiều suất/căn |
| POST | `/api/leads` | Form tư vấn gắn `listingId` hoặc `projectId` (LeadContactForm) |
| GET | `/api/admin/unit-bookings` | Admin — danh sách suất (`status=ACTIVE\|ALL`) |
| PATCH | `/api/admin/unit-bookings/:id/status` | Admin — xác nhận / huỷ suất |
| POST | `/api/admin/unit-bookings/:id/convert-deposit` | Admin — **chuyển cọc thủ công** → lock căn `DEPOSITED` |
| POST | `/api/cron/expire-unit-bookings` | Cron hết hạn suất (`CRON_SECRET`); **không** đụng trạng thái căn |

UI: `/du-an/[slug]` (form giữ suất + tư vấn dự án) · `/tin-dang/[code]` (lead tin) · `/khach-hang/tai-khoan` · `/admin/unit-bookings`

**P1 — Search & Geo**

| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/listings/nearby` | Tìm tin quanh `lat/lng` trong `radiusKm` (bbox + haversine) |
| GET | `/api/search/listings` | Full-text + filter + geo. Meili nếu có `MEILI_HOST`, không thì fallback DB |

> Geo mặc định chạy bằng bounding-box + haversine (không cần PostGIS). Lên quy mô lớn:
> chạy `prisma/sql/enable-postgis.sql` rồi chuyển sang `ST_DWithin`. Search index đồng bộ
> tự động sau create/patch/expire; full reindex bằng `npm run search:reindex`.

**P2 — Quality & Ranking**

- **Publish gate:** chuyển tin sang `ACTIVE` cần ≥ `LISTING_MIN_PHOTOS` ảnh READY,
  mô tả ≥ `LISTING_MIN_DESC_LEN`, video (nếu có) phải READY → nếu không trả 422.
- **Ranking:** `rankScore` = tierBoost + quality·0.4 + freshness(decay) + verified +
  engagement − penalty(chất lượng thấp). Precompute vào `Listing` (cột `qualityScore`/
  `rankScore`/`photoCount`/`hasVideo`), cập nhật sau create/patch/media-READY + cron.
  Feed/marketplace/search đều xếp theo `rankScore`. Backfill: `npm run ranking:recompute`.
- Tiền (tier) chỉ là 1 trọng số — tin trả phí chất lượng thấp vẫn bị phạt.

**P2 — Event-driven outbox**

- `lead → WON` ghi event (`lead.won`, `commission.created`) vào `OutboxEvent` **cùng
  transaction** tạo commission (transactional outbox → không mất event).
- Dispatcher xử lý async: claim atomically, retry backoff luỹ thừa, dead-letter khi
  vượt `maxAttempts`. Handler forward sang n8n (`EVENTS_WEBHOOK_URL`).
- Chạy: `POST /api/cron/dispatch-events` (mỗi phút) hoặc `npm run events:dispatch -- --loop`.
- Delivery at-least-once → consumer (n8n) phải idempotent.

**P3 — Schema gaps**

- `Referral.listing` relation (bỏ tra listing rời ở redirect).
- **Soft-delete:** `deletedAt` trên `Listing`/`Project`; mọi public read lọc
  `deletedAt: null`; `DELETE` = soft (giữ attribution/commission), gỡ search index.
- **Status history:** bảng `StatusHistory` (generic) ghi mọi chuyển trạng thái của
  listing/lead/project trong cùng transaction (audit "ai đổi gì, khi nào, vì sao").

> Auth/role (Developer/Admin tạo dự án, broker xác thực…) nằm ngoài phạm vi module này.
> "Ai đang đăng tin" = `brokerId` từ payload/header (chưa gắn auth thật).

## Business rules đã implement

- **Rule #1 — Project/Unit consistency** (`lib/rules/listing-rules.ts`): nếu listing
  có `unitTypeId` thì bắt buộc có `projectId` và unit phải thuộc đúng project đó.
- **Rule #2 — License gate** (`lib/rules/listing-rules.ts`): broker `CTV` hoặc đăng
  `tier != FREE` bắt buộc `licenseVerified = true`.
- **Rule #5 — Expire listings** (`lib/rules/listing-rules.ts` + `/api/cron/expire-listings`):
  `ACTIVE` + `expireAt < now()` → `EXPIRED`.
- **Rule #3 — Lead attribution first-touch** (`lib/rules/referral-attribution.ts`):
  cookie httpOnly `mx_ref` set ở route redirect (KHÔNG ghi đè nếu đã có); khi tạo
  lead, gán `referralId` + `assignedBrokerId` từ cookie. Đã gán thì không sửa lại
  (`referralId` không nằm trong payload cho phép sửa).
- **Rule #4 — Commission trigger** (`lib/rules/commission-trigger.ts`): chỉ tạo
  `Commission` khi lead chuyển sang `WON` (trong transaction, 1-1 qua `leadId @unique`).
  broker nhận = `override.brokerId ?? referral.brokerId ?? assignedBrokerId`;
  amount = `override.amount ?? dealValue * rate` (dealValue mặc định = giá listing,
  rate mặc định = `DEFAULT_COMMISSION_RATE`).
- **Rule #6 — NOXH legal gate** (`lib/rules/project-noxh-gate.ts`): dự án
  `NHA_O_XA_HOI` không thể `DANG_BAN` nếu thiếu `ProjectLegalDoc(docType='giay_phep_xay_dung', status='da_co')`.
- **Rule #7 — SSR**: `/du-an/[slug]` và `/tin-dang/[code]` server-rendered
  (`generateMetadata` + JSON-LD trong HTML).

## Cron (rule #5)

```bash
# thêm CRON_SECRET vào .env, rồi gọi định kỳ (vd mỗi giờ):
curl -X POST http://localhost:3000/api/cron/expire-listings \
  -H "Authorization: Bearer $CRON_SECRET"
```

## SEO/AIO (mục 6)

`lib/seo/json-ld.ts → buildProjectJsonLd(project)` map trực tiếp từ dữ liệu Prisma
sang schema.org `ApartmentComplex`. Không hard-code JSON-LD trong component.

## Cấu trúc thư mục

```
app/
  page.tsx                              # landing tĩnh
  du-an/[slug]/page.tsx                 # SSR dự án + JSON-LD + marketplace ký gửi
  tin-dang/[code]/page.tsx              # SSR tin đăng + JSON-LD
  api/projects/route.ts                 # GET list / POST create
  api/projects/[slug]/route.ts          # GET detail
  api/projects/[slug]/status/route.ts   # PATCH status (rule #6)
  api/listings/route.ts                 # GET list / POST create (rule #1, #2)
  api/listings/[id]/route.ts            # PATCH (rule #1, #2)
  api/brokers/route.ts                  # POST create broker (helper)
  api/brokers/[id]/commissions/route.ts # GET dashboard hoa hồng (rule #4)
  api/cron/expire-listings/route.ts     # POST cron (rule #5)
  api/referrals/route.ts                # POST create referral (rule #2)
  api/referrals/[code]/redirect/route.ts# GET redirect + attribution (rule #3)
  api/leads/route.ts                    # POST create lead (rule #3)
  api/leads/[id]/status/route.ts        # PATCH status → commission (rule #4)
  api/listings/nearby/route.ts          # GET geo nearby (bbox + haversine)
  api/search/listings/route.ts          # GET search (Meili / fallback DB)
  api/cron/recompute-ranking/route.ts   # POST cron recompute rankScore (P2)
  api/cron/dispatch-events/route.ts     # POST cron dispatch outbox (P2)
  broker/[id]/hoa-hong/page.tsx         # dashboard hoa hồng (SSR)
lib/
  prisma.ts                             # PrismaClient singleton
  format.ts                             # format giá/diện tích + nhãn enum
  api/http.ts                           # response & error helpers
  api/current-broker.ts                 # resolve brokerId từ body/header
  data/project.ts                       # data-access project
  data/listing.ts                       # data-access listing + marketplace
  data/commission.ts                    # data-access commission summary
  rules/project-noxh-gate.ts            # rule #6
  rules/listing-rules.ts                # rule #1, #2, #5 + gen code
  rules/referral-attribution.ts         # rule #3 (cookie + redirect target)
  rules/commission-trigger.ts           # rule #4
  seo/json-ld.ts                        # buildProjectJsonLd
  seo/listing-json-ld.ts                # buildListingJsonLd
  validation/project.ts                 # Zod schemas (project)
  validation/listing.ts                 # Zod schemas (listing/broker)
  validation/referral.ts                # Zod schemas (referral)
  validation/lead.ts                    # Zod schemas (lead + commission override)
prisma/
  schema.prisma                         # full schema (mục 3 của spec)
  seed.ts                               # dữ liệu mẫu (projects/brokers/listings/referral/lead/commission)
```

## Thử nhanh flow Phase 3 (referral → lead → commission)

```bash
# 1) Khách bấm link CTV → set cookie first-touch + redirect
curl -i -c cookies.txt http://localhost:3000/api/referrals/RF-SEED0001/redirect

# 2) Khách submit form (gửi kèm cookie) → lead tự gán referralId
curl -X POST http://localhost:3000/api/leads -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"name":"Khách A","phone":"0900000009","projectId":"<riverside_id>"}'

# 3) Chuyển lead sang WON → tạo commission (amount = dealValue*rate)
curl -X PATCH http://localhost:3000/api/leads/<lead_id>/status \
  -H "Content-Type: application/json" \
  -d '{"status":"WON","commission":{"dealValue":3900000000,"rate":0.01}}'

# 4) Dashboard hoa hồng broker
#   /broker/<broker_id>/hoa-hong
```
