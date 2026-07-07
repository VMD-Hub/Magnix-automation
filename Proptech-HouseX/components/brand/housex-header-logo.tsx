import Image from "next/image";
import Link from "next/link";
import {
  HOUSEX_BRAND_LOGO_MARK_HEIGHT,
  HOUSEX_BRAND_LOGO_MARK_SRC,
  HOUSEX_BRAND_LOGO_MARK_WIDTH,
  HOUSEX_FOOTER_TAGLINE,
} from "@/lib/brand/housex-logo-assets";
import { getBrandName } from "@/lib/site-config";
import { cn } from "@/lib/ui/cn";

export { HOUSEX_HEADER_LOGO_SRC } from "@/lib/brand/housex-logo-assets";

type Props = {
  href?: string;
  className?: string;
  priority?: boolean;
  /** `ruby` — thanh tiêu đề; `light` — trang auth nền sáng (chip ruby nhỏ). */
  surface?: "ruby" | "light";
};

/** Logo thanh tiêu đề — mark trong suốt đồng bộ footer. */
export function HouseXHeaderLogo({
  href = "/",
  className,
  priority = true,
  surface = "ruby",
}: Props) {
  const image = (
    <span className="housex-header-logo__frame">
      <Image
        src={HOUSEX_BRAND_LOGO_MARK_SRC}
        alt={`${getBrandName()} — ${HOUSEX_FOOTER_TAGLINE}`}
        width={HOUSEX_BRAND_LOGO_MARK_WIDTH}
        height={HOUSEX_BRAND_LOGO_MARK_HEIGHT}
        priority={priority}
        quality={100}
        unoptimized
        sizes="(max-width: 640px) 180px, 220px"
        className="housex-header-logo__img"
      />
    </span>
  );

  const lockup =
    surface === "light" ? (
      <span className="housex-header-logo__light-pad">{image}</span>
    ) : (
      image
    );

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

  return (
    <Link
      href={href}
      className={cn(
        "housex-header-logo inline-flex shrink-0 items-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400",
        surface === "light" && "housex-header-logo--light",
        className,
      )}
      aria-label={`${getBrandName()} — Trang chủ`}
    >
      {lockup}
    </Link>
  );
}
