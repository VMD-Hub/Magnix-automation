# Sitemap — Dịch vụ liên kết (mô hình quảng cáo)

Giai đoạn hiện tại: **giới thiệu chung + đối tác + form** — không landing từng ngân hàng.

## Cây URL

```
/dich-vu                    ← Pillar 3 nhóm

/tai-chinh                  ← Hub quảng cáo tài chính (1 trang)
  #vay-mua-bds              ← Section (anchor), không URL riêng
  #vay-sxkd
  + Danh sách ngân hàng liên kết
  + Form tư vấn

/dinh-gia                   ← Hub định giá (cluster use-case)
  /tra-cuu-gia-chu-nha
  /tham-dinh-ngan-hang
  …

/noi-that                   ← Hub cảm hứng + đối tác thi công
  /phong-cach-hien-dai      ← Bài SEO quảng bá
  /phong-cach-scandinavian
  /phong-cach-indochine
  /phong-cach-toi-gian
  /can-ho-dep-y-tuong
  + Form tư vấn

/lien-he                    ← Form tổng (mọi dịch vụ)
```

## Vai trò vận hành

| Bước | Ai xử lý |
|------|----------|
| Khách đọc nội dung / xem đối tác | Trang quảng cáo SSR |
| Gửi form | `POST /api/contact/affiliate` → `Lead` source `affiliate:*` |
| Lọc nhu cầu | Tư vấn viên / Admin / Agent AI (phase sau) |
| Chốt hợp đồng | Khách ↔ Ngân hàng / Thẩm định / Studio đối tác |

## SEO

- **Tài chính:** 1 URL mạnh + FAQ + danh sách NH (không duplicate landing NH)
- **Nội thất:** Hub + bài phong cách (keyword: nội thất hiện đại, căn hộ đẹp…)
- **Disclaimer:** Quảng cáo affiliate, không cam kết lãi suất/giá thi công

Config: `lib/content/affiliate-verticals.ts`
