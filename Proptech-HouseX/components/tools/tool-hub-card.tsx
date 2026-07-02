import Link from "next/link";
import { cn } from "@/lib/ui/cn";
import type { ToolCardDef } from "@/lib/content/housex-tools-copy";
import { TOOL_CARD_IMAGES } from "@/lib/content/housex-tools-visuals";

export function ToolHubCard({ tool }: { tool: ToolCardDef }) {
  const image = TOOL_CARD_IMAGES[tool.id] ?? TOOL_CARD_IMAGES.loan;

  const inner = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          aria-hidden
          className={cn(
            "h-full w-full object-cover transition-transform duration-500",
            tool.ready && "group-hover:scale-105",
            !tool.ready && "opacity-60 grayscale-[30%]",
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent" />
        {tool.badge && tool.ready ? (
          <span className="absolute left-3 top-3 rounded-lg bg-gold-500 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
            {tool.badge}
          </span>
        ) : null}
        {!tool.ready ? (
          <span className="absolute right-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-600">
            Sắp ra mắt
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-slate-900">{tool.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{tool.desc}</p>
        <div className="mt-4">
          {tool.ready ? (
            <span className="inline-flex h-11 items-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition-colors group-hover:bg-brand-700">
              {tool.cta} →
            </span>
          ) : (
            <span className="inline-flex h-11 items-center rounded-xl border border-dashed border-slate-300 px-5 text-sm font-medium text-slate-400">
              {tool.cta}
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (!tool.ready) {
    return (
      <article className="proptech-card flex h-full flex-col overflow-hidden p-0 opacity-90">
        {inner}
      </article>
    );
  }

  return (
    <Link
      href={tool.href}
      className="proptech-card group flex h-full flex-col overflow-hidden p-0 transition-shadow hover:shadow-lg"
    >
      {inner}
    </Link>
  );
}

type ServiceCardProps = {
  href: string;
  title: string;
  intro: string;
  image: string;
};

export function ToolServiceCard({ href, title, intro, image }: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="proptech-card group flex flex-col overflow-hidden p-0 transition-shadow hover:shadow-lg sm:flex-row"
    >
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden sm:aspect-auto sm:h-auto sm:w-40 md:w-48">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          aria-hidden
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center p-5">
        <h3 className="font-bold text-slate-900 group-hover:text-brand-700">{title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{intro}</p>
        <span className="mt-4 inline-flex h-9 w-fit items-center rounded-xl border border-brand-200 px-4 text-sm font-semibold text-brand-700 transition-colors group-hover:bg-brand-50">
          Xem dịch vụ →
        </span>
      </div>
    </Link>
  );
}
