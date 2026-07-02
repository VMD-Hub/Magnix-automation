import {
  PROJECT_CATALOG_BANNERS,
  type ProjectCatalogBannerVariant,
} from "@/lib/brand/project-catalog-banners";
import {
  NOXH_CATALOG_BANNER_ALT,
  NOXH_REGION_TAGLINE,
} from "@/lib/content/messaging/noxh-public";

type Props = {
  variant: ProjectCatalogBannerVariant;
};

/**
 * Banner rộng cho /du-an — cao tương đương ảnh thẻ dự án (16:10), thấp hơn hero landing.
 */
export function ProjectCatalogBanner({ variant }: Props) {
  const banner = PROJECT_CATALOG_BANNERS[variant];

  return (
    <header className="relative mb-6 overflow-hidden rounded-2xl ring-1 ring-silver-200">
      <div className="relative h-[220px] w-full sm:h-[250px] lg:h-[260px]">
        <picture>
          <source
            media="(min-width: 1024px)"
            srcSet={`${banner.webp} 1x, ${banner.webp} 2x`}
            type="image/webp"
          />
          <source
            media="(min-width: 1024px)"
            srcSet={`${banner.jpg} 1x, ${banner.jpg} 2x`}
          />
          <source srcSet={banner.webpMd} type="image/webp" />
          <source srcSet={banner.jpgMd} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={banner.jpgMd}
            alt={variant === "NHA_O_XA_HOI" ? NOXH_CATALOG_BANNER_ALT : banner.alt}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: banner.objectPosition }}
          />
        </picture>
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink-900/82 via-ink-900/45 to-ink-900/15"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink-900/55 via-transparent to-ink-900/10"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col justify-end px-5 pb-5 sm:px-7 sm:pb-6">
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
