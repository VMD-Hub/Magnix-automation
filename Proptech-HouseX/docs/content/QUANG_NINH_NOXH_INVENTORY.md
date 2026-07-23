# Inventory NOXH Quảng Ninh — P0.5

Nguồn: PDF danh mục NOXH tỉnh Quảng Ninh (extract 2026-07-23).  
Canonical: **Quảng Ninh** (NQ 202/2025 — **không sáp nhập** cấp tỉnh).  
Alias tìm kiếm (optional): Hạ Long · Cẩm Phả · Quảng Yên · Đông Triều.

**Cụm:** Hạ Long (du lịch · cảng) · Cẩm Phả (than · công nghiệp) · Quảng Yên (KCN Amata · Đông Mai) · Đông Triều.

| STT | Tên TM | CĐT (PDF → research) | Vị trí | Quy mô PDF | Slug | Enrich |
|-----|--------|----------------------|--------|------------|------|--------|
| 1 | Đồi Ngân Hàng / GHomes Hạ Long | Toàn Cầu + Nhà số 6 (PDF: TTH+NHP) | Hồng Hải & **Cao Thắng**, TP. Hạ Long (PDF: Hồng Hà) | ~25.900 m² · 3 block · ~986 căn · 45–70 m² · ~16,2 tr/m² · đang mở bán | `nha-o-xa-hoi-doi-ngan-hang-ha-long` | **researched** |
| 2 | KĐT Kim Sơn | TCT Đông Bắc I | Phường Kim Sơn, TP. Đông Triều | 2 block 9 tầng · ~180 căn · ~11–12,5 tr/m² | `nha-o-xa-hoi-kdt-kim-son-dong-trieu` | skeleton |
| 3 | KCN Sông Khoai Amata | Amata + liên danh | KCN Sông Khoai, TP. Quảng Yên | ~1.200 căn công nhân | `nha-o-xa-hoi-kcn-song-khoai-amata` | skeleton |
| 4 | Hà Khánh | Viglacera HT | Phường Hà Khánh, TP. Hạ Long | 2 block 12 tầng · ~600 căn | `nha-o-xa-hoi-ha-khanh-ha-long` | skeleton |
| 5 | Cẩm Bình | BĐS Cẩm Phả | Phường Cẩm Bình, TP. Cẩm Phả | ~500 căn | `nha-o-xa-hoi-cam-binh-cam-pha` | skeleton |
| 6 | KCN Đông Mai | Viglacera đô thị KCN | KCN Đông Mai, TP. Quảng Yên | ~1.000 căn công nhân | `nha-o-xa-hoi-kcn-dong-mai` | skeleton |
| 7 | Tam Hợp | TCT Đông Bắc | Phường Cẩm Tây, TP. Cẩm Phả | ~400 căn | `nha-o-xa-hoi-tam-hop-cam-pha` | skeleton |

## Tra cứu

- `soxaydung.quangninh.gov.vn`
- Đồi Ngân Hàng / GHomes — enrich STT-1 (~25.900 m² · 986 căn · Hồng Hải & Cao Thắng; CĐT Toàn Cầu + Nhà số 6; giá ~16,2 tr/m² — xác minh Sở)

## Hub / seed

- Hub: `/du-an/nha-o-xa-hoi/quang-ninh`
- `npm run db:seed:noxh-quang-ninh`
- `salesRegion: NORTH`
