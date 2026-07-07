import { renderPromotionTermsMarkdown } from "@/lib/content/promotion-terms-render";

export function PromotionTermsSection({
  markdown,
  id = "the-le-chuong-trinh",
}: {
  markdown: string;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div
        className="promotion-terms prose prose-slate max-w-none prose-headings:scroll-mt-24"
        dangerouslySetInnerHTML={{
          __html: renderPromotionTermsMarkdown(markdown),
        }}
      />
    </section>
  );
}
