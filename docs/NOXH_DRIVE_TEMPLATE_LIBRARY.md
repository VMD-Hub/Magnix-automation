# Kho mẫu NOXH trên Google Drive

> Folder công khai **Magnix_NOXH_Mau_Ho_So** — lead magnet follow + share.

## Khởi tạo

```powershell
node scripts/init-magnix-drive-noxh-templates.mjs
```

Script sẽ:

1. Tạo folder `Magnix_NOXH_Mau_Ho_So` dưới `GOOGLE_DRIVE_ARCHIVE_FOLDER_ID`
2. Upload file từ `legal-sources/noxh/drive-pack/`
3. Share **anyone with link → reader**
4. Ghi `n8n-workflows/magnix-drive-folders.json` → `noxh_templates`
5. In env:

```bash
DRIVE_NOXH_TEMPLATES_FOLDER_ID=...
DRIVE_NOXH_TEMPLATES_PUBLIC_URL=https://drive.google.com/drive/folders/...
```

Sau đó:

```powershell
node scripts/generate-n8n-vps-env.mjs
node scripts/go-live-vps.mjs --deploy-env   # nếu cần
```

## Nội dung pack

| File | Mục đích |
|------|----------|
| `00-HUONG-DAN-DOC-TRUOC.md` | Disclaimer + hướng dẫn |
| `02-checklist-tu-kiem-dieu-kien.md` | Checklist opt-in CHECKLIST |
| `03-danh-muc-giay-to-photo.md` | Danh mục photo |
| `04-huong-dan-mau-01.md` | Đọc trước Mẫu 01 |

**Không** upload file có PII thật. PDF export: tự xuất từ Markdown khi cần.

## Dùng trong Page post

- Editorial item **#05** calendar: `pin_after_publish: true` + `publish_link` = folder URL
- CTA: Comment **MAU01** → Agent 4 DM link
- Ảnh post: mockup folder (Canva) → `meta.publish_image_url`

## Cập nhật pack

1. Sửa file trong `legal-sources/noxh/drive-pack/`
2. Xóa file cũ trên Drive (hoặc đổi tên version)
3. Chạy lại init script (bỏ qua file đã tồn tại — xóa tay nếu cần ghi đè)
4. Post Page thông báo “đã cập nhật kho mẫu”

## Liên quan

- `docs/EDITORIAL_CALENDAR_PAGE_2W.md`
- `scripts/seed-editorial-calendar-page.mjs`
