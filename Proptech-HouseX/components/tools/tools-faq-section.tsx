import type { FaqContentBlock, RichFaqItem } from "@/lib/content/faq-content";
import { faqBlocksToPlainText } from "@/lib/content/faq-content";
import { FaqAnswerBody } from "@/components/content/faq-answer-body";

export function ToolsFaqSection({
  heading,
  items,
  className,
}: {
  heading: string;
  items: RichFaqItem[];
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">
        {heading}
      </h2>
      <div className="mt-6 space-y-4">
        {items.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl border border-silver-200 bg-white open:border-brand-200 open:shadow-sm"
          >
            <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                {f.q}
                <span className="mt-0.5 shrink-0 text-brand-600 transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <div className="border-t border-silver-100 px-5 pb-5 pt-3">
              <FaqAnswerBody blocks={f.blocks} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/** JSON-LD FAQPage từ danh sách RichFaqItem. */
export function buildRichFaqJsonLd(items: RichFaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faqBlocksToPlainText(f.blocks),
      },
    })),
  };
}
