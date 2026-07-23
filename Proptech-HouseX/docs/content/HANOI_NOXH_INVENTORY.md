# Inventory NOXH Hà Nội — Phase 5 lite

Nguồn đầu vào: PDF danh sách 17 dự án (extract 2026-07-23).  
SoT biên tập House X — **skeleton** = chỉ tên / CĐT / địa chỉ PDF; **researched** = đã đối chiếu CĐT / cơ quan nhà nước.

**Quy tắc:** không bịa giá · số căn · tiến độ. Enrich từng STT sau khi hub live.

| STT | Viết tắt | Tên thương mại | CĐT (PDF) | Địa chỉ (PDF) | Slug | District (seed) | Approx lat/lng | Enrich |
|-----|----------|----------------|-----------|---------------|------|-----------------|----------------|--------|
| 1 | Udic Hạ Đình | Udic Eco Tower Hạ Đình | Liên danh UDIC – DAC – DACINCO | Ô N012, KĐT Hạ Đình, Tân Triều, Thanh Trì | `nha-o-xa-hoi-udic-eco-tower-ha-dinh` | Thanh Trì | 20.973 / 105.810 | **researched** (UDIC NO1; sửa N012→NO1, CĐT Haweicco+DAC) |
| 2 | Hacinco Nguyễn Xiển | Đại Kim – Định Công | CTCP Đầu tư Xây dựng Hà Nội (Hacinco) | Ô NO2, KĐT Đại Kim, Hoàng Mai | `nha-o-xa-hoi-hacinco-dai-kim-dinh-cong` | Hoàng Mai | 20.976 / 105.855 | skeleton |
| 3 | 321 Vĩnh Hưng | Green House Vĩnh Hưng | TNHH Đầu tư KD BĐS Đồng Phát | 321 Vĩnh Hưng, P. Vĩnh Hưng, Hoàng Mai | `nha-o-xa-hoi-green-house-vinh-hung` | Hoàng Mai | 20.983 / 105.870 | skeleton |
| 4 | 393 Lĩnh Nam | 393 Lĩnh Nam | TNHH Hoà Bình (Hoà Bình Group) | 393 Lĩnh Nam, P. Vĩnh Hưng, Hoàng Mai | `nha-o-xa-hoi-393-linh-nam` | Hoàng Mai | 20.985 / 105.875 | skeleton |
| 5 | CT1 Ao Sào | Ao Sào | CTCP Đầu tư và Phát triển Lũng Lô 5 | Ô CT1, KĐT Ao Sào, Thịnh Liệt, Hoàng Mai | `nha-o-xa-hoi-ao-sao-ct1` | Hoàng Mai | 20.970 / 105.850 | skeleton |
| 6 | CT6B Kim Giang | CT6B Kim Giang | CTCP ĐT & PT Thương mại Hạ Đình | 320 Khương Đình (gần Kim Giang), Thanh Xuân | `nha-o-xa-hoi-ct6b-kim-giang` | Thanh Xuân | 20.995 / 105.815 | skeleton |
| 7 | X2 Trần Phú | X2 Đại Kim | TCT ĐTPT nhà và đô thị (MHDI) | Ô X2, P. Đại Kim, Hoàng Mai | `nha-o-xa-hoi-x2-dai-kim` | Hoàng Mai | 20.978 / 105.848 | skeleton |
| 8 | HUD Vân Canh | Vân Canh HUD | TCT ĐTPT nhà và đô thị (HUD) | Ô CT1, KĐT mới Vân Canh, Hoài Đức | `nha-o-xa-hoi-hud-van-canh` | Hoài Đức | 21.035 / 105.735 | skeleton |
| 9 | Green Tower Đại Mỗ | FLC Garden City (HH1/HH4) | FLC / CTCP Địa ốc Alaska | KĐT FLC Garden City, Đại Mỗ, Nam Từ Liêm | `nha-o-xa-hoi-flc-garden-city-dai-mo` | Nam Từ Liêm | 21.010 / 105.755 | skeleton |
| 10 | Rice City Tố Hữu | Rice City Tố Hữu | CTCP BIC Việt Nam | Đường Tố Hữu, Mễ Trì & Trung Văn, Nam Từ Liêm | `nha-o-xa-hoi-rice-city-to-huu` | Nam Từ Liêm | 21.015 / 105.780 | skeleton |
| 11 | Tây Nam Mễ Trì | Green Tower Mễ Trì | Vinaconex 3 & TCT PIV | P. Mễ Trì, Nam Từ Liêm | `nha-o-xa-hoi-green-tower-me-tri` | Nam Từ Liêm | 21.020 / 105.775 | skeleton |
| 12 | Hồng Hà Eco City | Hồng Hà Eco City (CT1–CT4) | CTCP Đầu tư Tứ Hiệp | KĐT Hồng Hà Eco City, Tứ Hiệp, Thanh Trì | `nha-o-xa-hoi-hong-ha-eco-city` | Thanh Trì | 20.960 / 105.845 | skeleton |
| 13 | HUD Mê Linh | HUD Melinh Central | TCT ĐTPT nhà và đô thị (HUD) | KĐT Thanh Lâm – Đại Thịnh 2, Mê Linh | `nha-o-xa-hoi-hud-me-linh` | Mê Linh | 21.180 / 105.720 | skeleton |
| 14 | Minh Đức | Minh Đức Mê Linh | TNHH Minh Đức | Xã Tiền Phong, Mê Linh | `nha-o-xa-hoi-minh-duc-me-linh` | Mê Linh | 21.165 / 105.710 | skeleton |
| 15 | Him Lam Phúc Lợi | Him Lam Thượng Thanh | Him Lam Thủ Đô & BIC Việt Nam | P. Thượng Thanh, Long Biên | `nha-o-xa-hoi-him-lam-thuong-thanh` | Long Biên | 21.055 / 105.890 | skeleton |
| 16 | Rice City Thạch Bàn | Rice City Sông Hồng | CTCP BIC Việt Nam | P. Thạch Bàn, Long Biên | `nha-o-xa-hoi-rice-city-song-hong` | Long Biên | 21.040 / 105.905 | skeleton |
| 17 | Bảo Ngọc City | Bảo Ngọc City (Bảo Ngọc Towers) | CTCP Đầu tư Bảo Ngọc Corp | P. Thạch Bàn, Long Biên | `nha-o-xa-hoi-bao-ngoc-city` | Long Biên | 21.038 / 105.910 | skeleton |

## Seed / hub

- Hub: `/du-an/nha-o-xa-hoi/ha-noi`
- Script: `npm run db:seed:noxh-hanoi`
- `salesRegion: NORTH` · `leadLane: PIPELINE_CDT` · `status: SAP_MO_BAN`

## Enrich tiếp theo

Thứ tự mặc định STT 1 → 17. Brief mẫu: `docs/content/HO_GUOM_XANH_NOXH_LANDING.md`.
