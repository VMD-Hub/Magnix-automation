import type { Metadata } from "next";
import Link from "next/link";
import { DemoCatalogBanner } from "@/components/projects/demo-catalog-banner";
import { ProjectCard } from "@/components/projects/project-card";
import { LuxPageHeader } from "@/components/ui/lux-page-header";
import { listProjects } from "@/lib/data/project-list";
import { PROJECT_TYPE_LABEL } from "@/lib/format";
import { cn } from "@/lib/ui/cn";
import { getSiteUrl } from "@/lib/site-config";

export const revalidate = 300;

type PageProps = {
  searchParams: Promise<{
    projectType?: string;
    page?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const isNoxh = sp.projectType === "NHA_O_XA_HOI";
  const title = isNoxh ? "Dự án nhà ở xã hội (NOXH)" : "Dự án bất động sản";
  const description = isNoxh
    ? "Danh sách dự án NOXH — pháp lý, giá bán và tin ký gửi từ môi giới."
    : "Khám phá dự án thương mại mới tại TP.HCM và các tỉnh thành.";

  return { title, description };
}

export default async function DuAnListPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const projectType =
    sp.projectType === "NHA_O_XA_HOI" || sp.projectType === "THUONG_MAI"
      ? sp.projectType
      : undefined;

  const { items, pagination, isDemo } = await listProjects({ projectType, page });

  const heading =
    projectType === "NHA_O_XA_HOI"
      ? "Dự án nhà ở xã hội (NOXH)"
      : projectType === "THUONG_MAI"
        ? "Dự án thương mại"
        : "Dự án bất động sản";
  const subheading =
    projectType === "NHA_O_XA_HOI"
      ? "Danh sách dự án NOXH — pháp lý, giá bán và tin ký gửi từ môi giới."
      : "Dự án thương mại và NOXH — pháp lý rõ ràng, tin ký gửi minh bạch.";

  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Dự án bất động sản HouseX",
    url: `${siteUrl}/du-an`,
    numberOfItems: items.length,
    itemListElement: items.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteUrl}/du-an/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <div className="proptech-section-glow mx-auto max-w-7xl py-8 container-px">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <LuxPageHeader
        kicker="Danh mục dự án"
        title={heading}
        subtitle={subheading}
      />

      {isDemo && process.env.NODE_ENV !== "production" ? (
        <DemoCatalogBanner />
      ) : null}

      <div className="mb-6 flex flex-wrap gap-2">
        <Tab href="/du-an" active={!projectType} label="Tất cả" />
        <Tab href="/du-an?projectType=THUONG_MAI" active={projectType === "THUONG_MAI"} label="Thương mại" />
        <Tab
          href="/du-an?projectType=NHA_O_XA_HOI"
          active={projectType === "NHA_O_XA_HOI"}
          label={PROJECT_TYPE_LABEL.NHA_O_XA_HOI}
        />
      </div>

      {items.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProjectCard key={p.slug} item={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-silver-200 bg-white/60 p-12 text-center text-[#666666]">
          Chưa có dự án trong mục này.
        </div>
      )}

      {pagination.totalPages > 1 ? (
        <nav className="mt-8 flex justify-center gap-2">
          {page > 1 ? (
            <PageLink
              href={`/du-an?${new URLSearchParams({ ...(projectType ? { projectType } : {}), page: String(page - 1) }).toString()}`}
              label="← Trước"
            />
          ) : null}
          <span className="px-3 py-2 text-sm text-slate-600">
            Trang {page}/{pagination.totalPages}
          </span>
          {page < pagination.totalPages ? (
            <PageLink
              href={`/du-an?${new URLSearchParams({ ...(projectType ? { projectType } : {}), page: String(page + 1) }).toString()}`}
              label="Sau →"
            />
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}

function Tab({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-brand-600 text-white shadow-sm shadow-brand-600/20"
          : "bg-white text-[#555555] ring-1 ring-silver-200 hover:bg-silver-50",
      )}
    >
      {label}
    </Link>
  );
}

function PageLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-silver-200 bg-white px-4 py-2 text-sm font-medium text-[#333333] hover:border-brand-200 hover:bg-brand-50"
    >
      {label}
    </Link>
  );
}
