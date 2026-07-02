import Link from "next/link";
import { ArticleCard } from "@/components/articles/article-card";
import type { ArticleCardData } from "@/lib/data/article-types";
import { projectRelatedArticlesViewMoreHref } from "@/lib/content/project-related-articles";

export function ProjectRelatedArticles({
  projectName,
  projectSlug,
  articles,
  isNoxh = false,
}: {
  projectName: string;
  projectSlug: string;
  articles: ArticleCardData[];
  isNoxh?: boolean;
}) {
  if (articles.length === 0) return null;

  const viewMoreHref = projectRelatedArticlesViewMoreHref(projectSlug);

  return (
    <section
      id="project-related-articles"
      aria-labelledby="project-related-articles-heading"
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
            {isNoxh ? "NOXH · Cập nhật thị trường" : "HouseX Biên tập"}
          </p>
          <h2
            id="project-related-articles-heading"
            className="mt-1 text-2xl font-bold text-slate-900"
          >
            Bài liên quan
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Tin nóng, phân tích giá và chính sách vay liên quan{" "}
            <span className="font-medium text-slate-800">{projectName}</span>.
          </p>
        </div>
        <Link
          href={viewMoreHref}
          className="inline-flex shrink-0 items-center text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          Xem tất cả →
        </Link>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 6).map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}
