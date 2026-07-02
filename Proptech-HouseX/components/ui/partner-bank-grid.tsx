import type { AffiliatePartner } from "@/lib/content/affiliate-verticals";
import { BankMark } from "@/components/brand/bank-mark";
import { cn } from "@/lib/ui/cn";

type PartnerBankGridProps = {
  partners: AffiliatePartner[];
  intro?: string;
  title?: string;
  disclaimer?: string;
  className?: string;
  compact?: boolean;
};

export function PartnerBankGrid({
  partners,
  intro,
  title = "Ngân hàng đối tác tín dụng",
  disclaimer = "* Lãi suất và điều kiện vay do ngân hàng công bố tại thời điểm ký hợp đồng.",
  className,
  compact = false,
}: PartnerBankGridProps) {
  if (partners.length === 0) return null;

  return (
    <section className={cn("relative", className)}>
      <div className="proptech-section-glow pointer-events-none absolute -inset-x-4 -top-8 h-32 opacity-60" />
      <div className="relative">
        <p className="proptech-kicker">{compact ? "Đối tác" : "Proptech finance"}</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        {intro ? <p className="mt-2 max-w-2xl text-slate-600">{intro}</p> : null}
        <ul
          className={cn(
            "mt-6 grid gap-3",
            compact ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          )}
        >
          {partners.map((b) => (
            <li key={b.name}>
              <div className="proptech-card group flex items-center gap-3 p-3 sm:p-4">
                <BankMark name={b.name} size={compact ? "sm" : "md"} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900 transition-colors group-hover:text-brand-700">
                    {b.name}
                  </p>
                  {b.note ? (
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{b.note}</p>
                  ) : null}
                </div>
                <span
                  className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 opacity-0 transition-opacity group-hover:opacity-100 sm:flex"
                  aria-hidden
                >
                  →
                </span>
              </div>
            </li>
          ))}
        </ul>
        {disclaimer ? <p className="mt-4 text-xs text-slate-400">{disclaimer}</p> : null}
      </div>
    </section>
  );
}
