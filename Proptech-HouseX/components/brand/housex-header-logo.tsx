"use client";

import Image from "next/image";
import Link from "next/link";
import {
  HOUSEX_BRAND_LOGO_MARK_HEIGHT,
  HOUSEX_BRAND_LOGO_MARK_SRC,
  HOUSEX_BRAND_LOGO_MARK_WIDTH,
  HOUSEX_DOMAIN_TAGLINE,
  HOUSEX_FOOTER_TAGLINE,
} from "@/lib/brand/housex-logo-assets";
import { getBrandName } from "@/lib/site-config";
import { cn } from "@/lib/ui/cn";
import { EmbedHomeLink } from "@/components/miniapp/embed-links";

export { HOUSEX_HEADER_LOGO_SRC } from "@/lib/brand/housex-logo-assets";

type Props = {
  href?: string;
  className?: string;
  priority?: boolean;
  /** `ruby` — thanh tiêu đề; `light` — trang auth nền sáng (chip ruby nhỏ). */
  surface?: "ruby" | "light";
  /** Hiện tagline VN dưới logo (domain nằm trong mark PNG do user thiết kế). */
  showTagline?: boolean;
};

/** Logo thanh tiêu đề — khi mở từ Mini App, chạm logo về Mini App (không về home web). */
export function HouseXHeaderLogo({
  href = "/",
  className,
  priority = true,
  surface = "ruby",
  showTagline = true,
}: Props) {
  const brand = getBrandName();
  const image = (
    <span className="housex-header-logo__frame">
      <Image
        src={HOUSEX_BRAND_LOGO_MARK_SRC}
        alt={`${brand} — ${HOUSEX_FOOTER_TAGLINE}`}
        width={HOUSEX_BRAND_LOGO_MARK_WIDTH}
        height={HOUSEX_BRAND_LOGO_MARK_HEIGHT}
        priority={priority}
        sizes="(max-width: 640px) 180px, 220px"
        className="housex-header-logo__img"
      />
    </span>
  );

  const lockupInner = (
    <span className="housex-header-logo__lockup">
      {image}
      {showTagline ? (
        <span className="housex-header-logo__copy">
          <span className="housex-header-logo__tagline">{HOUSEX_FOOTER_TAGLINE}</span>
        </span>
      ) : null}
    </span>
  );

  const lockup =
    surface === "light" ? (
      <span className="housex-header-logo__light-pad">{lockupInner}</span>
    ) : (
      lockupInner
    );

  const logoClass = cn(
    "housex-header-logo inline-flex shrink-0 items-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400",
    surface === "light" && "housex-header-logo--light",
    className,
  );

  const ariaLabel = `${brand} — ${HOUSEX_FOOTER_TAGLINE} (${HOUSEX_DOMAIN_TAGLINE})`;

  if (!href) {
    return (
      <span
        className={cn(
          "housex-header-logo inline-flex shrink-0",
          surface === "light" && "housex-header-logo--light",
          className,
        )}
      >
        {lockup}
      </span>
    );
  }

  if (href === "/") {
    return (
      <EmbedHomeLink className={logoClass} ariaLabel={ariaLabel}>
        {lockup}
      </EmbedHomeLink>
    );
  }

  return (
    <Link href={href} className={logoClass} aria-label={ariaLabel}>
      {lockup}
    </Link>
  );
}
