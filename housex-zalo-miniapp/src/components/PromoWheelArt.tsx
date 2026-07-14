/**
 * Vòng quay trang trí — màu tier khớp lucky-wheel House X (SPECIAL/FIRST/…).
 * Dùng trên PromoTeaser; không quay thật (chỉ CSS idle spin nhẹ).
 */

const CX = 100;
const CY = 100;
const R = 94;

/** Layout 12 ô giống seed mặc định (màu tier). */
const SEGMENTS: { fill: string; stroke: string; label: string; text: string }[] = [
  { fill: "#e2e8f0", stroke: "#64748b", text: "#334155", label: "May mắn" },
  { fill: "#0d9488", stroke: "#115e59", text: "#ecfdf5", label: "500k" },
  { fill: "#e2e8f0", stroke: "#64748b", text: "#334155", label: "May mắn" },
  { fill: "#2563eb", stroke: "#1e3a8a", text: "#eff6ff", label: "1:1" },
  { fill: "#0d9488", stroke: "#115e59", text: "#ecfdf5", label: "500k" },
  { fill: "#facc15", stroke: "#a16207", text: "#422006", label: "Nồi" },
  { fill: "#e2e8f0", stroke: "#64748b", text: "#334155", label: "May mắn" },
  { fill: "#2563eb", stroke: "#1e3a8a", text: "#eff6ff", label: "1:1" },
  { fill: "#0d9488", stroke: "#115e59", text: "#ecfdf5", label: "500k" },
  { fill: "#14532d", stroke: "#052e16", text: "#dcfce7", label: "Bếp" },
  { fill: "#2563eb", stroke: "#1e3a8a", text: "#eff6ff", label: "1:1" },
  { fill: "#9b111e", stroke: "#3d070c", text: "#fcd34d", label: "Tủ lạnh" },
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
  const n = SEGMENTS.length;
  const angle = 360 / n;

  return (
    <svg
      className="promo-wheel-svg"
      viewBox="0 0 200 220"
      role="img"
      aria-label="Vòng quay may mắn House X"
    >
      {/* Pointer */}
      <polygon points="100,6 112,28 88,28" fill="#5c0b12" stroke="#fcd34d" strokeWidth="1.2" />
      <g transform="translate(0, 12)">
        <g className="promo-wheel-disc">
          <circle cx={CX} cy={CY} r={R + 3} fill="#3d070c" />
          <circle cx={CX} cy={CY} r={R + 1} fill="none" stroke="#fcd34d" strokeWidth="2.5" />
          {SEGMENTS.map((seg, i) => {
            const mid = i * angle - 90 + angle / 2;
            const lab = polar(CX, CY, 62, mid);
            return (
              <g key={i}>
                <path d={slicePath(i, n)} fill={seg.fill} stroke={seg.stroke} strokeWidth="1.4" />
                <text
                  x={lab.x}
                  y={lab.y}
                  fill={seg.text}
                  fontSize={seg.label.length > 5 ? 7 : 8}
                  fontWeight={800}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${mid}, ${lab.x}, ${lab.y})`}
                >
                  {seg.label}
                </text>
              </g>
            );
          })}
          <circle cx={CX} cy={CY} r={22} fill="#7a0e18" stroke="#fcd34d" strokeWidth="3" />
          <circle cx={CX} cy={CY} r={14} fill="#9b111e" />
          <text
            x={CX}
            y={CY + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fcd34d"
            fontSize="9"
            fontWeight={900}
          >
            X
          </text>
        </g>
      </g>
    </svg>
  );
}
