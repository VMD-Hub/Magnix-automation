import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type Props = {
  kicker?: string;
  title: string;
  subtitle?: string;
  className?: string;
  children?: ReactNode;
};

/** Header trang catalog — ruby wash + accent vàng. */
export function LuxPageHeader({
  kicker,
  title,
  subtitle,
  className,
  children,
}: Props) {
  return (
    <header
      className={cn(
        "proptech-ruby-page-header proptech-section-glow mb-8 p-6 sm:p-8",
        className,
      )}
    >
      {kicker ? <p className="proptech-kicker">{kicker}</p> : null}
      <h1 className={cn("lux-heading-accent text-3xl font-extrabold", kicker && "mt-2")}>
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#666666]">
          {subtitle}
        </p>
      ) : null}
      {children}
    </header>
  );
}
