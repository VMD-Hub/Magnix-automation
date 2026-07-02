# Canva brief — editorial #10

> Sheet row **12** · `editorial:page:2026w27:10` · status **draft**

## Template

- Duplicate: **Magnix Page Cover — MASTER**
- Kích thước: **1080 × 1080 px**
- File Canva: `Magnix Cover — 2026w27-10 Nhà ở tại tỉnh dự án`

## Text trên ảnh

| Lớp | Nội dung |
|-----|----------|
| **HEADLINE** | Nhà ở tại tỉnh dự án |
| **SUB** (tuỳ chọn) | Folder Drive · checklist Mẫu 01 · tham khảo trước khi nộp |
| Logo | Magnix — góc dưới phải, nhỏ |

## Màu & icon

- Nền: `#E8F4F4` hoặc trắng · accent `#0D7377`
- Icon: folder + checklist (không logo CP)

## Cấm trên ảnh

- Lãi suất %, "cam kết duyệt", số liệu pháp lý cụ thể

## Sau export

```powershell
node scripts/upload-manual-asset-to-drive.mjs --editorial 10 --type cover --file "C:\path\cover.png"
```

Folder Drive: [Magnix_Page_Covers](https://drive.google.com/drive/folders/1EVNn-4ASRhZwSnnapBkMzbHjdIjCNhBJ)

## Publish

- `scheduled_at`: 2026-07-03T10:00:00+07:00
- `pin_after_publish`: no
- Cần `meta.publish_image_url` + `status=approved` trước cron Page Publish

## Hook (tham khảo — không copy hết lên ảnh)

Nhà ở tại tỉnh dự án — khác gì nơi đang ở? — nội dung chờ biên tập từ listening/brief.
