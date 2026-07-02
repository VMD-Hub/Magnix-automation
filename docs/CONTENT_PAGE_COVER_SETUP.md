# Facebook Page Cover — Gemini → Drive

Workflow tự tạo **ảnh cover** cho bài `fb_page_post_image` trên `content_drafts`, ghi `meta.publish_image_url` (HTTPS public qua Drive) để workflow **Page Publish** đăng dạng photo.

## Luồng

```
Cron 09:30 VN
  → đọc content_drafts
  → lọc: fb_page_post_image, thiếu publish_image_url, có publish_image_prompt/title
  → Gemini Image API (1:1)
  → upload Drive Magnix_Page_Covers + share anyone-with-link
  → batchUpdate meta.publish_image_url
```

Chạy **trước** Page Publish (10h / 14h / 18h).

## Env (VPS + local)

| Biến | Mô tả |
|------|--------|
| `CONTENT_PAGE_COVER_ENABLED` | `true` để bật workflow |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) |
| `GEMINI_IMAGE_MODEL` | Mặc định `gemini-2.5-flash-image` — fallback: `gemini-2.0-flash-preview-image-generation`, `gemini-3.1-flash-image-preview` |
| `PAGE_COVER_ASPECT_RATIO` | Mặc định `1:1` (Facebook feed square) |
| `DRIVE_PAGE_COVERS_FOLDER_ID` | Folder Drive lưu PNG |

## Setup một lần

```powershell
node scripts/init-magnix-drive-page-covers.mjs
# Thêm GEMINI_API_KEY (hoặc .env.local) + bật CONTENT_PAGE_COVER_ENABLED
node scripts/sync-gemini-env.mjs
node scripts/probe-gemini-image.mjs

node n8n-workflows/build-content-page-cover.mjs
node scripts/generate-n8n-vps-env.mjs
node scripts/go-live-vps.mjs --deploy-env
node scripts/push-n8n-workflows.mjs --only content-page-cover.workflow.json --activate
```

n8n UI: gán credential **googleApi** trên Fetch + POST Sheet Batch + node Upload Drive.

## Điều kiện Sheet

| Cột / meta | Giá trị |
|------------|---------|
| `status` | `approved` (hoặc `draft` nếu `publish_image_pending: true`) |
| `meta.content_format` | `fb_page_post_image` |
| `meta.target_channel` | `facebook_page` |
| `meta.publish_image_prompt` | Mô tả cover (Agent 3 / editorial seed) |
| `meta.publish_image_url` | **Trống** — workflow sẽ điền sau khi tạo |

Sau khi có URL → Page Publish cron đăng qua Graph `POST /photos`.

## Row editorial #05

Key `editorial:page:2026w27:05` đã có `publish_image_pending: true` + `publish_image_prompt` — chạy manual workflow cover một lần sau khi bật env.

## Khắc phục

| Triệu chứng | Cách xử lý |
|-------------|------------|
| Không candidate | Kiểm tra format + thiếu URL + `CONTENT_PAGE_COVER_ENABLED` |
| `MISSING_GEMINI_API_KEY` | Thêm key AI Studio |
| `NO_IMAGE_IN_RESPONSE` | Đổi model; rút gọn prompt; kiểm tra quota |
| `DRIVE_UPLOAD_FAILED` | googleApi credential; chạy init folder script |
| FB không load ảnh | URL phải `https://drive.google.com/uc?export=view&id=...` (workflow tự set) |

## Tài liệu liên quan

- `docs/CONTENT_PAGE_PUBLISH_SETUP.md` § Ảnh minh họa
- `ai-agents-prompts/n8n__fb-page-post-draft.md` — `publish_image_prompt`
