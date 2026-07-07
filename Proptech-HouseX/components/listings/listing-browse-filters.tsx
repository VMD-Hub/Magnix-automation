"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import type { ListingBrowseProvince } from "@/lib/content/listing-browse-locations";
import { cn } from "@/lib/ui/cn";

type TypeOption = { slug: string; label: string };

type LocationFilters = {
  provinceSlug?: string;
  district?: string;
  propertyTypeSlug?: string;
};

type Props = {
  basePath: "/mua-ban" | "/cho-thue";
  provinces: readonly ListingBrowseProvince[];
  typeOptions: readonly TypeOption[];
  activeProvinceSlug?: string;
  activeDistrict?: string;
  activeTypeSlug?: string;
  className?: string;
};

function buildFilterHref(basePath: string, filters: LocationFilters) {
  const q = new URLSearchParams();
  if (filters.provinceSlug) q.set("province", filters.provinceSlug);
  if (filters.district) q.set("district", filters.district);
  if (filters.propertyTypeSlug) q.set("propertyType", filters.propertyTypeSlug);
  const qs = q.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

const selectClass = "catalog-filter-select";

export function ListingBrowseFilters({
  basePath,
  provinces,
  typeOptions,
  activeProvinceSlug,
  activeDistrict,
  activeTypeSlug,
  className,
}: Props) {
  const router = useRouter();

  const activeProvince = useMemo(
    () => provinces.find((p) => p.slug === activeProvinceSlug),
    [provinces, activeProvinceSlug],
  );

  const districtOptions = activeProvince?.districts ?? [];
  const districtGroups = activeProvince?.districtGroups;

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-3xl",
        className,
      )}
    >
      <label className="relative block min-w-0">
        <span className="mb-1 block text-xs font-semibold text-slate-500">
          Tỉnh / thành phố
        </span>
        <select
          value={activeProvinceSlug ?? ""}
          onChange={(e) => {
            const provinceSlug = e.target.value || undefined;
            router.push(
              buildFilterHref(basePath, {
                provinceSlug,
                district: undefined,
                propertyTypeSlug: activeTypeSlug,
              }),
            );
          }}
          className={selectClass}
          aria-label="Lọc theo tỉnh thành"
        >
          <option value="">Tất cả tỉnh/thành</option>
          {provinces.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.label}
            </option>
          ))}
        </select>
        <Icon.ChevronDown
          className="pointer-events-none absolute bottom-2.5 right-3 text-base text-slate-400"
          aria-hidden
        />
      </label>

      <label className="relative block min-w-0">
        <span className="mb-1 block text-xs font-semibold text-slate-500">
          Quận / huyện / phường
        </span>
        <select
          value={activeDistrict ?? ""}
          disabled={!activeProvinceSlug}
          onChange={(e) =>
            router.push(
              buildFilterHref(basePath, {
                provinceSlug: activeProvinceSlug,
                district: e.target.value || undefined,
                propertyTypeSlug: activeTypeSlug,
              }),
            )
          }
          className={cn(selectClass, !activeProvinceSlug && "opacity-60")}
          aria-label="Lọc theo quận huyện phường"
        >
          <option value="">
            {activeProvinceSlug ? `Tất cả ${activeProvince?.label ?? ""}` : "Chọn tỉnh trước"}
          </option>
          {districtGroups && districtGroups.length > 0
            ? districtGroups.map((group) => (
                <optgroup key={group.id} label={group.label}>
                  {group.districts.map((d) => (
                    <option key={`${group.id}-${d}`} value={d}>
                      {d}
                    </option>
                  ))}
                </optgroup>
              ))
            : districtOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
        </select>
        <Icon.ChevronDown
          className="pointer-events-none absolute bottom-2.5 right-3 text-base text-slate-400"
          aria-hidden
        />
      </label>

      <label className="relative block min-w-0 sm:col-span-2 lg:col-span-1">
        <span className="mb-1 block text-xs font-semibold text-slate-500">
          Loại hình
        </span>
        <select
          value={activeTypeSlug ?? ""}
          onChange={(e) =>
            router.push(
              buildFilterHref(basePath, {
                provinceSlug: activeProvinceSlug,
                district: activeDistrict,
                propertyTypeSlug: e.target.value || undefined,
              }),
            )
          }
          className={selectClass}
          aria-label="Lọc theo loại hình"
        >
          <option value="">Tất cả loại hình</option>
          {typeOptions.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.label}
            </option>
          ))}
        </select>
        <Icon.ChevronDown
          className="pointer-events-none absolute bottom-2.5 right-3 text-base text-slate-400"
          aria-hidden
        />
      </label>
    </div>
  );
}

export { buildFilterHref as buildListingBrowseFilterHref };
