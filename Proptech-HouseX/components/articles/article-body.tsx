import type { ArticleCardData } from "@/lib/data/article-types";

export function ArticleBody({ body }: { body: string }) {
  const paragraphs = body.split(/\n\n+/).filter(Boolean);
  return (
    <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:font-bold">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-base leading-relaxed text-slate-700">
          {p.trim()}
        </p>
      ))}
    </div>
  );
}

export function ArticleTagList({
  tags,
  className = "",
}: {
  tags: ArticleCardData["tags"];
  className?: string;
}) {
  if (tags.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((t) => (
        <li key={t.slug}>
          <a
            href={`/tin-tuc/chu-de/${t.slug}`}
            className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800 hover:bg-brand-100"
          >
            {t.name}
          </a>
        </li>
      ))}
    </ul>
  );
}
