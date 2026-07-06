import { cn } from "@/lib/ui/cn";
import { EASTERN, NGU_HANH_COLORS } from "@/components/feng-shui/eastern-art/eastern-palette";
import { EasternTextureLayers } from "@/components/feng-shui/eastern-art/eastern-texture";

type Props = { className?: string; size?: "card" | "hero" };

/** Vòng Ngũ hành — Kim Mộc Thủy Hỏa Thổ. */
export function NguHanhArt({ className, size = "card" }: Props) {
  const isHero = size === "hero";
  const vbW = isHero ? 800 : 400;
  const vbH = isHero ? 480 : 250;
  const cx = isHero ? 400 : 200;
  const cy = isHero ? 240 : 125;
  const r = isHero ? 120 : 60;
  const uid = isHero ? "nguHero" : "nguCard";

  const elements: { label: string; han: string; color: string; angle: number }[] = [
    { label: "Kim", han: "金", color: NGU_HANH_COLORS.kim, angle: -90 },
    { label: "Mộc", han: "木", color: NGU_HANH_COLORS.moc, angle: -18 },
    { label: "Thủy", han: "水", color: NGU_HANH_COLORS.thuy, angle: 54 },
    { label: "Hỏa", han: "火", color: NGU_HANH_COLORS.hoa, angle: 126 },
    { label: "Thổ", han: "土", color: NGU_HANH_COLORS.tho, angle: 198 },
  ];

  return (
    <svg viewBox={`0 0 ${vbW} ${vbH}`} className={cn("h-full w-full", className)} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <EasternTextureLayers id={uid} width={vbW} height={vbH} />
      <circle cx={cx} cy={cy} r={isHero ? 180 : 90} fill={EASTERN.mist} />
      {/* Ngũ giác tương sinh */}
      {elements.map((el, i) => {
        const next = elements[(i + 1) % elements.length]!;
        const a1 = (el.angle * Math.PI) / 180;
        const a2 = (next.angle * Math.PI) / 180;
        const x1 = cx + Math.cos(a1) * r;
        const y1 = cy + Math.sin(a1) * r;
        const x2 = cx + Math.cos(a2) * r;
        const y2 = cy + Math.sin(a2) * r;
        return (
          <line
            key={`line-${el.han}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={EASTERN.goldDim}
            strokeWidth={1}
            opacity={0.5}
            strokeDasharray="4 3"
          />
        );
      })}
      {elements.map((el) => {
        const rad = (el.angle * Math.PI) / 180;
        const x = cx + Math.cos(rad) * r;
        const y = cy + Math.sin(rad) * r;
        const nodeR = isHero ? 36 : 18;
        return (
          <g key={el.han}>
            <circle cx={x} cy={y} r={nodeR} fill={el.color} opacity={0.85} stroke={EASTERN.goldLight} strokeWidth={1} />
            <text
              x={x}
              y={y - (isHero ? 4 : 2)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={EASTERN.ink}
              fontSize={isHero ? 22 : 11}
              fontFamily="serif"
              fontWeight="bold"
            >
              {el.han}
            </text>
            <text
              x={x}
              y={y + (isHero ? 14 : 7)}
              textAnchor="middle"
              fill={EASTERN.goldLight}
              fontSize={isHero ? 10 : 5}
              opacity={0.9}
            >
              {el.label}
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={isHero ? 28 : 14} fill="none" stroke={EASTERN.gold} strokeWidth={1.5} opacity={0.7} />
      <text
        x={cx}
        y={cy + (isHero ? 6 : 3)}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={EASTERN.goldLight}
        fontSize={isHero ? 14 : 7}
        fontFamily="serif"
      >
        五行
      </text>
    </svg>
  );
}
