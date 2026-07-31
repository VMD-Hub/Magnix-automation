import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { CtvArticleGrid } from "@/components/ctv/ctv-article-grid";
import { CtvCashflowInfographic } from "@/components/ctv/ctv-cashflow-infographic";
import { CtvPersonaCards } from "@/components/ctv/ctv-persona-cards";
import {
  CTV_AFFILIATE_ARTICLES_SECTION,
  CTV_AFFILIATE_BENEFITS,
  CTV_AFFILIATE_CLOSING_HEADING,
  CTV_AFFILIATE_CTAS,
  CTV_AFFILIATE_FAQS,
  CTV_AFFILIATE_H1,
  CTV_AFFILIATE_LEAD,
  CTV_AFFILIATE_PAIN,
  CTV_AFFILIATE_PATH,
  CTV_AFFILIATE_PERSONAS,
  CTV_AFFILIATE_RULES,
  CTV_AFFILIATE_SEO_DESCRIPTION,
  CTV_AFFILIATE_SEO_TITLE,
  CTV_AFFILIATE_TIERS,
  CTV_AFFILIATE_TITLE,
  CTV_AFFILIATE_WHO,
} from "@/lib/content/ctv-affiliate-landing";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo/affiliate-json-ld";
import { withOpenGraph } from "@/lib/seo/open-graph";
import { getSiteUrl } from "@/lib/site-config";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const canonical = `${getSiteUrl()}${CTV_AFFILIATE_PATH}`;
  return {
    title: CTV_AFFILIATE_SEO_TITLE,
    description: CTV_AFFILIATE_SEO_DESCRIPTION,
    robots: { index: true, follow: true },
    alternates: { canonical },
    openGraph: withOpenGraph({
      title: CTV_AFFILIATE_SEO_TITLE,
      description: CTV_AFFILIATE_SEO_DESCRIPTION,
      url: canonical,
    }),
  };
}

export default function CtvAffiliateLandingPage() {
  const site = getSiteUrl();
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Trang chủ", path: "/" },
    { name: "Hợp tác", path: "/hop-tac" },
    { name: CTV_AFFILIATE_TITLE, path: CTV_AFFILIATE_PATH },
  ]);
  const faqLd = buildFaqJsonLd(
    CTV_AFFILIATE_FAQS.map((f) => ({ q: f.question, a: f.answer })),
  );
  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: CTV_AFFILIATE_SEO_TITLE,
    description: CTV_AFFILIATE_SEO_DESCRIPTION,
    url: `${site}${CTV_AFFILIATE_PATH}`,
    isPartOf: { "@type": "WebSite", name: "House X", url: site },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />

      <div className="bg-slate-50">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-12 container-px sm:py-16">
            <nav className="text-sm text-slate-500">
              <Link href="/" className="hover:text-brand-700">
                Trang chủ
              </Link>
              <span className="mx-2">/</span>
              <Link href="/hop-tac" className="hover:text-brand-700">
                Hợp tác
              </Link>
              <span className="mx-2">/</span>
              <span className="text-slate-800">Cộng tác viên</span>
            </nav>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-brand-700">
              Chương trình đối tác
            </p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              {CTV_AFFILIATE_H1}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
              {CTV_AFFILIATE_LEAD}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={CTV_AFFILIATE_CTAS.primary.href} size="lg">
                {CTV_AFFILIATE_CTAS.primary.label}
              </ButtonLink>
              <ButtonLink
                href={CTV_AFFILIATE_CTAS.secondary.href}
                variant="outline"
                size="lg"
              >
                {CTV_AFFILIATE_CTAS.secondary.label}
              </ButtonLink>
              <ButtonLink
                href={CTV_AFFILIATE_CTAS.tertiary.href}
                variant="outline"
                size="lg"
              >
                {CTV_AFFILIATE_CTAS.tertiary.label}
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl space-y-14 px-4 py-12 container-px sm:py-16">
          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              {CTV_AFFILIATE_PAIN.heading}
            </h2>
            {CTV_AFFILIATE_PAIN.body.map((p) => (
              <p key={p.slice(0, 40)} className="mt-4 leading-relaxed text-slate-600">
                {p}
              </p>
            ))}
          </section>

          <section>
            <CtvCashflowInfographic />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              {CTV_AFFILIATE_WHO.heading}
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              {CTV_AFFILIATE_WHO.intro}
            </p>
            <CtvPersonaCards personas={CTV_AFFILIATE_PERSONAS} />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              {CTV_AFFILIATE_TIERS.heading}
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              {CTV_AFFILIATE_TIERS.lead}
            </p>
            <ol className="mt-6 space-y-5">
              {CTV_AFFILIATE_TIERS.items.map((tier, i) => (
                <li key={tier.name} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{tier.name}</h3>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      {tier.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-600">
              {CTV_AFFILIATE_TIERS.note}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              {CTV_AFFILIATE_ARTICLES_SECTION.heading}
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              {CTV_AFFILIATE_ARTICLES_SECTION.intro}
            </p>
            <CtvArticleGrid />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              {CTV_AFFILIATE_RULES.heading}
            </h2>
            <ol className="mt-6 space-y-5">
              {CTV_AFFILIATE_RULES.steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-600">
              {CTV_AFFILIATE_RULES.note}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              {CTV_AFFILIATE_BENEFITS.heading}
            </h2>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold text-slate-900">
                  {CTV_AFFILIATE_BENEFITS.forReferrers.title}
                </h3>
                <ul className="mt-3 space-y-2 text-slate-600">
                  {CTV_AFFILIATE_BENEFITS.forReferrers.items.map((item) => (
                    <li key={item.slice(0, 40)} className="leading-relaxed">
                      · {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  {CTV_AFFILIATE_BENEFITS.forPros.title}
                </h3>
                <ul className="mt-3 space-y-2 text-slate-600">
                  {CTV_AFFILIATE_BENEFITS.forPros.items.map((item) => (
                    <li key={item.slice(0, 40)} className="leading-relaxed">
                      · {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              Câu hỏi thường gặp
            </h2>
            <dl className="mt-6 space-y-6">
              {CTV_AFFILIATE_FAQS.map((f) => (
                <div key={f.question}>
                  <dt className="font-semibold text-slate-900">{f.question}</dt>
                  <dd className="mt-2 leading-relaxed text-slate-600">
                    {f.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="border-t border-slate-200 pt-10">
            <h2 className="text-2xl font-bold text-slate-900">
              {CTV_AFFILIATE_CLOSING_HEADING}
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              {CTV_AFFILIATE_CTAS.closing}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={CTV_AFFILIATE_CTAS.primary.href} size="lg">
                {CTV_AFFILIATE_CTAS.primary.label}
              </ButtonLink>
              <ButtonLink
                href={CTV_AFFILIATE_CTAS.secondary.href}
                variant="outline"
                size="lg"
              >
                {CTV_AFFILIATE_CTAS.secondary.label}
              </ButtonLink>
              <ButtonLink
                href={CTV_AFFILIATE_CTAS.tertiary.href}
                variant="outline"
                size="lg"
              >
                {CTV_AFFILIATE_CTAS.tertiary.label}
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              Xem thêm{" "}
              <Link href="/hop-tac" className="font-medium text-brand-700 hover:underline">
                Hợp tác & đăng tin
              </Link>
              {" · "}
              <Link
                href="/wiki-nha-o-xa-hoi"
                className="font-medium text-brand-700 hover:underline"
              >
                Wiki nhà ở xã hội
              </Link>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
