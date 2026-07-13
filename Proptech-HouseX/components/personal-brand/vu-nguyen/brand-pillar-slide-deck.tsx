"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/ui/cn";
import type { BrandPillarCard } from "@/lib/personal-brand/vu-nguyen/housex-brand-dna";

type Props = {
  pillars: readonly BrandPillarCard[];
  className?: string;
};

function PillarHolderCard({ pillar, total }: { pillar: BrandPillarCard; total: number }) {
  return (
    <article
      className={cn(
        "proptech-ruby-holder flex shrink-0 snap-start flex-col overflow-hidden rounded-xl",
        "w-[46%] min-w-[9.75rem] shadow-md shadow-brand-950/10 sm:w-[44%] sm:min-w-[10.5rem]",
      )}
    >
      <div className="relative aspect-[5/4] w-full bg-brand-950">
        <Image
          src={pillar.image.jpg}
          alt={pillar.image.alt}
          fill
          className="object-cover"
          style={{ objectPosition: pillar.image.objectPosition ?? "50% 50%" }}
          sizes="(max-width: 576px) 46vw, 240px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/25 to-transparent" />
        <span className="absolute left-2 top-2 rounded-md bg-black/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold-300 ring-1 ring-white/10">
          {pillar.step}/{total}
        </span>
      </div>
      <div className="flex flex-1 flex-col bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950 px-3 py-3 text-white">
        <p className="text-sm font-extrabold leading-tight tracking-tight">{pillar.title}</p>
        <p className="mt-1.5 line-clamp-4 text-[11px] leading-snug text-white/78 sm:text-xs sm:leading-relaxed">
          {pillar.desc}
        </p>
      </div>
    </article>
  );
}

export function BrandPillarSlideDeck({ pillars, className }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const total = pillars.length;

  const syncActiveFromScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || el.children.length === 0) return;
    const { scrollLeft, clientWidth } = el;
    const center = scrollLeft + clientWidth * 0.25;
    let nearest = 0;
    let nearestDist = Number.POSITIVE_INFINITY;
    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i] as HTMLElement;
      const dist = Math.abs(child.offsetLeft - center);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    }
    setActiveIndex(nearest);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    syncActiveFromScroll();
    el.addEventListener("scroll", syncActiveFromScroll, { passive: true });
    return () => el.removeEventListener("scroll", syncActiveFromScroll);
  }, [syncActiveFromScroll]);

  function scrollToIndex(index: number) {
    const el = scrollerRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  function goPrev() {
    scrollToIndex((activeIndex - 1 + total) % total);
  }

  function goNext() {
    scrollToIndex((activeIndex + 1) % total);
  }

  return (
    <div className={cn("not-prose", className)}>
      <div
        ref={scrollerRef}
        className={cn(
          "flex gap-3 overflow-x-auto overscroll-x-contain scroll-smooth pb-1",
          "snap-x snap-mandatory",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "pr-[8%]",
        )}
        aria-label="Kim chỉ nam thương hiệu — vuốt ngang"
      >
        {pillars.map((pillar) => (
          <PillarHolderCard key={pillar.step} pillar={pillar} total={total} />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={goPrev}
          className="rounded-lg border border-brand-200 bg-white px-2.5 py-1 text-sm text-brand-800 shadow-sm hover:bg-brand-50"
          aria-label="Xem thẻ trước"
        >
          ←
        </button>
        <div className="flex flex-1 justify-center gap-1.5" role="tablist" aria-label="Vị trí thẻ">
          {pillars.map((p, i) => (
            <button
              key={p.step}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={p.title}
              onClick={() => scrollToIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === activeIndex ? "w-5 bg-brand-600" : "w-1.5 bg-brand-200 hover:bg-brand-400",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={goNext}
          className="rounded-lg border border-brand-200 bg-white px-2.5 py-1 text-sm text-brand-800 shadow-sm hover:bg-brand-50"
          aria-label="Xem thẻ tiếp"
        >
          →
        </button>
      </div>

      <p className="mt-2 text-center text-[11px] text-slate-500">
        Vuốt ngang hoặc bấm mũi tên · luôn thấy ít nhất 2 thẻ
      </p>
    </div>
  );
}
