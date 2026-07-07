import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/articles/article-card";
import { ToolHubCard } from "@/components/tools/tool-hub-card";
import {
  buildRichFaqJsonLd,
  ToolsFaqSection,
} from "@/components/tools/tools-faq-section";
import { ToolsBreadcrumb } from "@/components/tools/tools-page-hero";
import { ToolsPageHeroEastern } from "@/components/tools/tools-page-hero-eastern";
import { listPublishedArticles } from "@/lib/data/article-public";
import { PHONG_THUY_HUB_FAQ } from "@/lib/content/phong-thuy-hub-faq";
import {
  NOXH_HANDBOOK_PATH,
  NOXH_HANDBOOK_TITLE,
} from "@/lib/content/messaging/noxh-public";
import {
  PHONG_THUY_ARTICLES_HEADING,
  PHONG_THUY_FAQ_HEADING,
  PHONG_THUY_HUB_INTRO,
  PHONG_THUY_HUB_KICKER,
  PHONG_THUY_HUB_PATH,
  PHONG_THUY_HUB_SEO_DESCRIPTION,
  PHONG_THUY_HUB_SEO_TITLE,
  PHONG_THUY_HUB_SUBTITLE,
  PHONG_THUY_HUB_TITLE,
  PHONG_THUY_PILLAR_LINKS,
  PHONG_THUY_TOOLS_HEADING,
  PHONG_THUY_TOOLS_INTRO,
} from "@/lib/content/messaging/phong-thuy-public";
import { toolsByCategory } from "@/lib/content/housex-tools-registry";
import { PHONG_THUY_HUB_HERO_VARIANT } from "@/lib/content/phong-thuy-visual-variants";
import { getSiteUrl } from "@/lib/site-config";

export const revalidate = 300;

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const canonical =
    page > 1 ? `${PHONG_THUY_HUB_PATH}?page=${page}` : PHONG_THUY_HUB_PATH;

  return {
    title: PHONG_THUY_HUB_SEO_TITLE,
    description: PHONG_THUY_HUB_SEO_DESCRIPTION,
    alternates: { canonical: `${getSiteUrl()}${canonical}` },
  };
}

export default async function PhongThuyHubPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const { items, total } = await listPublishedArticles({
    tagSlug: "phong-thuy",
    page,
    pageSize: 12,
  });

  const totalPages = Math.max(1, Math.ceil(total / 12));
  const phongThuyTools = toolsByCategory("phong-thuy");
  const showHubExtras = page === 1;

  return (
    <div className="bg-slate-50">
      {showHubExtras ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildRichFaqJsonLd(PHONG_THUY_HUB_FAQ)),
          }}
        />
      ) : null}

      <div className="mx-auto max-w-7xl py-8 container-px">
        <ToolsBreadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Phong thủy nhà ở" },
          ]}
        />

        {showHubExtras ? (
          <ToolsPageHeroEastern
            kicker={PHONG_THUY_HUB_KICKER}
            title={PHONG_THUY_HUB_TITLE}
            subtitle={PHONG_THUY_HUB_SUBTITLE}
            easternVariant={PHONG_THUY_HUB_HERO_VARIANT}
            primaryCta={{
              label: "Xem hướng nhà",
              href: "/cong-cu/xem-huong-nha",
            }}
            secondaryCta={{
              label: "Kiểm tra tuổi xây",
              href: "/cong-cu/kiem-tra-tuoi-xay-nha",
            }}
          />
        ) : (
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900">
              {PHONG_THUY_HUB_TITLE}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">{PHONG_THUY_HUB_INTRO}</p>
          </header>
        )}

        {showHubExtras ? (
          <>
            <p className="mb-8 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              {PHONG_THUY_HUB_INTRO}
            </p>

            <nav
              aria-label="Chủ đề phong thủy nổi bật"
              className="mb-10 flex flex-wrap gap-2"
            >
              {PHONG_THUY_PILLAR_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800 hover:bg-brand-100"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <section className="mb-14">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                    {PHONG_THUY_TOOLS_HEADING}
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-slate-600">
                    {PHONG_THUY_TOOLS_INTRO}
                  </p>
                </div>
                <Link
                  href="/cong-cu"
                  className="text-sm font-semibold text-brand-700 hover:text-brand-800"
                >
                  Tất cả công cụ →
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {phongThuyTools.map((tool) => (
                  <ToolHubCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          </>
        ) : null}

        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                {PHONG_THUY_ARTICLES_HEADING}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{total} bài viết</p>
            </div>
            <Link
              href={NOXH_HANDBOOK_PATH}
              className="text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              {NOXH_HANDBOOK_TITLE} →
            </Link>
          </div>

          {items.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Bài viết phong thủy đang được biên tập. Bạn có thể dùng{" "}
              <Link href="/cong-cu/xem-huong-nha" className="text-brand-700 hover:underline">
                công cụ xem hướng nhà
              </Link>{" "}
              ngay bây giờ.
            </p>
          )}

          {totalPages > 1 ? (
            <nav className="mt-10 flex justify-center gap-2">
              {page > 1 ? (
                <Link
                  href={
                    page === 2
                      ? PHONG_THUY_HUB_PATH
                      : `${PHONG_THUY_HUB_PATH}?page=${page - 1}`
                  }
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm"
                >
                  ← Trước
                </Link>
              ) : null}
              <span className="flex items-center px-3 text-sm text-slate-600">
                Trang {page}/{totalPages}
              </span>
              {page < totalPages ? (
                <Link
                  href={`${PHONG_THUY_HUB_PATH}?page=${page + 1}`}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm"
                >
                  Sau →
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>

        {showHubExtras ? (
          <ToolsFaqSection
            className="mt-14 max-w-4xl"
            heading={PHONG_THUY_FAQ_HEADING}
            items={PHONG_THUY_HUB_FAQ}
          />
        ) : null}
      </div>
    </div>
  );
}
