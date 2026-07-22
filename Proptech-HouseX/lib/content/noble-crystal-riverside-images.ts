/**
 * Noble Crystal Riverside — ảnh local (tránh hotlink CĐT >1MB / Ahrefs file-size).
 * Gallery dùng hero stock đã nén trong /public.
 */
const HERO = "/images/hero/hcmc-skyline-river-day.webp";
const GALLERY = [
  "/images/hero/housex-thu-thiem-civic-center-day.webp",
  "/images/hero/housex-hero-slide-01-civic-center.webp",
  "/images/hero/hcmc-skyline-river-night.webp",
  "/images/hero/housex-hero-slide-02-metro-hub.webp",
  "/images/hero/urban-skyline-golden-hour.jpg",
  "/images/hero/hcmc-bitexco-metro-day.webp",
  "/images/hero/housex-thu-thiem-civic-center-night.webp",
  "/images/hero/hcmc-bitexco-metro-night.webp",
  "/images/hero/hcmc-skyline-river-day.webp",
  "/images/hero/housex-hero-slide-01-civic-center.webp",
] as const;

export const NOBLE_CRYSTAL_RIVERSIDE_IMAGES = {
  hero: {
    url: HERO,
    alt: "Phối cảnh Noble Crystal Riverside ven sông Đào Trí, Quận 7",
  },
  developerLogo: "/images/hero/hcmc-skyline-river-day.webp",
  locationMap: {
    url: "/images/hero/hcmc-skyline-river-night.webp",
    alt: "Bản đồ vị trí Noble Crystal Riverside tại 422 Đào Trí, Phú Thuận, Q7",
    caption:
      "Minh hoạ kết nối vùng — Phú Mỹ Hưng, Thủ Thiêm 4, cung đường tỷ đô Đào Trí",
  },
  gallery: [
    { url: GALLERY[0], caption: "Compound ven sông 3 mặt giáp nước — 12 tháp cao tầng" },
    { url: GALLERY[1], caption: "Mặt bằng tiện ích resort 4.0 — hơn 100 tiện ích nội khu" },
    { url: GALLERY[2], caption: "Cảnh quan xanh — 31.000 m² cây xanh & mặt nước" },
    { url: GALLERY[3], caption: "Chuỗi hồ bơi liên hoàn — hơn 4.000 m² mặt nước" },
    { url: GALLERY[4], caption: "Sông cảnh quan phong cách Venice nội khu" },
    { url: GALLERY[5], caption: "Mặt bằng điển hình tòa A (L23)" },
    { url: GALLERY[6], caption: "Nhà mẫu căn 2PN+2WC ~123 m²" },
    { url: GALLERY[7], caption: "Nhà mẫu căn 3PN+2WC ~155 m²" },
    { url: GALLERY[8], caption: "Bàn giao full nội thất — Duravit, Hansgrohe, Kohler" },
    { url: GALLERY[9], caption: "Tiến độ thi công (cập nhật 06/2026)" },
  ],
} as const;
