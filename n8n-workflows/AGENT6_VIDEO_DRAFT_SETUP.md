# Agent 6 — Production Brief (Layer C)

> **Deliverable video:** Agent 6 v3 (render spec) → **Agent 7 v2** (MP4 auto) → L3 xem MP4 → đăng.  
> Prompt: `ai-agents-prompts/n8n__production-brief.md` **version 3** · Render: `AGENT7_VIDEO_RENDER_V2.md`

Workflow: `content-video-draft.workflow.json`  
Prompt: `ai-agents-prompts/n8n__production-brief.md` (thay `n8n__short-video-script.md`)

---

## Vai trò trong pipeline

```
Agent 1 (listen) ──→ meta.intake_v1              [Layer A]
       ↓ Agent 2 (classify)
Layer B ──→ meta.editorial_brief_v1              [Layer B]
       ↓ Agent 6 (production brief v3) ──→ video_drafts ──→ L3 script
       ↓ Agent 3 (lead magnet) ──→ content_drafts (song song)
       ↓ Agent 7 v2 (RenderScript) ──→ MP4 ready_for_review
content_metrics ← clip đã đăng → Agent 5 Scorecard
```

Agent 6 **không** đọc `pain_text` thô one-shot — input là `editorial_brief_v1` + `intake_v1`.

---

## Lịch & batch

| | Giá trị |
|---|--------|
| Cron | `15 9 * * *` — **09:15 VN** hàng ngày |
| Batch | 3 production brief/lần |
| Min score | 70 |
| Platform | tiktok, fb_reels, youtube_shorts |

Chạy sau Layer B (08:30) và Agent 3 (09:00).

---

## Candidate filter

Một dòng `content_queue` được chọn khi:

- `meta.intake_v1` **và** `meta.editorial_brief_v1` tồn tại
- `status=classified` (hoặc `claude_verdict=qualified`)
- `score ≥ 70`
- `segment` ∈ {noxh_income, valuation, sme_credit, general_inbound}
- `platform` là kênh video
- `meta.video_draft_created !== true`

---

## Output schema (production_brief v2)

Beats có thêm: `role`, `visual_spec`, `retention_intent`.  
Meta trên `video_drafts`: `production_brief_version`, `pattern_applied`, `layer: C`.

---

## QA tiers

| Tier | Agent 6 |
|------|---------|
| L0 | Regex forbidden + hook ≤18 từ |
| L1 | Parse JSON schema (beats ≥4, duration 21–60, visual_spec optional) |
| L2 | `/devil` thủ công trên segment nhạy cảm |
| L3 | Human: `status=approved` + `l3_approved=true` |

---

## Env VPS

```env
ANTHROPIC_API_KEY=
ANTHROPIC_DRAFT_MODEL=claude-sonnet-4-6
ANTHROPIC_VIDEO_MODEL=claude-sonnet-4-6

DEEPSEEK_API_KEY=                          # ưu tiên nếu set
```

---

## Manual test

1. Đảm bảo Layer B đã ghi `editorial_brief_v1` trên ít nhất 1 dòng
2. `node n8n-workflows/build-content-video-draft.mjs`
3. Import `content-video-draft.workflow.json` → gán `googleApi`
4. Manual run → `stats.video_ok > 0`, tab `video_drafts` có beats v2

---

## Troubleshooting

| Triệu chứng | Fix |
|-------------|-----|
| Không candidate | Thiếu `editorial_brief_v1` — chạy Layer B trước |
| MISSING_EDITORIAL_OR_INTAKE | Meta chưa đủ 2 layer — kiểm tra cột O |
| L0 fail | Sửa output LLM — vi phạm compliance |
| Parse fail | Beats thiếu hoặc duration ngoài 21–60 |

Chi tiết Sheet: `SHEET_VIDEO_DRAFTS_SETUP.md` · Layer B: `EDITORIAL_BRIEF_SETUP.md`
