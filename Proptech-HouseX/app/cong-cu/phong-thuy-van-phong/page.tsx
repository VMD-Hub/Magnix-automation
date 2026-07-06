import type { Metadata } from "next";
import Link from "next/link";
import { OfficeFengShuiTool } from "@/components/tools/office-feng-shui-tool";
import { RelatedToolsSection } from "@/components/tools/related-tools-section";
import { ToolsBreadcrumb, ToolsPageHero } from "@/components/tools/tools-page-hero";
import { OFFICE_FENG_SHUI_COPY } from "@/lib/content/utilities-tools-copy";
import { PHONG_THUY_TOOL_VISUALS } from "@/lib/content/phong-thuy-visual-variants";

export const metadata: Metadata = {
  title: OFFICE_FENG_SHUI_COPY.metaTitle,
  description: OFFICE_FENG_SHUI_COPY.metaDescription,
  alternates: { canonical: "/cong-cu/phong-thuy-van-phong" },
};

export default function Page() {
  return (
    <div className="proptech-section-glow mx-auto max-w-5xl py-8 container-px">
      <ToolsBreadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Công cụ", href: "/cong-cu" }, { label: "Phong thủy văn phòng" }]} />
      <ToolsPageHero kicker="House X · Phong thủy" title={OFFICE_FENG_SHUI_COPY.title} subtitle={OFFICE_FENG_SHUI_COPY.subtitle} easternVariant={PHONG_THUY_TOOL_VISUALS["phong-thuy-van-phong"]} primaryCta={{ label: OFFICE_FENG_SHUI_COPY.primaryCta, href: OFFICE_FENG_SHUI_COPY.primaryCtaHref }} secondaryCta={{ label: "Xem hướng nhà", href: "/cong-cu/xem-huong-nha" }} />
      <section id="cong-cu" className="scroll-mt-24">
        <div className="mb-4 flex justify-between"><h2 className="text-lg font-bold text-slate-900">Hướng ngồi & bố trí bàn</h2><Link href="/cong-cu" className="text-sm text-slate-500 hover:text-brand-700">← Tất cả công cụ</Link></div>
        <OfficeFengShuiTool />
      </section>
      <RelatedToolsSection currentId="phong-thuy-van-phong" category="phong-thuy" />
    </div>
  );
}
