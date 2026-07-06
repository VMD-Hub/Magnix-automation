import { cn } from "@/lib/ui/cn";
import { EasternTextureLayers } from "@/components/feng-shui/eastern-art/eastern-texture";
import { EASTERN } from "@/components/feng-shui/eastern-art/eastern-palette";
import { TrigramRingDetailed } from "@/components/feng-shui/eastern-art/luo-pan-rings";
import { YinYang } from "@/components/feng-shui/eastern-art/trigram-glyphs";

type Props = {
  className?: string;
  title?: string;
};

/** Cover mặc định bài viết tag phong-thuy — bát quái trên nền giấy cổ. */
export function PhongThuyArticleCover({ className, title }: Props) {
  const uid = "phongThuyCover";

  return (
    <div
      className={cn(
        "relative aspect-[16/9] w-full overflow-hidden bg-ink-900",
        className,
      )}
      aria-hidden={!title}
    >
      <svg
        viewBox="0 0 640 360"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <EasternTextureLayers id={uid} width={640} height={360} />
        <circle cx="320" cy="180" r="150" fill={EASTERN.glow} opacity={0.3} />
        <TrigramRingDetailed cx={320} cy={180} radius={118} glyphSize={16} uid={uid} />
        <circle
          cx={320}
          cy={180}
          r={72}
          fill="none"
          stroke={EASTERN.gold}
          strokeWidth={1.2}
          opacity={0.6}
        />
        <YinYang cx={320} cy={180} r={36} />
        <text
          x={320}
          y={318}
          textAnchor="middle"
          fill={EASTERN.goldLight}
          fontSize={13}
          fontFamily="serif"
          opacity={0.5}
          letterSpacing={3}
        >
          風水
        </text>
      </svg>
      {title ? (
        <span className="sr-only">{title}</span>
      ) : null}
    </div>
  );
}

export function articleHasPhongThuyTag(tags: { slug: string }[]): boolean {
  return tags.some((t) => t.slug === "phong-thuy");
}
