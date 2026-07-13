"use client";

import { useState } from "react";
import { cn } from "@/lib/ui/cn";
import type {
  VuNguyenCaseStudyAccent,
  VuNguyenCaseStudyArticle,
} from "@/lib/personal-brand/vu-nguyen/case-studies";

const ACCENT_BG: Record<VuNguyenCaseStudyAccent, string> = {
  finance:
    "bg-gradient-to-br from-brand-950 via-brand-900 to-amber-950/90 text-white",
  legal: "bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white",
  education:
    "bg-gradient-to-br from-slate-900 via-brand-950 to-emerald-950/80 text-white",
};

type Props = {
  article: VuNguyenCaseStudyArticle;
  /** Profile: nhỏ hơn, không nút điều hướng */
  compact?: boolean;
  className?: string;
};

export function CaseStudySlideDeck({ article, compact = false, className }: Props) {
  const { deck } = article;
  const [index, setIndex] = useState(0);
  const total = deck.slides.length;
  const slide = deck.slides[index]!;

  return (
    <div className={cn("not-prose", className)}>
      <div
        className={cn(
          "proptech-ruby-holder relative flex flex-col overflow-hidden rounded-2xl shadow-lg shadow-brand-950/15",
          compact ? "min-h-[168px]" : "min-h-[min(72vh,420px)] sm:min-h-[400px]",
        )}
      >
        <div
          className={cn(
            "flex flex-1 flex-col items-center justify-center px-6 py-8 text-center transition-colors duration-300 sm:px-10",
            ACCENT_BG[deck.accent],
          )}
        >
          {!compact && index === 0 ? (
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
              {article.segment}
            </p>
          ) : null}
          <p
            className={cn(
              "font-extrabold leading-[1.1] tracking-tight",
              compact ? "text-xl sm:text-2xl" : "text-3xl sm:text-4xl",
            )}
          >
            {slide.headline}
          </p>
          <p
            className={cn(
              "mt-3 max-w-sm font-medium leading-relaxed text-white/80",
              compact ? "text-sm" : "text-base sm:text-lg",
            )}
          >
            {slide.line}
          </p>
        </div>

        {!compact ? (
          <div className="flex items-center justify-between border-t border-white/10 bg-black/20 px-3 py-2.5">
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + total) % total)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Slide trước"
            >
              ←
            </button>
            <div className="flex gap-1.5" role="tablist" aria-label="Slides">
              {deck.slides.map((s, i) => (
                <button
                  key={s.headline}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-5 bg-gold-400" : "w-1.5 bg-white/30 hover:bg-white/50",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % total)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Slide sau"
            >
              →
            </button>
          </div>
        ) : (
          <div
            className="flex justify-center gap-1 border-t border-white/10 bg-black/20 py-2"
            aria-hidden
          >
            {deck.slides.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 w-1 rounded-full",
                  i === 0 ? "bg-gold-400" : "bg-white/25",
                )}
              />
            ))}
          </div>
        )}
      </div>

      {!compact ? (
        <p className="mt-3 text-center text-xs text-slate-500">
          {index + 1}/{total}
          <span className="mx-2">·</span>
          Vu Nguyễn · case ẩn danh
        </p>
      ) : null}
    </div>
  );
}
