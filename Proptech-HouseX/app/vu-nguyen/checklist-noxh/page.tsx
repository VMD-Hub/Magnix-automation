import type { Metadata } from "next";
import Link from "next/link";
import { PrintChecklistButton } from "@/components/personal-brand/vu-nguyen/print-checklist-button";
import { ProfileBrandHero } from "@/components/personal-brand/vu-nguyen/profile-brand-hero";
import { RubySurfaceOrnament } from "@/components/brand/ruby-surface-ornament";
import { ButtonLink } from "@/components/ui/button";
import { NOXH_LEGAL_CHECKLIST } from "@/lib/personal-brand/vu-nguyen/checklist-noxh-content";
import { VU_NGUYEN_STORIES_LABEL } from "@/lib/personal-brand/vu-nguyen/profile-content";
import { VU_NGUYEN_PORTFOLIO_PATH } from "@/lib/personal-brand/vu-nguyen/nfc-mode";
import { getLegalEntityDisclosure } from "@/lib/content/legal-entity";
import { getSiteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: NOXH_LEGAL_CHECKLIST.title,
  description:
    "Checklist 10 điểm rà soát rủi ro pháp lý và tài chính khi mua NOXH — Vũ Nguyễn, Co-Founder House X.",
  alternates: {
    canonical: `${getSiteUrl()}/vu-nguyen/checklist-noxh`,
  },
};

export default function ChecklistNoxhPage() {
  const c = NOXH_LEGAL_CHECKLIST;
  const disclosure = getLegalEntityDisclosure().vi;

  return (
    <article className="proptech-catalog-page proptech-section-glow mx-auto max-w-2xl py-6 container-px print:max-w-none print:py-4 sm:py-8">
      <RubySurfaceOrnament variant="page" />

      <div className="not-prose mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href={VU_NGUYEN_PORTFOLIO_PATH}
          className="text-sm font-medium text-brand-700 hover:text-brand-900"
        >
          ← {VU_NGUYEN_STORIES_LABEL}
        </Link>
        <PrintChecklistButton />
      </div>

      <ProfileBrandHero kicker="Checklist rà soát NOXH" />

      <header className="proptech-ruby-soft-panel relative z-10 -mt-3 px-5 py-6 sm:-mt-4 sm:px-7 sm:py-8">
        <p className="proptech-kicker">{c.author}</p>
        <h1 className="lux-heading-accent mt-2 text-2xl font-extrabold sm:text-3xl">
          {c.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.subtitle}</p>
      </header>

      <div className="proptech-catalog-page__content mt-8 space-y-10">
        {c.sections.map((section) => (
          <section key={section.id}>
            <h2 className="lux-heading-accent text-lg font-extrabold text-brand-800">
              {section.title}
            </h2>
            <ul className="mt-4 space-y-3">
              {section.items.map((item) => (
                <li
                  key={item.id}
                  className="proptech-card flex gap-3 p-4 print:break-inside-avoid sm:p-5"
                >
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-brand-400 print:border-slate-600"
                    aria-hidden
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {item.hint}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <footer className="proptech-catalog-page__content mt-10 space-y-4 border-t border-brand-100 pt-6 text-xs leading-relaxed text-slate-500">
        <p>{c.disclaimer}</p>
        <p>{disclosure}</p>
        <p className="print:hidden">
          Ghi chú khách / ngày: _________________________
        </p>
        <div className="not-prose flex flex-wrap gap-3 print:hidden">
          <ButtonLink href={c.footerCta.review} variant="primary" size="sm">
            Đặt lịch rà soát 15 phút
          </ButtonLink>
          <ButtonLink href={c.footerCta.tools} variant="outline" size="sm">
            Kiểm tra điều kiện NOXH
          </ButtonLink>
          <ButtonLink href={c.footerCta.profile} variant="ghost" size="sm">
            Digital name card
          </ButtonLink>
        </div>
      </footer>
    </article>
  );
}
