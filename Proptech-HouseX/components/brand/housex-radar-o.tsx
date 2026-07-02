import { useId } from "react";
import { cn } from "@/lib/ui/cn";
import {
  HOUSEX_COLORS,
  RADAR_O_ARC_OPACITY,
  RADAR_O_ARCS_LEFT,
  RADAR_O_ARCS_RIGHT,
  RADAR_O_CORE,
  RADAR_O_GRADIENT,
  RADAR_O_STROKE,
  RADAR_O_VIEWBOX,
} from "@/lib/brand/housex-mark.config";

type Props = {
  className?: string;
};

/** Chữ O = sóng rada gold — trong “HOUSE”. */
export function HouseXRadarO({ className }: Props) {
  const id = useId().replace(/:/g, "");
  const gradId = `${id}-radar-o`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={RADAR_O_VIEWBOX}
      fill="none"
      className={cn("inline-block shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient
          id={gradId}
          x1={RADAR_O_GRADIENT.x1}
          y1={RADAR_O_GRADIENT.y1}
          x2={RADAR_O_GRADIENT.x2}
          y2={RADAR_O_GRADIENT.y2}
        >
          {RADAR_O_GRADIENT.stops.map((stop) => (
            <stop
              key={stop.offset}
              offset={stop.offset}
              stopColor={stop.color}
            />
          ))}
        </linearGradient>
      </defs>

      {RADAR_O_ARCS_LEFT.map((d, i) => (
        <path
          key={`l-${i}`}
          d={d}
          stroke={HOUSEX_COLORS.gold}
          strokeWidth={RADAR_O_STROKE}
          strokeLinecap="round"
          fill="none"
          opacity={RADAR_O_ARC_OPACITY[i]}
        />
      ))}
      {RADAR_O_ARCS_RIGHT.map((d, i) => (
        <path
          key={`r-${i}`}
          d={d}
          stroke={HOUSEX_COLORS.gold}
          strokeWidth={RADAR_O_STROKE}
          strokeLinecap="round"
          fill="none"
          opacity={RADAR_O_ARC_OPACITY[i]}
        />
      ))}
      <circle
        cx={RADAR_O_CORE.cx}
        cy={RADAR_O_CORE.cy}
        r={RADAR_O_CORE.r}
        fill={`url(#${gradId})`}
      />
    </svg>
  );
}
