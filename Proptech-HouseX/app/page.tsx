import Link from "next/link";
import { Icon } from "@/components/icons";
import { SearchHero } from "@/components/home/search-hero";
import { ProptechTools } from "@/components/home/proptech-tools";
import { SectionHeading } from "@/components/ui/section-heading";
import { ListingCard } from "@/components/listings/listing-card";
import { ProjectCard } from "@/components/projects/project-card";
import { getHomepageData } from "@/lib/data/home";
import { HeroSlideBackground } from "@/components/home/hero-slide-background";
import {
  PLATFORM_BROKER_CTA,
  PLATFORM_HERO,
  PLATFORM_TRUST,
} from "@/lib/content/messaging/platform-public";

export const revalidate = 300;

export default async function Home() {
  const { projects, saleListings, listingsAreCatalog } = await getHomepageData();

  return (
    <>
      <section className="lux-hero relative overflow-hidden">
        <div className="lux-hero-mesh" aria-hidden />
        <HeroSlideBackground />
        <div className="relative z-[2] mx-auto max-w-7xl py-16 container-px sm:py-24">
          <p className="lux-hero-kicker proptech-kicker text-gold-400">
            {PLATFORM_HERO.kicker}
          </p>
          <h1 className="lux-hero-title mt-3 max-w-2xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            {PLATFORM_HERO.h1Line1}
            <br />
            <span className="lux-hero-title-accent text-brand-300">
              {PLATFORM_HERO.h1Accent}
            </span>
          </h1>
          <p className="lux-hero-lead mt-4 max-w-xl text-base text-silver-200">
            {PLATFORM_HERO.lead}
          </p>
          <div className="mt-8">
            <SearchHero />
          </div>
        </div>
      </section>

      <section className="proptech-section-glow mx-auto max-w-7xl py-8 container-px">
        <ProptechTools />
      </section>

      <section className="mx-auto max-w-7xl py-8 container-px">
        <SectionHeading
          title="Dự án nổi bật"
          subtitle="Các dự án mới, pháp lý rõ ràng"
          href="/du-an"
        />
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

      <section className="mx-auto max-w-7xl py-8 container-px">
        <SectionHeading
          title="Bất động sản đang bán"
          subtitle="Tin đã kiểm duyệt — sắp xếp để bạn so sánh nhanh"
          href="/mua-ban"
        />
        {saleListings.length > 0 ? (
          <>
            {listingsAreCatalog ? (
              <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
                Tin minh hoạ — kho tin thật cập nhật khi môi giới đăng trên HouseX.
              </p>
            ) : null}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {saleListings.map((l) => (
                <ListingCard key={l.code} item={l} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState label="Chưa có tin phù hợp. Xem thêm tại mục Mua bán." />
        )}
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto grid max-w-7xl gap-6 py-10 container-px sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_TRUST.map((t) => (
            <div key={t.title} className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xl text-brand-600 ring-1 ring-brand-100">
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-brand-900 to-ink-800 p-8 text-center sm:flex-row sm:text-left">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 100% 0%, rgba(218,165,32,0.15), transparent 50%)",
            }}
          />
          <div className="relative flex flex-col items-center justify-between gap-6 sm:flex-row">
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
        </div>
      </section>
    </>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">
      {label}
    </div>
  );
}
