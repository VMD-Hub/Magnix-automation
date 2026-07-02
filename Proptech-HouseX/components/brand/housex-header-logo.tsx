import Image from "next/image";
import Link from "next/link";
import {
  HOUSEX_BRAND_LOGO_HEIGHT,
  HOUSEX_BRAND_LOGO_WIDTH,
  HOUSEX_HEADER_LOGO_MARK_SRC,
} from "@/lib/brand/housex-logo-assets";
import { getBrandName } from "@/lib/site-config";
import { cn } from "@/lib/ui/cn";

export { HOUSEX_HEADER_LOGO_SRC } from "@/lib/brand/housex-logo-assets";

type Props = {
  href?: string;
  className?: string;
  priority?: boolean;
};

export function HouseXHeaderLogo({
  href = "/",
  className,
  priority = true,
}: Props) {
  const image = (
    <Image
      src={HOUSEX_HEADER_LOGO_MARK_SRC}
      alt={`${getBrandName()} — Ultimate Real Estate Radar`}
      width={HOUSEX_BRAND_LOGO_WIDTH}
      height={HOUSEX_BRAND_LOGO_HEIGHT}
      priority={priority}
      quality={100}
      unoptimized
      sizes="(max-width: 640px) 180px, 220px"
      className="housex-header-logo__img"
    />
  );

  if (!href) {
    return (
      <span className={cn("housex-header-logo inline-flex shrink-0", className)}>
        {image}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "housex-header-logo inline-flex shrink-0 items-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
        className,
      )}
      aria-label={`${getBrandName()} — Trang chủ`}
    >
      {image}
    </Link>
  );
}
