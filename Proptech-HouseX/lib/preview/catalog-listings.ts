import type { ListingCardData } from "@/components/listings/listing-card";
import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import { DTA_HAPPY_HOME_SLUG } from "@/lib/content/dta-happy-home-landing";
import { isInternalDemoListingCode } from "@/lib/deploy/internal-demo-content";
import {
  enrichDtaListingCardTitle,
  listDtaHappyHomeListingCards,
} from "@/lib/preview/dta-happy-home-listings";
import {
  getDemoListingsForSlug,
  getDemoProjectBySlug,
} from "@/lib/preview/demo-projects";
import { getCatalogSlugs } from "@/lib/seed/catalog-project-slugs";

function previewToCard(
  preview: ProjectLandingListingCard,
  project: ProjectDetail,
): ListingCardData {
  const price =
    preview.price != null &&
    typeof preview.price === "object" &&
    "toString" in preview.price
      ? preview.price.toString()
      : String(preview.price ?? 0);

  return enrichDtaListingCardTitle({
    code: preview.code,
    title: preview.title,
    propertyType: preview.propertyType,
    transactionType: preview.transactionType,
    price,
    area: null,
    province: project.province,
    district: project.district,
    verified: true,
    hasVideo: false,
    photoCount: preview.media.length,
    imageUrl: preview.media[0]?.url ?? null,
    offerCount: 1,
  });
}

/**
 * Tin bán catalog go-live — cùng nguồn với thẻ tin trên landing dự án.
 * Dùng trên /mua-ban và trang chủ khi Postgres chưa seed listing.
 */
export function listCatalogSaleListingCards(): ListingCardData[] {
  const byCode = new Map<string, ListingCardData>();

  for (const card of listDtaHappyHomeListingCards()) {
    byCode.set(card.code, enrichDtaListingCardTitle(card));
  }

  for (const slug of getCatalogSlugs()) {
    if (slug === DTA_HAPPY_HOME_SLUG) continue;
    const project = getDemoProjectBySlug(slug);
    if (!project) continue;
    for (const preview of getDemoListingsForSlug(slug)) {
      if (preview.transactionType !== "SALE") continue;
      if (isInternalDemoListingCode(preview.code)) continue;
      if (!byCode.has(preview.code)) {
        byCode.set(preview.code, previewToCard(preview, project));
      }
    }
  }

  return [...byCode.values()];
}
