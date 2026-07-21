# Magnix — 8 Agent + Legal Gate

> Cập nhật: 2026-06-26 · Magnix = **automation-first**, không quy trình thủ công.
>
> **Mục tiêu pháp lý:** mọi content/kịch bản NOXH · vay · định giá phải qua **Legal Gate** — xem `docs/LEGAL_GATE_PIPELINE.md`.

---

## 8 Agent chuẩn (hiệu quả · VPS cron)

| # | Agent | Workflow | Legal gate | Output | Cron VN |
|---|-------|----------|------------|--------|---------|
| 1 | Social Listening | `social-listening` (+ FB) | Tag `legal_confusion` | `content_queue` + `intake_v1` | T2/T4 07:00 |
| 2 | Classify | `content-classify` | Set `requires_legal_kb` | segment, score | 08:00 · 200 |
| — | **Layer B** | `content-editorial-brief` | **Inject** `legal_retrieval_pack` | `editorial_brief_v1` | 08:30 · 5 |
| 3 | Lead Magnet | `content-draft` | **Consume** pack | `content_drafts` (text_post) | 09:00 · 5 |
| 3b | Carousel | `content-carousel-draft` | **Consume** pack | `content_drafts` (carousel slides) | 09:20 · 3 |
| 4 | Outreach | `outreach-queue` | **Consume** (segment pháp lý) | `outreach_queue` | 09:30 · 10 |
| 5 | Scorecard | `content-scorecard` | Audit `source_refs` | verdict, IVI | 10:00 |
| 6 | Video Script **v3** | `content-video-draft` | **Consume** pack | `video_drafts` + beats_json | 09:15 · 3 |
| 7 | Video Render **v2** | `content-video-render` | L0 text on-screen | MP4 / render package | 09:45 · 1 |
| **8** | **Email Sequence** | `email-sequence-draft` (stub) | **Consume** + L3 | `EmailSequenceStep` JSON | Manual |
| **P** | **Page Publish** | `content-page-publish` | L0 + đã L3 | FB Page post live | 10/14/18h · 3 |

**Layer B** bắt buộc trước Agent 3 và 6. **Page Publish** chạy sau L3 `approved` trên `content_drafts` — xem `docs/CONTENT_PAGE_PUBLISH_SETUP.md`.

**Agent 8 (ADR-017):** prompt `ai-agents-prompts/n8n__email-sequence-draft.md` — sinh subject/preheader/body/CTA cho SC-6 `channel=email`. Workflow n8n JSON chưa deploy; House X P1 dùng stub Welcome E1–E3 + DeliveryAdapter. **L3 bắt buộc** trước blast sequence mới / newsletter.

**LLM routing** (`magnix-public-config.json` → `llm_task_providers`): **DeepSeek** cho classify · Layer B · outreach · video script; **Anthropic** cho Agent 3 segment pháp lý (`noxh_income` / `valuation` / `sme_credit`). Cả hai key nên có trên VPS — fallback tự động. **Bản chuẩn:** `docs/LLM_PROVIDER_POLICY.md` · `ARCHITECTURE_MAGNIX.md` §8.

---

## Sơ đồ đầy đủ

```
Listen → Classify → Editorial (+ Legal Pack) → ┬→ Lead Magnet → [L3] → Page Publish → FB Page
                                                │                    └→ Outreach
                                                └→ Video Script v3 → [L3] → Render v2 → Metrics → Scorecard
                         ↓ needs_human_legal_source
                    Telegram legal_source_needed
```

---

## Nguyên tắc vận hành

1. Google Sheet chỉ là **content editorial workspace** (`content_queue`,
   `content_drafts`, `video_drafts`, `outreach_queue`) và L3 review; không phải
   store of record hay write path cho lead/sales Ops. Postgres House X giữ
   authoritative operational state theo ADR-013/015.
2. LLM output → parse layer bắt buộc
3. **Legal Gate** trước mọi bản publish pháp lý — Layer K (`legal-sources/`)
4. L3 human duyệt **nội dung** (script/MP4) — không thay thế render auto
5. Agent 6 sinh **render spec**; Agent 7 **thực thi** spec

---

## Deploy sau thay đổi

```powershell
node scripts/build-legal-pack-bundle.mjs
node scripts/rebuild-all-workflows.mjs
node scripts/push-n8n-workflows.mjs
```

Registry chi tiết: `WORKFLOW_REGISTRY.md` · Legal: `docs/LEGAL_GATE_PIPELINE.md` · Audit cũ: `AGENT7_AUDIT.md` (MVP v1).
