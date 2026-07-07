import Link from "next/link";
import { HeroBrandBackground } from "@/components/home/hero-brand-background";
import { SearchHero } from "@/components/home/search-hero";
import { PLATFORM_HERO } from "@/lib/content/messaging/platform-public";

/** Preview tĩnh — hero brand giống trang chủ, không gọi DB. */
export const dynamic = "force-static";

export default function HeroCinematicPreviewPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-center text-xs text-[var(--muted)]">
        Xem trước hero —{" "}
        <Link href="/" className="font-semibold text-brand-600 hover:underline">
          Trang chủ
        </Link>
      </div>

      <section className="lux-hero lux-hero--home lux-hero--brand relative min-h-[min(100vh,920px)] overflow-hidden">
        <div className="lux-hero-mesh" aria-hidden />
        <HeroBrandBackground />

        <div className="lux-hero-inner relative z-[2] mx-auto flex min-h-[min(100vh,920px)] max-w-7xl flex-col justify-center py-16 container-px sm:py-24">
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
            <SearchHero tone="rubyHero" />
          </div>
        </div>
      </section>
    </div>
  );
}
