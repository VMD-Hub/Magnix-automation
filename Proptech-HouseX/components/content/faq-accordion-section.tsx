import type { ReactNode } from "react";

export type FaqAccordionItem = {
  q: string;
  a: ReactNode;
};

export function FaqAccordionSection({
  heading,
  items,
  className = "",
}: {
  heading: string;
  items: FaqAccordionItem[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section
      className={`mt-10 scroll-mt-24 border-t border-slate-100 pt-8 ${className}`}
    >
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{heading}</h2>
      <div className="mt-6 space-y-3">
        {items.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl border border-slate-200 bg-white open:border-brand-200 open:shadow-sm"
          >
            <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                {f.q}
                <span className="mt-0.5 shrink-0 text-brand-600 transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <div className="border-t border-slate-100 px-5 pb-5 pt-3 text-base leading-[1.75] text-slate-700">
              {f.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
