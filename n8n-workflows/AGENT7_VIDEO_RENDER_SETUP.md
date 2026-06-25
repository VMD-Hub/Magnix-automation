# Agent 7 — Creatomate Video Render

> **v2 (2026-06-23):** RenderScript động từ `beats_json` — xem **`AGENT7_VIDEO_RENDER_V2.md`**.  
> MVP v1 (template tĩnh) — **`AGENT7_AUDIT.md`**.

Workflow: `content-video-render.workflow.json`

---

## Vị trí trong pipeline

```
content_queue → Agent 6 (script) → video_drafts
                                        ↓ L3: status=approved + l3_approved=true
                                   Agent 7 (Creatomate)
                                        ↓
                              meta.render_url + status=ready_for_review
                                        ↓ L3 lần 2: xem MP4 → đăng thủ công
                              content_metrics → Agent 5 Scorecard
```

Agent 7 **không tự đăng** TikTok/Reels — chỉ xuất file MP4 qua Creatomate.

---

## Env bắt buộc (VPS `/root/n8n.env`)

```env
CREATOMATE_TEMPLATE_ID=fde5a488-a584-4a42-b984-a6b03c59bc1d
N8N_BLOCK_ENV_ACCESS_IN_NODE=false
```

**Creatomate API key** — một trong hai cách (khuyến nghị **cách 1**):

### Cách 1 — Header Auth credential trong n8n (khuyến nghị)

1. n8n → **Credentials** → **Header Auth**
2. Name: `Authorization`
3. Value: `Bearer {CREATOMATE_API_KEY}` (thay key thật)
4. Gán credential này cho:
   - `HTTP POST Creatomate`
   - `HTTP GET Creatomate Status`

### Cách 2 — Biến môi trường VPS

```env
CREATOMATE_API_KEY=          # Dashboard → Project Settings → API Keys
```

Sau đó chạy:

```powershell
node scripts/generate-n8n-vps-env.mjs
node scripts/deploy-vps-n8n.mjs
```

Tùy chọn:

```env
PEXELS_API_KEY=              # Stock video portrait — nếu không có, dùng nền mặc định template
CREATOMATE_POLL_MAX=24       # Số lần poll (mặc định 24)
CREATOMATE_POLL_MS=15000     # 15s giữa mỗi poll
CREATOMATE_API_URL=https://api.creatomate.com/v2/renders
```

---

## Creatomate template (contract)

Tạo template **9:16** trong [Creatomate Editor](https://creatomate.com). Đặt tên element khớp `magnix-public-config.json` → `creatomate_modifications`:

| Key config | Element mặc định | Nội dung từ Sheet |
|------------|------------------|-------------------|
| `hook` | `Hook-Text` | `hook_3s` |
| `body` | `Body-Text` | `spoken_script` |
| `caption` | `Caption-Text` | `caption` |
| `cta` | `CTA-Text` | `cta_keyword` |
| `title` | `Title-Text` | `title` |
| `background` | `Background-Video` | Pexels portrait (nếu có key) |
| `voiceover_text` | `Voiceover` | Text TTS trong template |

Sau khi đổi tên element trong template, cập nhật `creatomate_modifications` rồi rebuild:

```powershell
node n8n-workflows/build-content-video-render.mjs
```

**Gợi ý template MVP:** 1 scene hook 3s + body subtitles + CTA overlay + voice element gắn `spoken_script`.

---

## Input / Output Sheet

**Input:** tab `video_drafts`

- `status` = `approved`
- `l3_approved` = `true`
- `meta.render_status` ∉ `rendering`, `ready_for_review`, `published`

**Output (cột `meta` JSON + cột `status`):**

```json
{
  "render_status": "ready_for_review",
  "render_id": "…",
  "render_url": "https://cdn.creatomate.com/…/output.mp4",
  "render_provider": "creatomate",
  "rendered_at": "2026-06-22T…"
}
```

`status` → `ready_for_review`

---

## Deploy

1. Thêm env Creatomate trên VPS → restart n8n container
2. `node n8n-workflows/build-content-video-render.mjs`
3. Import `content-video-render.workflow.json`
4. Gán credential **`googleApi`** trên: Fetch, HTTP GET meta, HTTP PUT meta, HTTP PUT status
5. Gán credential **Header Auth Creatomate** trên: HTTP POST Creatomate, HTTP GET Creatomate Status
6. **Manual test** — row 2 (`approved` + ☑ l3) → kỳ vọng **2–6 phút**
7. Mở node **Build Summary** → đọc `hint`, `stats`, `candidate_count`, `env_probe`

---

## Pass criteria (manual test)

| Bước | Kỳ vọng |
|------|---------|
| Build Summary | `stats.render_ok > 0` |
| Sheet `meta` | `render_url` HTTPS, `render_status=ready_for_review` |
| Creatomate dashboard | Render `succeeded` |
| Tải MP4 | Mở được, 9:16, hook + voice/subtitle khớp script |

---

## Troubleshooting

| Lỗi | Fix |
|-----|-----|
| `MISSING_CREATOMATE_TEMPLATE_ID` | Set `CREATOMATE_TEMPLATE_ID` env |
| `MISSING_CREATOMATE_API_KEY` | Set key + `N8N_BLOCK_ENV_ACCESS_IN_NODE=false` |
| `CREATOMATE_POLL_TIMEOUT` | Tăng `CREATOMATE_POLL_MAX` hoặc đơn giản hóa template |
| Element không đổi | Tên element trong template ≠ `creatomate_modifications` |
| Không candidate | Chưa `approved` + ☑ `l3_approved` hoặc đã render |
| Xong **< 10 giây** | Mở **Build Summary** — đọc `hint` |
| `no_candidates: true` | Row cần `approved` + ☑ l3 — chạy `node scripts/diagnose-agent7-candidates.mjs` |
| `fetch_error` | Chưa gán `googleApi` trên **Fetch video_drafts** |
| `CREATOMATE_POST_FAILED` | Chưa gán **Header Auth** trên HTTP POST Creatomate |
| `candidate_count: 1` nhưng fail nhanh | Thiếu Creatomate credential hoặc template ID sai |

Phase 2 (chưa build): ElevenLabs TTS URL → `Voiceover.source`.

---

## Google Drive archive

**Cấu trúc folder** (trong Magnix root Drive):

```
Magnix_Videos/
  ready_for_review/   ← Agent 7 upload sau render
  approved/           ← di chuyển thủ công sau L3 xem MP4
  published/          ← sau đăng + metrics
```

**Tạo folder:**

```powershell
node scripts/init-magnix-drive-folders.mjs
```

Ghi `n8n-workflows/magnix-drive-folders.json` + in env `DRIVE_VIDEO_FOLDER_*`.

**Đặt tên file SEO/AIO** (MP4):

```
{segment-slug}-{platform}-{topic-slug}-{YYYYMMDD}.mp4
```

Ví dụ: `dieu-kien-thu-nhap-vay-noxh-tiktok-thu-nhap-15-trieu-co-vay-noxh-20260623.mp4`

Logic: `code/shared/video-drive-name.mjs`

**Retention:** Agent 7 xóa MP4 trong `ready_for_review` **> 30 ngày** (mặc định). Folder `approved` / `published` **không** auto-xóa.

**Sheet chỉ lưu link:**

```json
{
  "drive_view_url": "https://drive.google.com/file/d/…/view",
  "drive_file_name": "dieu-kien-thu-nhap-vay-noxh-tiktok-….mp4",
  "render_url": "https://cdn.creatomate.com/…"
}
```
