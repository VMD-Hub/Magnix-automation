import Link from "next/link";
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import {
  PROJECT_STATUS_LABEL,
  PROJECT_TYPE_LABEL,
  formatVnd,
} from "@/lib/format";

export type ProjectCardData = {
  slug: string;
  name: string;
  projectType: string;
  status: string;
  province: string;
  district: string;
  developerName?: string | null;
  priceFrom?: number | string | null;
  listingCount?: number;
  imageUrl?: string | null;
};

function Placeholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-700 to-ink-900 text-white/20">
      <Icon.Building className="text-6xl" />
    </div>
  );
}

export function ProjectCard({ item }: { item: ProjectCardData }) {
  const priceFrom = formatVnd(item.priceFrom ?? null);

  return (
    <Link
      href={`/du-an/${item.slug}`}
      className="proptech-card group flex flex-col overflow-hidden p-0 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Placeholder />
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge tone="neutral">
            {PROJECT_STATUS_LABEL[item.status] ?? item.status}
          </Badge>
          {item.projectType === "NHA_O_XA_HOI" ? (
            <Badge tone="success">
              {PROJECT_TYPE_LABEL[item.projectType]}
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-base font-bold text-slate-900 group-hover:text-brand-700">
          {item.name}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <Icon.MapPin className="text-sm shrink-0" />
          {item.district}, {item.province}
        </p>

        {item.developerName ? (
          <p className="mt-2 text-xs text-slate-500">
            CĐT: <span className="font-medium text-slate-700">{item.developerName}</span>
          </p>
        ) : null}

        <div className="mt-3 flex items-center justify-between border-t border-silver-100 pt-3">
          <div>
            <p className="text-[11px] text-[#888888]">Giá từ</p>
            <p className="text-base font-bold text-brand-700">
              {priceFrom ?? "Liên hệ"}
            </p>
          </div>
          {item.listingCount ? (
            <span className="text-xs text-slate-500">
              {item.listingCount} tin đang bán
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
