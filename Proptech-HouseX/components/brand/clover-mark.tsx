import { useId } from "react";
import { cn } from "@/lib/ui/cn";
import {
  CLOVER_CENTER,
  CLOVER_VIEWBOX,
  cloverLayerOpacity,
  cloverPathLayers,
  cloverStrokeWidth,
  type CloverStrokeLayer,
} from "@/lib/brand/clover-mark.config";
import { cloverMarkGradientIds } from "@/lib/brand/clover-mark-svg";

function CloverMarkDefs({ idPrefix }: { idPrefix: string }) {
  const { body, highlight } = cloverMarkGradientIds(idPrefix);
  const filterId = `${idPrefix}-lux`;

  return (
    <defs>
      <linearGradient id={body} x1="8%" y1="0%" x2="92%" y2="100%">
        <stop offset="0%" stopColor="#fffef5" />
        <stop offset="12%" stopColor="#ffe566" />
        <stop offset="38%" stopColor="#daa520" />
        <stop offset="62%" stopColor="#c8941a" />
        <stop offset="85%" stopColor="#96700a" />
        <stop offset="100%" stopColor="#5c3d08" />
      </linearGradient>
      <linearGradient id={highlight} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="35%" stopColor="#fff8dc" />
        <stop offset="70%" stopColor="#ffe566" />
        <stop offset="100%" stopColor="#daa520" />
      </linearGradient>
      <filter
        id={filterId}
        x="-35%"
        y="-35%"
        width="170%"
        height="170%"
        colorInterpolationFilters="sRGB"
      >
        <feDropShadow
          dx="0"
          dy="1.1"
          stdDeviation="0.55"
          floodColor="#1a1004"
          floodOpacity="0.7"
        />
        <feDropShadow
          dx="-0.35"
          dy="-0.65"
          stdDeviation="0.22"
          floodColor="#fffef5"
          floodOpacity="0.62"
        />
        <feDropShadow
          dx="0.45"
          dy="-0.15"
          stdDeviation="0.18"
          floodColor="#ffe566"
          floodOpacity="0.38"
        />
      </filter>
    </defs>
  );
}

function strokeForLayer(
  layer: CloverStrokeLayer,
  ids: ReturnType<typeof cloverMarkGradientIds>,
): string {
  if (layer === "shadow") return "#2a1a04";
  if (layer === "body") return `url(#${ids.body})`;
  return `url(#${ids.highlight})`;
}

export function CloverMarkGraphics({
  idPrefix,
  filter = true,
}: {
  idPrefix: string;
  filter?: boolean;
}) {
  const ids = cloverMarkGradientIds(idPrefix);
  const filterId = `${idPrefix}-lux`;

  return (
    <g
      transform={`translate(${CLOVER_CENTER.x} ${CLOVER_CENTER.y})`}
      filter={filter ? `url(#${filterId})` : undefined}
    >
      {cloverPathLayers().map((item, i) => {
        const transforms: string[] = [];
        if (item.rotate != null) transforms.push(`rotate(${item.rotate})`);
        if (item.offsetY != null) transforms.push(`translate(0 ${item.offsetY})`);

        return (
          <path
            key={`${item.layer}-${item.rotate ?? "stem"}-${i}`}
            d={item.d}
            fill="none"
            stroke={strokeForLayer(item.layer, ids)}
            strokeWidth={cloverStrokeWidth(item.layer)}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={cloverLayerOpacity(item.layer)}
            transform={transforms.length ? transforms.join(" ") : undefined}
          />
        );
      })}
    </g>
  );
}

type CloverMarkProps = {
  className?: string;
  withBackground?: boolean;
  filter?: boolean;
};

/**
 * Cỏ bốn lá vàng kim — sản phẩm luxury wire (Kim), 3 lớp shadow/body/highlight.
 */
export function CloverMark({
  className,
  withBackground = false,
  filter = true,
}: CloverMarkProps) {
  const uid = useId().replace(/:/g, "");
  const idPrefix = `clover-mark-${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={CLOVER_VIEWBOX}
      fill="none"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <CloverMarkDefs idPrefix={idPrefix} />
      {withBackground ? (
        <rect width="48" height="48" rx="10" fill="#1a1214" />
      ) : null}
      <CloverMarkGraphics idPrefix={idPrefix} filter={filter} />
    </svg>
  );
}
