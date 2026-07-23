import { HouseXFooterLogo } from "@/components/brand/housex-footer-logo";
import { RubySurfaceOrnament } from "@/components/brand/ruby-surface-ornament";
import { BannerPicture } from "@/components/ui/banner-picture";
import {
  CATALOG_BANNER_SIZES,
  catalogBannerSources,
} from "@/lib/brand/banner-responsive";
import { HOUSEX_HERO_SLIDES } from "@/lib/brand/hero-assets";
import { BRAND_TAGLINE_HEADER } from "@/lib/content/messaging/brand";
import { cn } from "@/lib/ui/cn";

type Props = {
  kicker?: string;
  className?: string;
  /** NFC / thẻ vật lý — banner thấp hơn, vừa một màn hình điện thoại */
  compact?: boolean;
};

/** Banner ruby skyline + lockup — đồng bộ catalog/công cụ House X. */
export function ProfileBrandHero({
  kicker = "Hồ sơ Co-Founder",
  className,
  compact = false,
}: Props) {
  const slide = HOUSEX_HERO_SLIDES[0]!;
  const sources = catalogBannerSources(slide);

  return (
    <header className={cn("proptech-catalog-hero mb-0", className)}>
      <RubySurfaceOrnament variant="holder" />
      <div
        className={cn(
          "relative w-full",
          compact ? "h-[108px] sm:h-[116px]" : "h-[168px] sm:h-[188px]",
        )}
      >
        <BannerPicture
          sources={sources}
          sizes={CATALOG_BANNER_SIZES}
          alt="House X — Nền tảng số tìm nhà Việt Nam"
          objectPosition={slide.objectPosition}
          priority
        />
        <div className="proptech-catalog-hero__overlay-h" aria-hidden />
        <div className="proptech-catalog-hero__overlay-v" aria-hidden />
        <div
          className={cn(
            "proptech-catalog-hero__content absolute inset-0 flex flex-col justify-end",
            compact ? "px-4 pb-3 sm:px-5" : "px-5 pb-5 sm:px-7 sm:pb-6",
          )}
        >
          <HouseXFooterLogo
            href="/"
            className={cn(
              "mb-3",
              compact ? "max-w-[148px] sm:max-w-[160px]" : "max-w-[200px] sm:max-w-[220px]",
            )}
          />
          {!compact && <p className="proptech-kicker">{BRAND_TAGLINE_HEADER}</p>}
          <p
            className={cn(
              "font-semibold text-white/90",
              compact ? "text-xs" : "mt-1 text-sm",
            )}
          >
            {kicker}
          </p>
        </div>
      </div>
    </header>
  );
}
