# TD_01 — Báo cáo chứng thư nhà đất (PDF mẫu)

## File

| File | Mô tả |
|---|---|
| `chung-thu-mau-nha-dat-SOURCE.pdf` | Bản gốc (có brand Citics) — giữ để tái chạy script |
| `chung-thu-mau-nha-dat-HOUSEX.pdf` | Bản đào tạo House X (đã xóa text Citics + gắn logo) |

Catalog: `TD_01_BAO_CAO_CHUNG_THU` · status `ready` (bản PDF)

## Có xóa được logo Citics → House X không?

**Có.** PDF này branding chủ yếu là **chữ** (không phải một file logo PNG duy nhất gắn mọi trang):

- `CÔNG TY CỔ PHẦN CITICS` → `CÔNG TY CỔ PHẦN HOUSE X`
- `citics.vn` → `timnhaxahoi.com`
- `CITICS` trong mã hồ sơ → `HOUSEX`
- Logo House X PNG gắn thêm góc trên trang bìa

Script: `scripts/rebrand-chung-thu-pdf.py` (PyMuPDF).

### Các cách (ưu tiên cho tài liệu pháp lý mẫu)

| Cách | Ưu | Nhược | Khi nào dùng |
|---|---|---|---|
| **A. Redact text + che logo vector + stamp logo** (đã làm) | Giữ layout, ảnh khảo sát, bảng biểu | Font thay chỗ chật hơi lệch; panel xanh trang trí còn phong cách cũ | **Mặc định cho mẫu đào tạo** |
| **B. Adobe Acrobat / PDF editor** | Kiểm soát từng ô; thay logo vector đẹp | Thủ công, dễ sót trên 40 trang | Rà soát L3 trước khi dùng làm mẫu “sạch 100%” |
| **C. Raster cả trang rồi che logo** | Đơn giản | Mất text selectable, file nặng, kém pháp lý mẫu | Tránh |
| **D. Xuất lại từ template gốc** | Sạch nhất | Cần file nguồn InDesign/Word/hệ thống chứng thư | Khi có nguồn biên tập |

### Lưu ý

1. **Tính pháp lý của chứng thư thật** không thay đổi bằng cách đổi logo trên file mẫu — file này chỉ dùng **đào tạo Agent**. Chứng thư phát hành thật do đơn vị thẩm định được cấp phép.
2. Panel geometry xanh / banner trang cuối là **đồ họa brand** (không ghi chữ Citics) — script chưa thay; có thể che thêm nếu muốn “House X visual” đồng bộ.
3. Tái sinh bản HOUSEX: `python scripts/rebrand-chung-thu-pdf.py`

## Preview

Sau khi chạy script: `preview-housex-p1.png`, `preview-housex-p2.png` — mở để QA trước khi seed/upload Mini App.
