import Link from "next/link";
import type { AffiliateFaq } from "@/lib/content/affiliate-verticals";
import { RubySurfaceOrnament } from "@/components/brand/ruby-surface-ornament";
import { AffiliateContactForm } from "@/components/affiliate/affiliate-contact-form";
import { EmbedAwareLink } from "@/components/miniapp/embed-links";
import type { ServiceVerticalId } from "@/lib/content/housex-services-visuals";

export function ServiceLandingHero({
  eyebrow,
  title,
  intro,
  heroImage,
  heroImageWebp,
  heroGradient: _heroGradient,
  breadcrumbs,
  primaryCta,
  secondaryCta,
}: {
  eyebrow?: string;
  title: string;
  intro: string;
  heroImage: string;
  heroImageWebp?: string;
  heroGradient: string;
  breadcrumbs?: { name: string; path: string }[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}) {
  return (
    <section className="proptech-catalog-hero relative isolate min-h-[380px] overflow-hidden text-white sm:min-h-[440px] lg:min-h-[480px]">
      <RubySurfaceOrnament variant="holder" />
      <picture className="absolute inset-0 block h-full w-full">
        {heroImageWebp ? (
          <source srcSet={heroImageWebp} type="image/webp" />
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
      </picture>
      <div className="proptech-catalog-hero__overlay-h" aria-hidden />
      <div className="proptech-catalog-hero__overlay-v" aria-hidden />

      <div className="proptech-catalog-hero__content relative mx-auto flex min-h-[380px] max-w-7xl flex-col justify-end px-4 py-10 container-px sm:min-h-[440px] sm:py-14 lg:min-h-[480px]">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="text-sm text-slate-300">
            {breadcrumbs.map((item, i) => (
              <span key={item.path}>
                {i > 0 ? <span className="mx-2 text-slate-500">/</span> : null}
                {i < breadcrumbs.length - 1 ? (
                  <EmbedAwareLink href={item.path} className="hover:text-white">
                    {item.name}
                  </EmbedAwareLink>
                ) : (
                  <span className="text-slate-200">{item.name}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}

        {eyebrow ? (
          <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-brand-300">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
          {intro}
        </p>

        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryCta ? (
              <EmbedAwareLink
                href={primaryCta.href}
                className="inline-flex h-12 items-center rounded-xl bg-brand-500 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-900/30 hover:bg-brand-400"
              >
                {primaryCta.label}
              </EmbedAwareLink>
            ) : null}
            {secondaryCta ? (
              <EmbedAwareLink
                href={secondaryCta.href}
                className="inline-flex h-12 items-center rounded-xl border border-white/30 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20"
              >
                {secondaryCta.label}
              </EmbedAwareLink>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

export function ServiceStatsBand({
  stats,
  accentBg,
}: {
  stats: { label: string; value: string }[];
  accentBg?: string;
}) {
  return (
    <section className={`border-b border-slate-200 ${accentBg ?? "bg-white"}`}>
      <div className="mx-auto grid max-w-7xl gap-6 py-8 container-px sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="text-center sm:text-left">
            <p className="text-2xl font-extrabold text-ink-900">{s.value}</p>
            <p className="mt-1 text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ServiceProcessSteps({
  title,
  steps,
  accentText,
  columns = 3,
}: {
  title: string;
  steps: { step: string; title: string; desc: string }[];
  accentText?: string;
  columns?: 3 | 5;
}) {
  const gridClass =
    columns === 5
      ? "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5"
      : "mt-8 grid gap-6 md:grid-cols-3";
  return (
    <section className="mx-auto max-w-7xl py-14 container-px">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <ol className={gridClass}>
        {steps.map((s) => (
          <li
            key={s.step}
            className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <span
              className={`text-3xl font-black ${accentText ?? "text-brand-600"} opacity-30`}
            >
              {s.step}
            </span>
            <h3 className="mt-2 font-bold text-slate-900">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ServiceTrustGrid({
  items,
  accentBg,
}: {
  items: { title: string; desc: string }[];
  accentBg?: string;
}) {
  return (
    <section className={`${accentBg ?? "bg-slate-50"} border-y border-slate-200`}>
      <div className="mx-auto grid max-w-7xl gap-6 py-10 container-px sm:grid-cols-3">
        {items.map((t) => (
          <div key={t.title}>
            <p className="font-semibold text-slate-900">{t.title}</p>
            <p className="mt-1 text-sm text-slate-600">{t.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ServiceImageCard({
  href,
  image,
  badge,
  title,
  desc,
  cta = "Xem chi tiết →",
}: {
  href: string;
  image: string;
  badge?: string;
  title: string;
  desc: string;
  cta?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink-900 shadow">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-bold text-slate-900 group-hover:text-brand-700">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
          {desc}
        </p>
        <span className="mt-4 text-sm font-semibold text-brand-600">{cta}</span>
      </div>
    </Link>
  );
}

export function ServiceFaqSection({
  title,
  faqs,
  id,
}: {
  title: string;
  faqs: AffiliateFaq[];
  id?: string;
}) {
  if (!faqs.length) return null;
  return (
    <section id={id} className="mx-auto max-w-3xl scroll-mt-24 py-14 container-px">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <dl className="mt-6 space-y-4">
        {faqs.map((f) => (
          <div
            key={f.q}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <dt className="font-semibold text-slate-900">{f.q}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ServiceCtaSection({
  verticalId,
  title = "Nhận tư vấn miễn phí",
  subtitle = "Để lại thông tin — đội ngũ HouseX phản hồi trong giờ làm việc.",
}: {
  verticalId?: ServiceVerticalId;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="proptech-ruby-band py-14">
      <RubySurfaceOrnament variant="holder" />
      <div className="relative z-[1] mx-auto grid max-w-7xl gap-10 container-px lg:grid-cols-2 lg:items-center">
        <div className="text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
          <p className="mt-3 text-silver-200">{subtitle}</p>
          <ul className="mt-6 space-y-2 text-sm text-silver-200/80">
            <li>✓ Phản hồi nhanh trong giờ làm việc</li>
            <li>✓ Minh bạch quy trình &amp; chi phí</li>
            <li>✓ Đúng quy định pháp luật Việt Nam</li>
          </ul>
        </div>
        <div id="tu-van" className="rounded-2xl bg-white p-1 shadow-xl">
          <AffiliateContactForm
            defaultVertical={verticalId}
            compact={false}
          />
        </div>
      </div>
    </section>
  );
}

export function ServiceToolLinks({
  links,
  note,
}: {
  links: { label: string; href: string }[];
  note?: string;
}) {
  if (!links.length) return null;
  return (
    <section className="mx-auto max-w-7xl py-10 container-px">
      <div className="proptech-ruby-soft-panel p-6">
        <h2 className="text-lg font-bold text-slate-900">Công cụ hỗ trợ</h2>
        {note ? <p className="mt-1 text-sm text-slate-600">{note}</p> : null}
        <div className="mt-4 flex flex-wrap gap-3">
          {links.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow-sm ring-1 ring-brand-200 hover:bg-brand-100"
            >
              {t.label} →
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
