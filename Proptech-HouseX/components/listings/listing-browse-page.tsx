import Link from "next/link";
import { ListingCard } from "@/components/listings/listing-card";
import {
  PROPERTY_TYPE_FILTER_OPTIONS,
  RENT_PROPERTY_TYPE_FILTER_OPTIONS,
  propertyTypeToSlug,
} from "@/lib/content/property-type-slug";
import { propertyTypeLabel } from "@/lib/format";
import { cn } from "@/lib/ui/cn";

const HCM_DISTRICTS = [
  "Quận 1",
  "Quận 2",
  "Quận 7",
  "Quận 9",
  "Bình Thạnh",
  "Thủ Đức",
  "Gò Vấp",
  "Tân Bình",
  "Nhà Bè",
  "Bình Chánh",
];

type Props = {
  basePath: "/mua-ban" | "/cho-thue";
  title: string;
  subtitle: string;
  items: React.ComponentProps<typeof ListingCard>["item"][];
  pagination: { page: number; totalPages: number; total: number };
  filters: {
    district?: string;
    propertyType?: string;
    propertyTypeSlug?: string;
  };
};

function buildHref(
  basePath: string,
  current: Props["filters"],
  patch: Partial<Props["filters"] & { page?: number }>,
) {
  const next = { ...current, ...patch };
  const q = new URLSearchParams();
  if (next.district) q.set("district", next.district);
  if (next.propertyTypeSlug) q.set("propertyType", next.propertyTypeSlug);
  if (patch.page && patch.page > 1) q.set("page", String(patch.page));
  const qs = q.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function ListingBrowsePage({
  basePath,
  title,
  subtitle,
  items,
  pagination,
  filters,
}: Props) {
  const activeDistrict = filters.district;
  const activeSlug = filters.propertyTypeSlug;
  const typeOptions =
    basePath === "/cho-thue"
      ? RENT_PROPERTY_TYPE_FILTER_OPTIONS
      : PROPERTY_TYPE_FILTER_OPTIONS;

  return (
    <div className="mx-auto max-w-7xl py-8 container-px">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-600">{subtitle}</p>
        <p className="mt-1 text-sm text-slate-500">
          {pagination.total > 0
            ? `${pagination.total.toLocaleString("vi-VN")} tin đang hiển thị`
            : "Chưa có tin phù hợp"}
        </p>
      </header>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="shrink-0 lg:w-56">
          <FilterBlock title="Khu vực (TP.HCM)">
            <Link
              href={buildHref(basePath, filters, { district: undefined, page: 1 })}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm",
                !activeDistrict
                  ? "bg-brand-50 font-semibold text-brand-800"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              Tất cả
            </Link>
            {HCM_DISTRICTS.map((d) => (
              <Link
                key={d}
                href={buildHref(basePath, filters, { district: d, page: 1 })}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm",
                  activeDistrict === d
                    ? "bg-brand-50 font-semibold text-brand-800"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                {d}
              </Link>
            ))}
          </FilterBlock>

          <FilterBlock title="Loại hình">
            <Link
              href={buildHref(basePath, filters, {
                propertyTypeSlug: undefined,
                page: 1,
              })}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm",
                !activeSlug
                  ? "bg-brand-50 font-semibold text-brand-800"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              Tất cả
            </Link>
            {typeOptions.map((t) => (
              <Link
                key={t.slug}
                href={buildHref(basePath, filters, {
                  propertyTypeSlug: t.slug,
                  page: 1,
                })}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm",
                  activeSlug === t.slug
                    ? "bg-brand-50 font-semibold text-brand-800"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                {t.label}
              </Link>
            ))}
          </FilterBlock>
        </aside>

        <div className="min-w-0 flex-1">
          {(activeDistrict || filters.propertyType) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {activeDistrict ? (
                <FilterChip
                  label={activeDistrict}
                  href={buildHref(basePath, filters, { district: undefined, page: 1 })}
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
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <ListingCard key={item.code} item={item} />
              ))}
            </div>
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
    </div>
  );
}

function FilterBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      <div className="mt-2 space-y-0.5">{children}</div>
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
  items: { code: string; propertyType: string; district: string }[],
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
      name: `${propertyTypeLabel(item.propertyType)} tại ${item.district}`,
    })),
  };
}

export { propertyTypeToSlug };
