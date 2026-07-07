import { HeroBrandRubyTexture } from "@/components/home/hero-brand-ruby-texture";
import { HERO_BRAND_SKYLINE } from "@/lib/brand/hero-brand-assets";
import { cn } from "@/lib/ui/cn";

/** Vị trí crop khác nhau theo slug — tránh mọi thẻ trùng một khung ảnh. */
function articleCoverFocus(slug: string): string {
  const n = [...slug].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const x = 48 + (n % 16);
  const y = 36 + (n % 14);
  return `${x}% ${y}%`;
}

type Props = {
  title: string;
  slug: string;
  className?: string;
  /** Compact — thẻ ngang nhỏ hơn. */
  compact?: boolean;
  /** Ẩn tiêu đề trên ảnh (dùng cho thumbnail compact). */
  showTitle?: boolean;
};

/**
 * Cover mặc định bài viết không có ảnh — hero skyline ruby crop + tiêu đề trên ảnh.
 */
export function ArticleBrandCover({
  title,
  slug,
  className,
  compact,
  showTitle = true,
}: Props) {
  const objectPosition = articleCoverFocus(slug);

  return (
    <div
      className={cn(
        "article-brand-cover",
        compact && "article-brand-cover--compact",
        className,
      )}
    >
      <div className="article-brand-cover__bg" aria-hidden>
        <picture>
          <source srcSet={HERO_BRAND_SKYLINE.webp} type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_BRAND_SKYLINE.src}
            alt=""
            className="article-brand-cover__photo"
            style={{ objectPosition }}
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className="hero-brand-ruby-tint" />
        <HeroBrandRubyTexture />
        <div className="article-brand-cover__vignette" />
      </div>
      <p className={showTitle ? "article-brand-cover__title" : "sr-only"}>
        {title}
      </p>
    </div>
  );
}
