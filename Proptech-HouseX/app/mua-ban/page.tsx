import type { Metadata } from "next";
import { browseListings } from "@/lib/data/listing-browse";
import { propertyTypeFromSlug } from "@/lib/content/property-type-slug";
import { LISTINGS_BROWSE_COPY } from "@/lib/content/listings-browse-copy";
import {
  formatListingBrowseLocationLabel,
  resolveListingBrowseLocation,
} from "@/lib/content/listing-browse-locations";
import {
  ListingBrowsePage,
  buildListingListJsonLd,
  propertyTypeToSlug,
} from "@/components/listings/listing-browse-page";
import { propertyTypeLabel } from "@/lib/format";
import { isBrowseRateLimited } from "@/lib/security/browse-rate-limit";
import { RateLimitNotice } from "@/components/security/rate-limit-notice";
import { PreloadHeroBrandSkyline } from "@/components/home/hero-brand-background";
import { getSiteUrl } from "@/lib/site-config";
import { normalizeSeoDescription } from "@/lib/seo/meta-text";
import { listingBrowseCanonicalUrl } from "@/lib/content/listing-browse-url";

export const revalidate = 120;

type PageProps = {
  searchParams: Promise<{
    province?: string;
    district?: string;
    propertyType?: string;
    page?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const dbType = propertyTypeFromSlug(sp.propertyType);
  const location = resolveListingBrowseLocation(sp);
  const locationLabel = formatListingBrowseLocationLabel(location);
  const parts = ["Mua bán bất động sản"];
  if (dbType) parts.push(propertyTypeLabel(dbType));
  if (locationLabel) parts.push(locationLabel);
  const title = parts.join(" — ");
  const description = normalizeSeoDescription(
    `Tìm mua ${dbType ? propertyTypeLabel(dbType).toLowerCase() : "nhà đất"}${locationLabel ? ` tại ${locationLabel}` : " tại TP.HCM và các tỉnh lân cận"}. ${LISTINGS_BROWSE_COPY.sale.seoDescriptionSuffix}`,
  );

  return {
    title,
    description,
    alternates: {
      canonical: listingBrowseCanonicalUrl(
        "/mua-ban",
        {
          province: sp.province,
          district: sp.district,
          propertyType: sp.propertyType,
        },
        getSiteUrl(),
      ),
    },
  };
}

export default async function MuaBanPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const propertyType = propertyTypeFromSlug(sp.propertyType);
  const location = resolveListingBrowseLocation(sp);
  const copy = LISTINGS_BROWSE_COPY.sale;

  const browsePromise = browseListings({
    transactionType: "SALE",
    province: location.province,
    district: location.district,
    propertyType,
    page,
  });
  if (await isBrowseRateLimited()) {
    return <RateLimitNotice />;
  }
  const { items, pagination } = await browsePromise;

  const siteUrl = getSiteUrl();
  const jsonLd = buildListingListJsonLd(siteUrl, "/mua-ban", copy.listTitle, items);

  const locationLabel = formatListingBrowseLocationLabel(location);
  const subtitle =
    propertyType || locationLabel
      ? `Lọc theo ${[propertyType ? propertyTypeLabel(propertyType) : null, locationLabel].filter(Boolean).join(", ")}`
      : copy.heroSubtitle;

  return (
    <>
      <PreloadHeroBrandSkyline />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ListingBrowsePage
        basePath="/mua-ban"
        title={copy.listTitle}
        subtitle={subtitle}
        banner={{
          kicker: copy.kicker,
          title: copy.heroTitle,
          subtitle: copy.heroSubtitle,
          coverageNote: copy.coverageNote,
        }}
        items={items}
        pagination={pagination}
        filters={{
          location,
          propertyType,
          propertyTypeSlug: propertyType ? propertyTypeToSlug(propertyType) : sp.propertyType,
        }}
      />
    </>
  );
}
