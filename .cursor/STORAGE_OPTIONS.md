# Magnix + House X — Storage Options

> **ADR-013 (2026-07-08):** Postgres trên VPS = store of record · Google Sheet = mirror/archive · Drive JSONL = disaster recovery.
> Chi tiết: `.cursor/ADR-013-postgres-primary-storage.md`

## 1. Nguyên tắc

- **Postgres (House X)** là nơi ghi chính cho lead operational, NOXH Case, CTV, attribution, commission, booking.
- **VPS** = compute (n8n, Next.js) **+** Postgres SoR — **phải** có backup off-VPS (`pg_dump` + Drive JSONL).
- **Google Sheet** = mirror read-only (báo cáo) và/hoặc content editorial queue — **không** dedupe lead ops hàng ngày.
- **Google Drive JSONL** = archive bền vững; không thay Postgres cho query/realtime.
- Mọi workflow dedupe bằng `normalized_key` (UID) hoặc `normalized_phone` (NOXH/CTV) **trên Postgres**.
- Không hardcode secret; dùng n8n Credentials hoặc env.
- **Lark Base:** không dùng làm store (Ops trên Admin House X).

## 2. Vai trò lưu trữ

| Vai trò | Công nghệ | Mục đích |
|---------|-----------|----------|
| **Store of record** | Postgres (VPS Docker) | Lead, NOXH Case, CTV, attribution, commission, listing, booking |
| **Compute** | VPS — n8n + Next.js | Classify, parse, API, notify, Admin |
| **Archive** | Google Drive JSONL + `pg_dump` gzip off-VPS | Khôi phục khi VPS hỏng; audit trail |
| **Mirror (optional)** | Google Sheet | Export 1 chiều Postgres → tab `ops_mirror`; content queue biên tập |
| **File hồ sơ** | Google Drive / object storage | Scan giấy tờ; metadata trong Postgres |

## 3. Luồng ingress lead (mới — ADR-013)

```
n8n webhook / House X form / CTV portal
  → normalize / classify / parse
  → House X API upsert Postgres (dedupe normalized_key | normalized_phone)
  → Drive JSONL archive (best-effort)
  → respond
```

Contract UID: `ARCHITECTURE_MAGNIX.md` §3.1 — **schema giữ nguyên**, sink đổi từ Sheet sang Postgres.

### Postgres tables (Phase 0+)

| Domain | Tables (hiện có / planned) |
|--------|----------------------------|
| Lead CRM | `leads`, `customers` |
| CTV / referral | `brokers`, `referrals`, `ctv_applications` |
| NOXH Case | `noxh_cases`, `case_documents`, `case_assist_logs` (Phase 0) |
| Booking / freeze | `unit_bookings` — attribution lock tại `convertedAt` |
| Commission | `commissions` — ACCRUED → PAYABLE → PAID |

## 4. Sheet tabs — vai trò sau ADR-013

| Tab | Vai trò |
|-----|---------|
| `uid_leads` | **Legacy** — migrate → Postgres; không workflow mới |
| `ops_mirror` | **Mới (optional)** — cron export read-only từ Postgres |
| `content_queue` | Editorial — giữ tạm cho content pipeline |
| `content_drafts` | Editorial |
| `video_drafts` | Editorial |
| `outreach_queue` | Editorial |
| `content_metrics` | Metrics publish |
| `content_scorecard` | Scorecard |
| `notification_events` | Log approval Telegram |
| `legal_sources` | Metadata pháp lý |
| `legal_atomic_notes` | Atomic claims |
| `legal_qa` | Q&A SEO |

**Rule:** Không ghi ngược Sheet → Postgres. Mirror chỉ 1 chiều.

## 5. Content storage (không đổi ngay)

```
content_queue
  → editorial_brief
  → content_drafts / video_drafts / outreach_queue
  → notification_events
  → human approve (L3)
  → publish / assemble / send
  → content_metrics
```

Mọi content product tuân `docs/CONTENT_PRODUCT_OUTPUTS.md`. Migrate content sang Postgres khi cần — không blocker Phase 0.

## 6. Drive archive

```
Magnix_Automation/
  leads/YYYY-MM.jsonl
  content-products/YYYY-MM.jsonl
  social-raw/YYYY-MM/{source_key}.json
  render-packages/YYYY-MM/{product_id}/
  backups/housex-YYYY-MM-DD.sql.gz   # khuyến nghị sync off-VPS
```

Archive + pg_dump **không** thay Postgres cho dedupe/query hàng ngày.

## 7. Backup bắt buộc (Postgres SoR)

```bash
# Proptech-HouseX/docs/DEPLOY_VPS_TIMNHAXAHOI.md §7
docker exec housex-postgres pg_dump -U housex housex | gzip > ~/backup/housex-$(date +%F).sql.gz
```

- Tần suất: hàng ngày minimum.
- Off-site: sync `~/backup/` lên Drive hoặc storage khác.
- Test restore: ít nhất 1 lần/quý.

## 8. Env chuẩn

```env
MAGNIX_STORAGE_MODE=postgres_primary_drive_archive

# Postgres SoR (House X)
DATABASE_URL=postgresql://housex:***@localhost:5432/housex

# Archive
GOOGLE_DRIVE_ARCHIVE_FOLDER_ID=

# Sheet mirror (optional — không dedupe)
GOOGLE_SHEET_MIRROR_ID=
MAGNIX_SHEET_MIRROR_ENABLED=false
GOOGLE_SHEET_MIRROR_TAB=ops_mirror

# Legacy content editorial (giữ đến khi migrate)
GOOGLE_SHEET_DATABASE_ID=
GOOGLE_SHEET_CONTENT_QUEUE_TAB=content_queue
GOOGLE_SHEET_CONTENT_DRAFTS_TAB=content_drafts
GOOGLE_SHEET_VIDEO_DRAFTS_TAB=video_drafts
GOOGLE_SHEET_OUTREACH_TAB=outreach_queue
GOOGLE_SHEET_CONTENT_METRICS_TAB=content_metrics
GOOGLE_SHEET_CONTENT_SCORECARD_TAB=content_scorecard
GOOGLE_SHEET_NOTIFICATION_EVENTS_TAB=notification_events
```

## 9. Workflow & code rules

- **Không** tạo workflow n8n mới ghi `uid_leads` Sheet trước Postgres.
- Ingress operational → House X API (`EVENTS_WEBHOOK_URL`, ingest endpoints).
- Log `normalized_key` / case id — **không** log PII đầy đủ.
- Đổi storage → cập nhật ADR trước khi sửa workflow.

## 10. Legacy cleanup

| Legacy | Hành động |
|--------|-----------|
| n8n → Sheet `uid_leads` | Migrate P1; deprecate sau khi Postgres ổn |
| `MAGNIX_STORAGE_MODE=google_sheet_primary_*` | Đổi env → `postgres_primary_drive_archive` |
| Lark Base ops | Không triển khai |
