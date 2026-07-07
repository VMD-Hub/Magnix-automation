import Image from "next/image";
import Link from "next/link";
import {
  HOUSEX_FOOTER_LOGO_HEIGHT,
  HOUSEX_FOOTER_LOGO_SRC,
  HOUSEX_FOOTER_LOGO_WIDTH,
  HOUSEX_FOOTER_TAGLINE,
} from "@/lib/brand/housex-logo-assets";
import { getBrandName } from "@/lib/site-config";
import { cn } from "@/lib/ui/cn";

export { HOUSEX_FOOTER_LOGO_SRC };

type Props = {
  href?: string | null;
  className?: string;
};

/** Logo footer — `housex-footer-logo-transparent.png` (nền trong suốt). */
export function HouseXFooterLogo({ href = null, className }: Props) {
  const image = (
    <span className="housex-footer-logo__frame">
      <Image
        src={HOUSEX_FOOTER_LOGO_SRC}
        alt={`${getBrandName()} — ${HOUSEX_FOOTER_TAGLINE}`}
        width={HOUSEX_FOOTER_LOGO_WIDTH}
        height={HOUSEX_FOOTER_LOGO_HEIGHT}
        quality={100}
        unoptimized
        sizes="(max-width: 640px) 220px, 300px"
        className="housex-footer-logo__img"
      />
    </span>
  );

  if (!href) {
    return (
      <span className={cn("housex-footer-logo inline-flex shrink-0", className)}>
        {image}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "housex-footer-logo inline-flex shrink-0 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400",
        className,
      )}
      aria-label={`${getBrandName()} — Trang chủ`}
    >
      {image}
    </Link>
  );
}
