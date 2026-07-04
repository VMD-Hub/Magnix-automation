import { cn } from "@/lib/ui/cn";
import type { BilingualLine } from "@/lib/content/legal-appendix-types";

/** Prose blocks (markdown / CMS) — strong h2/h3 + list spacing */
export const HOUSEX_PROSE_CLASS =
  "housex-prose prose prose-slate max-w-none prose-a:text-brand-700";

export function DocKicker({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-xs font-bold uppercase tracking-wider text-brand-600", className)}>
      {children}
    </p>
  );
}

export function DocSectionHeading({
  vi,
  en,
  className,
  id,
}: {
  vi: string;
  en: string;
  className?: string;
  id?: string;
}) {
  return (
    <h2 className={cn("doc-h2", className)} id={id}>
      {vi}
      <span className="doc-h2-en">{en}</span>
    </h2>
  );
}

export function DocSubheading({
  vi,
  en,
  className,
}: {
  vi: string;
  en?: string;
  className?: string;
}) {
  return (
    <>
      <h3 className={cn("doc-h3", className)}>{vi}</h3>
      {en ? <p className="doc-h3-en">{en}</p> : null}
    </>
  );
}

export function DocBlockLabel({
  vi,
  en,
  className,
}: {
  vi: string;
  en?: string;
  className?: string;
}) {
  return (
    <p className={cn("doc-block-label", className)}>
      {vi}
      {en ? (
        <span className="ml-2 font-normal italic text-slate-500">/ {en}</span>
      ) : null}
    </p>
  );
}

export function DocSectionLabel({
  vi,
  en,
  className,
}: {
  vi: string;
  en?: string;
  className?: string;
}) {
  return (
    <h2 className={cn("doc-section-label", className)}>
      {vi}
      {en ? <span className="doc-section-label-en">{en}</span> : null}
    </h2>
  );
}

export function DocCategoryTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn("doc-category-title", className)}>{children}</p>;
}

export function DocPlainBulletList({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <ul className={cn("doc-bullets", className)}>
      {items.map((item) => (
        <li key={item} className="doc-body-vi">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function DocCategoryBlock({
  label,
  items,
  className,
}: {
  label: string;
  items: readonly string[];
  className?: string;
}) {
  return (
    <div className={className}>
      <DocCategoryTitle>{label}</DocCategoryTitle>
      <DocPlainBulletList items={items} />
    </div>
  );
}

export function DocBilingualParagraph({
  vi,
  en,
  className,
}: BilingualLine & { className?: string }) {
  return (
    <div className={cn("doc-paragraph", className)}>
      <p className="doc-body-vi">{vi}</p>
      <p className="doc-body-en">{en}</p>
    </div>
  );
}

export function DocBulletList({
  items,
  className,
}: {
  items: readonly BilingualLine[];
  className?: string;
}) {
  return (
    <ul className={cn("doc-bullets", className)}>
      {items.map((item) => (
        <li key={item.vi.slice(0, 48)}>
          <span className="doc-body-vi block">{item.vi}</span>
          <span className="doc-body-en block">{item.en}</span>
        </li>
      ))}
    </ul>
  );
}

export function DocNumberedList({
  items,
  className,
}: {
  items: readonly BilingualLine[];
  className?: string;
}) {
  return (
    <ol className={cn("doc-numbered", className)}>
      {items.map((item) => (
        <li key={item.vi.slice(0, 48)}>
          <span className="doc-body-vi block">{item.vi}</span>
          <span className="doc-body-en block">{item.en}</span>
        </li>
      ))}
    </ol>
  );
}

/** Card-style bullets for marketing / partnership pages */
export function DocCardBulletList({
  items,
  className,
}: {
  items: readonly BilingualLine[];
  className?: string;
}) {
  return (
    <ul className={cn("mt-4 space-y-3", className)}>
      {items.map((item) => (
        <li
          key={item.vi.slice(0, 40)}
          className="flex gap-3 rounded-xl border border-silver-200 bg-white px-4 py-3"
        >
          <span
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600"
            aria-hidden
          />
          <div>
            <p className="doc-body-vi">{item.vi}</p>
            <p className="doc-body-en">{item.en}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
