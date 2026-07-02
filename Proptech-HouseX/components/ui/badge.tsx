import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type Tone = "brand" | "neutral" | "dark" | "success";

const tones: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700 ring-1 ring-brand-200",
  neutral: "bg-white/90 text-slate-700 ring-1 ring-slate-200 backdrop-blur",
  dark: "bg-ink-900/80 text-white backdrop-blur",
  success: "bg-wood-500/10 text-wood-600 ring-1 ring-wood-500/20",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
