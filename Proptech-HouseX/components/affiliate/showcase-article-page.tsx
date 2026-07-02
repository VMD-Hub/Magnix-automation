import Link from "next/link";
import type { AffiliateService, AffiliateVertical } from "@/lib/content/affiliate-verticals";
import { HOUSEX_SERVICES_LABEL } from "@/lib/content/housex-services-copy";
import {
  cardImageForSlug,
  VERTICAL_VISUALS,
} from "@/lib/content/housex-services-visuals";
import {
  ServiceFaqSection,
  ServiceLandingHero,
} from "@/components/affiliate/service-landing-parts";
import { AffiliateContactForm } from "@/components/affiliate/affiliate-contact-form";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildServiceJsonLd,
} from "@/lib/seo/affiliate-json-ld";

/** Bài cảm hứng phong cách — dẫn về dịch vụ thiết kế HouseX. */
export function ShowcaseArticlePage({
  vertical,
  article,
}: {
  vertical: AffiliateVertical;
  article: AffiliateService;
}) {
  const visual = VERTICAL_VISUALS[vertical.id];
  const heroImage = cardImageForSlug(article.slug);
  const breadcrumbs = [
    { name: "Trang chủ", path: "/" },
    { name: HOUSEX_SERVICES_LABEL, path: "/dich-vu" },
    { name: vertical.h1, path: vertical.path },
    { name: article.title, path: `${vertical.path}/${article.slug}` },
  ];

  return (
    <article className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd(breadcrumbs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildServiceJsonLd(vertical, article)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFaqJsonLd(article.faqs)),
        }}
      />

      <ServiceLandingHero
        eyebrow={article.tags?.join(" · ") ?? "Nội thất HouseX"}
        title={article.h1}
        intro={article.intro}
        heroImage={heroImage}
        heroGradient={visual.heroGradient}
        breadcrumbs={breadcrumbs}
        primaryCta={{ label: article.ctaLabel ?? "Tư vấn thiết kế", href: "#tu-van" }}
        secondaryCta={{ label: "← Phong cách khác", href: vertical.path }}
      />

      <div className="mx-auto max-w-7xl py-12 container-px">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            {article.body ? (
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="aspect-[21/9] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={heroImage} alt="" className="h-full w-full object-cover" />
                </div>
                <p className="p-6 text-sm leading-relaxed text-slate-700">{article.body}</p>
              </section>
            ) : null}

            <section className="mt-8 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6">
              <p className="text-sm text-slate-700">
                <strong className="text-slate-900">Thích phong cách này?</strong> Gửi form —
                đội ngũ thiết kế HouseX khảo sát hiện trạng và báo giá triển khai cho căn nhà
                của bạn.
              </p>
            </section>

            <div className="mt-10 lg:hidden">
              <ServiceFaqSection title="Câu hỏi thường gặp" faqs={article.faqs} />
            </div>
          </div>

          <aside id="tu-van" className="lg:sticky lg:top-24">
            <AffiliateContactForm defaultVertical="noi-that" />
          </aside>
        </div>

        <div className="mt-10 hidden lg:block">
          <ServiceFaqSection title="Câu hỏi thường gặp" faqs={article.faqs} />
        </div>

        <p className="mt-10 text-center">
          <Link href={vertical.path} className="text-sm font-semibold text-brand-700 underline">
            ← Xem thêm phong cách nội thất
          </Link>
        </p>
      </div>
    </article>
  );
}
