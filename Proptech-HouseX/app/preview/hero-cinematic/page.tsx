import Link from "next/link";
import { HeroSlideBackground } from "@/components/home/hero-slide-background";
import { SearchHero } from "@/components/home/search-hero";
import { PLATFORM_HERO } from "@/lib/content/messaging/platform-public";

/** Preview tĩnh — không gọi DB, load nhanh để duyệt hero cinematic v2. */
export const dynamic = "force-static";

export default function HeroCinematicPreviewPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-center text-xs text-[var(--muted)]">
        POC hero slide · 2 ảnh fade 8s —{" "}
        <Link href="/" className="font-semibold text-brand-600 hover:underline">
          Trang chủ
        </Link>
      </div>

      <section className="lux-hero relative min-h-[min(100vh,920px)] overflow-hidden">
        <div className="lux-hero-mesh" aria-hidden />
        <HeroSlideBackground />

        <div className="relative z-[2] mx-auto flex min-h-[min(100vh,920px)] max-w-7xl flex-col justify-center py-16 container-px sm:py-24">
          <p className="lux-hero-kicker proptech-kicker text-gold-400">
            POC v7 · {PLATFORM_HERO.kicker}
          </p>
          <h1 className="lux-hero-title mt-3 max-w-2xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            {PLATFORM_HERO.h1Line1}
            <br />
            <span className="lux-hero-title-accent text-brand-300">
              {PLATFORM_HERO.h1Accent}
            </span>
          </h1>
          <p className="lux-hero-lead mt-4 max-w-xl text-base text-silver-200">
            Skyline Thủ Thiêm · ga metro · fade 8 giây/slide.
          </p>
          <div className="mt-8">
            <SearchHero />
          </div>
        </div>
      </section>
    </div>
  );
}
