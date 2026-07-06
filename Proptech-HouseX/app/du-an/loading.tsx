import {
  CatalogBannerSkeleton,
  CatalogGridSkeleton,
} from "@/components/ui/catalog-page-skeleton";

export default function DuAnLoading() {
  return (
    <div
      className="proptech-section-glow mx-auto max-w-7xl py-8 container-px"
      aria-busy="true"
      aria-label="Đang tải danh mục dự án"
    >
      <CatalogBannerSkeleton />
      <div className="mb-6 flex flex-wrap gap-2">
        <div className="h-9 w-20 animate-pulse rounded-xl bg-slate-200/80" />
        <div className="h-9 w-28 animate-pulse rounded-xl bg-slate-200/80" />
        <div className="h-9 w-32 animate-pulse rounded-xl bg-slate-200/80" />
      </div>
      <CatalogGridSkeleton count={6} />
    </div>
  );
}
