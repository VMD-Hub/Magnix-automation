import { EASTERN } from "@/components/feng-shui/eastern-art/eastern-palette";
import { TrigramLines } from "@/components/feng-shui/eastern-art/trigram-glyphs";
import {
  HEXAGRAM_64_LABELS,
  HEXAGRAM_64_LINES,
  TWENTY_FOUR_MOUNTAINS,
} from "@/lib/feng-shui/luo-pan-symbols";
import type { TrigramKey } from "@/lib/feng-shui/bat-trach";

const TRIGRAM_PATTERNS: Record<
  TrigramKey,
  [boolean, boolean, boolean]
> = {
  qian: [true, true, true],
  kun: [false, false, false],
  kan: [false, true, false],
  li: [true, false, true],
  zhen: [false, false, true],
  xun: [true, true, false],
  gen: [true, false, false],
  dui: [false, true, true],
};

const OCTAGON: { id: TrigramKey; angle: number }[] = [
  { id: "kan", angle: 0 },
  { id: "gen", angle: 45 },
  { id: "zhen", angle: 90 },
  { id: "xun", angle: 135 },
  { id: "li", angle: 180 },
  { id: "kun", angle: 225 },
  { id: "dui", angle: 270 },
  { id: "qian", angle: 315 },
];

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + Math.cos(rad) * r, y: cy + Math.sin(rad) * r };
}

/** Vòng 二十四山. */
export function TwentyFourMountainsRing({
  cx,
  cy,
  radius,
  detail = "full",
  uid = "m",
}: {
  cx: number;
  cy: number;
  radius: number;
  detail?: "full" | "compact";
  uid?: string;
}) {
  const step = 360 / 24;
  const fontSize = radius * (detail === "full" ? 0.11 : 0.09);
  const showEvery = detail === "full" ? 1 : 2;

  return (
    <g>
      {TWENTY_FOUR_MOUNTAINS.map((char, i) => {
        if (i % showEvery !== 0) {
          const a = i * step;
          const p1 = polar(cx, cy, radius - radius * 0.08, a);
          const p2 = polar(cx, cy, radius, a);
          return (
            <line
              key={`${uid}-t-${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={EASTERN.goldDim}
              strokeWidth={0.6}
              opacity={0.35}
            />
          );
        }
        const a = i * step + step / 2;
        const { x, y } = polar(cx, cy, radius, a);
        return (
          <text
            key={`${uid}-${char}-${i}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={EASTERN.goldLight}
            fontSize={fontSize}
            fontFamily="serif"
            opacity={0.85}
          >
            {char}
          </text>
        );
      })}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={EASTERN.gold}
        strokeWidth={1.2}
        opacity={0.75}
      />
    </g>
  );
}

/** Vòng 六十四卦 — hero: hào + nhãn; card: 64 chữ rút gọn. */
export function Hexagram64Ring({
  cx,
  cy,
  innerR,
  outerR,
  detail = "labels",
  uid = "h",
}: {
  cx: number;
  cy: number;
  innerR: number;
  outerR: number;
  detail?: "labels" | "labels-compact" | "ticks";
  uid?: string;
}) {
  const step = 360 / 64;
  const midR = (innerR + outerR) / 2;
  const ringW = outerR - innerR;

  return (
    <g>
      {HEXAGRAM_64_LINES.map((lines, i) => {
        const a = i * step + step / 2;
        const pIn = polar(cx, cy, innerR, a);
        const pOut = polar(cx, cy, outerR, a);
        const labelPos = polar(cx, cy, midR, a);

        if (detail === "ticks") {
          return (
            <line
              key={`${uid}-hx-${i}`}
              x1={pIn.x}
              y1={pIn.y}
              x2={pOut.x}
              y2={pOut.y}
              stroke={EASTERN.bronze}
              strokeWidth={0.5}
              opacity={0.35}
            />
          );
        }

        if (detail === "labels-compact") {
          return (
            <g key={`${uid}-hx-${i}`}>
              <line
                x1={pIn.x}
                y1={pIn.y}
                x2={pOut.x}
                y2={pOut.y}
                stroke={EASTERN.goldDim}
                strokeWidth={0.35}
                opacity={0.45}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={EASTERN.goldLight}
                fontSize={Math.max(3.8, ringW * 0.52)}
                fontFamily="serif"
                opacity={0.82}
              >
                {HEXAGRAM_64_LABELS[i]}
              </text>
            </g>
          );
        }

        return (
          <g key={`${uid}-hx-${i}`}>
            <line
              x1={pIn.x}
              y1={pIn.y}
              x2={pOut.x}
              y2={pOut.y}
              stroke={EASTERN.goldDim}
              strokeWidth={0.4}
              opacity={0.4}
            />
            <MiniHexagram
              cx={labelPos.x}
              cy={labelPos.y}
              lines={lines}
              size={Math.max(4, ringW * 0.55)}
            />
            {i % 8 === 0 ? (
              <text
                x={labelPos.x}
                y={labelPos.y + ringW * 0.55}
                textAnchor="middle"
                fill={EASTERN.gold}
                fontSize={ringW * 0.35}
                fontFamily="serif"
                opacity={0.7}
              >
                {HEXAGRAM_64_LABELS[i]}
              </text>
            ) : null}
          </g>
        );
      })}
      <circle
        cx={cx}
        cy={cy}
        r={outerR}
        fill="none"
        stroke={EASTERN.bronze}
        strokeWidth={0.8}
        opacity={0.5}
      />
    </g>
  );
}

function MiniHexagram({
  cx,
  cy,
  lines,
  size,
}: {
  cx: number;
  cy: number;
  lines: readonly boolean[];
  size: number;
}) {
  const barH = size * 0.12;
  const gap = size * 0.16;
  const barW = size;
  const halfW = barW * 0.42;
  const startY = cy - (lines.length * gap) / 2;

  return (
    <g>
      {lines.map((yang, i) => {
        const y = startY + i * gap;
        if (yang) {
          return (
            <rect
              key={i}
              x={cx - barW / 2}
              y={y}
              width={barW}
              height={barH}
              fill={EASTERN.goldLight}
              opacity={0.65}
              rx={0.2}
            />
          );
        }
        return (
          <g key={i}>
            <rect
              x={cx - barW / 2}
              y={y}
              width={halfW}
              height={barH}
              fill={EASTERN.goldLight}
              opacity={0.65}
              rx={0.2}
            />
            <rect
              x={cx + barW / 2 - halfW}
              y={y}
              width={halfW}
              height={barH}
              fill={EASTERN.goldLight}
              opacity={0.65}
              rx={0.2}
            />
          </g>
        );
      })}
    </g>
  );
}

export function TrigramRingDetailed({
  cx,
  cy,
  radius,
  glyphSize,
  uid = "t",
}: {
  cx: number;
  cy: number;
  radius: number;
  glyphSize: number;
  uid?: string;
}) {
  return (
    <g>
      {OCTAGON.map(({ id, angle }) => {
        const { x, y } = polar(cx, cy, radius, angle);
        return (
          <TrigramLines
            key={`${uid}-${id}`}
            pattern={TRIGRAM_PATTERNS[id]}
            x={x}
            y={y}
            size={glyphSize}
          />
        );
      })}
    </g>
  );
}
