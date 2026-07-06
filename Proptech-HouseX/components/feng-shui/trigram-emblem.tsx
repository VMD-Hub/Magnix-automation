import { cn } from "@/lib/ui/cn";
import {
  TRIGRAMS,
  type Trigram,
  type TrigramKey,
} from "@/lib/feng-shui/bat-trach";
import { TRIGRAM_HAN, EIGHT_TRIGRAMS_ORDER } from "@/lib/feng-shui/luo-pan-symbols";

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

type EmblemProps = {
  trigram: Trigram;
  size?: "sm" | "md" | "lg";
  active?: boolean;
  className?: string;
};

/** Biểu tượng một cung mệnh — quái + Hán tự + quái số. */
export function TrigramEmblem({
  trigram,
  size = "md",
  active = false,
  className,
}: EmblemProps) {
  const pattern = TRIGRAM_PATTERNS[trigram.key];
  const han = TRIGRAM_HAN[trigram.key];
  const dims = { sm: 56, md: 72, lg: 96 }[size];
  const barW = dims * 0.55;
  const barH = dims * 0.07;
  const gap = dims * 0.14;
  const halfW = barW * 0.42;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border text-center transition-colors",
        active
          ? "border-gold-500/60 bg-ink-900 text-white shadow-md shadow-gold-900/20"
          : "border-slate-200 bg-white text-slate-800",
        className,
      )}
      style={{ width: dims, height: dims }}
    >
      <svg
        viewBox={`0 0 ${barW} ${gap * 3}`}
        width={barW * 0.7}
        height={gap * 2.2}
        aria-hidden
        className={active ? "text-gold-300" : "text-brand-800"}
      >
        {pattern.map((yang, i) => {
          const y = i * gap;
          if (yang) {
            return (
              <rect
                key={i}
                x={0}
                y={y}
                width={barW}
                height={barH}
                fill="currentColor"
                rx={0.5}
              />
            );
          }
          return (
            <g key={i}>
              <rect x={0} y={y} width={halfW} height={barH} fill="currentColor" rx={0.5} />
              <rect
                x={barW - halfW}
                y={y}
                width={halfW}
                height={barH}
                fill="currentColor"
                rx={0.5}
              />
            </g>
          );
        })}
      </svg>
      <span
        className={cn(
          "font-serif leading-none",
          size === "lg" ? "text-xl" : size === "md" ? "text-base" : "text-sm",
          active ? "text-gold-300" : "text-brand-900",
        )}
      >
        {han}
      </span>
      <span
        className={cn(
          "mt-0.5 text-[10px] font-bold leading-none",
          active ? "text-gold-400" : "text-slate-500",
        )}
      >
        {trigram.name} · {trigram.kua}
      </span>
    </div>
  );
}

/** 8 cung mệnh — highlight cung của gia chủ. */
export function EightTrigramStrip({
  activeKey,
  className,
}: {
  activeKey: TrigramKey;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-2", className)}>
      {EIGHT_TRIGRAMS_ORDER.map((key) => (
        <TrigramEmblem
          key={key}
          trigram={TRIGRAMS[key]}
          size="sm"
          active={key === activeKey}
        />
      ))}
    </div>
  );
}
