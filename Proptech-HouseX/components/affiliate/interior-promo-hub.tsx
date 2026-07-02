import Link from "next/link";
import type { AffiliateVertical } from "@/lib/content/affiliate-verticals";
import { HOUSEX_SERVICES_LABEL } from "@/lib/content/housex-services-copy";
import {
  AffiliateBreadcrumbs,
  AffiliateDisclaimer,
} from "@/components/affiliate/affiliate-vertical-hub";
import { AffiliateContactForm } from "@/components/affiliate/affiliate-contact-form";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
} from "@/lib/seo/affiliate-json-ld";

export function InteriorPromoHub({ vertical }: { vertical: AffiliateVertical }) {
  const breadcrumbs = [
    { name: "Trang chủ", path: "/" },
    { name: HOUSEX_SERVICES_LABEL, path: "/dich-vu" },
    { name: vertical.h1, path: vertical.path },
  ];

  return (
    <div className="mx-auto max-w-7xl py-10 container-px">
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

      <header className="mt-4 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          Dịch vụ HouseX
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">{vertical.h1}</h1>
        <p className="mt-3 text-slate-600">{vertical.intro}</p>
      </header>

      <AffiliateDisclaimer text={vertical.disclaimer} />

      {vertical.showcases && vertical.showcases.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">
            Phong cách & ý tưởng nhà đẹp
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Cảm hứng thiết kế — gửi yêu cầu để nhận khảo sát và báo giá cụ thể.
          </p>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vertical.showcases.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`${vertical.path}/${s.slug}`}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-brand-50" />
                  <div className="flex flex-1 flex-col p-4">
                    {s.tags ? (
                      <div className="mb-2 flex flex-wrap gap-1">
                        {s.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <h3 className="font-semibold text-slate-900">{s.title}</h3>
                    <p className="mt-1 flex-1 text-sm text-slate-600 line-clamp-2">
                      {s.intro}
                    </p>
                    <span className="mt-3 text-sm font-medium text-brand-600">
                      Xem ý tưởng →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {vertical.hubFaqs ? (
        <section className="mt-10 max-w-3xl">
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

      <section className="mt-12 max-w-xl" id="tu-van">
        <AffiliateContactForm defaultVertical="noi-that" />
      </section>
    </div>
  );
}
