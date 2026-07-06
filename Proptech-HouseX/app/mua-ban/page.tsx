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
import { PreloadBannerImage } from "@/components/seo/preload-banner-image";
import { catalogBannerSources } from "@/lib/brand/banner-responsive";

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
  const description = `Tìm mua ${dbType ? propertyTypeLabel(dbType).toLowerCase() : "nhà đất"}${locationLabel ? ` tại ${locationLabel}` : " tại TP.HCM và các tỉnh lân cận"}. Tin đã kiểm duyệt, dễ so sánh theo khu vực.`;

  return {
    title,
    description,
    alternates: {
      canonical: buildCanonical(sp),
    },
  };
}

function buildCanonical(sp: {
  province?: string;
  district?: string;
  propertyType?: string;
}) {
  const site = getSiteUrl();
  const q = new URLSearchParams();
  if (sp.province) q.set("province", sp.province);
  if (sp.district) q.set("district", sp.district);
  if (sp.propertyType) q.set("propertyType", sp.propertyType);
  const qs = q.toString();
  return site ? `${site}/mua-ban${qs ? `?${qs}` : ""}` : undefined;
}

export default async function MuaBanPage({ searchParams }: PageProps) {
  if (await isBrowseRateLimited()) {
    return <RateLimitNotice />;
  }
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const propertyType = propertyTypeFromSlug(sp.propertyType);
  const location = resolveListingBrowseLocation(sp);
  const copy = LISTINGS_BROWSE_COPY.sale;

  const { items, pagination } = await browseListings({
    transactionType: "SALE",
    province: location.province,
    district: location.district,
    propertyType,
    page,
  });

  const siteUrl = getSiteUrl();
  const jsonLd = buildListingListJsonLd(siteUrl, "/mua-ban", copy.title, items);

  const locationLabel = formatListingBrowseLocationLabel(location);
  const subtitle =
    propertyType || locationLabel
      ? `Lọc theo ${[propertyType ? propertyTypeLabel(propertyType) : null, locationLabel].filter(Boolean).join(", ")}`
      : copy.subtitle;

  const bannerPreload = copy.bannerSlide
    ? catalogBannerSources(copy.bannerSlide)
    : null;

  return (
    <>
      {bannerPreload ? <PreloadBannerImage sources={bannerPreload} /> : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ListingBrowsePage
        basePath="/mua-ban"
        title={copy.title}
        subtitle={subtitle}
        banner={{
          kicker: copy.kicker,
          title: copy.title,
          subtitle: copy.subtitle,
          bannerSlide: copy.bannerSlide,
          image: copy.bannerImage,
          imageWebp: copy.bannerWebp,
          imageAlt: copy.bannerAlt,
          objectPosition: copy.objectPosition,
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
