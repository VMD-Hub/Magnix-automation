import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { LoanCalculator } from "@/components/tools/loan-calculator";
import { ToolsBreadcrumb, ToolsPageHero } from "@/components/tools/tools-page-hero";
import { LOAN_CALC_COPY } from "@/lib/content/housex-tools-copy";
import {
  LOAN_CALC_BANNER,
  LOAN_CALC_TRUST_STATS,
} from "@/lib/content/housex-tools-visuals";

export const metadata: Metadata = {
  title: LOAN_CALC_COPY.metaTitle,
  description: LOAN_CALC_COPY.metaDescription,
  alternates: { canonical: "/tinh-tra-gop" },
};

const FAQ = [
  {
    q: "Tính lãi vay mua nhà theo phương pháp nào?",
    a: "Có 2 cách phổ biến: (1) Dư nợ giảm dần — gốc trả đều mỗi tháng, lãi tính trên dư nợ còn lại nên tiền trả giảm dần và tổng lãi thấp hơn; (2) Trả góp đều (annuity) — tổng tiền trả hằng tháng cố định, dễ lập kế hoạch. Đa số ngân hàng Việt Nam áp dụng dư nợ giảm dần.",
  },
  {
    q: "Công thức tính số tiền trả hàng tháng là gì?",
    a: "Trả góp đều: M = P × r × (1+r)^n / ((1+r)^n − 1), với P là tiền vay, r là lãi suất tháng (lãi năm chia 12), n là tổng số tháng. Dư nợ giảm dần: gốc hàng tháng = P/n, lãi tháng k = dư nợ còn lại × r.",
  },
  {
    q: "Nên vay tối đa bao nhiêu phần trăm giá trị nhà?",
    a: "Ngân hàng thường cho vay 70–85% giá trị tài sản thế chấp. Nên cân đối để tổng nghĩa vụ trả nợ hàng tháng không vượt 40–50% thu nhập để an toàn tài chính.",
  },
  {
    q: "Lãi suất ưu đãi và ân hạn gốc ảnh hưởng thế nào?",
    a: "Lãi ưu đãi áp dụng trong N tháng đầu (NOXH người dưới 35 tuổi thường 6,5%/năm 5 năm đầu theo NHNN; CĐT có thể có gói thấp hơn trong giai đoạn ngắn) rồi chuyển lãi thả nổi. Vay thương mại thường 8–12%/năm tùy thời điểm. Ân hạn gốc cho phép chỉ trả lãi trong giai đoạn đầu, giảm áp lực dòng tiền nhưng làm tăng tổng lãi.",
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

      <ToolsBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Công cụ", href: "/cong-cu" },
          { label: "Tính khoản vay" },
        ]}
      />

      <ToolsPageHero
        kicker={LOAN_CALC_COPY.kicker}
        title={LOAN_CALC_COPY.title}
        subtitle={LOAN_CALC_COPY.subtitle}
        image={LOAN_CALC_BANNER.jpg}
        imageWebp={LOAN_CALC_BANNER.webp}
        imageAlt={LOAN_CALC_BANNER.alt}
        objectPosition={LOAN_CALC_BANNER.objectPosition}
        primaryCta={{ label: LOAN_CALC_COPY.primaryCta, href: LOAN_CALC_COPY.primaryCtaHref }}
        secondaryCta={{
          label: LOAN_CALC_COPY.secondaryCta,
          href: LOAN_CALC_COPY.secondaryCtaHref,
        }}
      />

      <div className="mb-8 flex gap-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0 print:hidden">
        {LOAN_CALC_TRUST_STATS.map((s) => (
          <div
            key={s.label}
            className="min-w-[8.5rem] shrink-0 proptech-ruby-soft-panel rounded-xl px-3 py-3 text-center sm:min-w-0 sm:shrink sm:px-4 sm:py-4"
          >
            <p className="text-lg font-extrabold text-brand-700 sm:text-xl">{s.value}</p>
            <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      <section id="tinh-toan" className="min-w-0 scroll-mt-24">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <h2 className="text-lg font-bold text-slate-900">Bảng tính</h2>
          <Link
            href="/cong-cu"
            className="text-sm font-medium text-slate-500 hover:text-brand-700"
          >
            ← Tất cả công cụ
          </Link>
        </div>
        <div className="min-w-0 rounded-2xl border border-silver-200 bg-white/80 p-2 shadow-sm backdrop-blur-sm sm:p-3">
          <LoanCalculator />
        </div>
      </section>

      <section className="mt-14 print:hidden">
        <h2 className="text-lg font-bold text-slate-900">Công cụ liên quan</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            href="/cong-cu/tinh-han-muc-vay"
            className="rounded-2xl border border-silver-200 bg-white p-5 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <p className="font-bold text-slate-900">Tính hạn mức vay mua nhà</p>
            <p className="mt-1 text-sm text-slate-600">
              Ước tính số tiền vay tối đa theo thu nhập và nghĩa vụ trả nợ hiện tại.
            </p>
          </Link>
          <Link
            href="/cong-cu/dieu-kien-noxh"
            className="rounded-2xl border border-silver-200 bg-white p-5 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <p className="font-bold text-slate-900">Kiểm tra điều kiện NOXH</p>
            <p className="mt-1 text-sm text-slate-600">
              Kiểm tra đối tượng, thu nhập và khả năng vay theo quy định NOXH 2026.
            </p>
          </Link>
        </div>
      </section>

      <section className="mt-14 max-w-3xl print:hidden">
        <div className="proptech-ruby-soft-panel p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">Cần hỗ trợ làm hồ sơ vay?</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Sau khi có con số sơ bộ, đội ngũ HouseX giúp so sánh gói vay, chuẩn bị hồ sơ và đồng
            hành thẩm định tài sản nếu cần.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href="/vay-mua-nha#tu-van" variant="primary" size="md">
              Nhận tư vấn vay
            </ButtonLink>
            <ButtonLink href="/dich-vu" variant="brand" size="md">
              Xem dịch vụ HouseX
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mt-16 max-w-3xl print:hidden">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {LOAN_CALC_COPY.faqHeading}
        </h2>
        <div className="mt-6 space-y-4">
          {FAQ.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-silver-200 bg-white open:border-brand-200 open:shadow-sm"
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-3">
                  {f.q}
                  <span className="mt-0.5 text-brand-600 transition-transform group-open:rotate-45">
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
    </div>
  );
}
