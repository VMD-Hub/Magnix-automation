import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type Variant = "primary" | "brand" | "zalo" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-[box-shadow,transform,background-color,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  /** CTA vàng kim — nền đồng nhất, chữ trắng, bevel viền (.lux-gold-cta) */
  primary:
    "lux-gold-cta bg-gold-500 text-white hover:text-white active:text-white",
  /** Nút thương hiệu đỏ Ruby — 30% palette */
  brand: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/20",
  zalo: "bg-[#0068ff] text-white hover:bg-[#0055d6]",
  outline: "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface-muted)]",
  ghost: "text-[var(--muted)] hover:bg-[var(--surface-muted)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
