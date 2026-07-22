import type { Metadata } from "next";
import { IMAGE_FALLBACK } from "@/lib/content/safe-image";

const DEFAULT_OG_ALT = "House X — Smart Tools · Trusted Utility";

export function siteOgImages(
  url: string = IMAGE_FALLBACK,
  alt: string = DEFAULT_OG_ALT,
): NonNullable<NonNullable<Metadata["openGraph"]>["images"]> {
  return [{ url, alt }];
}

/**
 * Luôn kèm og:image — tránh Ahrefs “Open Graph tags incomplete”
 * khi page set openGraph mà quên images (ghi đè layout).
 */
export function withOpenGraph(
  partial: NonNullable<Metadata["openGraph"]>,
  opts?: { imageUrl?: string; imageAlt?: string },
): NonNullable<Metadata["openGraph"]> {
  const hasImages = Array.isArray(partial.images)
    ? partial.images.length > 0
    : Boolean(partial.images);

  return {
    type: "website",
    locale: "vi_VN",
    siteName: "House X",
    ...partial,
    images: hasImages
      ? partial.images
      : siteOgImages(opts?.imageUrl, opts?.imageAlt),
  };
}
