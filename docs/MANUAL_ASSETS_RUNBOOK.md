# Manual assets — Runbook (Canva / quay video / Drive)

> Bạn làm **thủ công** phần tốn thời gian; Magnix làm trước **script, Sheet, n8n, legal pack**.  
> Sau khi upload Drive → chạy script patch URL → approve → cron đăng.

---

## Phân tầng: Làm trước vs Làm sau

### Đã / có thể làm ngay (không cần ảnh/video)

| # | Việc | Trạng thái |
|---|------|------------|
| 1 | Editorial 30 slot trên `content_drafts` | ✓ Seeded |
| 2 | Bài #05 PIN — nội dung + `approved` | ✓ (thiếu `publish_image_url`) |
| 3 | Folder Drive mẫu NOXH + Page Covers | ✓ |
| 4 | Workflow Page Publish (cron 10/14/18h) | ✓ Active VPS |
| 5 | Legal pack CT07, VNeID, Mẫu 01 | ✓ `legal-sources/noxh/` |
| 6 | `meta.manual_assets` trên 30 row editorial | Script `patch-editorial-manual-asset-plan.mjs` |
| 7 | Kịch bản + beats reel **#06 CT07** → `video_drafts` | Script `seed-editorial-ct07-video-draft.mjs` |
| 8 | Layer B brief (30 row) | Chạy manual **content-editorial-brief** trên n8n |
| 9 | Biên tập text Page (Agent 3) | `node scripts/run-agent3-fb-page-post.mjs --editorial NN` (local DeepSeek) |
| 10 | Tắt Gemini cover | `CONTENT_PAGE_COVER_ENABLED=false` |

### Bạn làm sau (upload Drive)

| Format | Số slot | Việc thủ công | Folder Drive |
|--------|---------|---------------|--------------|
| `fb_page_post_image` | 10 | Canva 1080×1080 → PNG | `Magnix_Page_Covers` |
| `fb_reels` | 14 | Quay + slide VNeID + ghép CapCut → MP4 | `Magnix_Videos` / manual |
| `carousel_image` | 6 | Canva 6–10 slide → PNG hoặc PDF | Tạo subfolder hoặc zip |

### Sau khi có file trên Drive

```powershell
node scripts/upload-manual-asset-to-drive.mjs --editorial 05 --type cover --file "C:\path\cover.png"
node scripts/upload-manual-asset-to-drive.mjs --editorial 06 --type video --file "C:\path\ct07-reel.mp4"
```

Hoặc copy `publish_image_url` / `render_url` vào cột `meta` trên Sheet.

---

## Quy trình end-to-end (1 bài Page có ảnh)

```
[TRƯỚC — Magnix/Sheet]
  content_drafts: text + approved + manual_assets.status=pending_cover
        │
[BẠN — Canva]
  Duplicate MASTER → export PNG
        │
[BẠN — Drive]
  Upload Magnix_Page_Covers → share anyone
        │
[PATCH]
  upload-manual-asset-to-drive.mjs HOẶC dán meta.publish_image_url
        │
[TỰ ĐỘNG]
  Page Publish cron → Facebook
```

## Quy trình reel hybrid (CT07 / VNeID)

```
[TRƯỚC — Magnix]
  video_drafts: script + beats_json + shot_list (seed #06)
  content_drafts editorial #06: link meta.video_draft_key
        │
[BẠN]
  Canva: slide mockup VNeID (5–7 PNG)
  Quay presenter 9:16 theo script
  CapCut ghép → export MP4
        │
[BẠN — Drive]
  Upload MP4 → folder video
        │
[PATCH]
  meta.render_url hoặc meta.manual_video_url trên video_drafts
  status=ready_for_review → L3 → đăng Reels tay (Agent 7 không auto-post)
```

---

## Checklist trước khi approve

- [ ] `publish_image_url` mở được tab ẩn danh (Page image)
- [ ] `render_url` tải được MP4 (Reels)
- [ ] Không PII trên slide/quay màn hình
- [ ] Disclaimer cuối script / caption
- [ ] `scheduled_at` đúng giờ đăng (+07)

---

## Tài liệu liên quan

- `docs/CANVA_MAGNIX_PAGE_COVER.md`
- `docs/CONTENT_PAGE_PUBLISH_SETUP.md`
- `legal-sources/noxh/ct07-residence-confirmation-guide.md`
- `docs/EDITORIAL_CALENDAR_PAGE_2W.md`
