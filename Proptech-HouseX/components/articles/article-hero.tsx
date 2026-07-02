import type { ArticleCardData } from "@/lib/data/article-types";
import { ArticleTagList } from "@/components/articles/article-body";

export function ArticleHero({
  article,
  publishedLabel,
}: {
  article: Pick<
    ArticleCardData,
    | "title"
    | "excerpt"
    | "coverImageUrl"
    | "coverImageAlt"
    | "coverImageCaption"
    | "authorName"
    | "tags"
  >;
  publishedLabel: string | null;
}) {
  const alt = article.coverImageAlt ?? article.title;

  return (
    <header className="border-b border-slate-200 bg-slate-50">
      {article.coverImageUrl ? (
        <figure className="relative mx-auto max-w-6xl">
          <div className="relative aspect-[21/9] max-h-[420px] w-full overflow-hidden bg-slate-200 sm:aspect-[2.4/1]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImageUrl}
              alt={alt}
              className="h-full w-full object-cover"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent"
              aria-hidden
            />
          </div>
          {article.coverImageCaption && (
            <figcaption className="border-t border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-600 sm:px-6">
              <span className="font-semibold text-slate-800">Ảnh: </span>
              {article.coverImageCaption}
            </figcaption>
          )}
        </figure>
      ) : null}

      <div className="mx-auto max-w-3xl px-4 py-8 container-px sm:py-10">
        <ArticleTagList tags={article.tags} />
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl sm:leading-tight">
          {article.title}
        </h1>
        <p className="mt-4 text-sm text-slate-500">
          {publishedLabel}
          {article.authorName ? ` · ${article.authorName}` : ""}
        </p>
        {article.excerpt && (
          <p className="mt-6 border-l-4 border-brand-600 pl-4 text-lg font-medium leading-relaxed text-slate-800">
            {article.excerpt}
          </p>
        )}
      </div>
    </header>
  );
}
