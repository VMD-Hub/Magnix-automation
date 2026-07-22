import type { Metadata } from "next";
import Link from "next/link";
import { CatalogPageShell } from "@/components/layout/catalog-page-shell";
import { ToolHubCard, ToolServiceCard } from "@/components/tools/tool-hub-card";
import { ToolsPageHero } from "@/components/tools/tools-page-hero";
import { AFFILIATE_VERTICALS } from "@/lib/content/affiliate-verticals";
import {
  ALL_TOOLS,
  TOOL_CATEGORIES,
  toolsByCategory,
} from "@/lib/content/housex-tools-registry";
import { TOOLS_HUB_COPY } from "@/lib/content/housex-tools-copy";
import {
  TOOL_SERVICE_IMAGES,
  TOOL_SERVICE_IMAGES_WEBP,
  TOOLS_HUB_BANNER,
} from "@/lib/content/housex-tools-visuals";
import { PreloadBannerImage } from "@/components/seo/preload-banner-image";
import { catalogBannerSources } from "@/lib/brand/banner-responsive";
import { withOpenGraph } from "@/lib/seo/open-graph";

export const metadata: Metadata = {
  title: TOOLS_HUB_COPY.metaTitle,
  description: TOOLS_HUB_COPY.metaDescription,
  alternates: { canonical: "/cong-cu" },
  openGraph: withOpenGraph({
    title: TOOLS_HUB_COPY.metaTitle,
    description: TOOLS_HUB_COPY.metaDescription,
    url: "/cong-cu",
  }),
};

export default function CongCuPage() {
  const sortedCategories = [...TOOL_CATEGORIES].sort((a, b) => a.order - b.order);

  return (
    <CatalogPageShell>
      <PreloadBannerImage sources={catalogBannerSources(TOOLS_HUB_BANNER.slide)} />
      <ToolsPageHero
        kicker={TOOLS_HUB_COPY.kicker}
        title={TOOLS_HUB_COPY.title}
        subtitle={TOOLS_HUB_COPY.subtitle}
        bannerSlide={TOOLS_HUB_BANNER.slide}
        imageAlt={TOOLS_HUB_BANNER.alt}
        objectPosition={TOOLS_HUB_BANNER.objectPosition}
        primaryCta={{ label: "Xem hướng nhà", href: "/cong-cu/xem-huong-nha" }}
        secondaryCta={{ label: "Tính khoản vay", href: "/cong-cu/tinh-khoan-vay" }}
      />

      {sortedCategories.map((cat, idx) => {
        const tools = toolsByCategory(cat.id);
        if (tools.length === 0) return null;
        return (
          <section key={cat.id} className={idx > 0 ? "mt-14" : ""}>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                  {cat.title}
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-slate-600">{cat.intro}</p>
              </div>
              {cat.id === "tai-chinh" ? (
                <Link href="/cong-cu/tinh-khoan-vay" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                  Mở máy tính vay →
                </Link>
              ) : null}
              {cat.id === "phong-thuy" ? (
                <Link href="/phong-thuy" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                  Phong thủy nhà ở →
                </Link>
              ) : null}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <ToolHubCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="mt-14 proptech-ruby-soft-panel p-5 sm:p-6">
        <h2 className="text-lg font-bold text-slate-900">Vì sao dùng công cụ House X?</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Bên cạnh tra cứu phong thủy và ước tính chi phí xây dựng, House X tích hợp thẩm định vay NOXH,
          kiểm tra điều kiện mua nhà ở xã hội theo luật 2026, tính hạn mức vay và lịch trả nợ PDF — giúp bạn
          chuẩn bị từ con số đến hướng nhà trước khi cọc.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {ALL_TOOLS.filter((t) => t.ready).length} công cụ miễn phí · không cần đăng ký · tính trên trình duyệt
        </p>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
          {TOOLS_HUB_COPY.servicesHeading}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
          {TOOLS_HUB_COPY.servicesIntro}
        </p>
        <div className="mt-6 grid gap-4">
          {AFFILIATE_VERTICALS.map((v) => (
            <ToolServiceCard
              key={v.id}
              href={v.path}
              title={v.h1}
              intro={v.intro}
              image={TOOL_SERVICE_IMAGES[v.id] ?? TOOL_SERVICE_IMAGES["tai-chinh"]}
              imageWebp={TOOL_SERVICE_IMAGES_WEBP[v.id]}
            />
          ))}
        </div>
      </section>
    </CatalogPageShell>
  );
}
