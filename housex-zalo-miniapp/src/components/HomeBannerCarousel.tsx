import { useEffect, useState } from "react";
import type { HomeBanner } from "@/data/home-content";
import { RubySurfaceOrnament } from "@/components/RubySurfaceOrnament";
import { mediaUrl } from "@/utils/media";

export function HomeBannerCarousel({ banners }: { banners: HomeBanner[] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = window.setInterval(() => {
      setIdx((i) => (i + 1) % banners.length);
    }, 5200);
    return () => window.clearInterval(t);
  }, [banners.length]);

  const b = banners[idx];
  const bgImg = mediaUrl(b.imageUrl);

  return (
    <div className="home-banner proptech-ruby-banner" aria-label="Giới thiệu House X">
      <div
        className="home-banner-slide"
        style={{
          backgroundImage: bgImg
            ? `linear-gradient(105deg, rgba(42,5,8,0.92) 0%, rgba(92,11,18,0.72) 42%, rgba(122,14,24,0.35) 100%), url(${bgImg})`
            : b.gradient,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <RubySurfaceOrnament variant="holder" />
        <p className="home-banner-kicker">HOUSE X PLATFORM</p>
        <h2 className="home-banner-headline">{b.headline}</h2>
        <p className="home-banner-sub">{b.subline}</p>
      </div>
      {banners.length > 1 ? (
        <div className="home-banner-dots" role="tablist">
          {banners.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              className={i === idx ? "home-dot on" : "home-dot"}
              aria-label={`Slide ${i + 1}`}
              aria-selected={i === idx}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
