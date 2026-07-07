import type { ReactNode } from "react";
import { RubySurfaceOrnament } from "@/components/brand/ruby-surface-ornament";
import { cn } from "@/lib/ui/cn";

type Props = {
  children: ReactNode;
  className?: string;
  /** Tailwind max-width, ví dụ `max-w-6xl`. */
  maxWidth?: string;
};

/** Vỏ trang catalog — glow ruby + ornament góc, dùng Mua bán / Cho thuê / Dự án / Khuyến mãi… */
export function CatalogPageShell({
  children,
  className,
  maxWidth = "max-w-7xl",
}: Props) {
  return (
    <div
      className={cn(
        "proptech-catalog-page proptech-section-glow mx-auto py-8 container-px",
        maxWidth,
        className,
      )}
    >
      <RubySurfaceOrnament variant="page" />
      <div className="proptech-catalog-page__content">{children}</div>
    </div>
  );
}
