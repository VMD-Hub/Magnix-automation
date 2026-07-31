"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { AGENT_SUPPORT } from "@/lib/content/agent-support";

/** Help FAB P0 — modal kênh người (parity Mini AgentHelpFab). */
export function CtvHelpFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Cần trợ giúp"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg hover:bg-brand-700"
      >
        <Icon.Chat className="text-2xl" />
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-labelledby="ctv-help-title"
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="ctv-help-title"
              className="text-lg font-bold text-slate-900"
            >
              Cần trợ giúp?
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Chọn kênh hỗ trợ đối tác (P0 — AI bổ sung sau)
            </p>
            <div className="mt-4 space-y-2">
              <a
                href={`tel:${AGENT_SUPPORT.phoneTel}`}
                className="block rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Số điện thoại · {AGENT_SUPPORT.phoneDisplay}
              </a>
              <a
                href={`mailto:${AGENT_SUPPORT.email}`}
                className="block rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Email hỗ trợ
              </a>
              <a
                href={AGENT_SUPPORT.zaloUrl}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Zalo OA
              </a>
            </div>
            <button
              type="button"
              className="mt-4 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
