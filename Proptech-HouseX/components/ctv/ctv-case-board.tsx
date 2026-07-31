"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/ui/cn";
import { CtvCaseDropForm } from "@/components/ctv/ctv-case-drop-form";
import {
  CtvCaseDetailPanel,
  type CtvCaseDetailView,
} from "@/components/ctv/ctv-case-detail-panel";
import { DEAL_TIER_LABEL } from "@/lib/ctv/deal-tiers";

type CaseItem = {
  id: string;
  code: string;
  customerName: string;
  phoneMasked: string;
  projectName: string | null;
  dealTier: string | null;
  milestoneLabel: string;
  milestoneProgress: string;
  milestoneSub: string | null;
  docPercent: number;
  docPassed: number;
  docRequired: number;
  opsNote: string | null;
  attributionLocked: boolean;
  updatedAt: string;
};

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "Vừa cập nhật";
  if (hours < 24) return `${hours} giờ trước`;
  return new Date(iso).toLocaleDateString("vi-VN");
}

export function CtvCaseBoard() {
  const [items, setItems] = useState<CaseItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<CtvCaseDetailView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ctv/cases");
      if (res.status === 401 || res.status === 403) {
        window.location.href = "/dang-ky/moi-gioi";
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không tải được danh sách.");
        return;
      }
      setItems(json.data?.items ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDetail = useCallback(async (id: string) => {
    const res = await fetch(`/api/ctv/cases/${id}`);
    const json = await res.json();
    if (res.ok) setDetail(json.data);
  }, []);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    if (selectedId) void loadDetail(selectedId);
    else setDetail(null);
  }, [selectedId, loadDetail]);

  async function nudge() {
    if (!selectedId) return;
    setActionMsg(null);
    const res = await fetch(`/api/ctv/cases/${selectedId}/nudge`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    const json = await res.json();
    setActionMsg(
      res.ok
        ? (json.data?.message ?? "Đã gửi nhắc.")
        : (json?.error?.message ?? "Lỗi."),
    );
    void loadDetail(selectedId);
  }

  async function assistNote() {
    if (!selectedId) return;
    const message = window.prompt("Ghi nhận bạn đã hỗ trợ khách (ngoài đời):");
    if (!message?.trim()) return;
    await fetch(`/api/ctv/cases/${selectedId}/assist`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ assistType: "NOTE", message }),
    });
    void loadDetail(selectedId);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            href="/moi-gioi/khai-bao"
            className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 font-medium text-brand-800 hover:bg-brand-100"
          >
            Khai báo A+B+C
          </Link>
          <Link
            href="/moi-gioi/gio-hang"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
          >
            Giỏ hàng
          </Link>
          <Link
            href="/moi-gioi/hoa-hong"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
          >
            Hoa hồng
          </Link>
        </div>

        <CtvCaseDropForm
          onCreated={(id) => {
            void loadList();
            setSelectedId(id);
          }}
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Hồ sơ của bạn</h2>
          {loading ? (
            <p className="mt-4 text-sm text-slate-500">Đang tải…</p>
          ) : error ? (
            <p className="mt-4 text-sm text-rose-600">{error}</p>
          ) : items.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">Chưa có hồ sơ nào.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={cn(
                      "w-full py-3 text-left transition hover:bg-slate-50",
                      selectedId === item.id && "bg-brand-50/50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.customerName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.phoneMasked} · {item.code}
                          {item.dealTier
                            ? ` · ${DEAL_TIER_LABEL[item.dealTier] ?? item.dealTier}`
                            : ""}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400">
                        {formatRelative(item.updatedAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-brand-700">
                      {item.milestoneProgress} — {item.milestoneLabel}
                    </p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${item.docPercent}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Hồ sơ: {item.docPassed}/{item.docRequired} giấy đã đạt
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-4 lg:self-start">
        {!detail ? (
          <p className="text-sm text-slate-500">
            Chọn một hồ sơ để xem CS, checklist và nhắc khách qua HouseX.
          </p>
        ) : (
          <CtvCaseDetailPanel
            detail={detail}
            actionMsg={actionMsg}
            onNudge={() => void nudge()}
            onAssistNote={() => void assistNote()}
            onCareSaved={() => {
              if (selectedId) void loadDetail(selectedId);
              void loadList();
            }}
            showOpenLink
          />
        )}
      </div>
    </div>
  );
}
