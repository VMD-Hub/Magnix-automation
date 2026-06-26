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
| 3 | Lead Magnet | `content-draft` | **Consume** pack | `content_drafts` | 09:00 · 5 |
| 4 | Outreach | `outreach-queue` | **Consume** (segment pháp lý) | `outreach_queue` | 09:30 · 10 |
| 5 | Scorecard | `content-scorecard` | Audit `source_refs` | verdict, IVI | 10:00 |
| 6 | Video Script **v3** | `content-video-draft` | **Consume** pack | `video_drafts` + beats_json | 09:15 · 3 |
| 7 | Video Render **v2** | `content-video-render` | L0 text on-screen | MP4 / render package | 09:45 · 1 |

**Layer B** bắt buộc trước Agent 3 và 6. Segment `noxh_income` / `valuation` / `sme_credit` **không** chạy Agent 3/6 nếu thiếu pack hoặc `needs_human_legal_source`.

---

## Sơ đồ đầy đủ

```
Listen → Classify → Editorial (+ Legal Pack) → ┬→ Lead Magnet → Outreach
                                                └→ Video Script v3 → [L3] → Render v2 → Metrics → Scorecard
                         ↓ needs_human_legal_source
                    Telegram legal_source_needed
```

---

## Nguyên tắc vận hành

1. Sheet store-of-record + ops queue/review · VPS cron · không phụ thuộc máy local
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
