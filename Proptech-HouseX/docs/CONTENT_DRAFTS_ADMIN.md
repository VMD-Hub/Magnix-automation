# Content Drafts Admin (House X) — P4.2

> Super-only · Agent 3 drafts · CTA tool NƠXH bắt buộc trước L3 · sync Sheet `content_drafts`.

## Mục tiêu

- Super xem/sửa/L3 bản nháp Agent 3 **trên Admin**, không nhảy Sheet để duyệt.
- Cùng allowlist CTA + checklist L3 như content queue.
- Sheet vẫn là nguồn n8n; Postgres = SoR biên tập sau sync.

## Routes

| Surface | Path |
|---|---|
| UI | `/admin/content-drafts` |
| List / create | `GET` / `POST /api/admin/content-drafts` |
| Edit / L3 | `PATCH` / `POST /api/admin/content-drafts/[id]` |
| Sync Sheet | `POST /api/admin/content-drafts/sync` |

## Status

`DRAFT` → `PENDING_L3` → `APPROVED` → `PUBLISHED` (hoặc `REJECTED`).

Actions: `submit_l3` · `approve` · `reject` · `mark_published`.

Publish web CMS từ draft = dùng queue `publish_web`. Facebook Page = n8n P4.3 (due API + `scheduled_at`).

## Sync env

- `GOOGLE_SERVICE_ACCOUNT_JSON`
- `MAGNIX_CONTENT_SHEET_ID` \|\| `MAGNIX_GOOGLE_SHEET_ID` \|\| `GOOGLE_SHEET_MIRROR_ID`
- `MAGNIX_CONTENT_DRAFTS_TAB` (default `content_drafts`)

Upsert: `normalized_key = sheet-draft:{source}::{slug(title)}::{ymd}`.

Merge: không đè CTA / L3 / schedule / article; chỉ refresh body khi status = `DRAFT`.

## Migration

`prisma/migrations/20260721210000_content_drafts`

VPS: `npm run db:deploy` rồi build/restart.

Spec: `docs/CONTENT_QUEUE_P4_SPEC.md` slice 2.
