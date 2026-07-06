import Link from "next/link";
import { relatedTools, type ToolCategoryId } from "@/lib/content/housex-tools-registry";

export function RelatedToolsSection({
  currentId,
  category,
  heading = "Công cụ liên quan",
}: {
  currentId: string;
  category: ToolCategoryId;
  heading?: string;
}) {
  const tools = relatedTools(currentId, category);

  return (
    <section className="mt-14">
      <h2 className="text-lg font-bold text-slate-900">{heading}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {tools.map((t) => (
          <Link
            key={t.id}
            href={t.href}
            className="rounded-2xl border border-silver-200 bg-white p-5 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <p className="font-bold text-slate-900">{t.title}</p>
            <p className="mt-1 text-sm text-slate-600">{t.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
