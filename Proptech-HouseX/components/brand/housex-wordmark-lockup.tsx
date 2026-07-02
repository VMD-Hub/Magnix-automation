import { cn } from "@/lib/ui/cn";
import { HOUSEX_COLORS } from "@/lib/brand/housex-mark.config";
import { HouseXChromeX } from "@/components/brand/housex-chrome-x";
import { HouseXRadarO } from "@/components/brand/housex-radar-o";

type Props = {
  className?: string;
  variant?: "default" | "onDark";
  size?: "default" | "header";
  showDomain?: boolean;
};

const SCALE = {
  default: {
    row: "text-[1.05rem]",
    radarO: "h-[0.78em] w-[0.78em]",
    chromeX: "h-[1.68em] w-[1.68em] mx-[0.02em]",
    domain: "text-[0.56em] tracking-[0.02em]",
  },
  header: {
    row: "text-[0.98rem] sm:text-[1.02rem]",
    radarO: "h-[0.76em] w-[0.76em]",
    chromeX: "h-[1.58em] w-[1.58em] sm:h-[1.64em] sm:w-[1.64em] mx-[0.02em]",
    domain: "text-[0.54em] sm:text-[0.56em] tracking-[0.02em]",
  },
} as const;

/** Lockup H + O(rada gold) + USE + X gold + .vn */
export function HouseXWordmarkLockup({
  className,
  variant = "default",
  size = "default",
  showDomain = true,
}: Props) {
  const preset = SCALE[size];
  const textColor =
    variant === "onDark" ? HOUSEX_COLORS.navyOnDark : HOUSEX_COLORS.navy;

  return (
    <span
      className={cn(
        "inline-flex items-baseline leading-none",
        preset.row,
        className,
      )}
    >
      <span
        className="inline-flex shrink-0 items-baseline font-bold uppercase tracking-[0.05em]"
        style={{ color: textColor }}
      >
        <span>H</span>
        <HouseXRadarO className={cn(preset.radarO, "mx-[0.02em]")} />
        <span>USE</span>
      </span>

      <HouseXChromeX variant={variant} className={preset.chromeX} />

      {showDomain ? (
        <span
          className={cn(
            "inline-block shrink-0 font-bold lowercase",
            preset.domain,
          )}
          style={{ color: textColor }}
        >
          .vn
        </span>
      ) : null}
    </span>
  );
}
