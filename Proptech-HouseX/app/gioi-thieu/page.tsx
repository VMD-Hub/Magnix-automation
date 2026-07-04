import type { Metadata } from "next";
import Link from "next/link";
import { ToolsPageHero } from "@/components/tools/tools-page-hero";
import { FounderNoteBlock } from "@/components/content/founder-story-sections";
import { DocPlainBulletList, HOUSEX_PROSE_CLASS } from "@/components/content/document-typography";
import {
  MetricsBand,
  PageCtaBand,
  ProcessSteps,
  QuickLinkGrid,
} from "@/components/content/trust-page-sections";
import {
  ABOUT_BUYER_BENEFITS,
  ABOUT_CORE_VALUES,
  ABOUT_CTA,
  ABOUT_HERO,
  ABOUT_MISSION_VISION,
  ABOUT_PARTNER_SECTION,
  ABOUT_PROCESS_STEPS,
  ABOUT_QUICK_LINKS,
  ABOUT_SEO,
} from "@/lib/content/messaging/about-public";
import { getPlatformMetrics } from "@/lib/content/platform-metrics";
import { FOUNDER_NOTE } from "@/lib/content/trust-hub-content";
import { HOUSEX_HERO_SLIDES } from "@/lib/brand/hero-assets";
import { getSiteUrl } from "@/lib/site-config";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: ABOUT_SEO.metaTitle,
  description: ABOUT_SEO.metaDescription,
  alternates: { canonical: `${getSiteUrl()}/gioi-thieu` },
};

export default function GioiThieuPage() {
  const hero = HOUSEX_HERO_SLIDES[0]!;
  const metrics = getPlatformMetrics();

  return (
    <div className="proptech-section-glow">
      <div className="mx-auto max-w-4xl py-8 container-px">
        <ToolsPageHero
          kicker={ABOUT_HERO.kicker}
          title={ABOUT_HERO.h1}
          subtitle={ABOUT_HERO.intro}
          image={hero.jpgMd}
          imageWebp={hero.webpMd}
          imageAlt="House X — cổng Proptech tìm nhà an toàn"
          objectPosition={hero.objectPosition}
          primaryCta={{ label: "Tìm nhà ngay", href: "/mua-ban" }}
          secondaryCta={{ label: "Đăng ký", href: "/dang-ky/khach-hang" }}
        />

        <ProcessSteps steps={ABOUT_PROCESS_STEPS} className="mb-10" />

        <section className="mb-12">
          <h2 className="text-xl font-extrabold text-slate-900">Giá trị cốt lõi</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {ABOUT_CORE_VALUES.items.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-silver-200 bg-white p-4 shadow-sm"
              >
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-2xl border border-silver-200 bg-slate-50 p-6 sm:p-8">
          <h2 className="text-xl font-extrabold text-slate-900">
            {ABOUT_MISSION_VISION.title}
          </h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="font-bold text-brand-700">Sứ mệnh</dt>
              <dd className="mt-1 leading-relaxed text-slate-700">
                {ABOUT_MISSION_VISION.mission}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-brand-700">Tầm nhìn</dt>
              <dd className="mt-1 leading-relaxed text-slate-700">
                {ABOUT_MISSION_VISION.vision}
              </dd>
            </div>
          </dl>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-extrabold text-slate-900">Con số nổi bật</h2>
          <MetricsBand metrics={metrics} className="mt-4" />
        </section>

        <section className={`mb-12 ${HOUSEX_PROSE_CLASS}`}>
          <h2>{ABOUT_BUYER_BENEFITS.title}</h2>
          <ul>
            {ABOUT_BUYER_BENEFITS.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-12 rounded-2xl border border-brand-100 bg-brand-50/50 p-6 sm:p-8">
          <h2 className="doc-h2 !mt-0">{ABOUT_PARTNER_SECTION.title}</h2>
          <DocPlainBulletList items={ABOUT_PARTNER_SECTION.items} className="mt-4" />
          <div className="mt-6 flex flex-wrap gap-3">
            {ABOUT_PARTNER_SECTION.ctas.map((cta, i) => (
              <ButtonLink
                key={cta.href}
                href={cta.href}
                variant={i === 0 ? "brand" : "outline"}
                size="sm"
              >
                {cta.label}
              </ButtonLink>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-extrabold text-slate-900">{ABOUT_CTA.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{ABOUT_CTA.body}</p>
          <PageCtaBand
            className="mt-4"
            primary={ABOUT_CTA.primary}
            secondary={ABOUT_CTA.secondary}
          />
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-extrabold text-slate-900">Liên kết nhanh</h2>
          <QuickLinkGrid links={ABOUT_QUICK_LINKS} className="mt-6" />
        </section>

        <FounderNoteBlock note={FOUNDER_NOTE} teaserParagraphs={1} className="mb-10" />

        <p className="text-sm text-slate-600">
          <Link href="/gioi-thieu/cau-chuyen" className="font-semibold text-brand-700 underline">
            Đọc câu chuyện thương hiệu đầy đủ
          </Link>
          {" · "}
          <Link
            href="/gioi-thieu/phuong-phap-bien-tap"
            className="font-semibold text-brand-700 underline"
          >
            Phương pháp biên tập
          </Link>
        </p>
      </div>
    </div>
  );
}
