import type { Metadata } from "next";
import Link from "next/link";
import { EditorialTrustPanel } from "@/components/content/editorial-trust-panel";
import { ToolHubCard } from "@/components/tools/tool-hub-card";
import { ToolsBreadcrumb, ToolsPageHero } from "@/components/tools/tools-page-hero";
import {
  NOXH_LOAN_ASSESSMENT_HUB_ARTICLES,
  NOXH_LOAN_ASSESSMENT_HUB_COPY,
  NOXH_LOAN_ASSESSMENT_HUB_TOOLS,
} from "@/lib/content/housex-tools-copy";
import { NOXH_CHECK_BANNER } from "@/lib/content/housex-tools-visuals";
import { getNoxhEditorialTrust } from "@/lib/content/editorial-trust";

export const metadata: Metadata = {
  title: NOXH_LOAN_ASSESSMENT_HUB_COPY.metaTitle,
  description: NOXH_LOAN_ASSESSMENT_HUB_COPY.metaDescription,
  alternates: { canonical: "/cong-cu/tham-dinh-vay-noxh" },
};

export default function Page() {
  const noxhTrust = getNoxhEditorialTrust();

  return (
    <div className="proptech-section-glow mx-auto max-w-5xl py-8 container-px">
      <ToolsBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Công cụ", href: "/cong-cu" },
          { label: "Thẩm định vay NOXH" },
        ]}
      />

      <ToolsPageHero
        kicker={NOXH_LOAN_ASSESSMENT_HUB_COPY.kicker}
        title={NOXH_LOAN_ASSESSMENT_HUB_COPY.title}
        subtitle={NOXH_LOAN_ASSESSMENT_HUB_COPY.subtitle}
        image={NOXH_CHECK_BANNER.jpg}
        imageWebp={NOXH_CHECK_BANNER.webp}
        imageAlt="Thẩm định vay nhà ở xã hội — bộ công cụ House X"
        objectPosition={NOXH_CHECK_BANNER.objectPosition}
        primaryCta={{
          label: "Kiểm tra 60 giây",
          href: "/cong-cu/kiem-tra-vay-noxh",
        }}
        secondaryCta={{
          label: "Kiểm tra điều kiện NOXH",
          href: "/cong-cu/dieu-kien-noxh",
        }}
      />

      <section className="mb-12">
        <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
          {NOXH_LOAN_ASSESSMENT_HUB_COPY.toolsHeading}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {NOXH_LOAN_ASSESSMENT_HUB_COPY.toolsIntro}
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {NOXH_LOAN_ASSESSMENT_HUB_TOOLS.map((tool) => (
            <ToolHubCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mb-12 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900">
          {NOXH_LOAN_ASSESSMENT_HUB_COPY.articlesHeading}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {NOXH_LOAN_ASSESSMENT_HUB_COPY.articlesIntro}
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {NOXH_LOAN_ASSESSMENT_HUB_ARTICLES.map((a) => (
            <li key={a.href}>
              <Link
                href={a.href}
                className="font-medium text-brand-700 hover:underline"
              >
                {a.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <EditorialTrustPanel
        variant="tool"
        updatedAt={noxhTrust.updatedAt}
        sources={noxhTrust.sources}
        expert={noxhTrust.expert}
      />

      <p className="mt-10 text-center text-sm text-slate-500">
        <Link href="/cong-cu" className="font-medium text-brand-700 hover:underline">
          ← Tất cả công cụ
        </Link>
      </p>
    </div>
  );
}
