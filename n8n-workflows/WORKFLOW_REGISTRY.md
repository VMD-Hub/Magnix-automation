# Magnix — n8n Workflow Registry

| Slug | File | Trigger | QA tiers | Legal gate | Parse | Mô tả | Trạng thái |
|------|------|---------|----------|------------|-------|-------|------------|
| `uid-ingest` | `uid-ingest.workflow.json` | Webhook POST | L0 | Route (classify) | ✅ | House X Postgres `POST /api/ingest/magnix-lead` (dedupe `normalized_key`) + Drive JSONL archive | staging |
| `content-scorecard` | `content-scorecard.workflow.json` | Cron 10h + Manual | L0 | Audit refs | — | Sheet metrics → score.mjs logic → Sheet `content_scorecard` | staging |
| `social-listening` | `social-listening.workflow.json` | Cron Mon 7h + Manual | L0 | Tag | ✅ | TikTok weekly → Claude → Sheet content_queue + dedupe | staging |
| `social-listening-facebook` | `social-listening-facebook.workflow.json` | Cron Wed 7h + Manual | L0 | Tag | ✅ | Facebook page/group weekly → Claude → content_queue | staging |
| `content-classify` | `content-classify.workflow.json` | Cron 8h + Manual | L0 | Route | ✅ | Agent 2: regex → LLM classify content_queue (200/batch) | staging |
| `content-editorial-brief` | `content-editorial-brief.workflow.json` | Cron 8:30 + Manual | L0–L1 | **Inject** | ✅ | Layer B: intake → brief + `legal_retrieval_pack` (5/batch) | staging |
| `content-draft` | `content-draft.workflow.json` | Cron 9h + Manual | Title QA + Hook Gate + L0–L2 + L3 | **Consume** | ✅ | Agent 3: text_post only → Router → Hook Gate → L2 (5/batch) | staging |
| `content-carousel-draft` | `content-carousel-draft.workflow.json` | Cron 9:20 + Manual | L0 | **Consume** | ✅ | Agent 3b: `carousel_image` → slides trong meta (3/batch) | staging |
| `outreach-queue` | `outreach-queue.workflow.json` | Cron 9:30 + Manual | L0–L1 + L3 | Consume | ✅ | Agent 4: Zalo script → outreach_queue (+ warmth, Phase 0 tracking cols) · SOP `docs/OUTBOUND_RUNBOOK.md` | staging |
| `content-video-draft` | `content-video-draft.workflow.json` | Cron 9:15 + Manual | L0–L3 | **Consume** | ✅ | Agent 6: video production package (3/batch) | staging |
| `content-page-publish` | `content-page-publish.workflow.json` | Cron 10/14/18h + Manual | L0 | Consume | — | **Page Publish:** `content_drafts` approved → Graph API feed | staging |
| `content-page-cover` | `content-page-cover.workflow.json` | Cron 9:30 + Manual | L0 | — | — | **Page Cover:** Gemini image → Drive → `meta.publish_image_url` | staging |
| `content-housex-article` | `content-housex-article.workflow.json` | Webhook POST + Manual | L0 + voice gate + L3 | **Consume** | ✅ | **HouseX PR:** webhook `/magnix/housex-article` → LLM PR → Sheet `housex_articles` | staging |
| `housex-noxh-lead-route` | `housex-noxh-lead-route.workflow.json` | Webhook POST ×2 + Manual | L0 | — | ✅ | **HouseX Events Hub:** NOXH + form + nurture + **attribution.conflict** + đăng ký → Sheet + Telegram | staging |
| `housex-noxh-nurture` | `housex-noxh-nurture.workflow.json` | Cron 9h + Manual | L0 | — | — | **HouseX NOXH:** COLD/OUT → email nurture (Resend) + meta `nurture_sent_at` | staging |
| `content-video-render` | `content-video-render.workflow.json` | Cron 9:45 + Manual | L3 | L0 text | — | Agent 7: assembly/render package (1/batch) | staging v2 |
| `telegram-notify` | `telegram-notify.workflow.json` | Webhook POST | L0 | Escalate | — | Central notify incl. `legal_source_needed` | staging |
| `telegram-reminder` | `telegram-reminder.workflow.json` | Cron 30m + Manual | L0 | SLA legal | — | SLA reminder cho approval/render/legal | staging |
| `telegram-resolver` | `telegram-resolver.workflow.json` | Cron 30m + Manual | L0 | — | — | Mark `notification_events` resolved khi Sheet approved | staging |

> **Trade / swing / CRO** không thuộc Magnix — xem `TRADE_PROJECT.md` và repo `trading-intelligence`.

## Cột bắt buộc khi thêm dòng

- **Slug:** path webhook `/webhook/magnix/{slug}` hoặc tên schedule
- **File:** tên JSON trong thư mục này
- **Trigger:** Webhook / Cron / Manual
- **QA tiers:** L0–L3 áp dụng (xem `.cursor/QA_TIERS.md`)
- **Legal gate:** Inject / Consume / Audit / Tag — xem `docs/LEGAL_GATE_PIPELINE.md`
- **Parse layer:** có/không — bắt buộc nếu có LLM node
- **Notification:** workflow có approve / legal source needed / render review / blocked human action phải gửi Telegram theo `docs/TELEGRAM_APPROVAL_NOTIFICATIONS.md`
- **LLM provider:** DeepSeek / Anthropic theo task — xem `docs/LLM_PROVIDER_POLICY.md`
- **Credential:** `uid-ingest` — Header Auth `HouseX Magnix Ingest` (`x-magnix-ingest-secret`) cho Postgres ingest; Drive credential cho archive. Agent 1 — `googleApi`, Drive SA, Apify, Anthropic. Agent 2 — `googleApi` + `DEEPSEEK_API_KEY` (ưu tiên) hoặc `ANTHROPIC_API_KEY`. Workflow content dùng Google Sheets làm ops queue/review.
- **Go-live:** YYYY-MM-DD hoặc `staging`

## Import lên n8n

1. n8n UI → Import from File → chọn `.workflow.json`
2. Gán Credential theo tên trong registry
3. Activate workflow
4. Test webhook bằng curl trước khi ghi `production` vào cột Trạng thái
