import Link from "next/link";
import type { AffiliateVertical } from "@/lib/content/affiliate-verticals";
import { HOUSEX_SERVICES_LABEL } from "@/lib/content/housex-services-copy";
import { PartnerBankGrid } from "@/components/ui/partner-bank-grid";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildVerticalCollectionJsonLd,
} from "@/lib/seo/affiliate-json-ld";

export function AffiliateVerticalHub({ vertical }: { vertical: AffiliateVertical }) {
  const breadcrumbs = [
    { name: "Trang chủ", path: "/" },
    { name: HOUSEX_SERVICES_LABEL, path: "/dich-vu" },
    { name: vertical.h1, path: vertical.path },
  ];

  const sectionTitle =
    vertical.id === "tai-chinh"
      ? "Gói vay mua nhà"
      : vertical.id === "dinh-gia"
        ? "Dịch vụ định giá"
        : "Thiết kế & thi công";

  return (
    <div className="mx-auto max-w-7xl py-10 container-px">
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

      <AffiliateBreadcrumbs items={breadcrumbs} />

      <header className="mt-4 max-w-3xl">
        <h1 className="text-3xl font-extrabold text-slate-900">{vertical.h1}</h1>
        <p className="mt-3 text-slate-600">{vertical.intro}</p>
      </header>

      <AffiliateDisclaimer text={vertical.disclaimer} />

      {vertical.partnerIntro && vertical.partners && vertical.partners.length > 0 ? (
        <PartnerBankGrid
          className="mt-8"
          partners={vertical.partners}
          intro={vertical.partnerIntro}
          compact
        />
      ) : null}

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">{sectionTitle}</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {vertical.services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`${vertical.path}/${s.slug}`}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:border-brand-300 hover:shadow-md"
              >
                <h3 className="font-semibold text-brand-700">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-600 line-clamp-3">
                  {s.intro}
                </p>
                <span className="mt-3 text-sm font-medium text-brand-600">
                  Xem chi tiết →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {vertical.toolLinks && vertical.toolLinks.length > 0 ? (
        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-bold text-slate-900">Công cụ hỗ trợ</h2>
          <p className="mt-1 text-sm text-slate-600">
            {vertical.id === "dinh-gia"
              ? "Tính toán vay và tra cứu tham khảo — không thay thế chứng thư thẩm định chính thức."
              : "Tính toán và tra cứu miễn phí — không thay thế tư vấn ngân hàng."}
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {vertical.toolLinks.map((t) => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-brand-700 ring-1 ring-slate-200 hover:bg-brand-50"
                >
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {vertical.hubFaqs && vertical.hubFaqs.length > 0 ? (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(buildFaqJsonLd(vertical.hubFaqs)),
            }}
          />
          <section className="mt-10 max-w-3xl">
            <h2 className="text-xl font-bold text-slate-900">
              {vertical.id === "dinh-gia"
                ? "Câu hỏi thường gặp về thẩm định giá"
                : "Câu hỏi thường gặp"}
            </h2>
            <dl className="mt-4 space-y-6">
              {vertical.hubFaqs.map((f) => (
                <div key={f.q}>
                  <dt className="text-base font-semibold text-slate-900">{f.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </>
      ) : null}

      <section className="mt-10">
        <Link
          href="/lien-he"
          className="inline-flex h-11 items-center rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Liên hệ tư vấn dịch vụ
        </Link>
      </section>
    </div>
  );
}

export function AffiliateBreadcrumbs({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
      {items.map((item, i) => (
        <span key={item.path}>
          {i > 0 ? " / " : null}
          {i < items.length - 1 ? (
            <Link href={item.path} className="hover:text-brand-700">
              {item.name}
            </Link>
          ) : (
            <span className="text-slate-700">{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function AffiliateDisclaimer({ text }: { text: string }) {
  return (
    <p className="mt-6 max-w-3xl text-sm leading-relaxed text-slate-500">{text}</p>
  );
}
