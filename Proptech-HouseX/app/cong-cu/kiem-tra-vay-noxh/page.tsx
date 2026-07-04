import type { Metadata } from "next";
import Link from "next/link";
import { NoxhLoanQuickCheckSection } from "@/components/tools/noxh-loan-quick-check-section";
import { ToolsBreadcrumb, ToolsPageHero } from "@/components/tools/tools-page-hero";
import {
  NOXH_LOAN_QUICK_COPY,
  NOXH_LOAN_QUICK_FAQ,
  NOXH_LOAN_QUICK_HELP,
} from "@/lib/content/noxh-loan-quick-check-copy";
import { NOXH_CHECK_BANNER } from "@/lib/content/housex-tools-visuals";

export const metadata: Metadata = {
  title: NOXH_LOAN_QUICK_COPY.metaTitle,
  description: NOXH_LOAN_QUICK_COPY.metaDescription,
  alternates: { canonical: "/cong-cu/kiem-tra-vay-noxh" },
};

export default function Page() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: NOXH_LOAN_QUICK_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="proptech-section-glow mx-auto max-w-3xl py-8 container-px">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <ToolsBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Công cụ", href: "/cong-cu" },
          { label: "Kiểm tra vay NOXH" },
        ]}
      />

      <ToolsPageHero
        kicker={NOXH_LOAN_QUICK_COPY.kicker}
        title={NOXH_LOAN_QUICK_COPY.title}
        subtitle={NOXH_LOAN_QUICK_COPY.subtitle}
        image={NOXH_CHECK_BANNER.jpg}
        imageWebp={NOXH_CHECK_BANNER.webp}
        imageAlt="Kiểm tra khả năng vay nhà ở xã hội — HouseX"
        objectPosition={NOXH_CHECK_BANNER.objectPosition}
        primaryCta={{
          label: NOXH_LOAN_QUICK_COPY.heroCta,
          href: NOXH_LOAN_QUICK_COPY.heroCtaHref,
        }}
        secondaryCta={{
          label: "Bộ công cụ thẩm định vay",
          href: "/cong-cu/tham-dinh-vay-noxh",
        }}
      />

      <section className="mb-10">
        <h2 className="text-lg font-bold text-slate-900">Công cụ này giúp gì?</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {NOXH_LOAN_QUICK_HELP.map((h) => (
            <div
              key={h.title}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <p className="font-semibold text-slate-900">{h.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50/80 to-white p-6">
        <h2 className="text-lg font-bold text-slate-900">
          Hướng dẫn chi tiết: Kiểm tra trong 60 giây
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Công cụ phía dưới ước tính tuổi cuối kỳ vay. Bài hướng dẫn giải thích kết quả có ý nghĩa
          gì, bước tiếp theo (CIC, hồ sơ, điều kiện vay) và toàn bộ cụm thẩm định vay NOXH.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link
            href="/tin-tuc/kiem-tra-kha-nang-vay-noxh-60-giay"
            className="inline-flex text-sm font-semibold text-brand-700 hover:underline"
          >
            Đọc hướng dẫn 60 giây →
          </Link>
          <Link
            href="/tin-tuc/tham-dinh-khoan-vay-mua-nha-o-xa-hoi"
            className="inline-flex text-sm font-semibold text-slate-600 hover:underline"
          >
            Bài trụ cột thẩm định vay →
          </Link>
        </div>
      </section>

      <NoxhLoanQuickCheckSection />

      <section className="mt-16 print:hidden">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {NOXH_LOAN_QUICK_COPY.faqHeading}
        </h2>
        <div className="mt-6 space-y-4">
          {NOXH_LOAN_QUICK_FAQ.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-silver-200 bg-white open:border-brand-200 open:shadow-sm"
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-3">
                  {f.q}
                  <span className="mt-0.5 shrink-0 text-brand-600 transition-transform group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="border-t border-silver-100 px-5 pb-4 pt-2 text-sm leading-relaxed text-slate-600">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <p className="mt-10 text-center text-sm text-slate-500">
        <Link href="/cong-cu" className="font-medium text-brand-700 hover:underline">
          ← Tất cả công cụ
        </Link>
      </p>
    </div>
  );
}
