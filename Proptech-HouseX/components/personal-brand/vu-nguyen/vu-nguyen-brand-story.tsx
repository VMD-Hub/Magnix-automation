import Link from "next/link";
import { BrandPillarSlideDeck } from "@/components/personal-brand/vu-nguyen/brand-pillar-slide-deck";
import { ProfileBrandHero } from "@/components/personal-brand/vu-nguyen/profile-brand-hero";
import { RubySurfaceOrnament } from "@/components/brand/ruby-surface-ornament";
import { HOUSEX_BRAND_DNA_CARD } from "@/lib/personal-brand/vu-nguyen/housex-brand-dna";
import { VU_NGUYEN_STORIES_LABEL } from "@/lib/personal-brand/vu-nguyen/profile-content";

/** DNA House X — mở rộng từ digital name card (không case). */
export function VuNguyenBrandStory() {
  const d = HOUSEX_BRAND_DNA_CARD;

  return (
    <div className="proptech-catalog-page proptech-section-glow mx-auto max-w-lg container-px py-6 sm:max-w-xl sm:py-8">
      <RubySurfaceOrnament variant="page" />

      <div className="mb-4">
        <Link href="/vu-nguyen" className="text-sm font-medium text-brand-700 hover:text-brand-900">
          ← Digital name card
        </Link>
      </div>

      <ProfileBrandHero kicker={VU_NGUYEN_STORIES_LABEL} />

      <div className="proptech-catalog-page__content mt-8 space-y-8 sm:mt-10 sm:space-y-10">
        <section className="proptech-ruby-soft-panel p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            {d.header}
          </p>
          <p className="mt-3 text-sm font-bold leading-relaxed text-brand-900">{d.promise}</p>
        </section>

        <section>
          <h2 className="lux-heading-accent text-lg font-extrabold text-brand-800">
            Kim chỉ nam thương hiệu
          </h2>
          <p className="mt-1 text-xs text-slate-500">Vuốt ngang — mỗi lần thấy 2 thẻ</p>
          <div className="mt-4">
            <BrandPillarSlideDeck pillars={d.pillars} />
          </div>
        </section>

        <section className="proptech-ruby-soft-panel p-5 sm:p-6">
          <h2 className="text-sm font-bold text-brand-800">Định hướng</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{d.direction}</p>
          <p className="mt-4 text-xs font-semibold tracking-wide text-gold-700">{d.tagline}</p>
        </section>

        <section>
          <h2 className="lux-heading-accent text-lg font-extrabold text-brand-800">Khám phá thêm</h2>
          <ul className="mt-4 space-y-3">
            {d.exploreLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="proptech-ruby-link-card flex items-center justify-between px-4 py-3"
                >
                  <span>
                    <span className="block text-sm font-bold text-slate-900">{link.label}</span>
                    <span className="text-xs text-slate-500">{link.desc}</span>
                  </span>
                  <span className="text-brand-600" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="pb-4 text-center text-xs text-slate-500">
          <Link href="/" className="font-medium text-brand-700 hover:text-brand-900">
            ← Về House X
          </Link>
        </p>
      </div>
    </div>
  );
}
