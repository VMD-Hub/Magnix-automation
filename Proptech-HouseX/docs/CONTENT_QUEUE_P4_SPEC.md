# P4 — Content factory trên Super Admin (spec)

> Mục tiêu: duyệt / sửa / lên lịch trên Admin; Sheet còn cập nhật từ n8n nhưng **không** là mặt kính Super.

## Nguyên tắc

| Vai trò | Hệ thống |
|---|---|
| **SoR biên tập (duyệt, CTA, schedule, publish)** | Postgres `content_queue_items` (+ drafts sau) |
| **Nguồn nghiên cứu n8n** | Sheet `content_queue` / `content_drafts` (ghi tiếp) |
| **Sync** | Sheet → Postgres (1 chiều, upsert). Admin **không** ghi ngược Sheet ở P4 slice 1 |

Khớp ADR-013: Sheet = editorial workspace tạm; Admin = vận hành.

## Phạm vi đầy đủ P4

| Slice | Việc | Status |
|---|---|---|
| **1 (now)** | Sync `content_queue` Sheet → Postgres + field `scheduled_at` trên Admin | **Implement** |
| 2 | Model + UI `content_drafts` (xem/sửa/L3) | Backlog |
| 3 | n8n `content-page-publish` đọc Postgres + honor `scheduled_at` | Backlog |
| 4 | Sheet mirror optional / dual-write tắt dần | Backlog |

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

## Slice 2+ (không làm trong PR này)

- `content_drafts` table + board
- Push schedule → n8n Graph publish
- Outreach queue UI

## VERIFY

- [ ] Migration deploy OK
- [ ] Sync upsert idempotent theo `sheet_key`
- [ ] Approve L3 + set schedule không bị sync xóa
- [ ] Unit test map status + merge rules
