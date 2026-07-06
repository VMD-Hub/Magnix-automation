import { HOUSEX_HERO_SLIDES, type HouseXHeroSlideAsset } from "@/lib/brand/hero-assets";
import { HERO_LCP_SIZES, heroLcpSources } from "@/lib/brand/banner-responsive";
import { BannerPicture } from "@/components/ui/banner-picture";

type Props = {
  slide?: HouseXHeroSlideAsset;
};

/** LCP hero — render SSR trong HTML, không chờ hydration. */
export function HeroLcpPicture({ slide = HOUSEX_HERO_SLIDES[0]! }: Props) {
  const sources = heroLcpSources(slide);

  return (
    <div className="hero-slide-bg absolute inset-0 z-[1]" aria-hidden>
      <BannerPicture
        sources={sources}
        sizes={HERO_LCP_SIZES}
        objectPosition={slide.objectPosition}
        priority
      />
      <div className="hero-slide-vignette absolute inset-0 z-[2]" />
    </div>
  );
}
