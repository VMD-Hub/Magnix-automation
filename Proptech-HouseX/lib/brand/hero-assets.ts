/** Hero banner — 21:9, xuất 1x + 2x cho desktop/Retina. */
export const HOUSEX_HERO_BANNER_WIDTH = 1920;
export const HOUSEX_HERO_BANNER_HEIGHT = 823;

/** Desktop lớn / Retina — tiêu chuẩn hero ≥2560–3840px rộng. */
export const HOUSEX_HERO_BANNER_WIDTH_2X = 3840;
export const HOUSEX_HERO_BANNER_HEIGHT_2X = 1646;

export type HouseXHeroSlideAsset = {
  id: string;
  label: string;
  /** Bản 3840px — màn hình lớn / DPR cao */
  jpg: string;
  webp: string;
  /** Bản 1920px — tablet / tiết kiệm băng thông */
  jpgMd: string;
  webpMd: string;
  objectPosition: string;
};

/** File nguồn — đặt vào assets/incoming/ trước khi chạy hero:import-slides */
export const HOUSEX_HERO_SLIDE_SOURCES = {
  civicCenter:
    "phoi-canh-trung-tam-hanh-chinh-tphcm-3-anh-nha-dau-tu-17773776007711485794661.png",
  metroHub: "housex-hero-slide-02-thu-thiem-metro-hub.png",
} as const;

const SLIDE_01 = "housex-hero-slide-01-civic-center";
const SLIDE_02 = "housex-hero-slide-02-metro-hub";

export const HOUSEX_HERO_SLIDES: HouseXHeroSlideAsset[] = [
  {
    id: "civic-center",
    label: "Phối cảnh trung tâm hành chính Thủ Thiêm",
    jpg: `/images/hero/${SLIDE_01}.jpg`,
    webp: `/images/hero/${SLIDE_01}.webp`,
    jpgMd: `/images/hero/${SLIDE_01}-1920.jpg`,
    webpMd: `/images/hero/${SLIDE_01}-1920.webp`,
    objectPosition: "50% 42%",
  },
  {
    id: "metro-hub",
    label: "Ga metro Thủ Thiêm — kết nối đô thị",
    jpg: `/images/hero/${SLIDE_02}.jpg`,
    webp: `/images/hero/${SLIDE_02}.webp`,
    jpgMd: `/images/hero/${SLIDE_02}-1920.jpg`,
    webpMd: `/images/hero/${SLIDE_02}-1920.webp`,
    objectPosition: "50% 38%",
  },
];

/** @deprecated Dùng HOUSEX_HERO_SLIDES — giữ tương thích cũ. */
export const HOUSEX_HERO_DAY = HOUSEX_HERO_SLIDES[0]!.jpg;
export const HOUSEX_HERO_DAY_WEBP = HOUSEX_HERO_SLIDES[0]!.webp;
export const HOUSEX_HERO_NIGHT = HOUSEX_HERO_SLIDES[0]!.jpg;
export const HOUSEX_HERO_NIGHT_WEBP = HOUSEX_HERO_SLIDES[0]!.webp;

export const HOUSEX_HERO_SRCSET_SIZES = "100vw" as const;
