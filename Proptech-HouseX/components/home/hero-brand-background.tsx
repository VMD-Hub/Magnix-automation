import { HERO_BRAND_SKYLINE } from "@/lib/brand/hero-brand-assets";
import { HeroBrandRubyTexture } from "@/components/home/hero-brand-ruby-texture";

/**
 * Hero House X — ảnh tĩnh public/ (không qua next/image) để dev + LCP nhanh.
 */
export function HeroBrandBackground() {
  return (
    <div className="hero-brand-bg" aria-hidden>
      <picture>
        <source srcSet={HERO_BRAND_SKYLINE.webp} type="image/webp" />
        <img
          src={HERO_BRAND_SKYLINE.src}
          alt={HERO_BRAND_SKYLINE.alt}
          className="hero-brand-photo"
          decoding="async"
          fetchPriority="high"
        />
      </picture>
      <div className="hero-brand-ruby-tint" />
      <HeroBrandRubyTexture />
      <div className="hero-brand-vignette-left" />
    </div>
  );
}
