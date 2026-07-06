import type { Metadata } from "next";
import Link from "next/link";
import { ConstructionCostTool } from "@/components/tools/construction-cost-tool";
import { RelatedToolsSection } from "@/components/tools/related-tools-section";
import { ToolsBreadcrumb, ToolsPageHero } from "@/components/tools/tools-page-hero";
import { COST_QUICK_COPY } from "@/lib/content/utilities-tools-copy";
import { CONSTRUCTION_COST_QUICK_BANNER } from "@/lib/content/housex-tools-visuals";

export const metadata: Metadata = {
  title: COST_QUICK_COPY.metaTitle,
  description: COST_QUICK_COPY.metaDescription,
  alternates: { canonical: "/cong-cu/uoc-tinh-chi-phi-xay-nha" },
};

export default function Page() {
  return (
    <div className="proptech-section-glow mx-auto max-w-5xl py-8 container-px">
      <ToolsBreadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Công cụ", href: "/cong-cu" }, { label: "Ước tính chi phí xây" }]} />
      <ToolsPageHero kicker="House X · Xây dựng" title={COST_QUICK_COPY.title} subtitle={COST_QUICK_COPY.subtitle} image={CONSTRUCTION_COST_QUICK_BANNER.jpg} imageWebp={CONSTRUCTION_COST_QUICK_BANNER.webp} imageAlt={CONSTRUCTION_COST_QUICK_BANNER.alt} objectPosition={CONSTRUCTION_COST_QUICK_BANNER.objectPosition} primaryCta={{ label: COST_QUICK_COPY.primaryCta, href: COST_QUICK_COPY.primaryCtaHref }} secondaryCta={{ label: "Dự toán chi tiết", href: "/cong-cu/du-toan-xay-nha-chi-tiet" }} />
      <section id="cong-cu" className="scroll-mt-24">
        <div className="mb-4 flex justify-between"><h2 className="text-lg font-bold text-slate-900">Khái toán nhanh</h2><Link href="/cong-cu" className="text-sm text-slate-500 hover:text-brand-700">← Tất cả công cụ</Link></div>
        <ConstructionCostTool mode="quick" />
      </section>
      <RelatedToolsSection currentId="uoc-tinh-chi-phi-xay-nha" category="xay-dung" />
    </div>
  );
}
