import Link from "next/link";
import { ArticleCardCompact } from "@/components/articles/article-card";
import type { ArticleCardData } from "@/lib/data/article-types";

export function ProjectRelatedArticles({
  projectName,
  projectSlug,
  articles,
}: {
  projectName: string;
  projectSlug: string;
  articles: ArticleCardData[];
}) {
  if (articles.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900">
        Tin & kiến thức về {projectName}?
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Cập nhật tiến độ, pháp lý và phân tích liên quan dự án.
      </p>
      <div className="mt-5 space-y-3">
        {articles.slice(0, 6).map((a) => (
          <ArticleCardCompact key={a.id} article={a} />
        ))}
      </div>
      <Link
        href={`/tin-tuc?du-an=${projectSlug}`}
        className="mt-4 inline-flex text-sm font-medium text-brand-700 hover:text-brand-800"
      >
        Xem thêm tin tức →
      </Link>
    </section>
  );
}
