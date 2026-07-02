import type { ListingDetail } from "@/lib/data/listing";
import { resolveListingDisplayTitle } from "@/lib/content/title";
import { getSiteUrl } from "@/lib/site-config";

type JsonLdObject = Record<string, unknown>;

/**
 * Structured data cho trang tin đăng. Dùng schema.org `Product` + `Offer`
 * (cách Google khuyến nghị cho rao bán BĐS), map trực tiếp từ dữ liệu Prisma.
 */
export function buildListingJsonLd(
  listing: ListingDetail & { title?: string | null },
): JsonLdObject {
  const siteUrl = getSiteUrl();
  const price = Number(listing.price.toString());
  const displayName = resolveListingDisplayTitle(listing);

  const jsonLd: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: displayName,
    category: listing.propertyType,
    sku: listing.code,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "VND",
      availability:
        listing.status === "ACTIVE"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      ...(siteUrl ? { url: `${siteUrl}/tin-dang/${listing.code}` } : {}),
    },
  };

  if (listing.description) {
    jsonLd.description = listing.description;
  }

  const images = listing.media
    .filter((m) => m.type === "image")
    .map((m) => m.url);
  if (images.length > 0) {
    jsonLd.image = images;
  }

  return jsonLd;
}
