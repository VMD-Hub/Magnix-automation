import { cn } from "@/lib/ui/cn";
import type { VuNguyenCaseStudyArticle } from "@/lib/personal-brand/vu-nguyen/case-studies";

const ACCENT_BG = {
  finance:
    "bg-gradient-to-br from-brand-950 via-brand-900 to-amber-950/90 text-white",
  legal: "bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white",
  education:
    "bg-gradient-to-br from-slate-900 via-brand-950 to-emerald-950/80 text-white",
} as const;

/** Ảnh bìa slide 1 — dùng trên profile, không tương tác. */
export function CaseStudyBannerPreview({
  article,
  className,
}: {
  article: VuNguyenCaseStudyArticle;
  className?: string;
}) {
  const slide = article.deck.slides[0]!;
  const last = article.deck.slides[article.deck.slides.length - 1]!;

  return (
    <div
      className={cn(
        "relative flex min-h-[140px] flex-col justify-between overflow-hidden rounded-xl px-4 py-3.5 sm:min-h-[152px] sm:px-5 sm:py-4",
        ACCENT_BG[article.deck.accent],
        className,
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/45">
        {article.segment}
      </p>
      <div>
        <p className="text-xl font-extrabold leading-tight tracking-tight sm:text-2xl">
          {slide.headline}
        </p>
        <p className="mt-1 text-sm text-white/75">{slide.line}</p>
      </div>
      <p className="text-right text-[11px] font-medium text-gold-300/90">{last.headline}</p>
    </div>
  );
}
