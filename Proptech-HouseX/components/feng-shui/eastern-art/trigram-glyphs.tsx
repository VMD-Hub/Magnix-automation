import { EASTERN } from "@/components/feng-shui/eastern-art/eastern-palette";

type TrigramId =
  | "qian"
  | "kun"
  | "kan"
  | "li"
  | "zhen"
  | "xun"
  | "gen"
  | "dui";

/** Ba hào quái — yin (đứt) / yang (liền). */
export function TrigramLines({
  pattern,
  x,
  y,
  size = 14,
  stroke = EASTERN.goldLight,
}: {
  pattern: [boolean, boolean, boolean];
  x: number;
  y: number;
  size?: number;
  stroke?: string;
}) {
  const gap = size * 0.35;
  const barH = size * 0.12;
  const barW = size * 0.9;
  const halfW = barW * 0.42;

  return (
    <g transform={`translate(${x - barW / 2}, ${y - size / 2})`}>
      {pattern.map((yang, i) => {
        const cy = i * gap;
        if (yang) {
          return (
            <rect
              key={i}
              x={0}
              y={cy}
              width={barW}
              height={barH}
              fill={stroke}
              rx={0.5}
            />
          );
        }
        return (
          <g key={i}>
            <rect x={0} y={cy} width={halfW} height={barH} fill={stroke} rx={0.5} />
            <rect
              x={barW - halfW}
              y={cy}
              width={halfW}
              height={barH}
              fill={stroke}
              rx={0.5}
            />
          </g>
        );
      })}
    </g>
  );
}

const TRIGRAM_PATTERNS: Record<TrigramId, [boolean, boolean, boolean]> = {
  qian: [true, true, true],
  kun: [false, false, false],
  kan: [false, true, false],
  li: [true, false, true],
  zhen: [false, false, true],
  xun: [true, true, false],
  gen: [true, false, false],
  dui: [false, true, true],
};

const OCTAGON_TRIGRAMS: { id: TrigramId; angle: number }[] = [
  { id: "kan", angle: 0 },
  { id: "gen", angle: 45 },
  { id: "zhen", angle: 90 },
  { id: "xun", angle: 135 },
  { id: "li", angle: 180 },
  { id: "kun", angle: 225 },
  { id: "dui", angle: 270 },
  { id: "qian", angle: 315 },
];

export function TrigramRing({
  cx,
  cy,
  radius,
  glyphSize = 12,
  stroke = EASTERN.goldLight,
}: {
  cx: number;
  cy: number;
  radius: number;
  glyphSize?: number;
  stroke?: string;
}) {
  return (
    <g>
      {OCTAGON_TRIGRAMS.map(({ id, angle }) => {
        const rad = ((angle - 90) * Math.PI) / 180;
        const x = cx + Math.cos(rad) * radius;
        const y = cy + Math.sin(rad) * radius;
        return (
          <TrigramLines
            key={id}
            pattern={TRIGRAM_PATTERNS[id]}
            x={x}
            y={y}
            size={glyphSize}
            stroke={stroke}
          />
        );
      })}
    </g>
  );
}

export function YinYang({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={EASTERN.goldLight} opacity={0.95} />
      <path
        d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${r / 2} ${r / 2} 0 0 0 ${cx} ${cy} A ${r / 2} ${r / 2} 0 0 1 ${cx} ${cy - r} Z`}
        fill={EASTERN.ink}
      />
      <path
        d={`M ${cx} ${cy} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${r / 2} ${r / 2} 0 0 1 ${cx} ${cy} A ${r / 2} ${r / 2} 0 0 0 ${cx} ${cy - r} Z`}
        fill={EASTERN.goldLight}
      />
      <circle cx={cx} cy={cy - r / 2} r={r * 0.12} fill={EASTERN.ink} />
      <circle cx={cx} cy={cy + r / 2} r={r * 0.12} fill={EASTERN.goldLight} />
    </g>
  );
}

/** Hán tự phương vị — gợi la bàn cổ. */
export function DirectionHan({
  cx,
  cy,
  radius,
  opacity = 0.55,
}: {
  cx: number;
  cy: number;
  radius: number;
  opacity?: number;
}) {
  const dirs: { char: string; angle: number }[] = [
    { char: "北", angle: -90 },
    { char: "東", angle: 0 },
    { char: "南", angle: 90 },
    { char: "西", angle: 180 },
  ];
  return (
    <g fill={EASTERN.gold} opacity={opacity} fontSize={radius * 0.14} fontFamily="serif">
      {dirs.map(({ char, angle }) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <text
            key={char}
            x={cx + Math.cos(rad) * radius}
            y={cy + Math.sin(rad) * radius}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {char}
          </text>
        );
      })}
    </g>
  );
}
