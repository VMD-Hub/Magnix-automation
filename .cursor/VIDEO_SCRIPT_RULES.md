# Video Script Schema — Magnix Agent 6 (TikTok/Reels)

> **Độc lập** với text post (`hook_line` / `title` / `cta_opt_in`).
> Trục phân loại: `format_type = "video_script"` — **không** thay `content_type` (NOXH_LEGAL, …) hay `channel`.

---

## Vị trí pipeline

```
LLM Production Brief → Parse → Video Script QA Gate → L0 → Sheet video_drafts
```

**Không** qua Title QA Gate / Hook Completion Gate text post.

Config: `n8n-workflows/cta_templates.json` (`verbal_cta_templates`, keywords) · Logic: `code/shared/video-script-qa-gate.mjs` · Node: `03b-video-script-qa-gate.js`

Legacy: `format_type = production_brief_v3` (beats Creatomate) vẫn parse — QA Gate skip nếu không có `visual_hook`.

---

## Schema `format_type: video_script`

| Field | Bắt buộc | Mô tả |
|-------|----------|-------|
| `format_type` | ✅ | `"video_script"` |
| `content_type` | khuyến nghị | Enum NOXH_LEGAL / LOAN_FINANCE / VALUATION / GENERAL_POLICY |
| `platform` | ✅ | `tiktok` \| `fb_reels` \| `youtube_shorts` |
| `visual_hook` | ✅ | 0–3s — **hình ảnh cụ thể** (không trừu tượng) |
| `verbal_hook` | ✅ | 0–3s — ≤**12 từ**, không chào hỏi dài |
| `on_screen_text` | ✅ | Overlay hook — ≤**8 từ** |
| `body_beats[]` | ✅ ≥2 | `{ timestamp, spoken_line, on_screen_text, visual_note }` |
| `verbal_cta` | flag nếu thiếu | CTA nói cuối video — ngắn, tự nhiên |
| `caption_cta` | flag nếu thiếu | CTA caption — dùng keyword từ `cta_templates.json`, **khác** `verbal_cta` |
| `target_length_seconds` | ✅ | **15–60** (đề xuất mặc định **30** — chờ xác nhận) |
| `hashtags` | khuyến nghị | 2–3 tag chủ đề |
| `disclaimer` | khuyến nghị | Tham khảo pháp lý |

**KHÔNG dùng:** `hook_line`, `title`, `cta_opt_in` (text post).

---

## Validate (Video Script QA Gate)

### Hard block (`video_script_rejected`)

| Rule | Lý do |
|------|-------|
| `visual_hook` / `verbal_hook` rỗng hoặc placeholder | BLOCK |
| `visual_hook` quá trừu tượng | BLOCK |
| `verbal_hook` > 12 từ hoặc mở đầu chào hỏi | BLOCK |
| `body_beats` < 2 hoặc thiếu `timestamp` / `spoken_line` | BLOCK |
| Beat 0 không nối mạch với `verbal_hook` | BLOCK |
| `target_length_seconds` ∉ [15, 60] | BLOCK |

### Soft flag (`video_script_review`)

| Rule | Hành động |
|------|-----------|
| `on_screen_text` > 8 từ | flag |
| Thiếu `verbal_cta` / `caption_cta` | flag |
| `verbal_cta === caption_cta` | flag |
| NOXH/LOAN/VALUATION + số liệu/văn bản pháp lý trong `spoken_line` | → L2/L3 |

---

## LLM prompt

Agent 6 gửi `format_type: "video_script"` trong user payload.

**Prompt riêng** (không dùng chung lead-magnet text): cập nhật `ai-agents-prompts/n8n__production-brief.md` hoặc file prompt mới khi chốt schema — hiện payload đã tách trục `format_type`.

Output JSON mẫu: `tests/fixtures/video-script-noxh-legal-sample.json`

---

## `format_type` trong ARCHITECTURE — đề xuất (chờ xác nhận)

**Chưa sửa** `ARCHITECTURE_MAGNIX.md` §3.1.

Đề xuất thêm vào **§3.2 Inbound content production** (draft contract), không nhét vào UID lead §3.1:

| Field | Giá trị | Ghi chú |
|-------|---------|---------|
| `format_type` | `text_post` \| `video_script` | Trục hình thức sản phẩm |
| `content_type` | NOXH_LEGAL / … | Trục chủ đề pháp lý |
| `channel` | facebook / blog_seo | Trục kênh phân phối |

Bạn xác nhận vị trí §3.2 vs tab `content_drafts`/`video_drafts` trước khi commit schema doc.

---

## Test

```bash
node tests/video-script-qa-gate.test.mjs
node n8n-workflows/build-content-video-draft.mjs
```
