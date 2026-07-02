import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";

type Cta = { label: string; href: string };

type Props = {
  kicker?: string;
  title: string;
  subtitle: string;
  image: string;
  imageWebp?: string;
  imageAlt: string;
  objectPosition?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  className?: string;
};

/** Banner công cụ — rộng, cao ~260px, gradient Ruby/Gold HouseX. */
export function ToolsPageHero({
  kicker,
  title,
  subtitle,
  image,
  imageWebp,
  imageAlt,
  objectPosition = "50% 40%",
  primaryCta,
  secondaryCta,
  className,
}: Props) {
  return (
    <header
      className={cn(
        "relative mb-8 overflow-hidden rounded-2xl ring-1 ring-silver-200",
        className,
      )}
    >
      <div className="relative h-[240px] w-full sm:h-[260px] lg:h-[280px]">
        <picture>
          {imageWebp ? (
            <source srcSet={imageWebp} type="image/webp" />
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={imageAlt}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition }}
          />
        </picture>
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink-900/90 via-ink-900/55 to-brand-900/25"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-ink-900/15"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col justify-end px-5 pb-5 sm:px-8 sm:pb-7">
          {kicker ? (
            <p className="proptech-kicker text-gold-400">{kicker}</p>
          ) : null}
          <h1
            className={cn(
              "lux-hero-title max-w-2xl text-2xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-3xl lg:text-4xl",
              kicker && "mt-2",
            )}
          >
            {title}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-silver-200 sm:text-base">
            {subtitle}
          </p>
          {(primaryCta || secondaryCta) && (
            <div className="mt-5 flex flex-wrap gap-3 print:hidden">
              {primaryCta ? (
                <ButtonLink href={primaryCta.href} variant="primary" size="md">
                  {primaryCta.label}
                </ButtonLink>
              ) : null}
              {secondaryCta ? (
                <ButtonLink
                  href={secondaryCta.href}
                  variant="brand"
                  size="md"
                  className="ring-1 ring-white/20"
                >
                  {secondaryCta.label}
                </ButtonLink>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/** Breadcrumb nhẹ cho trang con công cụ. */
export function ToolsBreadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500 print:hidden">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`}>
          {i > 0 ? <span className="mx-2 text-slate-300">/</span> : null}
          {item.href ? (
            <Link href={item.href} className="hover:text-brand-700">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
