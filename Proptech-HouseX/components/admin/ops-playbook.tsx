"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdminRole } from "@/lib/admin/admin-role-context";
import { cn } from "@/lib/ui/cn";
import {
  PLAYBOOK_QUICK_LINKS,
  PLAYBOOK_SECTIONS,
} from "@/lib/admin/ops-playbook-sections";

export function OpsPlaybook() {
  const role = useAdminRole();
  const [openId, setOpenId] = useState<string>("daily");

  const links = PLAYBOOK_QUICK_LINKS.filter((l) => l.roles.includes(role));

  return (
    <div className="ops-playbook space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3 print:hidden">
        <p className="max-w-2xl text-sm text-slate-600">
          Hướng dẫn vận hành trong Admin — không cần truy cập mã nguồn.
          In hoặc lưu PDF để đào tạo nhân viên mới.
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          In / PDF
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 print:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-900/5 transition hover:border-brand-200 hover:ring-brand-100"
          >
            <p className="font-semibold text-brand-800">{link.label}</p>
            <p className="mt-1 text-xs text-slate-500">{link.description}</p>
          </Link>
        ))}
      </div>

      <div className="hidden print:block">
        <h2 className="text-lg font-bold text-slate-900">
          House X — Playbook Ops (SOP)
        </h2>
        <p className="text-xs text-slate-500">
          In từ Console vận hành · timnhaxahoi.com/admin/playbook
        </p>
      </div>

      <div className="space-y-2">
        {PLAYBOOK_SECTIONS.map((section) => {
          const isOpen = openId === section.id;
          return (
            <section
              key={section.id}
              className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left print:pointer-events-none"
                onClick={() =>
                  setOpenId((id) => (id === section.id ? "" : section.id))
                }
                aria-expanded={isOpen}
              >
                <span>
                  <span className="font-semibold text-slate-900">
                    {section.title}
                  </span>
                  {section.subtitle ? (
                    <span className="mt-0.5 block text-xs text-slate-500 print:hidden">
                      {section.subtitle}
                    </span>
                  ) : null}
                </span>
                <span
                  className={cn(
                    "text-slate-400 print:hidden",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden
                >
                  ▾
                </span>
              </button>

              <div
                className={cn(
                  "border-t border-slate-100 px-4 pb-4 pt-3",
                  !isOpen && "hidden print:block",
                )}
              >
                {section.bullets ? (
                  <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-700">
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}

                {section.checklist ? (
                  <ul className="space-y-2 text-sm text-slate-700">
                    {section.checklist.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span
                          className="mt-0.5 inline-block h-4 w-4 shrink-0 rounded border border-slate-300 print:border-slate-500"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {section.table ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[280px] border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80">
                          {section.table.head.map((h) => (
                            <th
                              key={h}
                              className="px-3 py-2 text-left font-semibold text-slate-700"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row, i) => (
                          <tr
                            key={i}
                            className="border-b border-slate-100 last:border-0"
                          >
                            {row.map((cell, j) => (
                              <td
                                key={j}
                                className="px-3 py-2 align-top text-slate-700"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 print:hidden">
        Bản đầy đủ kỹ thuật:{" "}
        <code className="rounded bg-slate-100 px-1">docs/OPS_PLAYBOOK.md</code>
        {" · "}
        <code className="rounded bg-slate-100 px-1">
          docs/NOXH_CASE_PIPELINE.md
        </code>
        {" "}
        (chỉ dev/L3 trên repo).
      </p>
    </div>
  );
}
