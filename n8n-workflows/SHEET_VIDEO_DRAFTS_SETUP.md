# Sheet tab — `video_drafts` (Agent 6 / Mạch 6)

**Sheet:** [Database_Magnix_Lead](https://docs.google.com/spreadsheets/d/1fYB4h_BTiKXa9O3lBah-tQonWpQOQMG2aSkSfPs6yU4/edit)

Tạo tự động: `node scripts/init-magnix-sheet.mjs`

---

## Tab `video_drafts` (Agent 6 output)

Header dòng 1:

```
source_normalized_key	post_id	platform	segment	title	hook_3s	spoken_script	beats_json	on_screen_text	caption	hashtags	cta_keyword	duration_sec	aspect_ratio	source_insight	disclaimer	status	qa_tier	l3_approved	created_at	source	meta
```

| Cột | Ghi chú |
|-----|---------|
| `source_normalized_key` | Link về `content_queue.normalized_key` |
| `platform` | `tiktok`, `fb_reels`, `youtube_shorts` |
| `hook_3s` | Hook frame 0 — ≤15 từ |
| `spoken_script` | Teleprompter đầy đủ |
| `beats_json` | JSON array timing + visual + on_screen |
| `on_screen_text` | Text overlay chính (pipe-separated) |
| `caption` | Caption đăng — ≤150 ký tự |
| `cta_keyword` | CHECKLIST, NOXH, DTI… — comment opt-in |
| `duration_sec` | 21–45 (ideal 30 TikTok) |
| `source_insight` | 1 câu insight rút từ social listen |
| `status` | `draft` → human `approved` |
| `l3_approved` | `false` — **bắt buộc true trước quay/đăng** |

**Input Agent 6:** `content_queue` — `status=classified`, `score≥70`, platform video, chưa `meta.video_draft_created`.

---

## Quy trình L3 (human gate)

1. Agent 6 chạy → dòng mới `status=draft`, `l3_approved=false`
2. **Bạn đọc** `hook_3s`, `spoken_script`, `beats_json` — sửa trực tiếp trên Sheet nếu cần
3. Segment nhạy cảm (NOXH/vay/thẩm định): chạy `/devil` (L2) thủ công hoặc qua copywriter agent
4. Duyệt: `status=approved` **và** `l3_approved=true`
5. **Agent 7** (Creatomate) render → `meta.render_url`, `status=ready_for_review`
6. Xem MP4 → đăng TikTok/Reels thủ công
7. Nhập metrics vào `content_metrics` → Agent 5 Scorecard đóng vòng evidence

Agent **không tự đăng** video — script (Agent 6) + render (Agent 7) đều có human gate L3.

---

## Filter view gợi ý

- **Chờ duyệt:** `status=draft` AND `l3_approved=false`
- **Sẵn quay:** `status=approved` AND `l3_approved=true`
- **Sort:** `created_at` giảm dần

---

## Rebuild workflow

```powershell
node n8n-workflows/build-content-video-draft.mjs
```

Deploy: xem `AGENT6_VIDEO_DRAFT_SETUP.md` · `VPS_DEPLOY_ALL_AGENTS.md`
