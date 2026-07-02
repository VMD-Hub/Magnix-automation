import Link from "next/link";
import type { ArticleCardData } from "@/lib/data/article-types";

function formatArticleDate(d: Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <Link
      href={`/tin-tuc/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-brand-200 hover:shadow-md"
    >
      {article.coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.coverImageUrl}
          alt={article.coverImageAlt ?? article.title}
          className="aspect-[16/9] w-full object-cover transition group-hover:scale-[1.02]"
        />
      ) : (
        <div className="aspect-[16/9] w-full bg-gradient-to-br from-brand-50 to-slate-100" />
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-1.5">
          {article.tags.slice(0, 2).map((t) => (
            <span
              key={t.slug}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
            >
              {t.name}
            </span>
          ))}
        </div>
        <h3 className="mt-2 line-clamp-2 text-base font-semibold text-slate-900 group-hover:text-brand-700">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600">
            {article.excerpt}
          </p>
        )}
        <p className="mt-3 text-xs text-slate-500">
          {formatArticleDate(article.publishedAt)}
          {article.authorName ? ` · ${article.authorName}` : ""}
        </p>
      </div>
    </Link>
  );
}

export function ArticleCardCompact({ article }: { article: ArticleCardData }) {
  return (
    <Link
      href={`/tin-tuc/${article.slug}`}
      className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-200 hover:shadow-md"
    >
      {article.coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.coverImageUrl}
          alt=""
          className="h-20 w-28 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="h-20 w-28 shrink-0 rounded-lg bg-slate-100" />
      )}
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 font-semibold text-slate-900 group-hover:text-brand-700">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">
            {article.excerpt}
          </p>
        )}
        <p className="mt-2 text-xs text-slate-500">
          {formatArticleDate(article.publishedAt)}
        </p>
      </div>
    </Link>
  );
}
