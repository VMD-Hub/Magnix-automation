import type { Metadata } from "next";
import { browseListings } from "@/lib/data/listing-browse";
import { propertyTypeFromSlug } from "@/lib/content/property-type-slug";
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
  const parts = ["Cho thuê bất động sản"];
  if (dbType) parts.push(propertyTypeLabel(dbType));
  if (sp.district) parts.push(sp.district);
  const title = parts.join(" — ");
  const description = `Tìm thuê ${dbType ? propertyTypeLabel(dbType).toLowerCase() : "nhà đất"}${sp.district ? ` tại ${sp.district}` : " tại TP.HCM"}. Tin đã kiểm duyệt, sắp xếp theo chất lượng.`;

  const site = getSiteUrl();
  const q = new URLSearchParams();
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

  const { items, pagination } = await browseListings({
    transactionType: "RENT",
    district: sp.district,
    propertyType,
    page,
  });

  const siteUrl = getSiteUrl();
  const jsonLd = buildListingListJsonLd(
    siteUrl,
    "/cho-thue",
    "Cho thuê bất động sản",
    items,
  );

  const subtitle =
    propertyType || sp.district
      ? `Lọc theo ${[propertyType ? propertyTypeLabel(propertyType) : null, sp.district].filter(Boolean).join(", ")}`
      : "Căn hộ, CHDV, phòng trọ, shophouse — tin đã kiểm duyệt chất lượng";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ListingBrowsePage
        basePath="/cho-thue"
        title="Cho thuê bất động sản"
        subtitle={subtitle}
        items={items}
        pagination={pagination}
        filters={{
          district: sp.district,
          propertyType,
          propertyTypeSlug: propertyType ? propertyTypeToSlug(propertyType) : sp.propertyType,
        }}
      />
    </>
  );
}
