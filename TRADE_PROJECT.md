# Trade / CRO — Dự án riêng

**Magnix-automation** chỉ phục vụ inbound lead và content pipeline. Mọi logic giao dịch, swing, CRO, VN100 scan và Telegram bot trade **không** nằm trong repo này.

## Repo chính thức

| Mục | Giá trị |
|-----|---------|
| **Path local** | `C:\Users\nguye\trading-intelligence` |
| **Slash / CRO** | `.cursor/commands/trade.md` |
| **Automation** | GitHub Actions (`trading-alerts.yml`, `telegram-bot.yml`) |
| **Store of record** | `portfolio/{real,paper}/*.csv` + git |
| **Telegram** | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` trong `trading-intelligence/.env` |

## Đã gỡ khỏi Magnix (2026-06-25)

- Scripts: `swing-*.mjs`, `init-swing-kpi.mjs`, libs `swing-*`, `tcbs-market`, `google-drive` (trade)
- n8n workflow: `swing-vn100-scan`
- Docs: `scripts/SWING-*.md`
- Config: `google_sheet_swing_kpi_id`, `schedule_cron_swing_vn100`, `drive_trade_project_folder_id`

## Tài sản Google cũ (Magnix era)

Có thể **archive** hoặc migrate sang TI — Magnix không còn đọc/ghi:

- Sheet KPI paper: `1rgjLhL6FPz3fWRzoIL4WV0LcdknegD7bQWhPLIhM5Lc`
- Drive Trade_Project: `1hr8fs1ocZZ72JAcm1k5QDTVxsCg2q7Pv`

## Ranh giới nhanh

| Magnix | trading-intelligence |
|--------|----------------------|
| UID leads, content queue | Portfolio, gate, `/trade` |
| n8n content agents | `job postclose` / `swing` / `t0` |
| Telegram L3 content (tương lai) | Telegram bot 2 chiều trade |
| Google Sheet inbound | CSV + `watch-state.json` |

Chi tiết: `trading-intelligence/docs/MAGNIX_BOUNDARY.md`
