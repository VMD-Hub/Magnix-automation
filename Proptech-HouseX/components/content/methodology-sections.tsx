import Link from "next/link";
import { DocCategoryBlock } from "@/components/content/document-typography";
import { cn } from "@/lib/ui/cn";

/** Flowchart 5 bước — trang Phương pháp biên tập. */
export function MethodologyFlowchart({
  steps,
  className,
}: {
  steps: readonly string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "not-prose overflow-x-auto rounded-2xl border border-silver-200 bg-white p-4 sm:p-6",
        className,
      )}
      aria-label="Quy trình kiểm chứng tin"
    >
      <ol className="flex min-w-[640px] items-center gap-1 sm:gap-2">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 items-center">
            <div className="flex flex-1 flex-col items-center text-center">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="mt-2 text-xs font-semibold leading-snug text-slate-800 sm:text-sm">
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                className="mx-1 hidden h-px flex-1 bg-brand-200 sm:block"
                aria-hidden
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CriteriaGrid({
  required,
  recommended,
  excluded,
  title,
}: {
  title: string;
  required: { label: string; items: readonly string[] };
  recommended: { label: string; items: readonly string[] };
  excluded: { label: string; items: readonly string[] };
}) {
  const blocks = [required, recommended, excluded];
  return (
    <section className="not-prose">
      <h2 className="doc-h2 !mt-12">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {blocks.map((b) => (
          <div
            key={b.label}
            className="rounded-xl border border-silver-200 bg-white p-5"
          >
            <DocCategoryBlock label={b.label} items={b.items} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function MethodologyCtaLinks({
  links,
  className,
}: {
  links: readonly { label: string; href: string }[];
  className?: string;
}) {
  return (
    <div className={cn("not-prose flex flex-wrap gap-3", className)}>
      {links.map((l, i) => (
        <Link
          key={l.href}
          href={l.href}
          className={cn(
            "rounded-xl px-4 py-2.5 text-sm font-semibold transition",
            i === 0
              ? "bg-brand-600 text-white hover:bg-brand-700"
              : "border border-silver-200 bg-white text-slate-800 hover:border-brand-200",
          )}
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}
