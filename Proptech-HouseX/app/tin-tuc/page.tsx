import type { Metadata } from "next";
import Link from "next/link";
import {
  NEWS_HUB_INTRO,
  NEWS_HUB_PATH,
  NEWS_HUB_SEO_DESCRIPTION,
  NEWS_HUB_SEO_TITLE,
  NEWS_HUB_TITLE,
  NOXH_HANDBOOK_PATH,
} from "@/lib/content/article-routes";
import {
  NOXH_HANDBOOK_INTRO,
  NOXH_HANDBOOK_TITLE,
} from "@/lib/content/messaging/noxh-public";
import { buildNewsHubJsonLd } from "@/lib/seo/article-json-ld";
import { getSiteUrl } from "@/lib/site-config";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: NEWS_HUB_SEO_TITLE,
    description: NEWS_HUB_SEO_DESCRIPTION,
    alternates: {
      canonical: `${getSiteUrl()}${NEWS_HUB_PATH}`,
    },
  };
}

const SECTIONS = [
  {
    href: NOXH_HANDBOOK_PATH,
    title: NOXH_HANDBOOK_TITLE,
    description: NOXH_HANDBOOK_INTRO,
    status: "live" as const,
  },
  {
    title: "Kiến thức bất động sản",
    description:
      "Phân tích thị trường, mua bán và đầu tư — chuyên mục đang được biên tập, sẽ ra mắt sau.",
    status: "soon" as const,
  },
];

export default function TinTucParentHubPage() {
  const jsonLd = buildNewsHubJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-slate-50">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10 container-px">
            <nav className="text-sm text-slate-500">
              <Link href="/" className="hover:text-brand-700">
                Trang chủ
              </Link>
              <span className="mx-2">/</span>
              <span className="text-slate-800">{NEWS_HUB_TITLE}</span>
            </nav>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              {NEWS_HUB_TITLE}
            </h1>
            <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">
              {NEWS_HUB_INTRO}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 container-px">
          <div className="grid gap-6 sm:grid-cols-2">
            {SECTIONS.map((section) =>
              section.status === "live" ? (
                <Link
                  key={section.title}
                  href={section.href!}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-200 hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                    Đang mở
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900 group-hover:text-brand-700">
                    {section.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {section.description}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-brand-700">
                    Xem cẩm nang →
                  </p>
                </Link>
              ) : (
                <div
                  key={section.title}
                  className="rounded-2xl border border-dashed border-slate-200 bg-white/80 p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Sắp ra mắt
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-slate-700">
                    {section.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    {section.description}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </>
  );
}
