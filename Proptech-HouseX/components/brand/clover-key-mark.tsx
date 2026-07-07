import { useId } from "react";
import { cn } from "@/lib/ui/cn";
import {
  CLOVER_KEY_BIT_PATH,
  CLOVER_KEY_BOW_CENTER,
  CLOVER_KEY_GOLD_BODY,
  CLOVER_KEY_GOLD_HIGHLIGHT,
  CLOVER_KEY_HEART_LEAF,
  CLOVER_KEY_LEAF_ROTATIONS,
  CLOVER_KEY_LEAF_VEIN,
  CLOVER_KEY_SHADOW_COLOR,
  CLOVER_KEY_SHANK,
  CLOVER_KEY_SHANK_HATCH,
  CLOVER_KEY_STROKE,
  CLOVER_KEY_VIEWBOX,
} from "@/lib/brand/clover-key-mark.config";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  variant?: "default" | "onDark";
  filter?: boolean;
  "aria-hidden"?: boolean;
};

/**
 * Chìa khóa cỏ bốn lá vàng — biểu tượng thay chữ X (bản duyệt).
 */
export function CloverKeyMark({
  className,
  style,
  variant = "default",
  filter = true,
  "aria-hidden": ariaHidden = true,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const bodyId = `${uid}-key-body`;
  const hiId = `${uid}-key-hi`;
  const luxId = `${uid}-key-lux`;
  const isDark = variant === "onDark";
  const { x, y, width, height, rx } = CLOVER_KEY_SHANK;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={CLOVER_KEY_VIEWBOX}
      fill="none"
      aria-hidden={ariaHidden}
      className={cn("inline-block shrink-0", className)}
      style={style}
    >
      <defs>
        <linearGradient id={bodyId} x1="8%" y1="0%" x2="92%" y2="100%">
          {CLOVER_KEY_GOLD_BODY.stops.map((stop) => (
            <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
        <linearGradient id={hiId} x1="0%" y1="0%" x2="100%" y2="100%">
          {CLOVER_KEY_GOLD_HIGHLIGHT.stops.map((stop) => (
            <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
        <filter
          id={luxId}
          x="-30%"
          y="-20%"
          width="160%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow
            dx="0"
            dy="1.4"
            stdDeviation="0.9"
            floodColor={CLOVER_KEY_SHADOW_COLOR}
            floodOpacity={isDark ? 0.75 : 0.45}
          />
          <feDropShadow
            dx="-0.3"
            dy="-0.5"
            stdDeviation="0.25"
            floodColor="#fffef5"
            floodOpacity={isDark ? 0.35 : 0.55}
          />
          <feDropShadow
            dx="0.2"
            dy="0"
            stdDeviation="0.35"
            floodColor="#ffe566"
            floodOpacity={0.28}
          />
        </filter>
      </defs>

      <g filter={filter ? `url(#${luxId})` : undefined}>
        <g opacity="0.35" transform="translate(0.6 1)">
          {CLOVER_KEY_LEAF_ROTATIONS.map((deg) => (
            <path
              key={`sh-${deg}`}
              d={CLOVER_KEY_HEART_LEAF}
              transform={`translate(${CLOVER_KEY_BOW_CENTER.x} ${CLOVER_KEY_BOW_CENTER.y}) rotate(${deg})`}
              stroke={CLOVER_KEY_SHADOW_COLOR}
              strokeWidth={CLOVER_KEY_STROKE.leaf + 0.35}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </g>

        {CLOVER_KEY_LEAF_ROTATIONS.map((deg) => (
          <g
            key={`leaf-${deg}`}
            transform={`translate(${CLOVER_KEY_BOW_CENTER.x} ${CLOVER_KEY_BOW_CENTER.y}) rotate(${deg})`}
          >
            <path
              d={CLOVER_KEY_HEART_LEAF}
              stroke={`url(#${bodyId})`}
              strokeWidth={CLOVER_KEY_STROKE.leaf}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={CLOVER_KEY_LEAF_VEIN}
              stroke={`url(#${hiId})`}
              strokeWidth={CLOVER_KEY_STROKE.vein}
              strokeLinecap="round"
              opacity={0.75}
            />
            <path
              d="M-1.8-5.2 Q0-3.8 1.8-5.2"
              stroke={`url(#${hiId})`}
              strokeWidth={CLOVER_KEY_STROKE.vein * 0.85}
              strokeLinecap="round"
              opacity={0.5}
            />
          </g>
        ))}

        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={rx}
          stroke={`url(#${bodyId})`}
          strokeWidth={CLOVER_KEY_STROKE.shank}
        />
        {CLOVER_KEY_SHANK_HATCH.map((line, i) => (
          <line
            key={`hatch-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={`url(#${hiId})`}
            strokeWidth={CLOVER_KEY_STROKE.hatch}
            strokeLinecap="round"
            opacity={0.55}
          />
        ))}

        <path
          d={CLOVER_KEY_BIT_PATH}
          stroke={`url(#${bodyId})`}
          strokeWidth={CLOVER_KEY_STROKE.bit}
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
