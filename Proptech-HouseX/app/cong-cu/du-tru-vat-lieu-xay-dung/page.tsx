import type { Metadata } from "next";
import Link from "next/link";
import { MaterialEstimateTool } from "@/components/tools/material-estimate-tool";
import { RelatedToolsSection } from "@/components/tools/related-tools-section";
import { ToolsBreadcrumb, ToolsPageHero } from "@/components/tools/tools-page-hero";
import { MATERIAL_COPY } from "@/lib/content/utilities-tools-copy";
import { CONSTRUCTION_MATERIALS_BANNER } from "@/lib/content/housex-tools-visuals";

export const metadata: Metadata = {
  title: MATERIAL_COPY.metaTitle,
  description: MATERIAL_COPY.metaDescription,
  alternates: { canonical: "/cong-cu/du-tru-vat-lieu-xay-dung" },
};

export default function Page() {
  return (
    <div className="proptech-section-glow mx-auto max-w-5xl py-8 container-px">
      <ToolsBreadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Công cụ", href: "/cong-cu" }, { label: "Dự trù vật liệu" }]} />
      <ToolsPageHero kicker="House X · Xây dựng" title={MATERIAL_COPY.title} subtitle={MATERIAL_COPY.subtitle} image={CONSTRUCTION_MATERIALS_BANNER.jpg} imageWebp={CONSTRUCTION_MATERIALS_BANNER.webp} imageAlt={CONSTRUCTION_MATERIALS_BANNER.alt} objectPosition={CONSTRUCTION_MATERIALS_BANNER.objectPosition} primaryCta={{ label: MATERIAL_COPY.primaryCta, href: MATERIAL_COPY.primaryCtaHref }} secondaryCta={{ label: "Ước tính chi phí", href: "/cong-cu/uoc-tinh-chi-phi-xay-nha" }} />
      <section id="cong-cu" className="scroll-mt-24">
        <div className="mb-4 flex justify-between"><h2 className="text-lg font-bold text-slate-900">Bảng dự trù vật tư</h2><Link href="/cong-cu" className="text-sm text-slate-500 hover:text-brand-700">← Tất cả công cụ</Link></div>
        <MaterialEstimateTool />
      </section>
      <RelatedToolsSection currentId="du-tru-vat-lieu-xay-dung" category="xay-dung" />
    </div>
  );
}
