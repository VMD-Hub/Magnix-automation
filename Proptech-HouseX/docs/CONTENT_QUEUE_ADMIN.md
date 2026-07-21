# Content Queue Admin (House X) — P0

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

## UI / API

| | |
|---|---|
| Admin | `/admin/content-queue` |
| List/Create | `GET/POST /api/admin/content-queue` |
| Update/Actions | `PATCH/POST /api/admin/content-queue/[id]` |
| Actions | `submit_l3` · `approve` · `reject` · `mark_published` |

Status: `INTAKE` → `PENDING_L3` → `APPROVED` → `PUBLISHED` (hoặc `REJECTED`).

## Quan hệ Sheet / n8n

- n8n vẫn có thể ghi Sheet `content_queue` (pipeline listen/classify).
- House X Postgres `content_queue_items` = **mặt kính Super L3 + CTA**.
- Field `sheet_key` optional để lần dấu item Sheet; sync tự động = backlog P1.

## Migration

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
