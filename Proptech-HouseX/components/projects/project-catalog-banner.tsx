import {
  PROJECT_CATALOG_BANNERS,
  type ProjectCatalogBannerVariant,
} from "@/lib/brand/project-catalog-banners";
import { CATALOG_BANNER_SIZES, catalogBannerSources } from "@/lib/brand/banner-responsive";
import { RubySurfaceOrnament } from "@/components/brand/ruby-surface-ornament";
import { BannerPicture } from "@/components/ui/banner-picture";
import {
  NOXH_CATALOG_BANNER_ALT,
  NOXH_REGION_TAGLINE,
} from "@/lib/content/messaging/noxh-public";

type Props = {
  variant: ProjectCatalogBannerVariant;
};

/** Banner /du-an — ruby overlay + ornament đồng bộ catalog. */
export function ProjectCatalogBanner({ variant }: Props) {
  const banner = PROJECT_CATALOG_BANNERS[variant];
  const sources = catalogBannerSources(banner.slide);

  return (
    <header className="proptech-catalog-hero mb-6">
      <RubySurfaceOrnament variant="holder" />
      <div className="relative h-[220px] w-full sm:h-[250px] lg:h-[260px]">
        <BannerPicture
          sources={sources}
          sizes={CATALOG_BANNER_SIZES}
          alt={variant === "NHA_O_XA_HOI" ? NOXH_CATALOG_BANNER_ALT : banner.alt}
          objectPosition={banner.objectPosition}
          priority
        />
        <div className="proptech-catalog-hero__overlay-h" aria-hidden />
        <div className="proptech-catalog-hero__overlay-v" aria-hidden />
        <div className="proptech-catalog-hero__content absolute inset-0 flex flex-col justify-end px-5 pb-5 sm:px-7 sm:pb-6">
          {variant === "NHA_O_XA_HOI" && (
            <p className="mb-2 max-w-2xl text-sm font-medium text-emerald-100/95 sm:text-base">
              {NOXH_REGION_TAGLINE}
            </p>
          )}
          <h1 className="lux-hero-title max-w-2xl text-2xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-3xl">
            {banner.title}
          </h1>
        </div>
      </div>
    </header>
  );
}
