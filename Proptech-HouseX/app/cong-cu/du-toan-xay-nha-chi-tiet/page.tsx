import type { Metadata } from "next";
import Link from "next/link";
import { ConstructionCostTool } from "@/components/tools/construction-cost-tool";
import { RelatedToolsSection } from "@/components/tools/related-tools-section";
import { ToolsBreadcrumb, ToolsPageHero } from "@/components/tools/tools-page-hero";
import { COST_DETAIL_COPY } from "@/lib/content/utilities-tools-copy";
import { CONSTRUCTION_COST_DETAIL_BANNER } from "@/lib/content/housex-tools-visuals";

export const metadata: Metadata = {
  title: COST_DETAIL_COPY.metaTitle,
  description: COST_DETAIL_COPY.metaDescription,
  alternates: { canonical: "/cong-cu/du-toan-xay-nha-chi-tiet" },
};

export default function Page() {
  return (
    <div className="proptech-section-glow mx-auto max-w-5xl py-8 container-px">
      <ToolsBreadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Công cụ", href: "/cong-cu" }, { label: "Dự toán chi tiết" }]} />
      <ToolsPageHero kicker="House X · Xây dựng" title={COST_DETAIL_COPY.title} subtitle={COST_DETAIL_COPY.subtitle} image={CONSTRUCTION_COST_DETAIL_BANNER.jpg} imageWebp={CONSTRUCTION_COST_DETAIL_BANNER.webp} imageAlt={CONSTRUCTION_COST_DETAIL_BANNER.alt} objectPosition={CONSTRUCTION_COST_DETAIL_BANNER.objectPosition} primaryCta={{ label: COST_DETAIL_COPY.primaryCta, href: COST_DETAIL_COPY.primaryCtaHref }} secondaryCta={{ label: "Khái toán nhanh", href: "/cong-cu/uoc-tinh-chi-phi-xay-nha" }} />
      <section id="cong-cu" className="scroll-mt-24">
        <div className="mb-4 flex justify-between"><h2 className="text-lg font-bold text-slate-900">Bóc tách hạng mục</h2><Link href="/cong-cu" className="text-sm text-slate-500 hover:text-brand-700">← Tất cả công cụ</Link></div>
        <ConstructionCostTool mode="detail" />
      </section>
      <RelatedToolsSection currentId="du-toan-xay-nha-chi-tiet" category="xay-dung" />
    </div>
  );
}
