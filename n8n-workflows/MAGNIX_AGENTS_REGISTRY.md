# Magnix — 6 Agent chuẩn + Agent 7 v2 (automation video)

> Cập nhật: 2026-06-23 · Magnix = **automation-first**, không quy trình thủ công.

---

## 6 Agent chuẩn (hiệu quả · VPS cron)

| # | Agent | Workflow | Output | Cron VN |
|---|-------|----------|--------|---------|
| 1 | Social Listening | `social-listening` (+ FB) | `content_queue` + `intake_v1` | T2/T4 07:00 |
| 2 | Classify | `content-classify` | segment, score | 08:00 · 200 |
| — | **Layer B** | `content-editorial-brief` | `editorial_brief_v1` | 08:30 · 5 |
| 3 | Lead Magnet | `content-draft` | `content_drafts` | 09:00 · 5 |
| 4 | Outreach | `outreach-queue` | `outreach_queue` | 09:30 · 10 |
| 5 | Scorecard | `content-scorecard` | verdict, IVI | 10:00 |
| 6 | Video Script **v3** | `content-video-draft` | `video_drafts` + **beats_json render-ready** | 09:15 · 3 |

**Layer B** bắt buộc trước Agent 3 và 6.

---

## Agent 7 v2 — Render video tự động

| | |
|---|---|
| Workflow | `content-video-render` |
| Input | `video_drafts` approved + l3 + `beats_json` v3 |
| Engine | Creatomate **RenderScript** (multi-scene từ beats) |
| Doc | `AGENT7_VIDEO_RENDER_V2.md` |
| Trạng thái | **v2 rebuilt** — thay template tĩnh MVP |

```
Agent 6 (brief v3) → beats_json
       ↓ L3 script
Agent 7 v2 → Pexels/scene + RenderScript → MP4
       ↓
ready_for_review → đăng → Agent 5
```

**Không** coi quay CapCut thủ công là luồng chuẩn — chỉ fallback khi API nguồn (Pexels/voice) down.

---

## Sơ đồ đầy đủ

```
Listen → Classify → Editorial → ┬→ Lead Magnet → Outreach
                               └→ Video Script v3 → [L3] → Render v2 → Metrics → Scorecard
```

---

## Nguyên tắc vận hành

1. Sheet store-of-record + ops queue/review · VPS cron · không phụ thuộc máy local
2. LLM output → parse layer bắt buộc
3. L3 human duyệt **nội dung** (script/MP4) — không thay thế render auto
4. Agent 6 sinh **render spec**; Agent 7 **thực thi** spec

---

## Deploy sau thay đổi v2

```powershell
node scripts/rebuild-all-workflows.mjs
node scripts/push-n8n-workflows.mjs
```

Registry chi tiết: `WORKFLOW_REGISTRY.md` · Audit cũ: `AGENT7_AUDIT.md` (MVP v1).
