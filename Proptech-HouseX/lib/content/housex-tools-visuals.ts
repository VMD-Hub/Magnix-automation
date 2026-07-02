import { HOUSEX_HERO_SLIDES } from "@/lib/brand/hero-assets";
import { VERTICAL_VISUALS } from "@/lib/content/housex-services-visuals";

const financeHero = VERTICAL_VISUALS["tai-chinh"].heroImage;
const valuationHero = VERTICAL_VISUALS["dinh-gia"].heroImage;
const interiorHero = VERTICAL_VISUALS["noi-that"].heroImage;

/** Banner trang công cụ — rộng, thấp (cùng tỷ lệ catalog /du-an). */
export const TOOLS_HUB_BANNER = {
  jpg: HOUSEX_HERO_SLIDES[1]!.jpgMd,
  webp: HOUSEX_HERO_SLIDES[1]!.webpMd,
  objectPosition: HOUSEX_HERO_SLIDES[1]!.objectPosition,
  alt: "Kết nối đô thị — công cụ mua nhà HouseX",
};

export const LOAN_CALC_BANNER = {
  jpg: financeHero,
  webp: financeHero,
  objectPosition: "50% 40%",
  alt: "Tư vấn tài chính mua nhà — HouseX",
};

/** Ảnh minh hoạ từng thẻ công cụ trên hub. */
export const TOOL_CARD_IMAGES: Record<string, string> = {
  loan: financeHero,
  affordability: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
  "noxh-check": HOUSEX_HERO_SLIDES[0]!.jpgMd,
};

export const TOOL_SERVICE_IMAGES: Record<string, string> = {
  "tai-chinh": financeHero,
  "dinh-gia": valuationHero,
  "noi-that": interiorHero,
};

export const LOAN_CALC_TRUST_STATS = VERTICAL_VISUALS["tai-chinh"].stats;
