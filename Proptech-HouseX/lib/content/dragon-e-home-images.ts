/**
 * Dragon E-Home — ảnh local (tránh hotlink phulong.com >1MB).
 */
const HERO = "/images/hero/housex-hero-slide-02-metro-hub.webp";
const GALLERY = [
  "/images/hero/housex-hero-slide-02-metro-hub.webp",
  "/images/hero/hcmc-skyline-river-night.webp",
  "/images/hero/urban-skyline-golden-hour.jpg",
  "/images/hero/hcmc-skyline-river-day.webp",
  "/images/hero/housex-thu-thiem-civic-center-day.webp",
  "/images/hero/hcmc-bitexco-metro-day.webp",
] as const;

export const DRAGON_E_HOME_PUBLISHED_IMAGES = {
  hero: {
    url: HERO,
    alt: "Phối cảnh Dragon E-Home — nhà ở xã hội thế hệ mới tại Dragon Village",
  },
  developerLogo: "/images/hero/hcmc-skyline-river-day.webp",
  projectLogo: "/images/hero/housex-hero-slide-02-metro-hub.webp",
  locationMap: {
    url: "/images/hero/hcmc-skyline-river-night.webp",
    alt: "Bản đồ vị trí Dragon E-Home — Nguyễn Thị Tư, Dragon Village, Thủ Đức",
    caption: "Minh hoạ kết nối vùng — theo website CĐT Phú Long",
  },
  gallery: [
    { url: GALLERY[0], caption: "Tổng thể dự án Dragon E-Home ban ngày" },
    { url: GALLERY[1], caption: "Phối cảnh ban đêm — 6 tòa C1–C5" },
    { url: GALLERY[2], caption: "Chân tòa nhà & không gian cảnh quan" },
    { url: GALLERY[3], caption: "Hồ bơi nội khu" },
    { url: GALLERY[4], caption: "Công viên nội khu" },
    { url: GALLERY[5], caption: "Mặt bằng tầng 3–8 tòa C1" },
  ],
} as const;
