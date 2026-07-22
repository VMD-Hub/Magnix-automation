import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicListingByCode } from "@/lib/data/listing-browse";
import {
  getCanonicalOffers,
  getCanonicalPrimaryCode,
} from "@/lib/data/canonical";
import { buildListingJsonLd } from "@/lib/seo/listing-json-ld";
import { getSiteUrl } from "@/lib/site-config";
import {
  resolveListingDisplayTitle,
  resolveListingMetaTitle,
} from "@/lib/content/title";
import { normalizeSeoDescription } from "@/lib/seo/meta-text";
import {
  IMAGE_FALLBACK,
  isSafeImageUrl,
} from "@/lib/content/safe-image";
import { maskPhone } from "@/lib/privacy/phone";
import { BrokerContactCard } from "@/components/listings/broker-contact-card";
import { ListingReportForm } from "@/components/listings/listing-report-form";
import { Badge } from "@/components/ui/badge";
import { RateLimitNotice } from "@/components/security/rate-limit-notice";
import { isBrowseRateLimited } from "@/lib/security/browse-rate-limit";
import {
  LISTING_STATUS_LABEL,
  LISTING_TIER_LABEL,
  TRANSACTION_TYPE_LABEL,
  formatVnd,
  propertyTypeLabel,
} from "@/lib/format";

export const revalidate = 120;

type PageProps = {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ reveal?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { code } = await params;
  const listing = await getPublicListingByCode(code);

  if (!listing) {
    return { title: "Không tìm thấy tin đăng" };
  }

  const title = resolveListingMetaTitle(listing);
  const description = normalizeSeoDescription(
    listing.description?.replace(/^## .+\n/gm, "").slice(0, 200).trim() ||
      `${propertyTypeLabel(listing.propertyType)} ${TRANSACTION_TYPE_LABEL[
        listing.transactionType
      ].toLowerCase()} tại ${listing.district}, ${listing.province}.`,
  );
  const siteUrl = getSiteUrl();

  // SEO canonicalization (P1): nếu tin này KHÔNG phải tin đại diện của cụm BĐS
  // (nhiều broker cùng bán), trỏ canonical về tin đại diện + noindex để tránh
  // duplicate content.
  let canonicalCode = listing.code;
  let isSecondary = false;
  if (listing.fingerprint?.canonicalId) {
    const primary = await getCanonicalPrimaryCode(listing.fingerprint.canonicalId);
    if (primary && primary !== listing.code) {
      canonicalCode = primary;
      isSecondary = true;
    }
  }
  const canonical = siteUrl ? `${siteUrl}/tin-dang/${canonicalCode}` : undefined;

  const coverUrl = listing.media[0]?.url;
  const ogImage =
    coverUrl && isSafeImageUrl(coverUrl) ? coverUrl : IMAGE_FALLBACK;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: isSecondary ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: [{ url: ogImage }],
    },
  };
}

export default async function ListingPage({ params, searchParams }: PageProps) {
  if (await isBrowseRateLimited()) {
    return <RateLimitNotice />;
  }
  const { code } = await params;
  const { reveal } = await searchParams;
  const listing = await getPublicListingByCode(code);

  if (!listing) {
    notFound();
  }

  const jsonLd = buildListingJsonLd(listing);
  const cover = listing.media[0];
  const coverSrc =
    cover?.url && isSafeImageUrl(cover.url) ? cover.url : IMAGE_FALLBACK;
  const headline = resolveListingDisplayTitle(listing);

  // P1: các tin khác của cùng 1 BĐS (nhiều broker) — gom theo CanonicalProperty.
  const otherOffers = listing.fingerprint?.canonicalId
    ? await getCanonicalOffers(listing.fingerprint.canonicalId, listing.id)
    : [];

  return (
    <main className="min-h-screen bg-silver-50 text-[#333333]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero strip */}
      <div className="lux-hero relative overflow-hidden border-b border-brand-900/20">
        <div className="lux-hero-mesh" aria-hidden />
        {cover ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverSrc}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-35"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-ink-900/95 via-ink-900/80 to-brand-900/30"
              aria-hidden
            />
          </>
        ) : null}
        <div className="relative mx-auto max-w-4xl px-6 py-8 container-px">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge tone="brand">
              {TRANSACTION_TYPE_LABEL[listing.transactionType]}
            </Badge>
            {listing.tier !== "FREE" && (
              <Badge tone="neutral" className="bg-gold-500/15 text-gold-700 ring-gold-500/30">
                {LISTING_TIER_LABEL[listing.tier]}
              </Badge>
            )}
            {listing.verified && (
              <Badge tone="success">Đã xác minh</Badge>
            )}
            <Badge tone="neutral">{LISTING_STATUS_LABEL[listing.status]}</Badge>
            <span className="ml-auto font-mono text-silver-200">{listing.code}</span>
          </div>

          <h1 className="mt-4 max-w-3xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {headline}
          </h1>

          <p className="lux-price mt-3 text-3xl font-extrabold">
            {formatVnd(listing.price) ?? "Liên hệ"}
            {listing.transactionType === "RENT" && (
              <span className="text-base font-medium text-silver-200"> / tháng</span>
            )}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10 container-px">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverSrc}
            alt={`Ảnh ${listing.code}`}
            className="lux-detail-panel -mt-16 mb-8 aspect-video w-full object-cover p-0"
          />
        )}

        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {listing.area != null && (
            <div className="lux-stat-card p-4">
              <dt className="text-xs uppercase text-[#888888]">Diện tích</dt>
              <dd className="mt-1 font-semibold">{listing.area} m²</dd>
            </div>
          )}
          <div className="lux-stat-card p-4">
            <dt className="text-xs uppercase text-[#888888]">Địa chỉ</dt>
            <dd className="mt-1 font-semibold">
              {[listing.address, listing.ward].filter(Boolean).join(", ") || "—"}
            </dd>
          </div>
          {listing.project && (
            <div className="lux-stat-card p-4">
              <dt className="text-xs uppercase text-[#888888]">Thuộc dự án</dt>
              <dd className="mt-1 font-semibold">
                <Link
                  className="text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-800"
                  href={`/du-an/${listing.project.slug}`}
                >
                  {listing.project.name}
                </Link>
              </dd>
            </div>
          )}
        </dl>

        {listing.description && (
          <section className="lux-detail-panel mt-8 p-6">
            <h2 className="lux-heading-accent text-xl font-semibold">Mô tả</h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-[#555555]">
              {listing.description}
            </p>
          </section>
        )}

        <section className="mt-8">
          <h2 className="lux-heading-accent mb-4 text-lg font-semibold">
            Liên hệ môi giới
          </h2>
          <div className="max-w-sm">
            <BrokerContactCard
              code={listing.code}
              listingId={listing.id}
              brokerName={listing.broker.fullName}
              maskedPhone={maskPhone(listing.broker.phone)}
              licenseVerified={listing.broker.licenseVerified}
              brokerLabel={
                listing.broker.licenseVerified
                  ? "Môi giới · Chứng chỉ đã xác minh"
                  : "Môi giới"
              }
              autoReveal={reveal === "1"}
            />
          </div>
        </section>

        <section className="mt-8">
          <ListingReportForm listingCode={listing.code} />
        </section>

        {otherOffers.length > 0 && (
          <section className="mt-8">
            <h2 className="lux-heading-accent text-xl font-semibold">
              {otherOffers.length} môi giới khác cũng đang bán BĐS này
            </h2>
            <ul className="mt-3 space-y-2">
              {otherOffers.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/tin-dang/${o.code}`}
                    className="proptech-card flex items-center justify-between px-4 py-3 hover:border-brand-200"
                  >
                    <span className="font-medium">{o.broker.fullName}</span>
                    <span className="font-semibold text-brand-700">
                      {formatVnd(o.price) ?? "Liên hệ"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
