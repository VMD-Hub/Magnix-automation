import type { Metadata } from "next";
import Link from "next/link";
import { NoxhEligibilityWizard } from "@/components/tools/noxh-eligibility-wizard";
import {
  buildRichFaqJsonLd,
  ToolsFaqSection,
} from "@/components/tools/tools-faq-section";
import { ToolsBreadcrumb, ToolsPageHero } from "@/components/tools/tools-page-hero";
import { NOXH_CHECK_COPY } from "@/lib/content/housex-tools-copy";
import { NOXH_CHECK_BANNER } from "@/lib/content/housex-tools-visuals";
import { NOXH_ELIGIBILITY_FAQ } from "@/lib/content/noxh-eligibility-faq";
import { EditorialTrustPanel } from "@/components/content/editorial-trust-panel";
import { getNoxhEditorialTrust } from "@/lib/content/editorial-trust";
import { NOXH_CATALOG_PATH } from "@/lib/content/project-catalog-routes";

export const metadata: Metadata = {
  title: NOXH_CHECK_COPY.metaTitle,
  description: NOXH_CHECK_COPY.metaDescription,
  alternates: { canonical: "/cong-cu/dieu-kien-noxh" },
};

export default function Page() {
  const faqJsonLd = buildRichFaqJsonLd(NOXH_ELIGIBILITY_FAQ);
  const noxhTrust = getNoxhEditorialTrust();

  return (
    <div className="proptech-section-glow mx-auto max-w-5xl py-8 container-px">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="print:hidden">
      <ToolsBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Công cụ", href: "/cong-cu" },
          { label: "Kiểm tra điều kiện NOXH" },
        ]}
      />

      <ToolsPageHero
        kicker={NOXH_CHECK_COPY.kicker}
        title={NOXH_CHECK_COPY.title}
        subtitle={NOXH_CHECK_COPY.subtitle}
        image={NOXH_CHECK_BANNER.jpg}
        imageWebp={NOXH_CHECK_BANNER.webp}
        imageAlt={NOXH_CHECK_BANNER.alt}
        objectPosition={NOXH_CHECK_BANNER.objectPosition}
        primaryCta={{
          label: NOXH_CHECK_COPY.primaryCta,
          href: NOXH_CHECK_COPY.primaryCtaHref,
        }}
        secondaryCta={{
          label: NOXH_CHECK_COPY.secondaryCta,
          href: NOXH_CHECK_COPY.secondaryCtaHref,
        }}
      />
      </div>

      <section id="kiem-tra" className="scroll-mt-24">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <h2 className="text-lg font-bold text-slate-900">
            Kiểm tra trong 5 bước
          </h2>
          <Link
            href="/cong-cu"
            className="text-sm font-medium text-slate-500 hover:text-brand-700"
          >
            ← Tất cả công cụ
          </Link>
        </div>
        <NoxhEligibilityWizard />
      </section>

      <section className="mt-14 print:hidden">
        <h2 className="text-lg font-bold text-slate-900">Công cụ liên quan</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            href="/tinh-tra-gop"
            className="rounded-2xl border border-silver-200 bg-white p-5 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <p className="font-bold text-slate-900">Tính khoản vay mua nhà</p>
            <p className="mt-1 text-sm text-slate-600">
              Ước tính tiền trả hàng tháng, tổng lãi và lịch trả nợ khi vay mua NOXH.
            </p>
          </Link>
          <Link
            href="/cong-cu/tinh-han-muc-vay"
            className="rounded-2xl border border-silver-200 bg-white p-5 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <p className="font-bold text-slate-900">Tính hạn mức vay mua nhà</p>
            <p className="mt-1 text-sm text-slate-600">
              Biết bạn vay được tối đa bao nhiêu theo thu nhập trước khi chọn căn hộ.
            </p>
          </Link>
          <Link
            href="/cong-cu/kiem-tra-vay-noxh"
            className="rounded-2xl border border-silver-200 bg-white p-5 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <p className="font-bold text-slate-900">Kiểm tra vay NOXH 60 giây</p>
            <p className="mt-1 text-sm text-slate-600">
              Sàng lọc tuổi vay sơ bộ trước khi cọc — chỉ cần năm sinh.
            </p>
          </Link>
          <Link
            href={NOXH_CATALOG_PATH}
            className="rounded-2xl border border-silver-200 bg-white p-5 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <p className="font-bold text-slate-900">Dự án nhà ở xã hội</p>
            <p className="mt-1 text-sm text-slate-600">
              Khám phá các dự án NOXH đang mở bán phù hợp điều kiện của bạn.
            </p>
          </Link>
        </div>
      </section>

      <ToolsFaqSection
        className="mt-14 print:hidden"
        heading={NOXH_CHECK_COPY.faqHeading}
        items={NOXH_ELIGIBILITY_FAQ}
      />

      <EditorialTrustPanel
        className="print:hidden"
        updatedAt={noxhTrust.updatedAt}
        sources={noxhTrust.sources}
        expert={noxhTrust.expert}
        variant="tool"
      />
    </div>
  );
}
