/** Ảnh công bố trên noblecrystalriverside.com.vn — nên host CDN HouseX trước go-live. */
const CDN = "https://noblecrystalriverside.com.vn/wp-content/uploads";

export const NOBLE_CRYSTAL_RIVERSIDE_IMAGES = {
  hero: {
    url: `${CDN}/2026/06/phoi-canh-tong-the-du-an-noble-crystal-riverside.jpg`,
    alt: "Phối cảnh Noble Crystal Riverside ven sông Đào Trí, Quận 7",
  },
  developerLogo: `${CDN}/2025/06/LOGO-NOBLE-CRYSTAL-RIVERSIDE-MAU.png`,
  locationMap: {
    url: `${CDN}/2026/06/vi-tri-va-ket-noi-du-an-noble-crystal-riverside.jpg`,
    alt: "Bản đồ vị trí Noble Crystal Riverside tại 422 Đào Trí, Phú Thuận, Q7",
    caption:
      "Minh hoạ kết nối vùng — Phú Mỹ Hưng, Thủ Thiêm 4, cung đường tỷ đô Đào Trí",
  },
  gallery: [
    {
      url: `${CDN}/2026/06/phoi-canh-tong-the-du-an-noble-crystal-riverside-3.jpg`,
      caption: "Compound ven sông 3 mặt giáp nước — 12 tháp cao tầng",
    },
    {
      url: `${CDN}/2026/06/mat-bang-tien-ich-du-an-noble-crystal-riverside.jpg`,
      caption: "Mặt bằng tiện ích resort 4.0 — hơn 100 tiện ích nội khu",
    },
    {
      url: `${CDN}/2026/06/canh-quan-dac-quyen-noi-khu-noble-crystal-riverside-1.jpg`,
      caption: "Cảnh quan xanh — 31.000 m² cây xanh & mặt nước",
    },
    {
      url: `${CDN}/2025/06/tien-ich-noi-khu-du-an-noble-crystal-riverside-resort-4-0%20(1).jpg`,
      caption: "Chuỗi hồ bơi liên hoàn — hơn 4.000 m² mặt nước",
    },
    {
      url: `${CDN}/2026/06/dac-quyen-tinh-hoa-tien-ich-noble-crystal-riverside-4.jpg`,
      caption: "Sông cảnh quan phong cách Venice nội khu",
    },
    {
      url: `${CDN}/2025/08/mat-bang-dien-hinh-noble-crystal-riverside-toa-a-den-l23.jpg`,
      caption: "Mặt bằng điển hình tòa A (L23)",
    },
    {
      url: `${CDN}/2025/06/nha-mau-can-ho-2pn-2wc-123m2-noble-crystal-riverside-quan-7%20(4).jpg`,
      caption: "Nhà mẫu căn 2PN+2WC ~123 m²",
    },
    {
      url: `${CDN}/2025/06/nha-mau-can-ho-3pn-2wc-155m2-noble-crystal-riverside-quan-7%20(2).jpg`,
      caption: "Nhà mẫu căn 3PN+2WC ~155 m²",
    },
    {
      url: `${CDN}/2025/06/danh-muc-vat-lieu-ban-giao-can-ho-noble-crystal-riverside%20(1)-scaled.jpg`,
      caption: "Bàn giao full nội thất — Duravit, Hansgrohe, Kohler",
    },
    {
      url: `${CDN}/2026/06/tien-do-24-06-2026-du-an-noble-crystal-riverside-1.jpg`,
      caption: "Tiến độ thi công (cập nhật 06/2026)",
    },
  ],
} as const;
