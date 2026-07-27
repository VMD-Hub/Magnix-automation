import Link from "next/link";
import { listCtvAffiliateArticleCards } from "@/lib/content/ctv-affiliate-articles";

export function CtvArticleGrid() {
  const cards = listCtvAffiliateArticleCards();
  return (
    <ul className="mt-6 grid gap-4 sm:grid-cols-2">
      {cards.map((c) => (
        <li key={c.slug}>
          <Link
            href={c.href}
            className="block h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md"
          >
            <h3 className="font-bold leading-snug text-slate-900">{c.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
              {c.excerpt}
            </p>
            <span className="mt-3 inline-block text-sm font-semibold text-brand-700">
              Đọc bài →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
