# Inventory NOXH Đà Nẵng — Phase 5 lite (Trung)

Nguồn: PDF nội bộ `tuong tu la thong tin du an nha o xa hoi tai Da n....pdf` (extract 2026-07-23).

**Quy tắc:** không bịa giá nếu chưa có nguồn CĐT / Sở. PDF ghi “giá dự kiến” — chỉ đưa vào landing khi enrich + gắn nguồn.

| STT PDF | Tên | Loại | CĐT (PDF) | Vị trí | Quy mô / giá PDF | Slug | Enrich |
|---------|-----|------|-----------|--------|------------------|------|--------|
| 1 | EcoLife Signature | **Thương mại — không seed NOXH** | Capital House | Mê Linh, Hải Vân | 376 căn TM · ~34 tr/m² | — | excluded |
| 2 | Chung cư Đại Địa Bảo | NOXH | Đức Mạnh & ĐTXD 579 | Nại Hiên Đông, Sơn Trà | 237 NOXH + 28 TM · ~17 tr/m² | `nha-o-xa-hoi-dai-dia-bao-son-tra` | researched |
| 3 | Eco Residence (CC số 3 – Khu B) | NOXH | Chương Dương – 525 – NTMER – Như Anh – Asia | Nam Cầu Cẩm Lệ | 650 căn NOXH · ~20 tr/m² | `nha-o-xa-hoi-eco-residence-nam-cau-cam-le` | skeleton |
| 4 | Việt Hương Lakeside (CC số 5 – Khu B) | NOXH | CTCP ĐTPT Nhà ở Toàn Cầu | Nam Cầu Cẩm Lệ | 1.306 căn (1.040 NOXH) · ~20,68 tr/m² | `nha-o-xa-hoi-viet-huong-lakeside-cam-le` | skeleton |
| 5 | EcoHome Liên Chiểu (Hòa Hiệp) | NOXH | Capital House | Hòa Hiệp, Liên Chiểu | ~800 căn NOXH · ~20,7 tr/m² | `nha-o-xa-hoi-ecohome-lien-chieu` | skeleton |
| 6 | NOXH khu đất A2-4 | NOXH (tương lai) | Đang cập nhật | Ngũ Hành Sơn (trục lên cầu Tiên Sơn) | ~831 căn · 2026–2030 | `nha-o-xa-hoi-a2-4-ngu-hanh-son` | skeleton |

## Nguồn tra cứu (PDF)

- Sở Xây dựng Đà Nẵng: `sxd.danang.gov.vn` (công bố giá / đối tượng)
- Cổng TTĐT TP: `danang.gov.vn`
- CĐT: `chdt579.vn`, `chuongduong.vn`, `capitalhouse.vn`

## Hub / seed

- Hub: `/du-an/nha-o-xa-hoi/da-nang`
- `npm run db:seed:noxh-danang`
- `salesRegion: CENTRAL` · `leadLane: PIPELINE_CDT`
