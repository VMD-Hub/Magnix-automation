"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";
import { CtvCaseDropForm } from "@/components/ctv/ctv-case-drop-form";

type CaseItem = {
  id: string;
  code: string;
  customerName: string;
  phoneMasked: string;
  projectName: string | null;
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

type CaseDetail = CaseItem & {
  documents: {
    id: string;
    label: string;
    status: string;
    statusLabel: string;
    rejectReason: string | null;
    ctvActionHint: string | null;
  }[];
  missingDocs: { id: string; label: string; ctvActionHint: string | null }[];
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
  const [detail, setDetail] = useState<CaseDetail | null>(null);
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

  async function nudge(docType?: string) {
    if (!selectedId) return;
    setActionMsg(null);
    const res = await fetch(`/api/ctv/cases/${selectedId}/nudge`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ docType }),
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
        <CtvCaseDropForm onCreated={loadList} />

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
            Chọn một hồ sơ để xem checklist và nhắc khách qua HouseX.
          </p>
        ) : (
          <>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {detail.code}
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">
              {detail.customerName}
            </h3>
            <p className="text-sm text-slate-500">
              Liên hệ: {detail.phoneMasked}
              {detail.projectName ? ` · ${detail.projectName}` : ""}
            </p>
            {detail.attributionLocked ? (
              <p className="mt-2 rounded-lg bg-violet-50 px-3 py-2 text-xs text-violet-800">
                Đã cọc — quyền giới thiệu đã chốt.
              </p>
            ) : null}

            <p className="mt-4 text-sm font-medium text-slate-800">
              {detail.milestoneProgress} — {detail.milestoneLabel}
            </p>
            {detail.opsNote ? (
              <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                Ops: {detail.opsNote}
              </p>
            ) : null}

            {actionMsg ? (
              <p className="mt-3 text-sm text-emerald-700">{actionMsg}</p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => nudge()}
              >
                Nhắc qua HouseX
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={assistNote}>
                Đã hỗ trợ ngoài đời
              </Button>
              <Link
                href="/cong-cu/dieu-kien-noxh"
                className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                Gửi checklist NOXH
              </Link>
            </div>

            <h4 className="mt-6 text-sm font-bold text-slate-900">Checklist giấy tờ</h4>
            <ul className="mt-2 space-y-2">
              {detail.documents
                .filter((d) => d.status !== "NOT_REQUIRED")
                .map((d) => (
                  <li
                    key={d.id}
                    className="rounded-lg border border-slate-100 px-3 py-2 text-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-slate-800">{d.label}</span>
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          d.status === "PASSED" && "text-emerald-600",
                          (d.status === "MISSING" || d.status === "REJECTED") &&
                            "text-rose-600",
                          d.status === "REVIEWING" && "text-amber-600",
                        )}
                      >
                        {d.statusLabel}
                      </span>
                    </div>
                    {d.rejectReason ? (
                      <p className="mt-1 text-xs text-rose-600">{d.rejectReason}</p>
                    ) : null}
                    {d.ctvActionHint &&
                    (d.status === "MISSING" || d.status === "REJECTED") ? (
                      <p className="mt-1 text-xs text-slate-500">{d.ctvActionHint}</p>
                    ) : null}
                  </li>
                ))}
            </ul>

            <p className="mt-6 text-xs text-slate-400">
              Mọi tư vấn pháp lý do chuyên viên HouseX phụ trách.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
