import { useId } from "react";
import { cn } from "@/lib/ui/cn";
import {
  CHROME_X_ARMS,
  CHROME_X_CAP_R,
  CHROME_X_GRADIENT,
  CHROME_X_GRADIENT_ON_DARK,
  CHROME_X_HIGHLIGHT,
  CHROME_X_STROKE,
  CHROME_X_TIPS,
  CHROME_X_VIEWBOX,
  HOUSEX_COLORS,
} from "@/lib/brand/housex-mark.config";

type Props = {
  className?: string;
  variant?: "default" | "onDark";
  "aria-hidden"?: boolean;
};

/** Chữ X gold 3D — metallic vàng. */
export function HouseXChromeX({
  className,
  variant = "default",
  "aria-hidden": ariaHidden = true,
}: Props) {
  const id = useId().replace(/:/g, "");
  const goldId = `${id}-gold-x`;
  const hiId = `${id}-hi`;
  const depthId = `${id}-depth`;
  const isDark = variant === "onDark";
  const xGradient = isDark ? CHROME_X_GRADIENT_ON_DARK : CHROME_X_GRADIENT;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={CHROME_X_VIEWBOX}
      fill="none"
      className={cn("inline-block shrink-0 brand-gold-x", className)}
      aria-hidden={ariaHidden}
    >
      <defs>
        <linearGradient
          id={goldId}
          x1={xGradient.x1}
          y1={xGradient.y1}
          x2={xGradient.x2}
          y2={xGradient.y2}
        >
          {xGradient.stops.map((stop) => (
            <stop
              key={stop.offset}
              offset={stop.offset}
              stopColor={stop.color}
            />
          ))}
        </linearGradient>
        <linearGradient
          id={hiId}
          x1={CHROME_X_HIGHLIGHT.x1}
          y1={CHROME_X_HIGHLIGHT.y1}
          x2={CHROME_X_HIGHLIGHT.x2}
          y2={CHROME_X_HIGHLIGHT.y2}
        >
          {CHROME_X_HIGHLIGHT.stops.map((stop) => (
            <stop
              key={stop.offset}
              offset={stop.offset}
              stopColor={stop.color}
              stopOpacity={0.62}
            />
          ))}
        </linearGradient>
        <filter
          id={depthId}
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow
            dx="0"
            dy="2.2"
            stdDeviation="2.4"
            floodColor={HOUSEX_COLORS.xShadow}
            floodOpacity={isDark ? 0.65 : 0.38}
          />
          <feDropShadow
            dx="0"
            dy="-0.5"
            stdDeviation="0.7"
            floodColor="#ffffff"
            floodOpacity={isDark ? 0.28 : 0.55}
          />
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="1.2"
            floodColor={HOUSEX_COLORS.gold}
            floodOpacity={0.22}
          />
        </filter>
      </defs>

      <g filter={`url(#${depthId})`}>
        <g opacity="0.28" transform="translate(1, 1.4)">
          {CHROME_X_ARMS.map((arm) => (
            <line
              key={`sh-${arm.x1}`}
              x1={arm.x1}
              y1={arm.y1}
              x2={arm.x2}
              y2={arm.y2}
              stroke={HOUSEX_COLORS.xShadow}
              strokeWidth={CHROME_X_STROKE + 1}
              strokeLinecap="round"
            />
          ))}
        </g>

        {CHROME_X_TIPS.map(([cx, cy]) => (
          <circle
            key={`cap-${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={CHROME_X_CAP_R}
            fill={`url(#${goldId})`}
          />
        ))}

        {CHROME_X_ARMS.map((arm) => (
          <line
            key={`arm-${arm.x1}`}
            x1={arm.x1}
            y1={arm.y1}
            x2={arm.x2}
            y2={arm.y2}
            stroke={`url(#${goldId})`}
            strokeWidth={CHROME_X_STROKE}
            strokeLinecap="round"
          />
        ))}

        <ellipse
          cx={24}
          cy={21}
          rx={5}
          ry={2.8}
          fill={`url(#${hiId})`}
          opacity={0.45}
        />
      </g>
    </svg>
  );
}
