/** Ảnh stock HouseX cho landing căn hộ thương mại QL13 / Lái Thiêu (chưa nội bộ hóa ảnh CĐT). */
const HERO = {
  urban: "/images/hero/urban-skyline-golden-hour.jpg",
  skyline: "/images/hero/hcmc-skyline-river-day.webp",
  metro: "/images/hero/housex-hero-slide-02-metro-hub.webp",
  civic: "/images/hero/housex-hero-slide-01-civic-center.webp",
} as const;

function pack(heroUrl: string, name: string, place: string) {
  return {
    hero: {
      url: heroUrl,
      alt: `Phối cảnh minh họa ${name} — ${place}`,
    },
    developerLogo: null as string | null,
    locationMap: {
      url: HERO.metro,
      alt: `Minh họa kết nối ${name} trên trục Quốc lộ 13 / Đại lộ Bình Dương`,
      caption: "Bản đồ minh họa — khoảng cách tham chiếu, không thay bản đồ đo đạc",
    },
    gallery: [
      { url: heroUrl, caption: `${name} — minh họa đô thị cửa ngõ QL13` },
      { url: HERO.skyline, caption: "Cảnh quan vùng ven sông / đô thị mở rộng" },
      { url: HERO.metro, caption: "Hành lang giao thông công cộng và QL13" },
      { url: HERO.civic, caption: "Không gian sống đô thị tích hợp" },
    ],
  } as const;
}

export const EMERALD_68_IMAGES = pack(
  HERO.urban,
  "The Emerald 68",
  "Quốc lộ 13, Thuận An",
);
export const AT_SKY_GARDEN_IMAGES = pack(
  HERO.skyline,
  "A&T Sky Garden",
  "Lái Thiêu, Thuận An",
);
export const ASTRAL_CITY_IMAGES = pack(
  HERO.civic,
  "Astral City",
  "Bình Hòa, Thuận An",
);
export const EMERALD_BOULEVARD_IMAGES = pack(
  HERO.metro,
  "The Emerald Boulevard",
  "Đối diện sân golf Sông Bé",
);
