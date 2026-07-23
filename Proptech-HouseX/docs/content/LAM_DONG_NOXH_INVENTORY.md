# Inventory NOXH Lâm Đồng (Đắk Nông + Bình Thuận cũ) — P0.5

Nguồn: PDF `tong hop giup toi du an nha o xa hoi tinh Lam Don....pdf` (extract 2026-07-23).  
Canonical: **Lâm Đồng**. Alias: Đắk Nông / Bình Thuận / Đà Lạt / Phan Thiết / Gia Nghĩa.

**Cụm:** Cao nguyên (Đà Lạt) · Biển (Phan Thiết / Hàm Kiệm) · Đắk Nông cũ (Gia Nghĩa).

| STT | Tên TM | CĐT (PDF → research) | Vị trí | Quy mô PDF | Slug | Enrich |
|-----|--------|----------------------|--------|------------|------|--------|
| 1 | NOXH Kim Đồng - Đà Lạt | PDF: Khải Thịnh → **NNP + Minh Trí Thuận An** | Kim Đồng, P.6, Đà Lạt | 94 căn · 45–70 m² | `nha-o-xa-hoi-kim-dong-da-lat` | **researched** |
| 2 | NOXH Sào Nam - Đà Lạt | CTCP ĐT&XD 579 | Sào Nam, P.11, Đà Lạt | 3 block · 250 căn | `nha-o-xa-hoi-sao-nam-da-lat` | skeleton |
| 3 | NOXH Tiến Phát - Phan Thiết | TNHH Đầu tư Tiến Phát | P. Phú Tài, Phan Thiết | 2 khối 9 tầng · ~267 căn · ~13–15 tr/m² | `nha-o-xa-hoi-tien-phat-phan-thiet` | skeleton |
| 4 | NOXH Nam Long - Phan Thiết | Nam Long / liên danh | P. Xuân An, Phan Thiết | ~300 căn | `nha-o-xa-hoi-nam-long-phan-thiet` | skeleton |
| 5 | NOXH KCN Hàm Kiệm 1 | CTCP Đầu tư Bình Tân | KCN Hàm Kiệm 1, Hàm Thuận Nam | 9 block · ~955 căn | `nha-o-xa-hoi-kcn-ham-kiem-1` | skeleton |
| 6 | NOXH Gia Nghĩa | Liên danh được phê duyệt | TP. Gia Nghĩa (Đắk Nông cũ) | ~250 căn | `nha-o-xa-hoi-gia-nghia` | skeleton |

## Tra cứu

- `soxaydung.lamdong.gov.vn` · legacy `soxaydung.binhthuan.gov.vn`

## Hub / seed

- Hub: `/du-an/nha-o-xa-hoi/lam-dong`
- 308: `binh-thuan`, `dak-nong` → hub Lâm Đồng
- `npm run db:seed:noxh-lam-dong`
- `salesRegion: SOUTH`
