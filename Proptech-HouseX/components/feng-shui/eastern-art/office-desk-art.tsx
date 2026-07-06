import { cn } from "@/lib/ui/cn";
import { EASTERN } from "@/components/feng-shui/eastern-art/eastern-palette";
import { EasternTextureLayers } from "@/components/feng-shui/eastern-art/eastern-texture";
import { TrigramRing } from "@/components/feng-shui/eastern-art/trigram-glyphs";

type Props = { className?: string; size?: "card" | "hero" };

/** Bàn làm việc + la bàn nhỏ — phong thủy văn phòng. */
export function OfficeDeskArt({ className, size = "card" }: Props) {
  const isHero = size === "hero";
  const vbW = isHero ? 800 : 400;
  const vbH = isHero ? 480 : 250;
  const uid = isHero ? "officeHero" : "officeCard";
  const cx = isHero ? 400 : 200;
  const cy = isHero ? 260 : 130;

  return (
    <svg viewBox={`0 0 ${vbW} ${vbH}`} className={cn("h-full w-full", className)} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <EasternTextureLayers id={uid} width={vbW} height={vbH} />
      {/* Bàn — nhìn từ trên */}
      <rect
        x={isHero ? 120 : 60}
        y={isHero ? 140 : 70}
        width={isHero ? 360 : 180}
        height={isHero ? 200 : 100}
        rx={isHero ? 8 : 4}
        fill={EASTERN.inkSoft}
        stroke={EASTERN.bronze}
        strokeWidth={1.5}
        opacity={0.95}
      />
      {/* Ghế */}
      <rect
        x={isHero ? 240 : 120}
        y={isHero ? 360 : 180}
        width={isHero ? 120 : 60}
        height={isHero ? 50 : 25}
        rx={isHero ? 6 : 3}
        fill={EASTERN.bronze}
        opacity={0.5}
      />
      {/* La bàn mini trên bàn */}
      <g transform={`translate(${isHero ? 480 : 240}, ${isHero ? 200 : 100})`}>
        <circle r={isHero ? 70 : 35} fill={EASTERN.inkMid} stroke={EASTERN.gold} strokeWidth={1.5} />
        <TrigramRing cx={0} cy={0} radius={isHero ? 52 : 26} glyphSize={isHero ? 10 : 5} />
        <circle r={isHero ? 18 : 9} fill="none" stroke={EASTERN.vermillionSoft} strokeWidth={1} />
        <line x1={0} y1={isHero ? -75 : -38} x2={0} y2={isHero ? 75 : 38} stroke={EASTERN.goldLight} strokeWidth={0.8} opacity={0.4} />
        <line x1={isHero ? -75 : -38} y1={0} x2={isHero ? 75 : 38} y2={0} stroke={EASTERN.goldLight} strokeWidth={0.8} opacity={0.4} />
        <text y={isHero ? 5 : 2.5} textAnchor="middle" fill={EASTERN.gold} fontSize={isHero ? 12 : 6} fontFamily="serif">
          坐
        </text>
      </g>
      {/* Hướng tốt */}
      <text
        x={isHero ? 300 : 150}
        y={isHero ? 120 : 60}
        textAnchor="middle"
        fill={EASTERN.jadeSoft}
        fontSize={isHero ? 14 : 7}
        opacity={0.85}
      >
        生気 · 天醫
      </text>
    </svg>
  );
}
