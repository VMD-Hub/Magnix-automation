import type { CtvPersonaCard } from "@/lib/content/ctv-affiliate-landing";

export function CtvPersonaCards({
  personas,
}: {
  personas: readonly CtvPersonaCard[];
}) {
  return (
    <ul className="mt-8 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {personas.map((p) => (
        <li key={p.role} className="grid gap-4 p-5 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-8 sm:p-6">
          <h3 className="text-base font-semibold leading-snug text-slate-900">
            {p.role}
          </h3>
          <div className="space-y-3 text-sm leading-relaxed text-slate-600">
            <p>
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Bối cảnh
              </span>
              <span className="mt-1 block">{p.context}</span>
            </p>
            <p>
              <span className="block text-xs font-semibold uppercase tracking-wide text-brand-700">
                Cách hợp tác
              </span>
              <span className="mt-1 block text-slate-700">{p.partnership}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
