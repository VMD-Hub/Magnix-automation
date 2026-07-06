import type { HouseXHeroSlideAsset } from "@/lib/brand/hero-assets";

/** Hero full-viewport — không tải bản 3840 trừ màn hình cực rộng. */
export const HERO_LCP_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1920px";

/** Banner catalog/công cụ — cao ~260px, rộng tối đa container 1280px. */
export const CATALOG_BANNER_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1280px";

export type ResponsiveBannerSources = {
  webpSrcSet: string;
  jpgSrcSet: string;
  /** Fallback `src` — bản nhỏ nhất. */
  fallbackJpg: string;
  /** Preload ưu tiên — webp 768. */
  preloadWebp: string;
  width: number;
  height: number;
};

export function heroLcpSources(slide: HouseXHeroSlideAsset): ResponsiveBannerSources {
  return {
    webpSrcSet: `${slide.webp768} 768w, ${slide.webp1280} 1280w, ${slide.webpMd} 1920w`,
    jpgSrcSet: `${slide.jpg768} 768w, ${slide.jpg1280} 1280w, ${slide.jpgMd} 1920w`,
    fallbackJpg: slide.jpg768,
    preloadWebp: slide.webp768,
    width: 1920,
    height: 823,
  };
}

export function catalogBannerSources(
  slide: HouseXHeroSlideAsset,
): ResponsiveBannerSources {
  return {
    webpSrcSet: `${slide.webp768} 768w, ${slide.webp1280} 1280w`,
    jpgSrcSet: `${slide.jpg768} 768w, ${slide.jpg1280} 1280w`,
    fallbackJpg: slide.jpg768,
    preloadWebp: slide.webp768,
    width: 1280,
    height: 549,
  };
}
