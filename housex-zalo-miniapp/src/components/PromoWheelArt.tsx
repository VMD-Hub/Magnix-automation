/**
 * Vòng quay trang trí — màu tier khớp lucky-wheel House X.
 * Chỉ wedge + hub (không chữ trên ô) — ổn định trên WebView Zalo.
 */

const CX = 100;
const CY = 100;
const R = 94;

/** Layout 12 ô màu giống seed mặc định. */
const FILLS = [
  "#e2e8f0",
  "#0d9488",
  "#e2e8f0",
  "#2563eb",
  "#0d9488",
  "#facc15",
  "#e2e8f0",
  "#2563eb",
  "#0d9488",
  "#14532d",
  "#2563eb",
  "#9b111e",
];

const STROKES = [
  "#64748b",
  "#115e59",
  "#64748b",
  "#1e3a8a",
  "#115e59",
  "#a16207",
  "#64748b",
  "#1e3a8a",
  "#115e59",
  "#052e16",
  "#1e3a8a",
  "#3d070c",
];

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function slicePath(index: number, count: number): string {
  const angle = 360 / count;
  const start = index * angle - 90;
  const end = start + angle;
  const a = polar(CX, CY, R, start);
  const b = polar(CX, CY, R, end);
  return `M ${CX} ${CY} L ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y} Z`;
}

export function PromoWheelArt() {
  const n = FILLS.length;

  return (
    <svg
      className="promo-wheel-svg"
      viewBox="0 0 200 220"
      role="img"
      aria-label="Vòng quay may mắn House X"
    >
      <polygon
        points="100,6 114,30 86,30"
        fill="#fcd34d"
        stroke="#5c0b12"
        strokeWidth="2"
      />
      <g transform="translate(0, 12)">
        <g className="promo-wheel-disc">
          <circle cx={CX} cy={CY} r={R + 4} fill="#3d070c" />
          <circle
            cx={CX}
            cy={CY}
            r={R + 2}
            fill="none"
            stroke="#fcd34d"
            strokeWidth="3"
          />
          {FILLS.map((fill, i) => (
            <path
              key={i}
              d={slicePath(i, n)}
              fill={fill}
              stroke={STROKES[i]}
              strokeWidth="1.5"
            />
          ))}
          <circle cx={CX} cy={CY} r={26} fill="#7a0e18" stroke="#fcd34d" strokeWidth="4" />
          <circle cx={CX} cy={CY} r={16} fill="#9b111e" />
          <text
            x={CX}
            y={CY + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fcd34d"
            fontSize="14"
            fontWeight={900}
            fontFamily="system-ui, sans-serif"
          >
            X
          </text>
        </g>
      </g>
    </svg>
  );
}
