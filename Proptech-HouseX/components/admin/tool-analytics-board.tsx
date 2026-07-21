"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/ui/cn";

type WindowDays = 7 | 30 | 90;

type ToolRow = {
  toolId: string;
  title: string;
  href: string;
  category: string;
  priority: boolean;
  leadSource: string | null;
  views: null;
  leads: number;
  byStatus: {
    NEW: number;
    CONTACTED: number;
    QUALIFIED: number;
    WON: number;
    LOST: number;
  };
  contentCtaItems: number;
  contentPublished: number;
};

type Payload = {
  summary: {
    windowDays: number;
    since: string;
    priorityLeads: number;
    priorityContentPublished: number;
    totalLeadsFromTools: number;
    toolsWithLeadSource: number;
    toolsWithoutLeadSource: number;
    note: string;
  };
  tools: ToolRow[];
  weekly: {
    weekStart: string;
    noxhCheck: number;
    noxhLoanQuick: number;
  }[];
};

const WINDOWS: { days: WindowDays; label: string }[] = [
  { days: 7, label: "7 ngày" },
  { days: 30, label: "30 ngày" },
  { days: 90, label: "90 ngày" },
];

export function ToolAnalyticsBoard() {
  const [days, setDays] = useState<WindowDays>(30);
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/tool-analytics?days=${days}`, {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không tải được analytics.");
        setData(null);
        return;
      }
      setData(json.data);
    } catch {
      setError("Lỗi mạng khi tải tool analytics.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {WINDOWS.map((w) => (
          <button
            key={w.days}
            type="button"
            onClick={() => setDays(w.days)}
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium",
              days === w.days
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200",
            )}
          >
            {w.label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-slate-500">Đang tải…</p>
      ) : data ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi
              label="Lead 2 tool NƠXH"
              value={data.summary.priorityLeads}
              hint="Ưu tiên CTA"
            />
            <Kpi
              label="Bài CTA đã publish"
              value={data.summary.priorityContentPublished}
              hint="content-queue → web"
            />
            <Kpi
              label="Lead mọi tool*"
              value={data.summary.totalLeadsFromTools}
              hint={`${data.summary.toolsWithLeadSource} tool có source`}
            />
            <Kpi
              label="Tool chưa gắn lead"
              value={data.summary.toolsWithoutLeadSource}
              hint="Chỉ tính/PDF — chưa SoR"
            />
          </div>

          <p className="text-xs text-slate-500">{data.summary.note}</p>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Lead NƠXH theo tuần (4 tuần gần nhất)
            </h2>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Tuần (UTC)</th>
                    <th className="px-3 py-2">Điều kiện NƠXH</th>
                    <th className="px-3 py-2">Vay NƠXH 60s</th>
                    <th className="px-3 py-2">Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {data.weekly.map((w) => (
                    <tr key={w.weekStart} className="border-t border-slate-100">
                      <td className="px-3 py-2 font-medium">{w.weekStart}</td>
                      <td className="px-3 py-2">{w.noxhCheck}</td>
                      <td className="px-3 py-2">{w.noxhLoanQuick}</td>
                      <td className="px-3 py-2 font-semibold">
                        {w.noxhCheck + w.noxhLoanQuick}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Theo từng tool ({data.summary.windowDays} ngày)
            </h2>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Tool</th>
                    <th className="px-3 py-2">Views</th>
                    <th className="px-3 py-2">Content CTA</th>
                    <th className="px-3 py-2">Leads</th>
                    <th className="px-3 py-2">NEW</th>
                    <th className="px-3 py-2">CONTACTED+</th>
                    <th className="px-3 py-2">WON</th>
                  </tr>
                </thead>
                <tbody>
                  {data.tools.map((t) => {
                    const contactedPlus =
                      t.byStatus.CONTACTED +
                      t.byStatus.QUALIFIED +
                      t.byStatus.WON;
                    return (
                      <tr
                        key={t.toolId}
                        className={cn(
                          "border-t border-slate-100",
                          t.priority && "bg-amber-50/60",
                        )}
                      >
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap items-center gap-2">
                            {t.priority ? (
                              <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-900">
                                CTA
                              </span>
                            ) : null}
                            <a
                              href={t.href}
                              className="font-medium text-sky-800 underline-offset-2 hover:underline"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {t.title}
                            </a>
                          </div>
                          <p className="text-xs text-slate-400">
                            {t.leadSource ?? "— không tạo lead SoR"}
                          </p>
                        </td>
                        <td className="px-3 py-2 text-slate-400">—</td>
                        <td className="px-3 py-2">
                          {t.contentPublished}
                          <span className="text-xs text-slate-400">
                            /{t.contentCtaItems}
                          </span>
                        </td>
                        <td className="px-3 py-2 font-semibold">{t.leads}</td>
                        <td className="px-3 py-2">{t.byStatus.NEW}</td>
                        <td className="px-3 py-2">{contactedPlus}</td>
                        <td className="px-3 py-2">{t.byStatus.WON}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
        {value}
      </p>
      <p className="text-xs text-slate-400">{hint}</p>
    </div>
  );
}
