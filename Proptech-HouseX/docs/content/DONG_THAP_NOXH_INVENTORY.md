# Inventory NOXH Đồng Tháp (gồm Tiền Giang cũ) — P0.2

Nguồn: PDF `tiep tuc, tong hop giup toi cac du an chung cu nh....pdf` (extract 2026-07-23).  
Canonical tỉnh: **Đồng Tháp** (NQ 202/2025). Alias search: Tiền Giang / Mỹ Tho.

| STT | Tên TM | CĐT (PDF) | Vị trí | Quy mô PDF | Slug | Enrich |
|-----|--------|-----------|--------|------------|------|--------|
| 1 | Rivera Garden Mỹ Tho (NOXH Nguyễn Tri Phương) | Long Giang Land & TMG Lục Nam | 45–47 Nguyễn Tri Phương, P. Mỹ Tho | 15 tầng · 216 căn · KC 06/2026 · BG Q3/2027 | `nha-o-xa-hoi-rivera-garden-my-tho` | **researched** |
| 2 | NOXH HQC Mỹ Tho | Tập đoàn Hoàng Quân (HQC) | Nguyễn Trung Trực, P. 3, Mỹ Tho | 3 block · 230 căn · đã vận hành | `nha-o-xa-hoi-hqc-my-tho` | skeleton |
| 3 | NOXH HQC Tân Hương | HQC | Xã Tân Hương, Châu Thành (Tiền Giang cũ) | ~1.395 căn · KCN Tân Hương | `nha-o-xa-hoi-hqc-tan-huong` | skeleton |
| 4 | NOXH Nguyễn Trãi Nối Dài | Đang chọn NĐT | P. Long Hưng, Gò Công | 330 căn · 46,5–67,1 m² | `nha-o-xa-hoi-nguyen-trai-noi-dai-go-cong` | skeleton |
| 5 | NOXH Bình Thành 2 | Đang công bố NĐT | Xã Bình Thành, Đồng Tháp | 9,83 ha · ~828 căn · ~986 tỷ | `nha-o-xa-hoi-binh-thanh-2` | skeleton |
| 6 | NOXH Công đoàn Đồng Tháp | Tổng LĐLĐ Việt Nam | Tỉnh Đồng Tháp | >500 căn công nhân | `nha-o-xa-hoi-cong-doan-dong-thap` | skeleton |

## Tra cứu

- `soxaydung.tiengiang.gov.vn` (legacy) · `sxd.dongthap.gov.vn`
- CĐT: `longgiangland.com.vn`, HQC

## Hub / seed

- Hub: `/du-an/nha-o-xa-hoi/dong-thap` (`hubEnabled: true`)
- 308: `/du-an/nha-o-xa-hoi/tien-giang` → hub Đồng Tháp
- `npm run db:seed:noxh-dong-thap`
- `salesRegion: SOUTH`
