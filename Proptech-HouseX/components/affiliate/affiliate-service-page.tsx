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

/** Render nội dung body: ## tiêu đề, đoạn văn, dòng • bullet. */
function AffiliateServiceBody({ body }: { body: string }) {
  const blocks = body.split(/\n(?=## )/);
  return (
    <div className="space-y-8">
      {blocks.map((block) => {
        const lines = block.trim().split("\n");
        const heading = lines[0]?.startsWith("## ")
          ? lines[0].replace(/^## /, "")
          : null;
        const rest = heading ? lines.slice(1).join("\n").trim() : block.trim();
        const paragraphs = rest.split(/\n\n+/).filter(Boolean);
        return (
          <div
            key={heading ?? rest.slice(0, 40)}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            {heading ? (
              <h2 className="text-lg font-bold text-slate-900">{heading}</h2>
            ) : null}
            <div className={heading ? "mt-4 space-y-3" : "space-y-3"}>
              {paragraphs.map((p) => (
                <p
                  key={p.slice(0, 48)}
                  className="whitespace-pre-line text-sm leading-relaxed text-slate-700"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AffiliateServicePage({
  vertical,
  service,
}: {
  vertical: AffiliateVertical;
  service: AffiliateService;
}) {
  const visual = VERTICAL_VISUALS[vertical.id];
  const breadcrumbs = [
    { name: "Trang chủ", path: "/" },
    { name: HOUSEX_SERVICES_LABEL, path: "/dich-vu" },
    { name: vertical.h1, path: vertical.path },
    { name: service.title, path: `${vertical.path}/${service.slug}` },
  ];

  const heroImage = cardImageForSlug(service.slug);

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
          __html: JSON.stringify(buildServiceJsonLd(vertical, service)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFaqJsonLd(service.faqs)),
        }}
      />

      <ServiceLandingHero
        eyebrow={service.tags?.join(" · ") ?? "Dịch vụ HouseX"}
        title={service.h1}
        intro={service.intro}
        heroImage={heroImage}
        heroGradient={visual.heroGradient}
        breadcrumbs={breadcrumbs}
        primaryCta={{
          label: service.ctaLabel ?? "Liên hệ tư vấn",
          href: `#tu-van`,
        }}
        secondaryCta={{ label: "← Quay lại", href: vertical.path }}
      />

      <div className="mx-auto max-w-7xl py-12 container-px">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">
          <div>
            {service.body ? <AffiliateServiceBody body={service.body} /> : null}

            {vertical.id === "tai-chinh" && service.slug === "vay-mua-bat-dong-san" ? (
              <section className="mt-8 overflow-hidden proptech-ruby-soft-panel p-6">
                <h2 className="font-bold text-slate-900">Công cụ tính khoản vay</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Ước lượng tiền trả hàng tháng trước khi làm hồ sơ chính thức.
                </p>
                <Link
                  href="/cong-cu/tinh-khoan-vay"
                  className="mt-4 inline-flex h-10 items-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Mở công cụ tính lãi →
                </Link>
              </section>
            ) : null}

            <div className="mt-10 lg:hidden">
              <ServiceFaqSection title="Câu hỏi thường gặp" faqs={service.faqs} />
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <div id="tu-van" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
              <div className="aspect-video overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroImage} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="p-1">
                <AffiliateContactForm defaultVertical={vertical.id} compact />
              </div>
            </div>

            <div className="hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:block">
              <h2 className="font-bold text-slate-900">Câu hỏi nhanh</h2>
              <dl className="mt-4 space-y-4">
                {service.faqs.slice(0, 2).map((f) => (
                  <div key={f.q}>
                    <dt className="text-sm font-semibold text-slate-900">{f.q}</dt>
                    <dd className="mt-1 text-xs leading-relaxed text-slate-600 line-clamp-4">
                      {f.a}
                    </dd>
                  </div>
                ))}
              </dl>
              <Link
                href={vertical.path}
                className="mt-4 block text-center text-sm font-semibold text-brand-700 hover:underline"
              >
                ← {vertical.h1}
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-10 hidden lg:block">
          <ServiceFaqSection title="Câu hỏi thường gặp" faqs={service.faqs} />
        </div>
      </div>
    </article>
  );
}
