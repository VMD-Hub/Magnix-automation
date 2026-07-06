import { EASTERN } from "@/components/feng-shui/eastern-art/eastern-palette";

type Props = {
  id: string;
  width?: number;
  height?: number;
};

/** Nền giấy cổ + vân mực — dùng chung SVG phong thủy. */
export function EasternTextureDefs({ id, width = 400, height = 250 }: Props) {
  return (
    <defs>
      <linearGradient id={`${id}-paper`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#141820" />
        <stop offset="45%" stopColor={EASTERN.inkMid} />
        <stop offset="100%" stopColor="#1a1410" />
      </linearGradient>
      <pattern
        id={`${id}-grain`}
        width="4"
        height="4"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(12)"
      >
        <rect width="4" height="4" fill="transparent" />
        <circle cx="1" cy="1" r="0.35" fill={EASTERN.goldLight} opacity={0.04} />
        <circle cx="3" cy="3" r="0.25" fill={EASTERN.gold} opacity={0.03} />
      </pattern>
      <pattern
        id={`${id}-ink`}
        width="120"
        height="120"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M0 60 Q30 40 60 60 T120 60"
          fill="none"
          stroke={EASTERN.gold}
          strokeWidth="0.6"
          opacity={0.04}
        />
        <path
          d="M0 90 Q40 70 80 95"
          fill="none"
          stroke={EASTERN.vermillion}
          strokeWidth="0.5"
          opacity={0.03}
        />
      </pattern>
      <radialGradient id={`${id}-vignette`} cx="50%" cy="50%" r="65%">
        <stop offset="55%" stopColor="transparent" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
      </radialGradient>
    </defs>
  );
}

export function EasternTextureLayers({
  id,
  width = 400,
  height = 250,
}: Props & { width: number; height: number }) {
  return (
    <>
      <EasternTextureDefs id={id} width={width} height={height} />
      <rect width={width} height={height} fill={`url(#${id}-paper)`} />
      <rect width={width} height={height} fill={`url(#${id}-grain)`} />
      <rect width={width} height={height} fill={`url(#${id}-ink)`} />
      <rect width={width} height={height} fill={`url(#${id}-vignette)`} />
    </>
  );
}
