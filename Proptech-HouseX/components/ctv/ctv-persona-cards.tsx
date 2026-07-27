import type { CtvPersonaCard } from "@/lib/content/ctv-affiliate-landing";

export function CtvPersonaCards({
  personas,
}: {
  personas: readonly CtvPersonaCard[];
}) {
  return (
    <ul className="mt-6 grid gap-4 sm:grid-cols-2">
      {personas.map((p) => (
        <li
          key={p.role}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h3 className="font-bold text-slate-900">{p.role}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            <span className="font-medium text-slate-800">Nỗi đau: </span>
            {p.pain}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            <span className="font-medium text-brand-800">Trên House X: </span>
            {p.onHouseX}
          </p>
        </li>
      ))}
    </ul>
  );
}
