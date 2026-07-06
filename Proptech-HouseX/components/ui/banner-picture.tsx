import { cn } from "@/lib/ui/cn";
import type { ResponsiveBannerSources } from "@/lib/brand/banner-responsive";

type Props = {
  sources: ResponsiveBannerSources;
  sizes: string;
  alt?: string;
  objectPosition?: string;
  className?: string;
  imgClassName?: string;
  /** LCP hero — eager + high priority. */
  priority?: boolean;
};

/** `<picture>` responsive — WebP + JPG, không dùng bản 3840 cho banner. */
export function BannerPicture({
  sources,
  sizes,
  alt = "",
  objectPosition = "50% 40%",
  className,
  imgClassName,
  priority = false,
}: Props) {
  return (
    <picture className={cn("absolute inset-0 block h-full w-full", className)}>
      <source srcSet={sources.webpSrcSet} sizes={sizes} type="image/webp" />
      <source srcSet={sources.jpgSrcSet} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={sources.fallbackJpg}
        srcSet={sources.jpgSrcSet}
        sizes={sizes}
        alt={alt}
        width={sources.width}
        height={sources.height}
        decoding={priority ? "sync" : "async"}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={cn(
          "absolute inset-0 h-full w-full object-cover",
          imgClassName,
        )}
        style={{ objectPosition }}
      />
    </picture>
  );
}
