"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AGENT_CART_PROJECTS,
  type AgentCartProject,
} from "@/lib/ctv/agent-cart-projects";
import { cn } from "@/lib/ui/cn";

/** Giỏ hàng → khai báo `?project=` (parity Mini AgentCartPage). */
export function CtvCartGrid() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "noxh" | "cctm">("all");

  const items = useMemo(
    () =>
      AGENT_CART_PROJECTS.filter((p) =>
        filter === "all" ? true : p.lane === filter,
      ),
    [filter],
  );

  function pick(p: AgentCartProject) {
    router.push(
      `/moi-gioi/khai-bao?project=${encodeURIComponent(p.name)}`,
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", "Tất cả"],
            ["noxh", "NOXH"],
            ["cctm", "CCTM"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition",
              filter === id
                ? "border-brand-400 bg-brand-50 text-brand-800"
                : "border-slate-200 text-slate-600 hover:bg-slate-50",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((p) => (
          <article
            key={p.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
              {p.tag}
            </span>
            <h2 className="mt-3 text-lg font-bold text-slate-900">{p.name}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {p.kind} · {p.area}
            </p>
            <p className="mt-2 text-sm font-semibold text-brand-700">{p.price}</p>
            <button
              type="button"
              onClick={() => pick(p)}
              className="mt-4 w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Chọn để khai báo
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
