import Link from "next/link";
import type { HouseXHeroSlideAsset } from "@/lib/brand/hero-assets";
import { ListingCard } from "@/components/listings/listing-card";
import { ListingBrowseFilters } from "@/components/listings/listing-browse-filters";
import { ToolsPageHero } from "@/components/tools/tools-page-hero";
import { ButtonLink } from "@/components/ui/button";
import {
  PROPERTY_TYPE_FILTER_OPTIONS,
  RENT_PROPERTY_TYPE_FILTER_OPTIONS,
  propertyTypeToSlug,
} from "@/lib/content/property-type-slug";
import {
  formatListingBrowseLocationLabel,
  getListingBrowseProvinces,
  type ResolvedListingBrowseLocation,
} from "@/lib/content/listing-browse-locations";
import { propertyTypeLabel } from "@/lib/format";

type BannerProps = {
  kicker: string;
  title: string;
  subtitle: string;
  bannerSlide?: HouseXHeroSlideAsset;
  image: string;
  imageWebp?: string;
  imageAlt: string;
  objectPosition?: string;
  badge?: string;
};

type Props = {
  basePath: "/mua-ban" | "/cho-thue";
  title: string;
  subtitle: string;
  banner: BannerProps;
  items: React.ComponentProps<typeof ListingCard>["item"][];
  pagination: { page: number; totalPages: number; total: number };
  filters: {
    location: ResolvedListingBrowseLocation;
    propertyType?: string;
    propertyTypeSlug?: string;
  };
  emptyMode?: "no-results" | "coming-soon";
  comingSoon?: {
    title: string;
    body: string;
    cta: string;
    ctaHref: string;
  };
};

function buildHref(
  basePath: string,
  current: Props["filters"],
  patch: Partial<Props["filters"] & { page?: number }>,
) {
  const nextLocation = patch.location ?? current.location;
  const next = { ...current, ...patch, location: nextLocation };
  const q = new URLSearchParams();
  if (next.location.provinceSlug) q.set("province", next.location.provinceSlug);
  if (next.location.district) q.set("district", next.location.district);
  if (next.propertyTypeSlug) q.set("propertyType", next.propertyTypeSlug);
  if (patch.page && patch.page > 1) q.set("page", String(patch.page));
  const qs = q.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function ListingBrowsePage({
  basePath,
  subtitle: _subtitle,
  banner,
  items,
  pagination,
  filters,
  emptyMode = "no-results",
  comingSoon,
}: Props) {
  const { location } = filters;
  const activeSlug = filters.propertyTypeSlug;
  const locationLabel = formatListingBrowseLocationLabel(location);
  const browseProvinces = getListingBrowseProvinces();
  const typeOptions =
    basePath === "/cho-thue"
      ? RENT_PROPERTY_TYPE_FILTER_OPTIONS
      : PROPERTY_TYPE_FILTER_OPTIONS;

  return (
    <div className="proptech-section-glow mx-auto max-w-7xl py-8 container-px">
      <ToolsPageHero
        kicker={banner.kicker}
        title={banner.title}
        subtitle={banner.subtitle}
        bannerSlide={banner.bannerSlide}
        image={banner.image}
        imageWebp={banner.imageWebp}
        imageAlt={banner.imageAlt}
        objectPosition={banner.objectPosition}
      />

      {banner.badge ? (
        <div className="mb-6 flex justify-center">
          <span className="rounded-full bg-gold-500/15 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-gold-800 ring-1 ring-gold-400/40">
            {banner.badge}
          </span>
        </div>
      ) : null}

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <ListingBrowseFilters
          basePath={basePath}
          provinces={browseProvinces}
          typeOptions={typeOptions}
          activeProvinceSlug={location.provinceSlug}
          activeDistrict={location.district}
          activeTypeSlug={activeSlug}
        />
        <p className="shrink-0 text-sm text-slate-500 sm:pb-0.5">
          {pagination.total > 0
            ? `${pagination.total.toLocaleString("vi-VN")} tin đang hiển thị`
            : emptyMode === "coming-soon"
              ? "Đang cập nhật"
              : "Chưa có tin phù hợp"}
        </p>
      </div>

      <div className="min-w-0">
        {(locationLabel || filters.propertyType) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {location.provinceSlug && !location.district ? (
              <FilterChip
                label={location.provinceLabel ?? location.provinceSlug}
                href={buildHref(basePath, filters, {
                  location: { ...location, provinceSlug: undefined, province: undefined, provinceLabel: undefined },
                  page: 1,
                })}
              />
            ) : null}
            {location.district ? (
              <FilterChip
                label={locationLabel ?? location.district}
                href={buildHref(basePath, filters, {
                  location: { ...location, district: undefined },
                  page: 1,
                })}
              />
            ) : null}
            {filters.propertyType ? (
              <FilterChip
                label={propertyTypeLabel(filters.propertyType)}
                href={buildHref(basePath, filters, {
                  propertyTypeSlug: undefined,
                  page: 1,
                })}
              />
            ) : null}
          </div>
        )}

        {items.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ListingCard key={item.code} item={item} />
            ))}
          </div>
        ) : emptyMode === "coming-soon" && comingSoon ? (
          <ComingSoonPanel {...comingSoon} />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
            Chưa có tin phù hợp bộ lọc. Thử bỏ bớt điều kiện hoặc quay lại sau.
          </div>
        )}

        {pagination.totalPages > 1 ? (
          <nav
            className="mt-8 flex items-center justify-center gap-2"
            aria-label="Phân trang"
          >
            {pagination.page > 1 ? (
              <PageLink
                href={buildHref(basePath, filters, { page: pagination.page - 1 })}
                label="← Trước"
              />
            ) : null}
            <span className="px-3 text-sm text-slate-600">
              Trang {pagination.page}/{pagination.totalPages}
            </span>
            {pagination.page < pagination.totalPages ? (
              <PageLink
                href={buildHref(basePath, filters, { page: pagination.page + 1 })}
                label="Sau →"
              />
            ) : null}
          </nav>
        ) : null}
      </div>
    </div>
  );
}

function ComingSoonPanel({
  title,
  body,
  cta,
  ctaHref,
}: {
  title: string;
  body: string;
  cta: string;
  ctaHref: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-silver-200 bg-white">
      <div className="relative h-40 bg-gradient-to-br from-brand-900 via-ink-800 to-brand-700 sm:h-48">
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
            Coming Soon
          </p>
          <p className="mt-2 text-xl font-extrabold text-white sm:text-2xl">{title}</p>
        </div>
      </div>
      <div className="p-8 text-center">
        <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-600">{body}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href={ctaHref} variant="primary" size="md">
            {cta}
          </ButtonLink>
          <ButtonLink href="/dang-ky/moi-gioi" variant="brand" size="md">
            Đăng tin cho thuê
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-800 hover:bg-brand-200"
    >
      {label} ×
    </Link>
  );
}

function PageLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
    >
      {label}
    </Link>
  );
}

/** JSON-LD ItemList cho trang danh sách tin. */
export function buildListingListJsonLd(
  siteUrl: string,
  path: string,
  title: string,
  items: { code: string; propertyType: string; district: string; province?: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    url: `${siteUrl}${path}`,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 20).map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteUrl}/tin-dang/${item.code}`,
      name: `${propertyTypeLabel(item.propertyType)} tại ${item.district}${item.province ? `, ${item.province}` : ""}`,
    })),
  };
}

export { propertyTypeToSlug };
