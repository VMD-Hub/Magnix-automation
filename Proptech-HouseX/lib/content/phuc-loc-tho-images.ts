/**
 * Phúc Lộc Thọ — ảnh local (không hotlink mogivi: Ahrefs 403).
 * Stock đồng bộ với `NOXH_STOCK_BY_SLUG["chung-cu-phuc-loc-tho-noxh"]`.
 */
const HERO = "/images/hero/hcmc-bitexco-metro-day.webp";
const GALLERY = [
  "/images/hero/hcmc-bitexco-metro-day.webp",
  "/images/hero/housex-thu-thiem-civic-center-day.webp",
  "/images/hero/hcmc-skyline-river-day.webp",
  "/images/hero/housex-hero-slide-02-metro-hub.webp",
  "/images/hero/urban-skyline-golden-hour.jpg",
  "/images/hero/hcmc-skyline-river-night.webp",
] as const;

export const PHUC_LOC_THO_PUBLISHED_IMAGES = {
  hero: {
    url: HERO,
    alt: "Chung cư Phúc Lộc Thọ — 35 Lê Văn Chí, Thủ Đức",
  },
  developerLogo: "/images/hero/hcmc-skyline-river-day.webp",
  locationMap: {
    url: "/images/hero/hcmc-skyline-river-night.webp",
    alt: "Vị trí Chung cư Phúc Lộc Thọ — ngã tư Thủ Đức, Lê Văn Chí",
    caption: "Minh hoạ kết nối vùng — tham khảo theo tư liệu dự án",
  },
  gallery: [
    { url: GALLERY[0], caption: "Tổng quan chung cư Phúc Lộc Thọ (Emerald Apartment)" },
    { url: GALLERY[1], caption: "Phối cảnh block cao 16 tầng" },
    { url: GALLERY[2], caption: "Khu vực dự án mặt tiền Lê Văn Chí" },
    { url: GALLERY[3], caption: "Không gian sống nội khu" },
    { url: GALLERY[4], caption: "Tiện ích & cảnh quan xung quanh" },
    { url: GALLERY[5], caption: "Kết nối giao thông khu vực Thủ Đức" },
  ],
} as const;
