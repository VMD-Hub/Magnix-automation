"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NoxhWizardOpsSummary } from "@/components/admin/noxh-wizard-ops-summary";
import { cn } from "@/lib/ui/cn";
import {
  readNoxhWizardSnapshot,
  type NoxhWizardSnapshot,
} from "@/lib/leads/noxh-wizard-snapshot";

type AdminCaseRow = {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  milestone: string;
  milestoneLabel: string;
  milestoneSub: string | null;
  caseStatus: string;
  docPercent: number;
  opsNote: string | null;
  brokerName: string | null;
  ctvCode: string | null;
  projectName: string | null;
  attributionLocked: boolean;
  updatedAt: string;
};

type AdminCaseDetail = {
  objectGroup: string;
  intendToBorrow: boolean;
  leadMessage: string | null;
  wizardSnapshot: NoxhWizardSnapshot | null;
  leadId: string | null;
  leadSource: string | null;
};

type AdminDoc = {
  id: string;
  docType: string;
  status: string;
  statusLabel: string;
  rejectReason: string | null;
};

type AdminCommission = {
  id: string;
  status: string;
  amount: string;
  expectedPayDate: string | null;
};

const MILESTONES = [
  "M1_RECEIVED",
  "M2_DOCUMENTS",
  "M3_SUBMITTED",
  "M4_APPROVED",
  "M5_SIGNED",
] as const;

const DOC_STATUSES = [
  "MISSING",
  "RECEIVED",
  "REVIEWING",
  "PASSED",
  "REJECTED",
  "EXPIRED",
] as const;

export function NoxhCaseBoard() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<AdminCaseRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminCaseDetail | null>(null);
  const [docs, setDocs] = useState<AdminDoc[]>([]);
  const [commission, setCommission] = useState<AdminCommission | null>(null);
  const [opsNote, setOpsNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/noxh-cases?status=ACTIVE");
    if (res.status === 403) {
      window.location.href = "/admin/login";
      return;
    }
    const json = await res.json();
    setItems(json.data?.items ?? []);
    setLoading(false);
  }, []);

  const loadDetail = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/noxh-cases/${id}`);
    const json = await res.json();
    if (res.ok) {
      const row = json.data;
      setDetail({
        objectGroup: row.objectGroup ?? "WORKER",
        intendToBorrow: !!row.intendToBorrow,
        leadMessage: row.lead?.message ?? null,
        wizardSnapshot: readNoxhWizardSnapshot(row.lead?.opsMeta),
        leadId: row.lead?.id ?? null,
        leadSource: row.lead?.source ?? null,
      });
      setDocs(row?.documents ?? []);
      setOpsNote(row?.opsNote ?? "");
      const c = json.data?.lead?.commission;
      setCommission(
        c
          ? {
              id: c.id,
              status: c.status,
              amount: String(c.amount),
              expectedPayDate: c.expectedPayDate ?? null,
            }
          : null,
      );
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const caseId = searchParams.get("caseId");
    if (caseId) setSelectedId(caseId);
  }, [searchParams]);

  useEffect(() => {
    if (selectedId) void loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  async function patchCase(body: Record<string, unknown>) {
    if (!selectedId) return;
    setMsg(null);
    const res = await fetch(`/api/admin/noxh-cases/${selectedId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    setMsg(res.ok ? "Đã lưu." : (json?.error?.message ?? "Lỗi."));
    void load();
    void loadDetail(selectedId);
  }

  async function patchDoc(docId: string, status: string) {
    if (!selectedId) return;
    let rejectReason: string | undefined;
    if (status === "REJECTED") {
      rejectReason = window.prompt("Lý do từ chối giấy tờ:") ?? undefined;
      if (!rejectReason?.trim()) return;
    }
    const res = await fetch(
      `/api/admin/noxh-cases/${selectedId}/documents/${docId}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status, rejectReason }),
      },
    );
    if (res.ok) void loadDetail(selectedId);
  }

  async function markPayable() {
    if (!commission) return;
    setMsg(null);
    const res = await fetch(`/api/admin/commissions/${commission.id}/payable`, {
      method: "POST",
    });
    const json = await res.json();
    setMsg(res.ok ? "Hoa hồng → PAYABLE." : (json?.error?.message ?? "Lỗi."));
    if (selectedId) void loadDetail(selectedId);
  }

  const selected = items.find((i) => i.id === selectedId);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-4 text-sm text-slate-500">Đang tải…</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Mã / Khách</th>
                <th className="px-3 py-2">Mốc</th>
                <th className="px-3 py-2">CTV</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedId(row.id)}
                  className={cn(
                    "cursor-pointer border-b border-slate-100 hover:bg-slate-50",
                    selectedId === row.id && "bg-brand-50/40",
                  )}
                >
                  <td className="px-3 py-2">
                    <p className="font-medium text-slate-900">{row.customerName}</p>
                    <p className="text-xs text-slate-500">
                      {row.code} · {row.phone}
                    </p>
                  </td>
                  <td className="px-3 py-2">
                    <p>{row.milestoneLabel}</p>
                    <p className="text-xs text-slate-500">{row.docPercent}% giấy tờ</p>
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {row.ctvCode ?? row.brokerName ?? "Sàn"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        {!selected ? (
          <p className="text-sm text-slate-500">Chọn hồ sơ để cập nhật mốc & giấy tờ.</p>
        ) : (
          <>
            <h3 className="font-bold text-slate-900">
              {selected.customerName} — {selected.code}
            </h3>
            <p className="text-sm text-slate-600">{selected.phone}</p>
            {msg ? <p className="mt-2 text-sm text-emerald-700">{msg}</p> : null}

            {commission ? (
              <div className="mt-4 rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-sm">
                <p>
                  Hoa hồng:{" "}
                  <strong>
                    {Number(commission.amount).toLocaleString("vi-VN")} ₫
                  </strong>{" "}
                  — {commission.status}
                </p>
                {commission.status === "ACCRUED" ? (
                  <Button
                    type="button"
                    size="sm"
                    className="mt-2"
                    onClick={markPayable}
                  >
                    CĐT xác nhận → PAYABLE
                  </Button>
                ) : null}
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => patchCase({ markContacted: true })}
              >
                Đã liên hệ (M1)
              </Button>
              {MILESTONES.map((m) => (
                <Button
                  key={m}
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => patchCase({ milestone: m })}
                >
                  → {m.replace("M", "").split("_")[0]}
                </Button>
              ))}
            </div>

            <label className="mt-4 block text-sm">
              Ghi chú Ops (bắt buộc khi kẹt)
              <textarea
                value={opsNote}
                onChange={(e) => setOpsNote(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <Button
              type="button"
              size="sm"
              className="mt-2"
              onClick={() => patchCase({ opsNote })}
            >
              Lưu ghi chú
            </Button>

            {detail ? (
              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                <h4 className="font-bold text-slate-900">Tóm tắt từ wizard / lead</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Song ngữ · thu nhập & nợ cụ thể — chỉ Admin
                </p>
                <div className="mt-3">
                  <NoxhWizardOpsSummary
                    wizardSnapshot={detail.wizardSnapshot}
                    fallbackMessage={detail.leadMessage}
                  />
                </div>
                {detail.leadId ? (
                  <p className="mt-3 text-xs">
                    <a
                      href={`/admin/ops-leads`}
                      className="font-medium text-brand-700 hover:underline"
                    >
                      Xem lead Ops ({detail.leadSource ?? "sàn"})
                    </a>
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-slate-500">
                  Mục «Giấy tờ» bên dưới là checklist hồ sơ pháp lý Ops cập nhật
                  thủ công khi khách nộp bản cứng.
                </p>
              </div>
            ) : null}

            <h4 className="mt-6 text-sm font-bold">Giấy tờ (checklist pháp lý)</h4>
            <p className="mt-1 text-xs text-slate-500">
              Mặc định «Chưa có» sau wizard HOT — Ops đổi trạng thái khi nhận được
              từng loại giấy.
            </p>
            <ul className="mt-2 space-y-2">
              {docs
                .filter((d) => d.status !== "NOT_REQUIRED")
                .map((d) => (
                  <li
                    key={d.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-100 px-2 py-2 text-sm"
                  >
                    <span>{d.docType.replace("DOC_", "")}</span>
                    <span className="text-xs text-slate-500">{d.statusLabel}</span>
                    <select
                      className="rounded border border-slate-200 text-xs"
                      value={d.status}
                      onChange={(e) => patchDoc(d.id, e.target.value)}
                    >
                      {DOC_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
