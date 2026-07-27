# ID Town Long Thành — Bộ nội dung landing (HouseX)

Nguồn nghiên cứu: [id-town.com.vn](https://id-town.com.vn/) (thông tin công bố website dự án + công bố giá khối C/D 01/2026 — **admin xác minh trước publish**).

**Mục đích:** Landing nhà ở xã hội trên HouseX — slug `id-town-long-thanh`.

---

## Thông tin cơ bản

| Field | Giá trị |
|-------|---------|
| **Tên thương mại** | ID Town (iD Town) |
| **Tên dự án pháp lý** | Chung cư nhà ở xã hội thuộc Dự án Khu dân cư theo quy hoạch tại xã Long Thành |
| **Slug** | `id-town-long-thanh` |
| **Loại hình** | NHA_O_XA_HOI |
| **CĐT** | Công ty Cổ phần Long Thành Riverside |
| **Tổng thể** | Phân khu trong khu đô thị iD Junction |
| **Địa chỉ** | Đường Phạm Văn Đồng, Long Thành, Đồng Nai |
| **Quy mô** | 2,5 ha — 4 block 7 tầng — **628 căn** — mật độ XD **35%** |
| **Giá tham chiếu** | **~22 triệu/m²** (khối C, D công bố 01/2026, đã gồm VAT) |
| **Diện tích căn** | ~48–77 m² (công bố mở bán); website nêu 2PN ~59–73 m², 3PN hạn chế |
| **Bàn giao** | Quý 04/2026 (theo CĐT / báo chí) |
| **Website CĐT** | https://id-town.com.vn/ |

---

## Ảnh (đã nội bộ hóa)

Thư mục: `public/images/projects/id-town/`  
Mapping: `lib/content/id-town-images.ts`

| Vai trò | File |
|---------|------|
| Logo CĐT | `logo.png` |
| Hero | `hero.jpg` |
| Bản đồ / quy hoạch | `ban-do.jpg` |
| Gallery | phối cảnh, tiện ích, mặt bằng, tiến độ |

---

## Loại hình (unitTypes — tham chiếu)

| Tên | Diện tích | PN | Giá từ (~22 tr/m²) |
|-----|-----------|-----|---------------------|
| 2PN – 1WC | ~59 m² | 2 | ~1,30 tỷ |
| 2PN – 2WC | ~70 m² | 2 | ~1,54 tỷ |
| 3PN | ~85 m² | 3 | ~1,87 tỷ |

*Admin cập nhật khi có bảng giá chi tiết từng căn từ Sở/CĐT.*

---

## CTA HouseX

- **Nhãn:** Liên hệ tư vấn → `/lien-he`
- Không nhúng hotline CĐT trên landing HouseX.

---

## Bài hạ tầng (SEO)

| Slug | Tiêu đề ngắn | Tag |
|------|--------------|-----|
| `id-town-long-thanh-ha-tang-san-bay-metro-2026` | Sân bay ~5 km · ga ~1,5–2 km · cao tốc/QL51 | `hanh-lang-san-bay-long-thanh` |

- File: `lib/content/articles/id-town-infra-series-2026.ts`
- Preview: `/wiki-nha-o-xa-hoi/id-town-long-thanh-ha-tang-san-bay-metro-2026`
- Featured trên landing: `PROJECT_FEATURED_ARTICLE_SLUGS[id-town-long-thanh]`
- Cực tăng trưởng: `airport-long-thanh` (trục 5 — sân bay) — không thuộc QL13 hay biển Đông primary. Xem [`GROWTH_CORRIDORS.md`](./GROWTH_CORRIDORS.md).

---

## Xem trước / seed

```bash
# Preview không cần DB
# /preview/du-an/id-town-long-thanh

npm run db:reseed:id-town
# Public: /du-an/id-town-long-thanh
# Hub: /du-an/nha-o-xa-hoi/dong-nai
```

*Nghiên cứu: 2026-07-27*
