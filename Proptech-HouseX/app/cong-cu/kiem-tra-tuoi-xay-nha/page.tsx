import type { Metadata } from "next";
import Link from "next/link";
import { BuildAgeTool } from "@/components/tools/build-age-tool";
import { RelatedToolsSection } from "@/components/tools/related-tools-section";
import { ToolsBreadcrumb } from "@/components/tools/tools-page-hero";
import { ToolsPageHeroEastern } from "@/components/tools/tools-page-hero-eastern";
import { BUILD_AGE_COPY } from "@/lib/content/utilities-tools-copy";
import { PHONG_THUY_TOOL_VISUALS } from "@/lib/content/phong-thuy-visual-variants";

export const metadata: Metadata = {
  title: BUILD_AGE_COPY.metaTitle,
  description: BUILD_AGE_COPY.metaDescription,
  alternates: { canonical: "/cong-cu/kiem-tra-tuoi-xay-nha" },
};

export default function Page() {
  return (
    <div className="proptech-section-glow mx-auto max-w-5xl py-8 container-px">
      <ToolsBreadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Công cụ", href: "/cong-cu" }, { label: "Kiểm tra tuổi xây nhà" }]} />
      <ToolsPageHeroEastern
        kicker="House X · Phong thủy"
        title={BUILD_AGE_COPY.title}
        subtitle={BUILD_AGE_COPY.subtitle}
        easternVariant={PHONG_THUY_TOOL_VISUALS["kiem-tra-tuoi-xay-nha"]}
        primaryCta={{ label: BUILD_AGE_COPY.primaryCta, href: BUILD_AGE_COPY.primaryCtaHref }}
        secondaryCta={{ label: "Xem hướng nhà", href: "/cong-cu/xem-huong-nha" }}
      />
      <section id="cong-cu" className="scroll-mt-24">
        <div className="mb-4 flex justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Tam Tai · Kim Lâu · Hoang Ốc</h2>
          <Link href="/cong-cu" className="text-sm text-slate-500 hover:text-brand-700">← Tất cả công cụ</Link>
        </div>
        <BuildAgeTool />
      </section>
      <RelatedToolsSection currentId="kiem-tra-tuoi-xay-nha" category="phong-thuy" />
    </div>
  );
}
