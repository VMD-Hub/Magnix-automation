import Link from "next/link";
import type { AffiliateVertical } from "@/lib/content/affiliate-verticals";
import { HOUSEX_SERVICES_LABEL } from "@/lib/content/housex-services-copy";
import {
  VERTICAL_VISUALS,
  cardImageForSlug,
} from "@/lib/content/housex-services-visuals";
import {
  ServiceCtaSection,
  ServiceFaqSection,
  ServiceImageCard,
  ServiceLandingHero,
  ServiceProcessSteps,
  ServiceStatsBand,
  ServiceToolLinks,
  ServiceTrustGrid,
} from "@/components/affiliate/service-landing-parts";
import { PartnerBankGrid } from "@/components/ui/partner-bank-grid";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildVerticalCollectionJsonLd,
} from "@/lib/seo/affiliate-json-ld";

export function ServiceVerticalLanding({ vertical }: { vertical: AffiliateVertical }) {
  const visual = VERTICAL_VISUALS[vertical.id];
  const breadcrumbs = [
    { name: "Trang chủ", path: "/" },
    { name: HOUSEX_SERVICES_LABEL, path: "/dich-vu" },
    { name: vertical.h1, path: vertical.path },
  ];

  const servicesSectionTitle =
    vertical.id === "dinh-gia"
      ? "Dịch vụ thẩm định giá"
      : vertical.id === "noi-that"
        ? "Phong cách & ý tưởng"
        : "Gói vay phổ biến";

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd(breadcrumbs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildVerticalCollectionJsonLd(vertical)),
        }}
      />
      {vertical.hubFaqs ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildFaqJsonLd(vertical.hubFaqs)),
          }}
        />
      ) : null}

      <ServiceLandingHero
        eyebrow="Dịch vụ HouseX"
        title={vertical.h1}
        intro={vertical.intro}
        heroImage={visual.heroImage}
        heroGradient={visual.heroGradient}
        breadcrumbs={breadcrumbs}
        primaryCta={{ label: "Nhận tư vấn", href: "#tu-van" }}
        secondaryCta={
          vertical.toolLinks?.[0]
            ? { label: vertical.toolLinks[0].label, href: vertical.toolLinks[0].href }
            : undefined
        }
      />

      <ServiceStatsBand stats={visual.stats} accentBg={visual.accentBg} />

      {/* Product lines (tài chính) */}
      {vertical.productLines && vertical.productLines.length > 0 ? (
        <section className="mx-auto max-w-7xl py-14 container-px">
          <h2 className="text-2xl font-bold text-slate-900">{servicesSectionTitle}</h2>
          <p className="mt-2 max-w-2xl text-slate-600">{vertical.disclaimer}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {vertical.productLines.map((p) => (
              <div
                key={p.id}
                id={p.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-[21/9] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cardImageForSlug(p.id)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Service cards (định giá) */}
      {vertical.services.length > 0 ? (
        <section className="mx-auto max-w-7xl py-14 container-px">
          <h2 className="text-2xl font-bold text-slate-900">{servicesSectionTitle}</h2>
          <p className="mt-2 max-w-2xl text-slate-600">{vertical.disclaimer}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vertical.services.map((s) => (
              <ServiceImageCard
                key={s.slug}
                href={`${vertical.path}/${s.slug}`}
                image={cardImageForSlug(s.slug)}
                badge={s.tags?.[0]}
                title={s.title}
                desc={s.intro}
                cta={`${s.ctaLabel ?? "Xem chi tiết"} →`}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* Showcases (nội thất) */}
      {vertical.showcases && vertical.showcases.length > 0 ? (
        <section className="mx-auto max-w-7xl py-14 container-px">
          <h2 className="text-2xl font-bold text-slate-900">{servicesSectionTitle}</h2>
          <p className="mt-2 text-slate-600">
            Cảm hứng thiết kế — gửi yêu cầu để nhận khảo sát và báo giá cụ thể.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vertical.showcases.map((s) => (
              <ServiceImageCard
                key={s.slug}
                href={`${vertical.path}/${s.slug}`}
                image={cardImageForSlug(s.slug)}
                badge={s.tags?.[0]}
                title={s.title}
                desc={s.intro}
                cta="Xem ý tưởng →"
              />
            ))}
          </div>
        </section>
      ) : null}

      <ServiceProcessSteps
        title="Quy trình triển khai"
        steps={visual.process}
        accentText={visual.accentText}
      />

      <ServiceTrustGrid items={visual.trust} accentBg="bg-white" />

      {/* Ngân hàng (tài chính) */}
      {vertical.partners && vertical.partners.length > 0 ? (
        <PartnerBankGrid
          className="mx-auto max-w-7xl py-14 container-px"
          partners={vertical.partners}
          intro={vertical.partnerIntro}
        />
      ) : null}

      {vertical.toolLinks ? (
        <ServiceToolLinks
          links={vertical.toolLinks}
          note={
            vertical.id === "dinh-gia"
              ? "Tính toán vay tham khảo — không thay thế chứng thư thẩm định chính thức."
              : "Tính toán miễn phí — không thay thế tư vấn ngân hàng."
          }
        />
      ) : null}

      <ServiceFaqSection
        title={
          vertical.id === "dinh-gia"
            ? "Câu hỏi thường gặp về thẩm định giá"
            : "Câu hỏi thường gặp"
        }
        faqs={vertical.hubFaqs ?? []}
      />

      <ServiceCtaSection verticalId={vertical.id} />

      <div className="mx-auto max-w-7xl pb-8 text-center container-px">
        <Link href="/dich-vu" className="text-sm font-semibold text-brand-700 hover:underline">
          ← Xem tất cả dịch vụ HouseX
        </Link>
      </div>
    </div>
  );
}
