# Agent 7 — Báo cáo rà soát (không đạt yêu cầu tạo video)

**Ngày rà soát:** 2026-06-23  
**Workflow:** `content-video-render.workflow.json`  
**Kết luận:** **FAIL** — giữ `non-compliant`, không nằm trong 6 agent chuẩn Magnix.

---

## 1. Mục tiêu kỳ vọng

Agent 7 phải biến `video_drafts` (output Agent 6) thành **MP4 9:16 sẵn đăng**, thực thi:

- Timeline từ `beats_json` (hook → tension → value → proof → cta)
- On-screen text từng beat, B-roll theo `visual_spec`
- Voice tiếng Việt khớp `spoken` từng đoạn
- Duration khớp `duration_sec` + rubric platform (`docs/PLATFORM_VIRAL_RESEARCH.md`)

Prompt Agent 6 (`n8n__production-brief.md`) ghi rõ beats là **machine-executable** — *"agent dựng video đọc được từng field"*.

---

## 2. Implementation hiện tại

File: `n8n-workflows/code/content-video-render/02-build-creatomate-payload.js`

Chỉ map **7 modification** vào template Creatomate tĩnh:

| Field Sheet | Creatomate element | Ghi chú |
|-------------|-------------------|---------|
| `hook_3s` | Hook-Text | OK một phần |
| `spoken_script` | Body-Text + Voiceover | Gộp toàn bộ teleprompter — không theo beat |
| `caption` | Caption-Text | 1 dòng |
| `cta_keyword` | CTA-Text | 1 dòng |
| `title` | Title-Text | |
| Pexels (1 query) | Background-Video | Query từ `beats[0].visual`, không `visual_spec.stock_query` |
| — | — | **`beats_json` không parse timeline** |

Phase 2 (ElevenLabs TTS URL) — **chưa build** (`AGENT7_VIDEO_RENDER_SETUP.md` dòng 152).

---

## 3. Gap chi tiết vs spec viral

| Spec (`PLATFORM_VIRAL_RESEARCH.md`) | Agent 7 |
|-------------------------------------|---------|
| Hook text + verbal frame 0–1.5s | Phụ thuộc template; không sync beat 0–3s |
| Pattern interrupt mỗi 3–5s | Không có multi-cut |
| Completion target ≥70% (21–45s) | Không enforce duration |
| Save/share CTA soft | CTA text tĩnh, không gắn beat `role=cta` |
| Search keyword trong 5s đầu | Không kiểm tra spoken beat hook |
| Voice rõ, music nhẹ | Creatomate TTS mặc định — chưa validate tiếng Việt |

---

## 4. Triệu chứng vận hành đã quan sát

| Triệu chứng | Nguyên nhân gốc |
|-------------|-----------------|
| Agent 7 kết thúc <10s | Không candidate (`approved` + l3) hoặc env thiếu |
| MP4 generic (chữ + stock 1 clip) | Template MVP, không beats |
| Row 2 `ready_for_review` nhưng chất lượng thấp | Render thành công kỹ thuật ≠ đạt spec nội dung |
| Backlog 2300+ script Agent 6, 0 render eligible | L3 bottleneck + Agent 7 không tạo giá trị đủ để justify duyệt hàng loạt |

---

## 5. Pass criteria (để Agent 7 được nâng lên “chuẩn”)

Agent 7 chỉ được đổi trạng thái khi **tất cả** pass:

- [ ] Parse `beats_json` → ≥4 scenes với `start_sec`/`end_sec` liên tục
- [ ] Mỗi scene: `on_screen`, B-roll từ `visual_spec.stock_query`, `spoken` segment
- [ ] TTS tiếng Việt (ElevenLabs hoặc tương đương) — không robot/không đọc sai thuật ngữ NOXH
- [ ] Output 9:16, duration ±2s so với `duration_sec`
- [ ] Manual QA 3 clip: hook ≤15 từ, không cam kết lãi suất, CTA keyword đúng
- [ ] So sánh A/B với clip edit thủ công từ cùng `beats_json` — retention proxy (team đánh giá)

---

## 6. Khuyến nghị ngay

1. **Deactivate cron** `Schedule Daily Video Render` trên n8n (tránh tốn Creatomate + kỳ vọng sai).
2. **Vận hành video qua Agent 6:** duyệt L3 → quay/edit theo `beats_json` (CapCut/DaVinci).
3. **Ghi nhận Agent 7** = prototype / không production (doc `MAGNIX_AGENTS_REGISTRY.md`).
4. **Roadmap:** chọn phương án A hoặc B trong registry trước khi code lại.

---

## 7. File liên quan

| File | Vai trò |
|------|---------|
| `MAGNIX_AGENTS_REGISTRY.md` | 6 agent chuẩn + trạng thái Agent 7 |
| `AGENT6_VIDEO_DRAFT_SETUP.md` | Contract script — **đạt** |
| `AGENT7_VIDEO_RENDER_SETUP.md` | Hướng dẫn kỹ thuật Creatomate — giữ tham chiếu |
| `ai-agents-prompts/n8n__production-brief.md` | Source of truth beats v2 |
| `docs/PLATFORM_VIRAL_RESEARCH.md` | Rubric chất lượng video |
