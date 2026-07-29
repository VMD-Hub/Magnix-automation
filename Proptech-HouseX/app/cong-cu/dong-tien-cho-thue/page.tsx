import type { Metadata } from "next";
import Link from "next/link";
import { RentalCashflowCalculator } from "@/components/tools/rental-cashflow-calculator";
import { ToolsBreadcrumb, ToolsPageHero } from "@/components/tools/tools-page-hero";
import { RENTAL_CASHFLOW_COPY } from "@/lib/content/housex-tools-copy";
import { LOAN_AFFORDABILITY_BANNER } from "@/lib/content/housex-tools-visuals";
import { RE_KNOWLEDGE_PATH } from "@/lib/content/article-routes";

export const metadata: Metadata = {
  title: RENTAL_CASHFLOW_COPY.metaTitle,
  description: RENTAL_CASHFLOW_COPY.metaDescription,
  alternates: { canonical: "/cong-cu/dong-tien-cho-thue" },
};

const FAQ = [
  {
    q: "Thuế cho thuê nhà tính khoảng bao nhiêu?",
    a: "Với cá nhân, nhiều hướng dẫn tham chiếu khoảng 10% trên doanh thu thuê (5% GTGT + 5% TNCN). Mức thực tế phụ thuộc đối tượng, hóa đơn và chính sách tại thời điểm kê khai — công cụ chỉ ước lượng.",
  },
  {
    q: "Có nên trừ tháng trống căn không?",
    a: "Nên. Một–hai tháng trống/năm là giả định phổ biến khi tính dòng tiền thực; bạn chỉnh số tháng trống trong bảng tính.",
  },
  {
    q: "Kết quả có phải số thuế phải nộp không?",
    a: "Không. Đây là mô phỏng để chủ nhà / nhà đầu tư thấy dòng tiền ròng sơ bộ trước khi nhờ kế toán hoặc đăng tin tìm khách trên House X.",
  },
];

export default function Page() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="proptech-section-glow mx-auto min-w-0 max-w-7xl py-8 container-px">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="print:hidden">
        <ToolsBreadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Công cụ", href: "/cong-cu" },
            { label: "Dòng tiền cho thuê" },
          ]}
        />

        <ToolsPageHero
          kicker={RENTAL_CASHFLOW_COPY.kicker}
          title={RENTAL_CASHFLOW_COPY.title}
          subtitle={RENTAL_CASHFLOW_COPY.subtitle}
          image={LOAN_AFFORDABILITY_BANNER.jpg}
          imageWebp={LOAN_AFFORDABILITY_BANNER.webp}
          imageAlt="Ước tính dòng tiền cho thuê — House X"
          objectPosition={LOAN_AFFORDABILITY_BANNER.objectPosition}
          primaryCta={{
            label: RENTAL_CASHFLOW_COPY.primaryCta,
            href: RENTAL_CASHFLOW_COPY.primaryCtaHref,
          }}
          secondaryCta={{
            label: RENTAL_CASHFLOW_COPY.secondaryCta,
            href: RENTAL_CASHFLOW_COPY.secondaryCtaHref,
          }}
        />
      </div>

      <section id="tinh-toan" className="min-w-0 scroll-mt-24">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <h2 className="text-lg font-bold text-slate-900">Bảng tính dòng tiền</h2>
          <Link
            href="/cong-cu"
            className="text-sm font-medium text-slate-500 hover:text-brand-700"
          >
            ← Tất cả công cụ
          </Link>
        </div>
        <div className="min-w-0 rounded-2xl border border-silver-200 bg-white/80 p-2 shadow-sm backdrop-blur-sm sm:p-3">
          <RentalCashflowCalculator />
        </div>
      </section>

      <section className="mt-14 print:hidden">
        <h2 className="text-lg font-bold text-slate-900">
          {RENTAL_CASHFLOW_COPY.faqHeading}
        </h2>
        <dl className="mt-4 space-y-4">
          {FAQ.map((f) => (
            <div
              key={f.q}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <dt className="font-semibold text-slate-900">{f.q}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-slate-600">{f.a}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-slate-600">
          Đọc sâu:{" "}
          <Link
            href={`${RE_KNOWLEDGE_PATH}/tinh-dong-tien-don-bay-can-ho-cho-thue-2026`}
            className="font-semibold text-brand-700 underline"
          >
            dòng tiền & đòn bẩy
          </Link>{" "}
          ·{" "}
          <Link href="/cho-thue" className="font-semibold text-brand-700 underline">
            hub cho thuê
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
