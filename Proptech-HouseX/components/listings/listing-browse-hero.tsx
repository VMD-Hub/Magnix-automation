import { HeroBrandBackground } from "@/components/home/hero-brand-background";
import { RubySurfaceOrnament } from "@/components/brand/ruby-surface-ornament";
import { cn } from "@/lib/ui/cn";

type Props = {
  kicker: string;
  title: string;
  subtitle: string;
  className?: string;
};

/** Hero Mua bán / Cho thuê — cùng ảnh ruby skyline + facet như trang chủ, cao vừa catalog. */
export function ListingBrowseHero({ kicker, title, subtitle, className }: Props) {
  return (
    <header className={cn("proptech-catalog-hero proptech-catalog-hero--brand", className)}>
      <RubySurfaceOrnament variant="holder" />
      <div className="proptech-catalog-hero--brand__frame">
        <HeroBrandBackground />
        <div className="proptech-catalog-hero__content absolute inset-0 z-[5] flex flex-col justify-end px-5 pb-5 sm:px-8 sm:pb-7">
          <p className="proptech-kicker text-gold-400">{kicker}</p>
          <h1 className="lux-hero-title mt-2 max-w-2xl text-2xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-silver-200 sm:text-base">
            {subtitle}
          </p>
        </div>
      </div>
    </header>
  );
}
