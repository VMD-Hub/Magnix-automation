# Canva — ảnh cover Facebook Page (Magnix)

> **Chốt:** Magnix dùng **Canva template** cho `fb_page_post_image`, không dùng Gemini image (quota/chữ Việt).  
> Workflow **Page Publish** chỉ cần `meta.publish_image_url` = URL ảnh **HTTPS công khai**.

---

## 1. Chuẩn bị một lần

### 1.1 Tài khoản Canva

- [canva.com](https://www.canva.com) — **Free** đủ cho Page cover.
- **Canva Pro** (tuỳ chọn): Brand Kit, resize nhanh, xóa nền — không bắt buộc.

### 1.2 Tắt nhánh Gemini cover (tránh trùng)

Trong `n8n-workflows/.env` trên VPS:

```env
CONTENT_PAGE_COVER_ENABLED=false
```

Giữ workflow `content-page-cover` inactive — ảnh do Canva + Drive.

### 1.3 Folder Drive lưu cover (đã có)

- Folder: **Magnix_Page_Covers**  
- ID: `1EVNn-4ASRhZwSnnapBkMzbHjdIjCNhBJ`  
- Link: https://drive.google.com/drive/folders/1EVNn-4ASRhZwSnnapBkMzbHjdIjCNhBJ  

Mọi PNG export từ Canva → upload vào đây → share **Anyone with the link → Viewer**.

---

## 2. Master template (tạo 1 lần, dùng 30+ bài)

### Kích thước

| Nền tảng | Kích thước Canva | Ghi chú |
|----------|------------------|---------|
| Facebook Page feed (khuyến nghị) | **1080 × 1080 px** | Vuông, mobile tốt |
| Link preview wide | 1200 × 630 px | Chỉ nếu cần banner ngang |

Trong Canva: **Create a design → Custom size → 1080 × 1080**.

### Brand Magnix (gợi ý)

| Thành phần | Giá trị |
|------------|---------|
| Màu chính | `#0D7377` (teal) |
| Nền | Trắng hoặc teal nhạt `#E8F4F4` |
| Chữ tiêu đề | `#1A1A1A`, font có **tiếng Việt** (Be Vietnam Pro, Montserrat, Inter) |
| Logo | Chữ **Magnix** góc dưới phải, nhỏ, mờ |
| Icon | Checklist / folder / tài liệu — không logo Chính phủ |

### Lớp text cố định trên template

Đặt **placeholder** dễ đổi mỗi bài:

1. **HEADLINE** — 1–2 dòng, ≤ 60 ký tự (lấy từ `hook_line` hoặc `title` trên Sheet)
2. **SUB** (tuỳ chọn) — 1 dòng ngắn từ `publish_image_prompt`
3. Không ghi trên ảnh: lãi suất %, “cam kết duyệt”, số liệu pháp lý cụ thể

### Đặt tên file Canva

`Magnix Page Cover — MASTER` — duplicate cho mỗi bài:  
`Magnix Cover — 2026w27-05 Kho mẫu NOXH`

---

## 3. Quy trình mỗi bài (5–10 phút)

```
Sheet content_drafts (approved + có nội dung)
        │
        ▼
Duplicate template Canva → đổi HEADLINE theo hook/title
        │
        ▼
L3: xem trước (chữ đúng, không claim cấm)
        │
        ▼
Download PNG → upload Drive Magnix_Page_Covers → share link
        │
        ▼
Ghi meta.publish_image_url trên Sheet
        │
        ▼
Cron Page Publish (10h / 14h / 18h) hoặc manual n8n
```

### Bước A — Lấy nội dung từ Sheet

Tab **`content_drafts`**, cột:

| Cột | Dùng cho Canva |
|-----|----------------|
| `title` | Tiêu đề ngắn |
| `hook_line` | **Headline trên ảnh** (ưu tiên) |
| `meta` → `publish_image_prompt` | Gợi ý icon / mood |

Ví dụ row **#05** (`editorial:page:2026w27:05`):

- Headline: *Folder Drive miễn phí: mẫu hồ sơ NOXH, checklist thu nhập…*
- Rút gọn trên ảnh: **Kho mẫu NOXH miễn phí** + dòng phụ *Checklist & hướng dẫn điền*

### Bước B — Export từ Canva

1. **Share** → **Download**
2. Loại file: **PNG**
3. Tích **Transparent background** = **Tắt** (nền teal/trắng đầy đủ)
4. Download

Không dùng link share Canva (`canva.com/design/...`) làm `publish_image_url` — Facebook Graph thường **không** tải được (redirect/login).

### Bước C — Upload Drive + URL public

1. Vào folder [Magnix_Page_Covers](https://drive.google.com/drive/folders/1EVNn-4ASRhZwSnnapBkMzbHjdIjCNhBJ)
2. Upload PNG — đặt tên: `cover-2026w27-05-kho-mau-noxh.png`
3. Chuột phải file → **Share** → **Anyone with the link** → **Viewer**
4. Copy **FILE_ID** từ URL Drive (`/file/d/FILE_ID/view`)

URL đưa vào Sheet:

```text
https://drive.google.com/uc?export=view&id=FILE_ID
```

### Bước D — Cập nhật Sheet `meta` (cột N)

Thêm / sửa trong JSON `meta`:

```json
{
  "publish_image_url": "https://drive.google.com/uc?export=view&id=FILE_ID",
  "cover_source": "canva",
  "cover_drive_file_id": "FILE_ID",
  "publish_image_pending": false
}
```

Giữ nguyên các field khác (`target_channel`, `scheduled_at`, `pin_after_publish`, …).

### Bước E — Approve & đăng

- `status` = **`approved`**
- `content_format` = **`fb_page_post_image`**
- `scheduled_at` ≤ giờ đăng (ISO +07)
- Chờ cron **Page Publish** hoặc manual run workflow trên n8n

---

## 4. Checklist L3 (trước khi approve)

- [ ] Headline tiếng Việt đúng dấu, không quá 2 dòng
- [ ] Không có “cam kết duyệt”, lãi suất %, logo giả chính phủ
- [ ] `publish_image_url` mở được tab ẩn danh (incognito)
- [ ] Ảnh vuông, chữ không sát mép (safe zone ~80px)
- [ ] Bài PIN: `pin_after_publish: true` → sau đăng pin thủ công trên Meta / Telegram nhắc

---

## 5. Editorial calendar 2 tuần

| Loại slot | Canva |
|-----------|--------|
| `fb_page_post_image` | 1 cover / bài — duplicate MASTER |
| `carousel_image` | Bộ 6–10 slide — file Canva riêng (không qua Page Publish) |

Lịch chi tiết: `docs/EDITORIAL_CALENDAR_PAGE_2W.md`

---

## 6. Khắc phục lỗi

| Triệu chứng | Cách xử lý |
|-------------|------------|
| FB đăng text-only, không ảnh | Thiếu hoặc sai `publish_image_url` — phải URL Drive `uc?export=view` |
| Ảnh không hiện trên FB | File Drive chưa share **Anyone**; thử link incognito |
| Ảnh mờ | Export PNG đúng **1080×1080**, không chỉ screenshot |
| Cron không đăng | `scheduled_at` còn tương lai; hoặc `status` ≠ `approved` |

---

## 7. Tài liệu liên quan

- `docs/CONTENT_PAGE_PUBLISH_SETUP.md` — Graph API, pin, cron
- `docs/EDITORIAL_CALENDAR_PAGE_2W.md` — lịch 30 slot
- `ai-agents-prompts/n8n__fb-page-post-draft.md` — `publish_image_prompt` (brief cho Canva)

---

## 8. Nâng cấp sau (tuỳ chọn)

- **Brand Kit Canva Pro:** lưu màu `#0D7377`, font, logo — đổi bài nhanh hơn
- **Canva Bulk Create:** CSV từ Sheet → nhiều cover một lúc (cần map cột `hook_line`)
- Script upload: `node scripts/upload-page-cover-to-drive.mjs` *(chưa có — yêu cầu nếu cần)*
