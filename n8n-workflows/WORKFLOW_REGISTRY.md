# Magnix — n8n Workflow Registry

| Slug | File | Trigger | QA tiers | Parse | Mô tả | Trạng thái |
|------|------|---------|----------|-------|-------|------------|
| `uid-ingest` | `uid-ingest.workflow.json` | Webhook POST | L0 | ✅ | Google Sheet `uid_leads` upsert by `normalized_key` + Drive JSONL archive | staging |
| `content-scorecard` | `content-scorecard.workflow.json` | Cron 10h + Manual | L0 | — | Sheet metrics → score.mjs logic → Sheet `content_scorecard` | staging |
| `social-listening` | `social-listening.workflow.json` | Cron Mon 7h + Manual | L0 | ✅ | TikTok weekly → Claude → Sheet content_queue + dedupe | staging |
| `social-listening-facebook` | `social-listening-facebook.workflow.json` | Cron Wed 7h + Manual | L0 | ✅ | Facebook page/group weekly → Claude → content_queue | staging |
| `content-classify` | `content-classify.workflow.json` | Cron 8h + Manual | L0 | ✅ | Agent 2: regex → LLM classify content_queue (200/batch) | staging |
| `content-editorial-brief` | `content-editorial-brief.workflow.json` | Cron 8:30 + Manual | L0–L1 | ✅ | Layer B: intake_v1 → editorial_brief + target_products (5/batch) | staging |
| `content-draft` | `content-draft.workflow.json` | Cron 9h + Manual | L0–L3 | ✅ | Agent 3: sản phẩm viết — lead magnet / Page post / website article / carousel (5/batch) | staging |
| `outreach-queue` | `outreach-queue.workflow.json` | Cron 9:30 + Manual | L0–L3 | ✅ | Agent 4: Zalo outreach → outreach_queue (10/batch) | staging |
| `content-video-draft` | `content-video-draft.workflow.json` | Cron 9:15 + Manual | L0–L3 | ✅ | Agent 6: video/slide production package — script, SRT, slide/screen plan, caption (3/batch) | staging |
| `content-video-render` | `content-video-render.workflow.json` | Cron 9:45 + Manual | L3 | — | Agent 7: assembly/render package — assets, edit recipe, optional MP4 (1/batch) | staging v2 |

## Cột bắt buộc khi thêm dòng

- **Slug:** path webhook `/webhook/magnix/{slug}` hoặc tên schedule
- **File:** tên JSON trong thư mục này
- **Trigger:** Webhook / Cron / Manual
- **QA tiers:** L0–L3 áp dụng (xem `.cursor/QA_TIERS.md`)
- **Parse layer:** có/không — bắt buộc nếu có LLM node
- **Notification:** workflow có approve / legal source needed / render review / blocked human action phải gửi Telegram theo `docs/TELEGRAM_APPROVAL_NOTIFICATIONS.md`
- **Credential:** `uid-ingest` — `googleApi`/Google Sheets credential + Drive credential. Agent 1 — `googleApi`, Drive SA, Apify, Anthropic. Agent 2 — `googleApi` + `DEEPSEEK_API_KEY` hoặc `ANTHROPIC_API_KEY`. Workflow content dùng Google Sheets làm ops queue/review.
- **Go-live:** YYYY-MM-DD hoặc `staging`

## Import lên n8n

1. n8n UI → Import from File → chọn `.workflow.json`
2. Gán Credential theo tên trong registry
3. Activate workflow
4. Test webhook bằng curl trước khi ghi `production` vào cột Trạng thái
