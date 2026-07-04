import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";
import { HOUSEX_PROSE_CLASS, DocPlainBulletList, DocSubheading } from "@/components/content/document-typography";

export function TrustBreadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="mb-6 text-sm text-slate-500">
      {items.map((item, i) => (
        <span key={item.label}>
          {i > 0 && <span className="mx-2">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-brand-700">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-800">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function ProcessSteps({
  steps,
  className,
}: {
  steps: readonly { step: string; title: string; desc: string }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "not-prose grid gap-4 sm:grid-cols-3",
        className,
      )}
    >
      {steps.map((s) => (
        <div
          key={s.step}
          className="rounded-2xl border border-silver-200 bg-white p-5 shadow-sm"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Bước {s.step}
          </span>
          <h3 className="mt-2 text-base font-bold text-slate-900">{s.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
        </div>
      ))}
    </div>
  );
}

export function MetricsBand({
  metrics,
  className,
}: {
  metrics: readonly { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "not-prose grid grid-cols-2 gap-4 rounded-2xl bg-gradient-to-br from-brand-900 to-ink-900 p-6 text-white sm:grid-cols-4",
        className,
      )}
    >
      {metrics.map((m) => (
        <div key={m.label} className="text-center sm:text-left">
          <p className="text-2xl font-extrabold text-gold-400">{m.value}</p>
          <p className="mt-1 text-xs leading-snug text-slate-300">{m.label}</p>
        </div>
      ))}
    </div>
  );
}

export function QuickLinkGrid({
  links,
  className,
}: {
  links: readonly { title: string; desc: string; href: string }[];
  className?: string;
}) {
  return (
    <div className={cn("not-prose grid gap-4 sm:grid-cols-2", className)}>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="group rounded-2xl border border-silver-200 bg-white p-5 transition hover:border-brand-200 hover:shadow-md"
        >
          <h3 className="font-bold text-slate-900 group-hover:text-brand-700">
            {l.title} →
          </h3>
          <p className="mt-2 text-sm text-slate-600">{l.desc}</p>
        </Link>
      ))}
    </div>
  );
}

export function ContactRouteCards({
  routes,
  className,
}: {
  routes: readonly { title: string; desc: string; href: string }[];
  className?: string;
}) {
  return (
    <div className={cn("not-prose grid gap-3 sm:grid-cols-2", className)}>
      {routes.map((r) => (
        <Link
          key={r.title}
          href={r.href}
          className="rounded-xl border border-silver-200 bg-slate-50 p-4 transition hover:border-brand-200 hover:bg-white"
        >
          <h3 className="text-sm font-bold text-slate-900">{r.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{r.desc}</p>
        </Link>
      ))}
    </div>
  );
}

export function PageCtaBand({
  primary,
  secondary,
  className,
}: {
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "not-prose flex flex-wrap items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 p-6",
        className,
      )}
    >
      <ButtonLink href={primary.href} size="md">
        {primary.label}
      </ButtonLink>
      {secondary && (
        <ButtonLink href={secondary.href} variant="outline" size="md">
          {secondary.label}
        </ButtonLink>
      )}
    </div>
  );
}

export function LegalDocument({
  title,
  updated,
  intro,
  sections,
  disclaimer,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: readonly {
    heading: string;
    paragraphs?: readonly string[];
    bullets?: readonly string[];
    subsections?: readonly {
      heading: string;
      paragraphs?: readonly string[];
      bullets?: readonly string[];
    }[];
  }[];
  disclaimer?: string;
}) {
  return (
    <article className={cn("mx-auto max-w-2xl py-10 container-px", HOUSEX_PROSE_CLASS)}>
      <h1>{title}</h1>
      <p className="text-sm text-slate-500">Cập nhật: {updated}</p>
      <p>{intro}</p>
      {sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          {s.paragraphs?.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
          {s.subsections?.map((sub) => (
            <div key={sub.heading}>
              <DocSubheading vi={sub.heading} className="!mt-6" />
              {sub.paragraphs?.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
              {sub.bullets && <DocPlainBulletList items={sub.bullets} />}
            </div>
          ))}
          {s.bullets && <DocPlainBulletList items={s.bullets} />}
        </section>
      ))}
      {disclaimer && (
        <p className="text-sm text-slate-500 not-prose border-t border-slate-200 pt-6">
          {disclaimer}
        </p>
      )}
    </article>
  );
}
