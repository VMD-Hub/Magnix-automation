import { cn } from "@/lib/ui/cn";
import { EASTERN } from "@/components/feng-shui/eastern-art/eastern-palette";
import { EasternTextureLayers } from "@/components/feng-shui/eastern-art/eastern-texture";

type Props = { className?: string; size?: "card" | "hero" };

/** Vòng 12 địa chi + tam tai — tuổi xây/sửa nhà. */
export function BuildAgeArt({ className, size = "card" }: Props) {
  const isHero = size === "hero";
  const vbW = isHero ? 800 : 400;
  const vbH = isHero ? 480 : 250;
  const cx = isHero ? 400 : 200;
  const cy = isHero ? 240 : 125;
  const r = isHero ? 130 : 65;
  const uid = isHero ? "ageHero" : "ageCard";

  const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      className={cn("h-full w-full", className)}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <EasternTextureLayers id={uid} width={vbW} height={vbH} />
      <defs>
        <radialGradient id={`${uid}-ageGlow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(168, 50, 50, 0.2)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={isHero ? 200 : 100} fill={`url(#${uid}-ageGlow)`} />
      <circle
        cx={cx}
        cy={cy}
        r={r + (isHero ? 25 : 12)}
        fill="none"
        stroke={EASTERN.gold}
        strokeWidth={1.5}
        opacity={0.8}
      />
      {branches.map((char, i) => {
        const angle = i * 30 - 90;
        const rad = (angle * Math.PI) / 180;
        const x = cx + Math.cos(rad) * (r + (isHero ? 18 : 9));
        const y = cy + Math.sin(rad) * (r + (isHero ? 18 : 9));
        const isTamTai = i % 3 === 0;
        return (
          <text
            key={char}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={isTamTai ? EASTERN.vermillionSoft : EASTERN.goldLight}
            fontSize={isHero ? 18 : 9}
            fontFamily="serif"
            opacity={isTamTai ? 1 : 0.75}
          >
            {char}
          </text>
        );
      })}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
        const angle = n * 40 - 90;
        const rad = (angle * Math.PI) / 180;
        const x1 = cx + Math.cos(rad) * (r - (isHero ? 20 : 10));
        const y1 = cy + Math.sin(rad) * (r - (isHero ? 20 : 10));
        const x2 = cx + Math.cos(rad) * (r - (isHero ? 8 : 4));
        const y2 = cy + Math.sin(rad) * (r - (isHero ? 8 : 4));
        const bad = n === 0 || n === 2 || n === 5 || n === 7;
        return (
          <line
            key={n}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={bad ? EASTERN.vermillion : EASTERN.jadeSoft}
            strokeWidth={isHero ? 2.5 : 1.2}
            opacity={0.7}
          />
        );
      })}
      <circle
        cx={cx}
        cy={cy}
        r={r - (isHero ? 35 : 18)}
        fill="none"
        stroke={EASTERN.goldDim}
        strokeWidth={1}
        strokeDasharray="3 2"
      />
      <text
        x={cx}
        y={cy - (isHero ? 8 : 4)}
        textAnchor="middle"
        fill={EASTERN.goldLight}
        fontSize={isHero ? 11 : 5.5}
        opacity={0.8}
      >
        歲次
      </text>
      <text
        x={cx}
        y={cy + (isHero ? 14 : 7)}
        textAnchor="middle"
        fill={EASTERN.gold}
        fontSize={isHero ? 20 : 10}
        fontFamily="serif"
      >
        九
      </text>
      <text
        x={cx}
        y={cy + (isHero ? 38 : 19)}
        textAnchor="middle"
        fill={EASTERN.goldDim}
        fontSize={isHero ? 9 : 4.5}
      >
        Kim Lâu · Hoang Ốc
      </text>
    </svg>
  );
}
