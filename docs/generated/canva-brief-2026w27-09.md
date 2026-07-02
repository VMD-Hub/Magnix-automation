# Canva brief — editorial #09

> Sheet row **11** · `editorial:page:2026w27:09` · status **draft**

## Template

- Duplicate: **Magnix Page Cover — MASTER**
- Kích thước: **1080 × 1080 px**
- File Canva: `Magnix Cover — 2026w27-09 Danh mục một bộ photo`

## Text trên ảnh

| Lớp | Nội dung |
|-----|----------|
| **HEADLINE** | Danh mục một bộ photo |
| **SUB** (tuỳ chọn) | Folder Drive · checklist Mẫu 01 · tham khảo trước khi nộp |
| Logo | Magnix — góc dưới phải, nhỏ |

## Màu & icon

- Nền: `#E8F4F4` hoặc trắng · accent `#0D7377`
- Icon: folder + checklist (không logo CP)

## Cấm trên ảnh

- Lãi suất %, "cam kết duyệt", số liệu pháp lý cụ thể

## Sau export

```powershell
node scripts/upload-manual-asset-to-drive.mjs --editorial 09 --type cover --file "C:\path\cover.png"
```

Folder Drive: [Magnix_Page_Covers](https://drive.google.com/drive/folders/1EVNn-4ASRhZwSnnapBkMzbHjdIjCNhBJ)

## Publish

- `scheduled_at`: 2026-07-02T18:00:00+07:00
- `pin_after_publish`: no
- Cần `meta.publish_image_url` + `status=approved` trước cron Page Publish

## Hook (tham khảo — không copy hết lên ảnh)

Danh mục một bộ photo — checklist — nội dung chờ biên tập từ listening/brief.
