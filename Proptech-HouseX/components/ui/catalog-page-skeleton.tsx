import { cn } from "@/lib/ui/cn";

function Pulse({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-slate-200/80", className)} />;
}

/** Skeleton banner — tỷ lệ catalog /du-an. */
export function CatalogBannerSkeleton({ className }: { className?: string }) {
  return (
    <Pulse className={cn("mb-6 h-[220px] w-full rounded-2xl sm:h-[250px] lg:h-[260px]", className)} />
  );
}

/** Skeleton lưới thẻ dự án / tin. */
export function CatalogGridSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }, (_, i) => (
        <article
          key={i}
          className="overflow-hidden rounded-2xl border border-silver-200 bg-white shadow-sm"
        >
          <Pulse className="aspect-[16/10] w-full rounded-none" />
          <div className="space-y-3 p-4">
            <Pulse className="h-5 w-3/4" />
            <Pulse className="h-4 w-1/2" />
            <Pulse className="h-4 w-2/3" />
          </div>
        </article>
      ))}
    </div>
  );
}

/** Skeleton hub công cụ — hero + vài hàng thẻ. */
export function ToolsHubSkeleton() {
  return (
    <>
      <Pulse className="mb-8 h-[240px] w-full rounded-2xl sm:h-[260px] lg:h-[280px]" />
      <div className="mb-5 space-y-2">
        <Pulse className="h-7 w-48" />
        <Pulse className="h-4 w-full max-w-xl" />
      </div>
      <CatalogGridSkeleton count={6} />
    </>
  );
}
