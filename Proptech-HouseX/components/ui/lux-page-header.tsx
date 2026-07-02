import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type Props = {
  kicker?: string;
  title: string;
  subtitle?: string;
  className?: string;
  children?: ReactNode;
};

/** Header trang catalog — ruby heading + glow Kim. */
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
        "proptech-section-glow mb-8 rounded-2xl border border-silver-200 bg-white/75 p-6 backdrop-blur-sm sm:p-8",
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
