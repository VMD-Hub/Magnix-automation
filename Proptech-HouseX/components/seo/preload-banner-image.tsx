import {
  HERO_LCP_SIZES,
  type ResponsiveBannerSources,
} from "@/lib/brand/banner-responsive";

/** Preload LCP banner — Next.js hoist `<link>` trong page vào `<head>`. */
export function PreloadBannerImage({
  sources,
  sizes = HERO_LCP_SIZES,
}: {
  sources: ResponsiveBannerSources;
  sizes?: string;
}) {
  return (
    <link
      rel="preload"
      as="image"
      href={sources.preloadWebp}
      imageSrcSet={sources.webpSrcSet}
      imageSizes={sizes}
      type="image/webp"
      fetchPriority="high"
    />
  );
}
