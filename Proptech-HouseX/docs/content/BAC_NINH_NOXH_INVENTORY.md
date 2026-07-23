# Inventory NOXH Bắc Ninh (Bắc Giang cũ) — P0.5

Nguồn: PDF `Bac Ninh.pdf` (extract 2026-07-23).  
Canonical: **Bắc Ninh**. Alias: Bắc Giang / Yên Phong / Quế Võ / Tiên Du / Từ Sơn (NQ 2025).

**Cụm KCN-centric:** Yên Phong (Samsung corridor · KCN Yên Phong) · Quế Võ · TP Bắc Ninh · VSIP Tiên Du · **Việt Yên / KCN Vân Trung / Quang Châu** (Bắc Giang cũ).

## I. Bắc Ninh cũ (8 dự án)

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

## II. Bắc Giang cũ (7 dự án — hub Bắc Ninh)

Địa chỉ dual: canonical **Bắc Ninh** + alias **(Bắc Giang cũ)**. Route 308 `bac-giang` → hub `/du-an/nha-o-xa-hoi/bac-ninh`.

| STT | Tên TM | CĐT (PDF → research) | Vị trí | Quy mô PDF | Slug | Enrich |
|-----|--------|----------------------|--------|------------|------|--------|
| 9 | Evergreen Bắc Giang | KCN Sài Gòn-Hải Phòng + Evergreen BG (PDF: Vân Trung / 3A) | **Nếnh** Việt Yên (gần KCN Vân Trung) | ~3,2 ha · 10×20 · ~3300 căn · 28–70 m² · ~12–13,5 tr/m² · đang mở bán | `nha-o-xa-hoi-evergreen-bac-giang-van-trung` | **researched** |
| 10 | Đình Trám Sen Hồ | Lam Sơn | Hồng Thái Việt Yên | 4 block 18 tầng · ~2400 căn | `nha-o-xa-hoi-dinh-tram-sen-ho` | skeleton |
| 11 | Công nhân Quang Châu | APEC | Quang Châu Việt Yên | ~1500 căn | `nha-o-xa-hoi-quang-chau-cong-nhan` | skeleton |
| 12 | Nội Hoàng | VJS | Nội Hoàng Yên Dũng | 4 block 18 tầng · ~1600 căn | `nha-o-xa-hoi-noi-hoang` | skeleton |
| 13 | Năng Lượng Xanh Bắc Giang | NLX Bắc Giang | Xương Giang TP Bắc Giang | 2 block 19 tầng · ~700 căn | `nha-o-xa-hoi-nang-luong-xanh-bac-giang` | skeleton |
| 14 | KCN Hòa Phú | ĐT Hòa Phú | Mai Đình Hiệp Hòa | ~1200 căn | `nha-o-xa-hoi-kcn-hoa-phu-hiep-hoa` | skeleton |
| 15 | KĐT Nếnh | Liên danh | Nếnh Việt Yên | ~2000 căn | `nha-o-xa-hoi-kdt-nenh` | skeleton |

**Lưu ý:** STT-8 `nha-o-xa-hoi-evergreen-bac-ninh` (HUD2 Tiên Du) khác STT-9 Evergreen BG @ Nếnh (slug giữ `…-van-trung`). STT-15 KĐT Nếnh skeleton — có thể trùng cụm địa lý với Evergreen; không merge slug.

## Tra cứu

- `soxaydung.bacninh.gov.vn` · legacy `soxaydung.bacgiang.gov.vn`
- Cát Tường / Sở XD Bắc Ninh — enrich STT-1 (hành lang Samsung Yên Phong; đối chiếu giá Sở trước nộp hồ sơ)
- Evergreen Nếnh — enrich STT-9 (CĐT Sài Gòn-Hải Phòng + Evergreen BG; giá PDF ~12–13,5 tr/m² — xác minh Sở)

## Hub / seed

- Hub: `/du-an/nha-o-xa-hoi/bac-ninh`
- 308: `bac-giang` → hub Bắc Ninh
- `npm run db:seed:noxh-bac-ninh`
- `salesRegion: NORTH`
- **15 slugs** (8 BN cũ + 7 BG cũ)
