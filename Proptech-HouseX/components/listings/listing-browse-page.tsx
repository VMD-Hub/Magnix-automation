import Link from "next/link";
import { RubyHolder } from "@/components/brand/ruby-holder";
import { ListingBrowseHero } from "@/components/listings/listing-browse-hero";
import { ListingCard } from "@/components/listings/listing-card";
import { ListingBrowseFilters } from "@/components/listings/listing-browse-filters";
import { CatalogPageShell } from "@/components/layout/catalog-page-shell";
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
  coverageNote?: string;
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
    <CatalogPageShell>
      <ListingBrowseHero
        kicker={banner.kicker}
        title={banner.title}
        subtitle={banner.subtitle}
      />

      {banner.badge ? (
        <div className="mb-6 flex justify-center">
          <span className="proptech-catalog-badge">{banner.badge}</span>
        </div>
      ) : null}

      {banner.coverageNote ? (
        <p className="mb-4 text-center text-xs leading-relaxed text-slate-500 sm:text-left">
          {banner.coverageNote}
        </p>
      ) : null}

      <div className="proptech-catalog-filters mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
          <div className="proptech-empty-state p-12 text-center">
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
    </CatalogPageShell>
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
    <RubyHolder className="overflow-hidden p-0">
      <div className="px-6 py-10 text-center sm:px-8 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
          Coming Soon
        </p>
        <p className="mt-2 text-xl font-extrabold text-white sm:text-2xl">{title}</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-silver-200">{body}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href={ctaHref} variant="primary" size="md">
            {cta}
          </ButtonLink>
          <ButtonLink href="/dang-ky/moi-gioi" variant="brand" size="md">
            Đăng tin cho thuê
          </ButtonLink>
        </div>
      </div>
    </RubyHolder>
  );
}

function FilterChip({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href} className="proptech-catalog-chip">
      {label} ×
    </Link>
  );
}

function PageLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="proptech-ruby-link-card px-4 py-2 text-sm font-medium text-slate-700">
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
