"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/ui/cn";

type TypeOption = { slug: string; label: string };

type Props = {
  basePath: "/mua-ban" | "/cho-thue";
  districts: readonly string[];
  typeOptions: readonly TypeOption[];
  activeDistrict?: string;
  activeTypeSlug?: string;
  className?: string;
};

function buildFilterHref(
  basePath: string,
  district?: string,
  propertyTypeSlug?: string,
) {
  const q = new URLSearchParams();
  if (district) q.set("district", district);
  if (propertyTypeSlug) q.set("propertyType", propertyTypeSlug);
  const qs = q.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

const selectClass =
  "h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm text-slate-700 outline-none transition-colors hover:border-brand-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export function ListingBrowseFilters({
  basePath,
  districts,
  typeOptions,
  activeDistrict,
  activeTypeSlug,
  className,
}: Props) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-xl",
        className,
      )}
    >
      <label className="relative block min-w-0">
        <span className="mb-1 block text-xs font-semibold text-slate-500">
          Khu vực (TP.HCM)
        </span>
        <select
          value={activeDistrict ?? ""}
          onChange={(e) =>
            router.push(
              buildFilterHref(
                basePath,
                e.target.value || undefined,
                activeTypeSlug,
              ),
            )
          }
          className={selectClass}
          aria-label="Lọc theo khu vực"
        >
          <option value="">Tất cả khu vực</option>
          {districts.map((d) => (
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

      <label className="relative block min-w-0">
        <span className="mb-1 block text-xs font-semibold text-slate-500">
          Loại hình
        </span>
        <select
          value={activeTypeSlug ?? ""}
          onChange={(e) =>
            router.push(
              buildFilterHref(
                basePath,
                activeDistrict,
                e.target.value || undefined,
              ),
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
