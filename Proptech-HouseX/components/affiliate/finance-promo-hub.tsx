import Link from "next/link";
import type { AffiliateVertical } from "@/lib/content/affiliate-verticals";
import { HOUSEX_SERVICES_LABEL } from "@/lib/content/housex-services-copy";
import {
  AffiliateBreadcrumbs,
  AffiliateDisclaimer,
} from "@/components/affiliate/affiliate-vertical-hub";
import { AffiliateContactForm } from "@/components/affiliate/affiliate-contact-form";
import { PartnerBankGrid } from "@/components/ui/partner-bank-grid";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
} from "@/lib/seo/affiliate-json-ld";

export function FinancePromoHub({ vertical }: { vertical: AffiliateVertical }) {
  const breadcrumbs = [
    { name: "Trang chủ", path: "/" },
    { name: HOUSEX_SERVICES_LABEL, path: "/dich-vu" },
    { name: vertical.h1, path: vertical.path },
  ];

  return (
    <div className="mx-auto max-w-3xl py-10 container-px">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd(breadcrumbs)),
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

      <AffiliateBreadcrumbs items={breadcrumbs} />

      <header className="mt-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          Dịch vụ HouseX
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">{vertical.h1}</h1>
        <p className="mt-3 text-slate-600">{vertical.intro}</p>
      </header>

      <AffiliateDisclaimer text={vertical.disclaimer} />

      {vertical.productLines && vertical.productLines.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">
            Hai nhóm sản phẩm vay phổ biến
          </h2>
          <ul className="mt-4 space-y-4">
            {vertical.productLines.map((p) => (
              <li
                key={p.id}
                id={p.id}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <h3 className="font-semibold text-brand-700">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{p.desc}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {vertical.partners && vertical.partners.length > 0 ? (
        <PartnerBankGrid
          className="mt-10"
          partners={vertical.partners}
          intro={vertical.partnerIntro}
          compact
        />
      ) : null}

      {vertical.toolLinks && vertical.toolLinks.length > 0 ? (
        <section className="mt-8 flex flex-wrap gap-3">
          {vertical.toolLinks.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="rounded-xl bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 hover:bg-brand-100"
            >
              {t.label} →
            </Link>
          ))}
        </section>
      ) : null}

      {vertical.hubFaqs ? (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">Câu hỏi thường gặp</h2>
          <div className="mt-4 space-y-5">
            {vertical.hubFaqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold text-slate-900">{f.q}</h3>
                <p className="mt-1 text-sm text-slate-600">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12" id="tu-van">
        <AffiliateContactForm defaultVertical="tai-chinh" />
      </section>
    </div>
  );
}
