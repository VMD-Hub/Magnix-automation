# Tool analytics Admin (P2)

> Super-only · `/admin/tool-analytics` · đo phân phối tool → lead (SoR).

## Funnel đo được

| Bậc | Nguồn | Ghi chú |
|---|---|---|
| Content CTA | `content_queue_items` (`cta_tool_id`, APPROVED/PUBLISHED) | Bài trỏ vào tool |
| Submit / Lead | `leads.source` = `tool:noxh-check` \| `tool:noxh-loan-quick-check` | Chỉ 2 tool NƠXH tạo lead |
| CRM | `leads.status` NEW → CONTACTED → … → WON | Cùng cửa sổ ngày |

**Views:** chưa có trong Postgres (client `track()` → GTM). Cột Views = `—`.

## API

`GET /api/admin/tool-analytics?days=7|30|90` (mặc định 30) — Super cookie.

## Ưu tiên vận hành

Highlight 2 tool CTA chuẩn (`noxh-check`, `noxh-loan-quick`). Các tool khác hiện 0 lead nếu chưa gắn `LEAD_SOURCE`.

## Backlog

- SoR pageview / tool open (thay GTM-only)
- Gắn lead source cho tool tài chính khác nếu cần volume
