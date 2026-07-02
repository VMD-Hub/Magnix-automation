import Link from "next/link";
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import {
  TRANSACTION_TYPE_LABEL,
  formatPricePerM2,
  formatVnd,
  propertyTypeLabel,
} from "@/lib/format";

export type ListingCardData = {
  code: string;
  title?: string | null;
  propertyType: string;
  transactionType: string;
  price: number | string;
  area?: number | null;
  province: string;
  district: string;
  verified?: boolean;
  hasVideo?: boolean;
  photoCount?: number;
  imageUrl?: string | null;
  offerCount?: number; // tổng số tin cùng 1 BĐS (canonical)
};

function Placeholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-300">
      <Icon.Building className="text-5xl" />
    </div>
  );
}

export function ListingCard({ item }: { item: ListingCardData }) {
  const price = formatVnd(item.price);
  const perM2 = formatPricePerM2(item.price, item.area);
  const title =
    item.title?.trim() ||
    `${propertyTypeLabel(item.propertyType)} tại ${item.district}`;
  const otherBrokers = item.offerCount && item.offerCount > 1 ? item.offerCount - 1 : 0;

  return (
    <Link
      href={`/tin-dang/${item.code}`}
      className="proptech-card group flex flex-col overflow-hidden p-0 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Placeholder />
        )}

        <div className="absolute left-3 top-3 flex gap-2">
          {item.hasVideo ? (
            <Badge tone="dark">
              <Icon.Video className="text-sm" /> Video
            </Badge>
          ) : null}
        </div>
        {item.verified ? (
          <div className="absolute right-3 top-3">
            <Badge tone="brand">
              <Icon.BadgeCheck className="text-sm" /> Đã kiểm duyệt
            </Badge>
          </div>
        ) : null}
        <div className="absolute bottom-3 left-3">
          <Badge tone="neutral">
            {TRANSACTION_TYPE_LABEL[item.transactionType] ?? "Bán"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-brand-700">
            {price ?? "Thỏa thuận"}
          </span>
          {perM2 ? (
            <span className="text-xs font-medium text-slate-400">{perM2}</span>
          ) : null}
        </div>

        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-brand-700">
          {title}
        </h3>

        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <Icon.MapPin className="text-sm shrink-0" />
          <span className="line-clamp-1">
            {item.district}, {item.province}
          </span>
        </p>

        <div className="mt-3 flex items-center gap-4 border-t border-silver-100 pt-3 text-xs text-[#555555]">
          {item.area ? (
            <span className="inline-flex items-center gap-1">
              <Icon.Ruler className="text-sm" /> {item.area} m²
            </span>
          ) : null}
          {item.photoCount ? (
            <span className="inline-flex items-center gap-1 text-slate-400">
              {item.photoCount} ảnh
            </span>
          ) : null}
        </div>

        {otherBrokers > 0 ? (
          <p className="mt-2 inline-flex w-fit items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700">
            +{otherBrokers} môi giới khác cùng bán
          </p>
        ) : null}
      </div>
    </Link>
  );
}
