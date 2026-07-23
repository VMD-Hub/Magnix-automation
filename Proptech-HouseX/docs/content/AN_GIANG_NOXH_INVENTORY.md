# Inventory NOXH An Giang (gồm Kiên Giang cũ) — P0.2

Nguồn: PDF `tuong tu, tong hop giup toi du an nha o xa hoi ta....pdf` (extract 2026-07-23).  
Canonical: **An Giang**. Alias: Kiên Giang / Rạch Giá / Phú Quốc.

**Đặc thù:** nhiều dự án **liền kề thấp tầng (trệt + 1 lầu)** — khác chung cư cao tầng HN/HCM.

| STT | Tên TM | CĐT (PDF) | Vị trí | Quy mô / giá PDF | Slug | Enrich |
|-----|--------|-----------|--------|------------------|------|--------|
| 1 | NOXH KĐT lấn biển Tây Bắc Rạch Giá | CIC Group | Khu C & D, KĐT lấn biển Tây Bắc, Rạch Giá | 1.011 liền kề · 1,3–1,5 tỷ/căn | `nha-o-xa-hoi-cic-lan-bien-tay-bac-rach-gia` | **researched** |
| 2 | NOXH KĐT Phú Cường Phú Quý | CTCP Phú Cường Hoàng Gia | Lô S, KĐT Phú Cường Phú Quý, Rạch Giá | 751 liền kề · từ ~1,39 tỷ | `nha-o-xa-hoi-phu-cuong-phu-quy-rach-gia` | skeleton |
| 3 | NOXH CIC Boulevard Rạch Giá | CIC Group | Đường số 2, P. Vĩnh Quang, Rạch Giá | 190 liền kề · 1,49–1,64 tỷ | `nha-o-xa-hoi-cic-boulevard-rach-gia` | skeleton |
| 4 | NOXH 444 Ngô Quyền | CIC Group | 444 Ngô Quyền, Rạch Giá | Chung cư thấp / liền kề | `nha-o-xa-hoi-444-ngo-quyen-rach-gia` | skeleton |
| 5 | NOXH Rạch Tràm Phú Quốc | CityLand | KDC Rạch Tràm, Bãi Thơm, Phú Quốc | 294 thấp tầng + 4 khối CC (1.078 căn) | `nha-o-xa-hoi-rach-tram-phu-quoc` | skeleton |
| 6 | NOXH Golden City Long Xuyên | Nhất Lan Phước | P. Mỹ Hòa, Long Xuyên | CC cao tầng · 45–67 m² | `nha-o-xa-hoi-golden-city-long-xuyen` | skeleton |
| 7 | NOXH Tây Đại Học Long Xuyên | CTCP Xây lắp An Giang | P. Mỹ Hòa, Long Xuyên | CC NOXH cán bộ / CNV | `nha-o-xa-hoi-tay-dai-hoc-long-xuyen` | skeleton |
| 8 | NOXH Bình Khánh | CTCP Xây lắp An Giang | P. Bình Khánh, Long Xuyên | Cụm CC NOXH đô thị | `nha-o-xa-hoi-binh-khanh-long-xuyen` | skeleton |

## Tra cứu

- `soxaydung.angiang.gov.vn` · `soxaydung.kiengiang.gov.vn` (legacy)
- CĐT: `cicgroups.com`, CityLand, Xây lắp An Giang

## Hub / seed

- Hub: `/du-an/nha-o-xa-hoi/an-giang`
- 308: `/du-an/nha-o-xa-hoi/kien-giang` → hub An Giang
- `npm run db:seed:noxh-an-giang`
- `salesRegion: SOUTH`
