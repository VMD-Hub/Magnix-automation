"use client";

import { useEffect, useState } from "react";
import {
  HOUSEX_HERO_SLIDES,
  type HouseXHeroSlideAsset,
} from "@/lib/brand/hero-assets";
import { HERO_LCP_SIZES, heroLcpSources } from "@/lib/brand/banner-responsive";
import { BannerPicture } from "@/components/ui/banner-picture";
import { cn } from "@/lib/ui/cn";

const SLIDE_MS = 8000;
const FADE_MS = 1200;
const MOBILE_MAX = 767;

type Props = {
  slides?: HouseXHeroSlideAsset[];
};

function HeroSlideLayer({
  slide,
  active,
}: {
  slide: HouseXHeroSlideAsset;
  active: boolean;
}) {
  const sources = heroLcpSources(slide);

  return (
    <div
      className={cn(
        "hero-slide-layer absolute inset-0",
        active && "hero-slide-layer--active",
      )}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <BannerPicture
        sources={sources}
        sizes={HERO_LCP_SIZES}
        objectPosition={slide.objectPosition}
      />
    </div>
  );
}

/**
 * Luân phiên slide 2+ — slide 0 do HeroLcpPicture (SSR) phủ LCP.
 * Không preload 3840; chỉ warm slide kế khi idle.
 */
export function HeroSlideBackground({ slides = HOUSEX_HERO_SLIDES }: Props) {
  const [active, setActive] = useState(0);
  const [staticMode, setStaticMode] = useState(false);
  const count = slides.length;

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
    const sync = () => setStaticMode(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (staticMode || count <= 1) return;

    const warmNext = (index: number) => {
      const slide = slides[index];
      if (!slide) return;
      const img = new Image();
      img.src = slide.webp1280;
    };

    const idle =
      typeof requestIdleCallback === "function"
        ? requestIdleCallback
        : (cb: () => void) => window.setTimeout(cb, 200);

    idle(() => warmNext(1));
  }, [slides, staticMode, count]);

  useEffect(() => {
    if (staticMode || count <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [count, staticMode]);

  if (staticMode || count <= 1) {
    return null;
  }

  return (
    <div className="hero-slide-bg absolute inset-0 z-[1]" aria-hidden>
      {slides.map((slide, index) => {
        if (index === 0 && active === 0) return null;
        return (
          <HeroSlideLayer
            key={slide.id}
            slide={slide}
            active={index === active}
          />
        );
      })}
    </div>
  );
}

/** @deprecated — alias HeroSlideBackground */
export const CinematicHeroBackground = HeroSlideBackground;
