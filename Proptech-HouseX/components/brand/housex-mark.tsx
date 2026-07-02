import { cn } from "@/lib/ui/cn";
import { HouseXChromeX } from "@/components/brand/housex-chrome-x";
import { CHROME_X_VIEWBOX } from "@/lib/brand/housex-mark.config";

type Props = {
  className?: string;
  variant?: "default" | "onDark" | "iconOnly";
  "aria-hidden"?: boolean;
};

/** Logo icon — X chrome (favicon / icon-only). */
export function HouseXMark({
  className,
  variant = "default",
  "aria-hidden": ariaHidden = true,
}: Props) {
  const tone = variant === "onDark" ? "onDark" : "default";

  return (
    <HouseXChromeX
      variant={tone}
      className={cn("h-[1em] w-[1em]", className)}
      aria-hidden={ariaHidden}
    />
  );
}

export { CHROME_X_VIEWBOX };
