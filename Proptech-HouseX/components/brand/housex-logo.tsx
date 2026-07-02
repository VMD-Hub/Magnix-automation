import Link from "next/link";
import { HouseXChromeX } from "@/components/brand/housex-chrome-x";
import { HouseXWordmarkLockup } from "@/components/brand/housex-wordmark-lockup";
import { getBrandName, getBrandTagline, getBrandTaglineHeader } from "@/lib/site-config";
import { cn } from "@/lib/ui/cn";

type Props = {
  href?: string;
  className?: string;
  iconClassName?: string;
  variant?: "default" | "onDark";
  size?: "default" | "header";
  showWordmark?: boolean;
  showTagline?: boolean;
  showDomain?: boolean;
  showMarkCard?: boolean;
};

const SIZE_PRESET = {
  default: {
    root: "gap-0",
    icon: "h-[2.75rem] w-[2.75rem]",
    tagline: "mt-1.5 text-[10px] sm:text-[11px]",
  },
  header: {
    root: "brand-header-lockup gap-0",
    icon: "h-[2.5rem] w-[2.5rem]",
    tagline: "brand-header-tagline mt-1 font-medium",
  },
} as const;

export function HouseXLogo({
  href,
  className,
  iconClassName,
  variant = "default",
  size = "default",
  showWordmark = true,
  showTagline = false,
  showDomain = true,
}: Props) {
  const preset = SIZE_PRESET[size];
  const taglineCls =
    variant === "onDark" ? "text-slate-400" : "text-slate-500";
  const tone = variant === "onDark" ? "onDark" : "default";

  const inner = (
    <span
      className={cn(
        "inline-flex flex-col items-start justify-center",
        preset.root,
        className,
      )}
    >
      {showWordmark ? (
        <HouseXWordmarkLockup
          variant={tone}
          size={size}
          showDomain={showDomain}
          className={iconClassName}
        />
      ) : (
        <HouseXChromeX
          variant={tone}
          className={cn(preset.icon, iconClassName)}
        />
      )}
      {showTagline ? (
        <span
          className={cn(
            "block w-full font-medium",
            preset.tagline,
            taglineCls,
          )}
        >
          {size === "header" ? getBrandTaglineHeader() : getBrandTagline()}
        </span>
      ) : null}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex shrink-0 items-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        aria-label={`${getBrandName()} — Trang chủ`}
      >
        {inner}
      </Link>
    );
  }

  return inner;
}
