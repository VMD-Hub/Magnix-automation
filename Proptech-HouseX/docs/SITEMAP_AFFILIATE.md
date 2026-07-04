# Sitemap — Dịch vụ liên kết (mô hình quảng cáo)

Giai đoạn hiện tại: **giới thiệu + kết nối studio đối tác + form** — không cam kết giá công khai.

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

/noi-that                   ← Hub dịch vụ nội thất (conversion-first)
  /phong-cach/hien-dai      ← Bài SEO phong cách
  /phong-cach/scandinavian
  /phong-cach/indochine
  /phong-cach/toi-gian
  /nha-dep                    ← Inspiration (Pinterest-style)
  /cong-trinh/[slug]          ← Case study (mock → thật)
  + Form tư vấn (#tu-van)

/lien-he                    ← Form tổng (mọi dịch vụ)
```

**301 từ URL cũ:** `/noi-that/phong-cach-hien-dai` → `/noi-that/phong-cach/hien-dai`, v.v. (xem `next.config.mjs`).

## Vai trò vận hành

| Bước | Ai xử lý |
|------|----------|
| Khách đọc nội dung / xem công trình mẫu | Trang SSR |
| Gửi form | `POST /api/contact/affiliate` → `Lead` source `affiliate:*` |
| Lọc nhu cầu | Tư vấn viên / Admin / Agent AI (phase sau) |
| Chốt hợp đồng | Khách ↔ Studio đối tác (House X đầu mối tư vấn) |

## SEO

- **Tài chính:** 1 URL mạnh + FAQ + danh sách NH (không duplicate landing NH)
- **Nội thất:** Hub conversion + phong cách nested + case study + hub nhà đẹp inspiration
- **Disclaimer:** Chi phí tham khảo — báo giá chính thức sau khảo sát; không review schema khi chưa có dữ liệu thật

Config: `lib/content/affiliate-verticals.ts` · `lib/content/noi-that-content.ts`
