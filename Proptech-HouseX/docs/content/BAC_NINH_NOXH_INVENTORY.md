# Inventory NOXH Bắc Ninh (Bắc Giang cũ) — P0.5

Nguồn: PDF `Bac Ninh.pdf` (extract 2026-07-23).  
Canonical: **Bắc Ninh**. Alias: Bắc Giang / Yên Phong / Quế Võ / Tiên Du / Từ Sơn (NQ 2025).

**Cụm KCN-centric:** Yên Phong (Samsung corridor · KCN Yên Phong) · Quế Võ · TP Bắc Ninh · VSIP Tiên Du.

| STT | Tên TM | CĐT (PDF → research) | Vị trí | Quy mô PDF | Slug | Enrich |
|-----|--------|----------------------|--------|------------|------|--------|
| 1 | Cát Tường Smart City | CTCP Cát Tường | Yên Trung & Thụy Hòa, Yên Phong (gần KCN Yên Phong) | 5 block 9 tầng · ~1000 căn · 45–70 m² · ~9,5–11,5 tr/m² · đang mở bán | `nha-o-xa-hoi-cat-tuong-smart-city` | **researched** |
| 2 | Viglacera Yên Phong | Viglacera | Đông Tiến Yên Phong (KCN) | ~1200 căn · 9–12 tầng · ~8,5–10,5 tr/m² | `nha-o-xa-hoi-viglacera-yen-phong` | skeleton |
| 3 | Thống Nhất Smart City | CTCP Thống Nhất | Yên Trung Yên Phong | 4 block · ~800 căn | `nha-o-xa-hoi-thong-nhat-smart-city` | skeleton |
| 4 | Sao Hồng Quế Võ | CTCP ĐT Sao Hồng | Phương Liễu Quế Võ | 3 block 11–15 tầng · ~790 căn · 40–68 m² | `nha-o-xa-hoi-sao-hong-que-vo` | skeleton |
| 5 | Golden Park Quế Võ | TNHH ĐT&TM Kim Diamond | Phương Liễu Quế Võ | 4 block 18 tầng · ~1400 căn | `nha-o-xa-hoi-golden-park-que-vo` | skeleton |
| 6 | Kinh Bắc Plaza | CTCP ĐT BĐS Kinh Bắc | Vũ Ninh TP Bắc Ninh | 2 block 19 tầng · ~600 căn | `nha-o-xa-hoi-kinh-bac-plaza` | skeleton |
| 7 | Dabaco Khắc Niệm | Dabaco | Khắc Niệm TP Bắc Ninh | 2 block 19 tầng · ~480 căn | `nha-o-xa-hoi-dabaco-khac-niem` | skeleton |
| 8 | Evergreen Bắc Ninh | HUD2 | Đại Đồng Tiên Du (VSIP) | 5 block 11 tầng · ~1100 căn | `nha-o-xa-hoi-evergreen-bac-ninh` | skeleton |

## Tra cứu

- `soxaydung.bacninh.gov.vn` · legacy `soxaydung.bacgiang.gov.vn`
- Cát Tường / Sở XD Bắc Ninh — enrich STT-1 (hành lang Samsung Yên Phong; đối chiếu giá Sở trước nộp hồ sơ)

## Hub / seed

- Hub: `/du-an/nha-o-xa-hoi/bac-ninh`
- 308: `bac-giang` → hub Bắc Ninh
- `npm run db:seed:noxh-bac-ninh`
- `salesRegion: NORTH`
