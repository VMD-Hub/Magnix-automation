import type { Metadata } from "next";
import Link from "next/link";
import { PaintColorTool } from "@/components/tools/paint-color-tool";
import { RelatedToolsSection } from "@/components/tools/related-tools-section";
import { ToolsBreadcrumb } from "@/components/tools/tools-page-hero";
import { ToolsPageHeroEastern } from "@/components/tools/tools-page-hero-eastern";
import { PAINT_COLOR_COPY } from "@/lib/content/utilities-tools-copy";
import { PHONG_THUY_TOOL_VISUALS } from "@/lib/content/phong-thuy-visual-variants";

export const metadata: Metadata = {
  title: PAINT_COLOR_COPY.metaTitle,
  description: PAINT_COLOR_COPY.metaDescription,
  alternates: { canonical: "/cong-cu/chon-mau-son-theo-menh" },
};

export default function Page() {
  return (
    <div className="proptech-section-glow mx-auto max-w-5xl py-8 container-px">
      <ToolsBreadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Công cụ", href: "/cong-cu" }, { label: "Chọn màu sơn" }]} />
      <ToolsPageHeroEastern kicker="House X · Phong thủy" title={PAINT_COLOR_COPY.title} subtitle={PAINT_COLOR_COPY.subtitle} easternVariant={PHONG_THUY_TOOL_VISUALS["chon-mau-son-theo-menh"]} primaryCta={{ label: PAINT_COLOR_COPY.primaryCta, href: PAINT_COLOR_COPY.primaryCtaHref }} secondaryCta={{ label: "Nội thất House X", href: "/noi-that" }} />
      <section id="cong-cu" className="scroll-mt-24">
        <div className="mb-4 flex justify-between"><h2 className="text-lg font-bold text-slate-900">Bảng màu theo Ngũ hành</h2><Link href="/cong-cu" className="text-sm text-slate-500 hover:text-brand-700">← Tất cả công cụ</Link></div>
        <PaintColorTool />
      </section>
      <RelatedToolsSection currentId="chon-mau-son-theo-menh" category="phong-thuy" />
    </div>
  );
}
