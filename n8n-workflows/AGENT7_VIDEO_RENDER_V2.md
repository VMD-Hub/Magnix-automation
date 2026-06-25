# Agent 7 v2 — Video Render tự động (beats → RenderScript → MP4)

**Engine:** Creatomate RenderScript (dynamic, không template tĩnh)  
**Workflow:** `content-video-render.workflow.json`  
**Phụ thuộc:** Agent 6 `production_brief_version: 3` + `beats_json`

---

## Nguyên tắc Magnix

Magnix **tự động hóa** — Agent 7 biến `beats_json` thành MP4. Không quy trình quay/edit thủ công, trừ khi thiếu API key nguồn cung (Pexels/TTS).

---

## Pipeline

```
Agent 6 (prompt v3) → video_drafts.beats_json
        ↓ L3: approved + l3_approved=true
Agent 7 v2:
  1. Parse beats_json (≥4 scenes)
  2. Pexels portrait search per beat (visual_spec.stock_query)
  3. buildCreatomateSourceFromBeats() → RenderScript JSON
  4. POST Creatomate /v2/renders { source: ... }
  5. Poll → meta.render_url + status=ready_for_review
```

---

## Env VPS

```env
N8N_BLOCK_ENV_ACCESS_IN_NODE=false
PEXELS_API_KEY=                    # B-roll per beat — khuyến nghị bắt buộc
CREATOMATE_VOICE_PROVIDER=google   # voice element per beat (Creatomate TTS)
CREATOMATE_DISABLE_VOICE=false       # true = chỉ text overlay, không TTS
```

**Creatomate API:** Header Auth credential trên HTTP POST + GET (Bearer KEY).

`CREATOMATE_TEMPLATE_ID` **không còn bắt buộc** — render dùng `source` RenderScript.

---

## Agent 6 v3 — output bắt buộc cho render

Prompt: `ai-agents-prompts/n8n__production-brief.md` (version 3)

Mỗi beat broll phải có:

```json
{
  "visual_spec": {
    "type": "broll",
    "stock_query": "young vietnamese couple apartment keys",
    "fallback_color": "#0f172a"
  },
  "on_screen": "≤12 từ",
  "spoken": "TTS segment",
  "retention_intent": "pattern_interrupt"
}
```

Rows cũ (brief v1/v2 thiếu `stock_query` EN): **Agent 7 bỏ qua** — re-run Agent 6 v3 hoặc reject.

Agent 7 **chỉ render** khi mỗi beat `broll` có `visual_spec.stock_query` **tiếng Anh** (≥5 chars, không dấu Việt).

---

## Deploy

```powershell
node n8n-workflows/build-content-video-draft.mjs
node n8n-workflows/build-content-video-render.mjs
node scripts/push-n8n-workflows.mjs
```

Manual test: row `approved` + l3 → Build Summary `stats.render_ok > 0` · MP4 có ≥4 scene cuts.

Dry-run local:

```powershell
node scripts/test-beats-render-spec.mjs
```

---

## Pass criteria v2

| Kiểm tra | Kỳ vọng |
|----------|---------|
| RenderScript | ≥4 composition scenes |
| Pexels | ≥2/4 beats có videoUrl (nếu có API key) |
| MP4 | 9:16, duration ≈ duration_sec |
| Text | on_screen mỗi scene khớp beats |
| Voice | TTS per beat (nếu Creatomate voice enabled) |

---

## Phase 3 — ElevenLabs TTS (triển khai)

Webhook `webhooks/video-tts` — doc: **`VIDEO_TTS_SETUP.md`**

```
Agent 7 → POST /magnix/video-tts/batch → MP3 per beat → Creatomate audio track
```

Env n8n: `MAGNIX_VIDEO_TTS_URL` + `MAGNIX_WEBHOOK_TOKEN` (cùng token webhook Magnix).

---

## Roadmap tiếp

- Batch render >1/lần
- `motion_graphic` beats
