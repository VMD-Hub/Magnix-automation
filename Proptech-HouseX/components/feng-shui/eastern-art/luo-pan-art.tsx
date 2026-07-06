import { cn } from "@/lib/ui/cn";
import { EASTERN } from "@/components/feng-shui/eastern-art/eastern-palette";
import { EasternTextureLayers } from "@/components/feng-shui/eastern-art/eastern-texture";
import {
  DirectionHan,
  YinYang,
} from "@/components/feng-shui/eastern-art/trigram-glyphs";
import {
  Hexagram64Ring,
  TwentyFourMountainsRing,
  TrigramRingDetailed,
} from "@/components/feng-shui/eastern-art/luo-pan-rings";
import { LuoPanSpinLayer } from "@/components/feng-shui/eastern-art/luo-pan-spin-layer";

type Props = {
  className?: string;
  size?: "card" | "hero";
  /** Xoay nhẹ vòng ngoài khi hover (cần ancestor có class `group`). */
  interactive?: boolean;
};

/** La bàn (罗盘) — 24 sơn, 64 quái, bát quái, âm dương. */
export function LuoPanArt({ className, size = "card", interactive = false }: Props) {
  const isHero = size === "hero";
  const vbW = isHero ? 800 : 400;
  const vbH = isHero ? 480 : 250;
  const cx = isHero ? 560 : 280;
  const cy = isHero ? 240 : 125;
  const uid = isHero ? "luoHero" : "luoCard";

  const r64Out = isHero ? 210 : 98;
  const r64In = isHero ? 178 : 84;
  const r24 = isHero ? 165 : 76;
  const r8 = isHero ? 130 : 58;
  const rYin = isHero ? 42 : 20;

  const hexDetail = isHero ? "labels" : "labels-compact";

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      className={cn("h-full w-full", className)}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <EasternTextureLayers id={uid} width={vbW} height={vbH} />
      <circle cx={cx} cy={cy} r={isHero ? 230 : 108} fill={EASTERN.glow} opacity={0.35} />

      <LuoPanSpinLayer cx={cx} cy={cy} interactive={interactive}>
        <Hexagram64Ring
          cx={cx}
          cy={cy}
          innerR={r64In}
          outerR={r64Out}
          detail={hexDetail}
          uid={uid}
        />
        <TwentyFourMountainsRing
          cx={cx}
          cy={cy}
          radius={r24}
          detail="full"
          uid={uid}
        />
        <TrigramRingDetailed cx={cx} cy={cy} radius={r8} glyphSize={isHero ? 18 : 9} uid={uid} />
      </LuoPanSpinLayer>

      <circle
        cx={cx}
        cy={cy}
        r={isHero ? 58 : 28}
        fill="none"
        stroke={EASTERN.vermillionSoft}
        strokeWidth={1}
        opacity={0.45}
      />
      <YinYang cx={cx} cy={cy} r={rYin} />
      <DirectionHan cx={cx} cy={cy} radius={isHero ? 148 : 68} opacity={0.4} />
      <circle cx={cx} cy={cy} r={isHero ? 3.5 : 2} fill={EASTERN.vermillion} />
      <line
        x1={cx}
        y1={cy - r64Out}
        x2={cx}
        y2={cy + r64Out}
        stroke={EASTERN.goldLight}
        strokeWidth={0.6}
        opacity={0.2}
      />
      <line
        x1={cx - r64Out}
        y1={cy}
        x2={cx + r64Out}
        y2={cy}
        stroke={EASTERN.goldLight}
        strokeWidth={0.6}
        opacity={0.2}
      />
    </svg>
  );
}

/** Bát quái thuần — thẻ nhẹ hơn la bàn đầy đủ. */
export function BaguaCompassArt({
  className,
  size = "card",
  interactive = false,
}: Props) {
  const isHero = size === "hero";
  const vbW = isHero ? 800 : 400;
  const vbH = isHero ? 480 : 250;
  const cx = isHero ? 400 : 200;
  const cy = isHero ? 240 : 125;
  const uid = isHero ? "baguaHero" : "baguaCard";
  const r = isHero ? 160 : 80;

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      className={cn("h-full w-full", className)}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <EasternTextureLayers id={uid} width={vbW} height={vbH} />
      <polygon
        points={octagonPoints(cx, cy, r)}
        fill="none"
        stroke={EASTERN.gold}
        strokeWidth={isHero ? 2 : 1.5}
        opacity={0.9}
      />
      <LuoPanSpinLayer cx={cx} cy={cy} interactive={interactive}>
        <TwentyFourMountainsRing
          cx={cx}
          cy={cy}
          radius={r * 0.92}
          detail="full"
          uid={uid}
        />
        <TrigramRingDetailed
          cx={cx}
          cy={cy}
          radius={r * 0.72}
          glyphSize={isHero ? 16 : 8}
          uid={uid}
        />
      </LuoPanSpinLayer>
      <YinYang cx={cx} cy={cy} r={isHero ? 38 : 19} />
      <DirectionHan cx={cx} cy={cy} radius={r * 0.55} opacity={0.45} />
    </svg>
  );
}

function octagonPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 8 }, (_, i) => {
    const a = ((i * 45 - 22.5 - 90) * Math.PI) / 180;
    return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  }).join(" ");
}
