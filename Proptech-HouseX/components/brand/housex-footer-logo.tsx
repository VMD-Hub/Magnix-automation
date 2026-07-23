import Image from "next/image";
import Link from "next/link";
import {
  HOUSEX_DOMAIN_TAGLINE,
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
  showTagline?: boolean;
};

/** Logo footer — `housex-lockup-mark.png` (nền trong suốt). */
export function HouseXFooterLogo({
  href = null,
  className,
  showTagline = true,
}: Props) {
  const brand = getBrandName();
  const lockup = (
    <span className="housex-footer-logo__lockup">
      <span className="housex-footer-logo__frame">
        <Image
          src={HOUSEX_FOOTER_LOGO_SRC}
          alt={`${brand} — ${HOUSEX_FOOTER_TAGLINE}`}
          width={HOUSEX_FOOTER_LOGO_WIDTH}
          height={HOUSEX_FOOTER_LOGO_HEIGHT}
          sizes="(max-width: 640px) 220px, 300px"
          className="housex-footer-logo__img"
        />
      </span>
      {showTagline ? (
        <span className="housex-footer-logo__copy">
          <span className="housex-footer-logo__tagline">{HOUSEX_FOOTER_TAGLINE}</span>
        </span>
      ) : null}
    </span>
  );

  if (!href) {
    return (
      <span className={cn("housex-footer-logo inline-flex shrink-0", className)}>
        {lockup}
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
      aria-label={`${brand} — ${HOUSEX_FOOTER_TAGLINE} (${HOUSEX_DOMAIN_TAGLINE})`}
    >
      {lockup}
    </Link>
  );
}
