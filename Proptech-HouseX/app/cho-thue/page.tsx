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
import { getSiteUrl } from "@/lib/site-config";

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
  const parts = ["Cho thuê bất động sản"];
  if (dbType) parts.push(propertyTypeLabel(dbType));
  if (locationLabel) parts.push(locationLabel);
  const title = parts.join(" — ");
  const description = `Tìm thuê ${dbType ? propertyTypeLabel(dbType).toLowerCase() : "nhà đất"}${locationLabel ? ` tại ${locationLabel}` : " tại TP.HCM và các tỉnh lân cận"}. Kho tin cho thuê HouseX đang cập nhật.`;

  const site = getSiteUrl();
  const q = new URLSearchParams();
  if (sp.province) q.set("province", sp.province);
  if (sp.district) q.set("district", sp.district);
  if (sp.propertyType) q.set("propertyType", sp.propertyType);
  const qs = q.toString();

  return {
    title,
    description,
    alternates: {
      canonical: site ? `${site}/cho-thue${qs ? `?${qs}` : ""}` : undefined,
    },
  };
}

export default async function ChoThuePage({ searchParams }: PageProps) {
  if (await isBrowseRateLimited()) {
    return <RateLimitNotice />;
  }
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const propertyType = propertyTypeFromSlug(sp.propertyType);
  const location = resolveListingBrowseLocation(sp);
  const copy = LISTINGS_BROWSE_COPY.rent;

  const { items, pagination } = await browseListings({
    transactionType: "RENT",
    province: location.province,
    district: location.district,
    propertyType,
    page,
  });

  const siteUrl = getSiteUrl();
  const jsonLd = buildListingListJsonLd(siteUrl, "/cho-thue", copy.title, items);

  const locationLabel = formatListingBrowseLocationLabel(location);
  const subtitle =
    propertyType || locationLabel
      ? `Lọc theo ${[propertyType ? propertyTypeLabel(propertyType) : null, locationLabel].filter(Boolean).join(", ")}`
      : copy.subtitle;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ListingBrowsePage
        basePath="/cho-thue"
        title={copy.title}
        subtitle={subtitle}
        banner={{
          kicker: copy.kicker,
          title: copy.title,
          subtitle: copy.subtitle,
          image: copy.bannerImage,
          imageWebp: copy.bannerWebp,
          imageAlt: copy.bannerAlt,
          objectPosition: copy.objectPosition,
          badge: "Coming Soon",
        }}
        items={items}
        pagination={pagination}
        emptyMode={items.length === 0 ? "coming-soon" : "no-results"}
        comingSoon={{
          title: copy.comingSoonTitle,
          body: copy.comingSoonBody,
          cta: copy.comingSoonCta,
          ctaHref: copy.comingSoonCtaHref,
        }}
        filters={{
          location,
          propertyType,
          propertyTypeSlug: propertyType ? propertyTypeToSlug(propertyType) : sp.propertyType,
        }}
      />
    </>
  );
}
