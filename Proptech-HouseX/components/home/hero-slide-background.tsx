"use client";

import { useEffect, useState } from "react";
import {
  HOUSEX_HERO_SLIDES,
  HOUSEX_HERO_SRCSET_SIZES,
  type HouseXHeroSlideAsset,
} from "@/lib/brand/hero-assets";
import { cn } from "@/lib/ui/cn";

const SLIDE_MS = 8000;
const FADE_MS = 1200;
const MOBILE_MAX = 767;

type Props = {
  slides?: HouseXHeroSlideAsset[];
};

function HeroSlideFrame({
  slide,
  active,
  priority,
}: {
  slide: HouseXHeroSlideAsset;
  active: boolean;
  priority: boolean;
}) {
  const webpSrcSet = `${slide.webpMd} 1920w, ${slide.webp} 3840w`;
  const jpgSrcSet = `${slide.jpgMd} 1920w, ${slide.jpg} 3840w`;

  return (
    <div
      className={cn(
        "hero-slide-layer absolute inset-0",
        active && "hero-slide-layer--active",
      )}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <picture className="absolute inset-0 block h-full w-full">
        <source
          srcSet={webpSrcSet}
          sizes={HOUSEX_HERO_SRCSET_SIZES}
          type="image/webp"
        />
        <img
          src={slide.jpgMd}
          srcSet={jpgSrcSet}
          sizes={HOUSEX_HERO_SRCSET_SIZES}
          alt=""
          className="hero-slide-img absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: slide.objectPosition }}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      </picture>
    </div>
  );
}

/** Hero slide fade — mobile: ảnh tĩnh (LCP); desktop: luân phiên. */
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
    if (staticMode) return;
    for (const slide of slides) {
      for (const src of [slide.jpg, slide.jpgMd, slide.webp, slide.webpMd]) {
        const img = new Image();
        img.src = src;
      }
    }
  }, [slides, staticMode]);

  useEffect(() => {
    if (staticMode || count <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [count, staticMode]);

  const visibleSlides = staticMode ? slides.slice(0, 1) : slides;

  return (
    <div className="hero-slide-bg absolute inset-0 z-[1]" aria-hidden>
      {visibleSlides.map((slide, index) => (
        <HeroSlideFrame
          key={slide.id}
          slide={slide}
          active={staticMode || index === active}
          priority={index === 0}
        />
      ))}
      <div className="hero-slide-vignette absolute inset-0 z-[2]" />
    </div>
  );
}

/** @deprecated — alias HeroSlideBackground */
export const CinematicHeroBackground = HeroSlideBackground;
