import type { Metadata } from "next";
import Link from "next/link";
import { ToolHubCard, ToolServiceCard } from "@/components/tools/tool-hub-card";
import { ToolsPageHero } from "@/components/tools/tools-page-hero";
import { AFFILIATE_VERTICALS } from "@/lib/content/affiliate-verticals";
import {
  TOOL_HUB_CARDS,
  TOOLS_HUB_COPY,
} from "@/lib/content/housex-tools-copy";
import {
  TOOL_SERVICE_IMAGES,
  TOOLS_HUB_BANNER,
} from "@/lib/content/housex-tools-visuals";

export const metadata: Metadata = {
  title: TOOLS_HUB_COPY.metaTitle,
  description: TOOLS_HUB_COPY.metaDescription,
  alternates: { canonical: "/cong-cu" },
};

export default function CongCuPage() {
  return (
    <div className="proptech-section-glow mx-auto max-w-7xl py-8 container-px">
      <ToolsPageHero
        kicker={TOOLS_HUB_COPY.kicker}
        title={TOOLS_HUB_COPY.title}
        subtitle={TOOLS_HUB_COPY.subtitle}
        image={TOOLS_HUB_BANNER.jpg}
        imageWebp={TOOLS_HUB_BANNER.webp}
        imageAlt={TOOLS_HUB_BANNER.alt}
        objectPosition={TOOLS_HUB_BANNER.objectPosition}
        primaryCta={{ label: "Tính khoản vay", href: "/cong-cu/tinh-khoan-vay" }}
        secondaryCta={{ label: "Dịch vụ HouseX", href: "/dich-vu" }}
      />

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
              {TOOLS_HUB_COPY.calculatorsHeading}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{TOOLS_HUB_COPY.calculatorsIntro}</p>
          </div>
          <Link
            href="/cong-cu/tinh-khoan-vay"
            className="text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            Mở máy tính vay →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOOL_HUB_CARDS.map((tool) => (
            <ToolHubCard key={tool.id} tool={tool} />
          ))}
        </div>
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
            />
          ))}
        </div>
      </section>
    </div>
  );
}
