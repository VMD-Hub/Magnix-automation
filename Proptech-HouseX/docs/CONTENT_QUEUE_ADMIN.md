# Content Queue Admin (House X) — P0 + P1 publish web + P4 slice 1

> Super-only · CTA tool NƠXH bắt buộc trước L3 · thay dần Sheet `content_queue` cho vận hành duyệt.

## Mục tiêu

- Super quản lý hàng đợi nội dung Magnix **trong Admin**, không nhảy Sheet để L3.
- Mọi item publish phải có **đúng 1 CTA** vào tool NƠXH.
- Gate cứng: không `approve` / `mark_published` nếu thiếu `cta_tool_id` + checklist 3 mục.

## CTA chuẩn (allowlist)

| `cta_tool_id` | Path | Khi dùng |
|---|---|---|
| `noxh-check` | `/cong-cu/dieu-kien-noxh` | Điều kiện, hồ sơ, đối tượng, thu nhập |
| `noxh-loan-quick` | `/cong-cu/kiem-tra-vay-noxh` | Vay, lãi, trả góp, chứng minh thu nhập |

Source of truth code: `lib/content/noxh-cta-tools.ts`.

## Checklist L3 (3 câu)

1. Nỗi đau NƠXH nào? (`painPoint` + checkbox `pain`)
2. Link tool nào? (`ctaToolId` + checkbox `ctaTool`)
3. Câu CTA trên bài? (`ctaLabel` + checkbox `ctaCopy`)

Thiếu 1 → API trả `422 GATE_FAILED`.

## Actions

| Action | Ý nghĩa |
|---|---|
| `submit_l3` | INTAKE/REJECTED → PENDING_L3 |
| `approve` / `reject` | L3 |
| `publish_web` | **P1** — tạo/cập nhật `Article` CMS kèm CTA tool; `publishNow=true` → PUBLISHED |
| `mark_published` | Chỉ đánh dấu queue (đăng tay FB/short) |

Status: `INTAKE` → `PENDING_L3` → `APPROVED` → `PUBLISHED` (hoặc `REJECTED`).

## P1 — Publish web

Từ item **APPROVED** (CTA đủ):

1. **Publish web ngay** → tạo `Article` status PUBLISHED + body markdown có link tool → queue `PUBLISHED`
2. **Tạo nháp CMS** → `Article` DRAFT, sửa thêm tại `/admin/articles/[id]`, rồi publish_web lại
3. Public URL: `/wiki-nha-o-xa-hoi/[slug]`

Body luôn có section **Kiểm tra nhanh (CTA)** — không publish bài trống CTA.

## Quan hệ Sheet / n8n

- n8n vẫn có thể ghi Sheet `content_queue` (pipeline listen/classify).
- House X Postgres `content_queue_items` = **mặt kính Super L3 + CTA + publish web**.
- Field `sheet_key` optional; sync tự động Sheet → Postgres = backlog sau.

## P4 slice 1 — Sync Sheet + lịch đăng

Spec đầy đủ: `docs/CONTENT_QUEUE_P4_SPEC.md`.

- Nút **Sync từ Sheet** → `POST /api/admin/content-queue/sync`
- Field `scheduled_at` trên editor + tab **Lịch đăng**

## P4.2 — Content drafts

- UI: `/admin/content-drafts` · sync tab Sheet `content_drafts`
- Doc: `docs/CONTENT_DRAFTS_ADMIN.md` · spec slice 2 trong `CONTENT_QUEUE_P4_SPEC.md`
- Env VPS: `GOOGLE_SERVICE_ACCOUNT_JSON` + `MAGNIX_CONTENT_SHEET_ID` (hoặc `MAGNIX_GOOGLE_SHEET_ID` / `GOOGLE_SHEET_MIRROR_ID`)
- Tab Sheet: `MAGNIX_CONTENT_QUEUE_TAB` (default `content_queue`)

Migration: `20260721200000_content_queue_schedule_sync`

## Migration (P0 table)

`prisma/migrations/20260721180000_content_queue_items`

```bash
cd Proptech-HouseX
npx prisma migrate deploy
npx prisma generate
```

## KPI Super (tuần)

- Số item published **có** CTA tool
- Số submit 2 tool NƠXH
- `counts.missingCta` trên board → phải về 0 trước khi scale content
