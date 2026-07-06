import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

/** Vòng la bàn xoay quanh tâm — dùng với `.group:hover` trên ancestor. */
export function LuoPanSpinLayer({
  cx,
  cy,
  interactive,
  children,
  className,
}: {
  cx: number;
  cy: number;
  interactive?: boolean;
  children: ReactNode;
  className?: string;
}) {
  if (!interactive) {
    return <g className={className}>{children}</g>;
  }

  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g className={cn("luo-pan-disc-spin", className)}>
        <g transform={`translate(${-cx} ${-cy})`}>{children}</g>
      </g>
    </g>
  );
}
