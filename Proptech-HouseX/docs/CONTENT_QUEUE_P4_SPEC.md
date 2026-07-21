# P4 — Content factory trên Super Admin (spec)

> Mục tiêu: duyệt / sửa / lên lịch trên Admin; Sheet còn cập nhật từ n8n nhưng **không** là mặt kính Super.

## Nguyên tắc

| Vai trò | Hệ thống |
|---|---|
| **SoR biên tập (duyệt, CTA, schedule, publish)** | Postgres `content_queue_items` + `content_drafts` |
| **Nguồn nghiên cứu n8n** | Sheet `content_queue` / `content_drafts` (ghi tiếp) |
| **Sync** | Sheet → Postgres (1 chiều, upsert). Admin **không** ghi ngược Sheet ở P4 |
| **Page Publish** | n8n đọc Postgres due API (P4.3), không đọc Sheet |

Khớp ADR-013: Sheet = editorial workspace tạm; Admin = vận hành.

## Phạm vi đầy đủ P4

| Slice | Việc | Status |
|---|---|---|
| **1** | Sync `content_queue` Sheet → Postgres + field `scheduled_at` trên Admin | **Done** (`5042b19`) |
| **2** | Model + UI `content_drafts` (xem/sửa/L3) + sync Sheet | **Done** |
| **3** | n8n `content-page-publish` đọc Postgres + honor `scheduled_at` | **Done** |
| **4** | Sheet write-back optional (metrics / scorecard) | **Done** |

## Slice 1 — Contract

### Postgres (additive)

- `scheduled_at` — lịch đăng dự kiến (Super set)
- `sheet_synced_at` — lần sync gần nhất từ Sheet
- `platform` — tiktok/fb từ Sheet
- `sheet_status` — status thô trên Sheet (audit)

`normalized_key` upsert: `sheet:{sheet.normalized_key}` · `sheet_key` = key Sheet gốc.

### Map status Sheet → Admin

| Sheet `status` | Admin `ContentQueueStatus` |
|---|---|
| `published` | `PUBLISHED` |
| `rejected` | `REJECTED` |
| `approved` / `pending_l3` | `APPROVED` / `PENDING_L3` |
| còn lại (`raw`, `qualified`, `queued`, `classified`, …) | `INTAKE` |

### Upsert rules (không đè tay Super)

Khi row đã tồn tại:

- **Luôn** cập nhật: title/text→bodyPreview, segment, score, sourceUrl, platform, sheetStatus, sheetSyncedAt
- **Không** ghi đè nếu đã set: `cta_tool_id`, `cta_label`, `l3_checklist`, `article_id`, `scheduled_at`
- **Status:** chỉ cập nhật từ Sheet nếu status Admin hiện tại = `INTAKE` (không hạ `PENDING_L3` / `APPROVED` / `PUBLISHED`)

### Sync API

`POST /api/admin/content-queue/sync` (Super)

- Đọc Sheet qua `GOOGLE_SERVICE_ACCOUNT_JSON` + sheet id env
- Query: `limit` (default 100), `minScore` (default 70)
- Env:
  - `MAGNIX_CONTENT_SHEET_ID` \|\| `MAGNIX_GOOGLE_SHEET_ID` \|\| `GOOGLE_SHEET_MIRROR_ID`
  - `MAGNIX_CONTENT_QUEUE_TAB` (default `content_queue`)

### Admin UI

- Nút **Sync từ Sheet**
- Field **Lịch đăng** (`scheduled_at`) trên editor
- Tab/filter **Đã lên lịch** (có `scheduled_at`, chưa PUBLISHED)

## Slice 2 — content_drafts Admin

### Postgres `content_drafts`

Upsert key: `normalized_key` = `sheet-draft:{source_normalized_key}::{slug(title)}::{created_at|ymd}`  
`sheet_key` = phần sau `sheet-draft:`.

Fields chính: title, hookLine, artifactMarkdown, ctaOptIn, disclaimer, segment, qaTier, sheetStatus, sourceNormalizedKey, status, CTA tool + L3 checklist, scheduledAt, sheetSyncedAt.

### Map Sheet status

| Sheet | Admin |
|---|---|
| `approved` | `APPROVED` |
| `published` | `PUBLISHED` |
| `rejected` | `REJECTED` |
| `pending` / `pending_l3` | `PENDING_L3` |
| `draft` / khác | `DRAFT` |

### Upsert rules

- Luôn cập nhật body/hook/segment từ Sheet nếu Admin status = `DRAFT`
- Không đè: ctaToolId, l3Checklist, scheduledAt, articleId; không hạ status đã qua DRAFT

### API / UI

- `/admin/content-drafts` · `GET/POST /api/admin/content-drafts` · `PATCH/POST .../[id]` · `POST .../sync`
- L3 bắt buộc CTA tool NƠXH (cùng allowlist queue)
- Tab: DRAFT / PENDING_L3 / APPROVED / SCHEDULED / …

## Slice 3 — Page Publish từ Postgres

### API (machine, `CRON_SECRET`)

- `GET /api/cron/content-page-publish-due?limit=3` — APPROVED due (FB_PAGE / meta) · cột `scheduled_at` ưu tiên · fallback `meta.scheduled_at`
- `POST /api/cron/content-page-publish-due` — mark `PUBLISHED` + patch `meta.fb_post_id`

Lib: `lib/content/content-page-publish-due.ts` · `lib/data/content-page-publish.ts`

### n8n

- Fetch Sheet → **Fetch House X due**
- Write-back Sheet → **POST House X mark** (metrics Sheet optional)
- Rebuild: `node n8n-workflows/build-content-page-publish.mjs`
- Doc: `docs/CONTENT_PAGE_PUBLISH_SETUP.md`

### Admin

- `/admin/content-drafts`: kênh **Facebook Page** + **Lịch đăng** sau L3

## Slice 4 — Sheet write-back optional

Sau P4.3, Postgres = SoR publish/duyệt. Sheet còn:

| Giữ | Tắt dần (P4.4) |
|---|---|
| Research: listen / classify / Agent 3 → `content_queue` / `content_drafts` | Append `content_metrics` sau Page Publish |
| Admin sync Sheet → Postgres (1 chiều) | Upsert `content_scorecard` khi không cần audit Sheet |

### Env n8n

| Env | Default | Ý nghĩa |
|---|---|---|
| `CONTENT_SHEET_WRITEBACK_ENABLED` | `true` | Umbrella — set `false` để tắt write-back audit |
| `CONTENT_METRICS_SHEET_WRITE_ENABLED` | inherit | Override metrics append |
| `CONTENT_SCORECARD_SHEET_WRITE_ENABLED` | inherit | Override scorecard upsert |

Khuyến nghị VPS sau ổn định Page Publish Postgres: `CONTENT_SHEET_WRITEBACK_ENABLED=false`.

Không đụng: `MAGNIX_SHEET_MIRROR_ENABLED` (ops_mirror ADR-013).

## VERIFY

- [x] Migration `20260721210000_content_drafts`
- [x] Sync upsert idempotent theo `normalized_key` / `sheet_key`
- [x] Approve L3 + schedule không bị sync xóa
- [x] Unit test map / merge / L3 gate / due schedule
- [x] n8n Page Publish → Postgres fetch + mark
- [x] P4.4 write-back flags (metrics / scorecard) + unit test
