# ADR-013 — Postgres Primary, Sheet Mirror/Archive

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-08 |
| **Deciders** | House X / Magnix ops |
| **Supersedes** | `.cursor/STORAGE_OPTIONS.md` (2025 — Google Sheet primary) |

## Context

- Magnix ban đầu chốt **Google Sheet = store of record** vì lo VPS mất dữ liệu khi tắt/reset.
- Thực tế vận hành: kết nối Sheet/Lark qua API **chậm, hay lỗi quota/OAuth**, không phù hợp pipeline realtime (NOXH Case, CTV attribution, commission).
- House X đã chạy **Postgres trên VPS** (Prisma) cho listing, booking, lead, commission.
- Phase 0 (NOXH Case + CTV pipeline) cần transaction, dedupe `normalized_phone`, milestone/doc tracking — không làm tốt trên Sheet.

## Decision

1. **System of record (ghi chính):** Postgres trên VPS (House X `DATABASE_URL`).
   - Lead operational, NOXH Case, CTV claims, attribution, commission, booking.
   - Dedupe: `normalized_key` (Magnix UID) hoặc `normalized_phone` (NOXH/CTV).

2. **Disaster recovery (bắt buộc):** `pg_dump` hàng ngày off-VPS + Google Drive JSONL archive (best-effort event/lead snapshot).
   - VPS chết → restore từ backup; không coi VPS là single copy không backup.

3. **Google Sheet:** chỉ **mirror read-only** và/hoặc **content editorial queue** — **không** upsert dedupe hàng ngày cho lead ops.
   - Sync 1 chiều: Postgres → Sheet (cron, optional).
   - Content tabs (`content_queue`, `content_drafts`, …) giữ tạm cho biên tập; migrate sau nếu cần.

4. **Lark Base:** không dùng làm store. Ops chính trên **Admin House X**.

5. **n8n ingress mới:** webhook → normalize/classify → **`POST` House X API** (Postgres) → Drive JSONL archive → respond.
   - Không tạo workflow mới ghi Sheet trước Postgres.

6. **File scan hồ sơ:** Google Drive / object storage; metadata + status trong Postgres (`CaseDocument`).

## Consequences

### Positive

- Latency thấp, ACID, foreign key cho CTV/commission.
- Một nguồn sự thật — tránh 3 sink (Sheet + Lark + Postgres).
- Khớp Phase 0 blueprint (Admin House X, Contact Firewall, booking cọc freeze).

### Negative / Trade-offs

- Cần **backup discipline** (`DEPLOY_VPS_TIMNHAXAHOI.md` §7) — nếu thiếu, rủi ro mất data tăng.
- Workflow n8n cũ ghi Sheet `uid_leads` cần migrate dần.
- Team non-dev mất Sheet trực tiếp cho lead ops → dùng Admin hoặc mirror tab.

## Migration (không big-bang)

| Phase | Việc |
|-------|------|
| **P0** | NOXH Case, CTV claims, doc tracking → Postgres only |
| **P1** | Magnix inbound webhook → House X ingest API |
| **P2** | Cron mirror Postgres → Sheet `ops_mirror` (optional) |
| **Later** | Content queue: giữ Sheet hoặc migrate khi ổn định |

## Env

```env
MAGNIX_STORAGE_MODE=postgres_primary_drive_archive

# House X (Postgres SoR)
DATABASE_URL=postgresql://...

# Archive / mirror (optional)
GOOGLE_DRIVE_ARCHIVE_FOLDER_ID=
GOOGLE_SHEET_MIRROR_ID=          # read-only export, không dedupe
MAGNIX_SHEET_MIRROR_ENABLED=false
```

## References

- `.cursor/STORAGE_OPTIONS.md` (cập nhật theo ADR này)
- `Proptech-HouseX/docs/DEPLOY_VPS_TIMNHAXAHOI.md` §7 — backup
- `ARCHITECTURE_MAGNIX.md` §3.1 — UID contract (sink = Postgres, schema giữ nguyên)
