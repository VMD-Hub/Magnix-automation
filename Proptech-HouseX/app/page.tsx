import type { Metadata } from "next";
import Link from "next/link";
import { SearchHero } from "@/components/home/search-hero";
import { ProptechTools } from "@/components/home/proptech-tools";
import { SectionHeading } from "@/components/ui/section-heading";
import { ListingCard } from "@/components/listings/listing-card";
import { ProjectCard } from "@/components/projects/project-card";
import { RubyHolder } from "@/components/brand/ruby-holder";
import { getHomepageData } from "@/lib/data/home";
import { HeroBrandBackground } from "@/components/home/hero-brand-background";
import { buildWebSiteJsonLd } from "@/lib/seo/website-json-ld";
import {
  PLATFORM_BROKER_CTA,
  PLATFORM_HERO,
  PLATFORM_TRUST,
} from "@/lib/content/messaging/platform-public";
import {
  NOXH_CATALOG_PATH,
  NOXH_CATALOG_TITLE,
} from "@/lib/content/messaging/noxh-public";
import {
  SEO_DESCRIPTION_DEFAULT,
  SEO_TITLE_DEFAULT,
} from "@/lib/content/messaging/brand";
import { getSiteUrl } from "@/lib/site-config";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: SEO_TITLE_DEFAULT },
  description: SEO_DESCRIPTION_DEFAULT,
  alternates: { canonical: getSiteUrl() },
};

export default async function Home() {
  const { projects, saleListings } = await getHomepageData();
  const webSiteJsonLd = buildWebSiteJsonLd();

  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/images/hero/housex-hero-brand-ruby-skyline.webp"
        type="image/webp"
        fetchPriority="high"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />

      <section className="lux-hero lux-hero--home lux-hero--brand relative overflow-hidden">
        <div className="lux-hero-mesh" aria-hidden />
        <HeroBrandBackground />
        <div className="lux-hero-inner relative z-[2] mx-auto max-w-7xl container-px">
          <h1 className="lux-hero-title mt-0 max-w-2xl text-2xl font-extrabold leading-tight text-white sm:mt-3 sm:text-4xl lg:text-5xl">
            <span className="sm:hidden">{PLATFORM_HERO.h1Compact}</span>
            <span className="hidden sm:inline">
              {PLATFORM_HERO.h1Line1}
              <br />
              <span className="lux-hero-title-accent text-brand-300">
                {PLATFORM_HERO.h1Accent}
              </span>
            </span>
          </h1>
          <p className="lux-hero-lead mt-2 hidden max-w-xl text-base text-silver-200 sm:mt-4 sm:block">
            {PLATFORM_HERO.lead}
          </p>
          <div className="mt-4 sm:mt-8">
            <SearchHero tone="rubyHero" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl py-6 container-px sm:py-8">
        <SectionHeading
          title="Dự án nổi bật"
          subtitle="Các dự án mới, pháp lý rõ ràng"
          href="/du-an"
        />
        <p className="mb-5 -mt-2 text-sm text-[#666666]">
          Ưu tiên an cư?{" "}
          <Link
            href={NOXH_CATALOG_PATH}
            className="font-semibold text-brand-700 hover:text-brand-800"
          >
            {NOXH_CATALOG_TITLE} →
          </Link>
        </p>
        {projects.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((p) => (
              <ProjectCard key={p.slug} item={p} />
            ))}
          </div>
        ) : (
          <EmptyState label="Danh sách tin đang cập nhật. Quay lại sau hoặc xem mục Dự án." />
        )}
      </section>

      <section className="mx-auto max-w-7xl py-6 container-px sm:py-8">
        <SectionHeading
          title="Bất động sản đang bán"
          subtitle="Tin đã kiểm duyệt — sắp xếp để bạn so sánh nhanh"
          href="/mua-ban"
        />
        {saleListings.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {saleListings.map((l) => (
              <ListingCard key={l.code} item={l} />
            ))}
          </div>
        ) : (
          <EmptyState label="Chưa có tin phù hợp. Xem thêm tại mục Mua bán." />
        )}
      </section>

      <section className="proptech-section-glow mx-auto max-w-7xl py-6 container-px sm:py-8">
        <SectionHeading
          title="Công cụ hỗ trợ"
          subtitle="Vay, định giá, phong thủy và nhiều hơn"
          href="/cong-cu"
        />
        <ProptechTools />
      </section>

      <section className="proptech-trust-band">
        <div className="mx-auto grid max-w-7xl gap-6 py-10 container-px sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_TRUST.map((t) => (
            <div key={t.title} className="flex items-start gap-3">
              <span className="proptech-trust-tile__icon">
                <t.Icon />
              </span>
              <div>
                <p className="font-semibold text-[#333333]">{t.title}</p>
                <p className="text-sm text-[#666666]">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl py-14 container-px">
        <RubyHolder className="p-8">
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {PLATFORM_BROKER_CTA.title}
              </h2>
              <p className="mt-1 text-silver-200">{PLATFORM_BROKER_CTA.desc}</p>
            </div>
            <Link
              href="/dang-tin"
              className="lux-gold-cta relative inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-gold-500 px-6 font-semibold text-white"
            >
              Đăng tin ngay
            </Link>
          </div>
        </RubyHolder>
      </section>
    </>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="proptech-empty-state p-10 text-center text-sm">
      {label}
    </div>
  );
}
