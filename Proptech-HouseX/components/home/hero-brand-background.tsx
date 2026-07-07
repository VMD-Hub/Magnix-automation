import { HeroBrandLineArt } from "@/components/home/hero-brand-line-art";
import { HeroBrandRubyTexture } from "@/components/home/hero-brand-ruby-texture";

/**
 * Hero House X — ruby facet + skyline neon line-art (phong cách ảnh tham chiếu).
 */
export function HeroBrandBackground() {
  return (
    <div className="hero-brand-bg" aria-hidden>
      <HeroBrandRubyTexture />
      <div className="hero-brand-vignette-left" />
      <HeroBrandLineArt />
    </div>
  );
}
