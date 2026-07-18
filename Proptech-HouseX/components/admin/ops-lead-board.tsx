"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NoxhWizardOpsSummary } from "@/components/admin/noxh-wizard-ops-summary";
import { AssignInternalBrokerPanel } from "@/components/admin/assign-internal-broker-panel";
import {
  OpsHotLeadCreateForm,
  OpsLeadTelesalesPanel,
} from "@/components/admin/ops-lead-telesales";
import { notifyAdminQueueRefresh } from "@/components/admin/use-admin-queue-counts";
import { cn } from "@/lib/ui/cn";
import type { NoxhWizardSnapshot } from "@/lib/leads/noxh-wizard-snapshot";

type OpsLeadRow = {
  id: string;
  status: string;
  statusLabel: string;
  source: string;
  sourceLabel: string;
  segment: string | null;
  customerName: string | null;
  phoneMasked: string | null;
  nurtureScriptId: string | null;
  nurtureScriptLabel: string | null;
  projectName: string | null;
  listingTitle: string | null;
  messagePreview: string | null;
  noxhCaseCode: string | null;
  createdAt: string;
};

type NurtureOption = { id: string; label: string; channel: string };

type OpsLeadDetail = OpsLeadRow & {
  message: string | null;
  wizardSnapshot: NoxhWizardSnapshot | null;
  objectGroupLabel: string | null;
  intendToBorrowFromCase: boolean | null;
  opsNote: string | null;
  channels: {
    phone: string | null;
    zalo: string | null;
    email: string | null;
    facebook: string | null;
  };
  nurtureScript: {
    id: string;
    label: string;
    description: string;
    channel: string;
  } | null;
  nurtureCatalog: NurtureOption[];
  updatedAt: string;
};

const STATUSES = [
  { id: "NEW", label: "Mới" },
  { id: "CONTACTED", label: "Đã tiếp nhận" },
  { id: "QUALIFIED", label: "Đã liên hệ" },
  { id: "WON", label: "Thành công" },
  { id: "LOST", label: "Đóng" },
] as const;

export function OpsLeadBoard() {
  const [items, setItems] = useState<OpsLeadRow[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<OpsLeadDetail | null>(null);
  const [status, setStatus] = useState("NEW");
  const [opsNote, setOpsNote] = useState("");
  const [nurtureScriptId, setNurtureScriptId] = useState("");
  const [channels, setChannels] = useState({
    phone: "",
    zalo: "",
    email: "",
    facebook: "",
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const q = statusFilter ? `?status=${statusFilter}` : "";
    const res = await fetch(`/api/admin/ops-leads${q}`);
    if (res.status === 403) {
      window.location.href = "/admin/login";
      return;
    }
    const data = await res.json();
    setItems(data.data?.items ?? []);
    setCounts(data.data?.counts ?? {});
    setLoading(false);
  }, [statusFilter]);

  const loadDetail = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/ops-leads/${id}`);
    if (!res.ok) return;
    const json = await res.json();
    const row: OpsLeadDetail = json.data;
    setDetail(row);
    setStatus(row.status);
    setOpsNote(row.opsNote ?? "");
    setNurtureScriptId(row.nurtureScriptId ?? "");
    setChannels({
      phone: row.channels.phone ?? "",
      zalo: row.channels.zalo ?? "",
      email: row.channels.email ?? "",
      facebook: row.channels.facebook ?? "",
    });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (selectedId) void loadDetail(selectedId);
    else setDetail(null);
  }, [selectedId, loadDetail]);

  async function save() {
    if (!selectedId) return;
    setMsg(null);
    const res = await fetch(`/api/admin/ops-leads/${selectedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        opsNote: opsNote || null,
        nurtureScriptId: nurtureScriptId || null,
        channels: {
          phone: channels.phone || null,
          zalo: channels.zalo || null,
          email: channels.email || null,
          facebook: channels.facebook || null,
        },
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error?.message ?? "Lưu thất bại.");
      return;
    }
    setMsg("Đã lưu.");
    notifyAdminQueueRefresh();
    await load();
    setDetail(json.data);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
      <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
        <OpsHotLeadCreateForm
          onCreated={(id) => {
            void load();
            setSelectedId(id);
            notifyAdminQueueRefresh();
          }}
        />
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
          <div>
            <h2 className="font-semibold text-slate-900">Danh sách lead</h2>
            <p className="text-xs text-slate-500">
              Chọn dòng → telesales (gọi/SMS/Zalo) + nurture & trạng thái
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            <FilterChip
              active={!statusFilter}
              label={`Tất cả (${items.length})`}
              onClick={() => setStatusFilter("")}
            />
            {STATUSES.map((s) => (
              <FilterChip
                key={s.id}
                active={statusFilter === s.id}
                label={`${s.label} (${counts[s.id] ?? 0})`}
                onClick={() => setStatusFilter(s.id)}
              />
            ))}
          </div>
        </div>

        {loading ? (
          <p className="p-4 text-sm text-slate-500">Đang tải…</p>
        ) : items.length === 0 ? (
          <p className="p-4 text-sm text-slate-500">Chưa có lead Ops trong bộ lọc này.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((row) => (
              <li key={row.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(row.id)}
                  className={cn(
                    "w-full px-4 py-3 text-left hover:bg-slate-50",
                    selectedId === row.id && "bg-brand-50/60",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900">
                        {row.customerName ?? "Khách"}
                        {row.phoneMasked ? (
                          <span className="ml-2 text-sm font-normal text-slate-500">
                            {row.phoneMasked}
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {row.sourceLabel}
                        {row.segment ? ` · ${row.segment}` : ""}
                        {row.projectName ? ` · ${row.projectName}` : ""}
                      </p>
                      {row.nurtureScriptLabel ? (
                        <p className="mt-1 text-xs text-brand-700">
                          Nurture: {row.nurtureScriptLabel}
                        </p>
                      ) : null}
                      {row.noxhCaseCode ? (
                        <p className="mt-1 text-xs font-medium text-violet-700">
                          Hồ sơ NOXH: {row.noxhCaseCode}
                        </p>
                      ) : null}
                    </div>
                    <StatusBadge status={row.status} label={row.statusLabel} />
                  </div>
                  {row.messagePreview ? (
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                      {row.messagePreview}
                    </p>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-900/5">
        {!selectedId || !detail ? (
          <p className="text-sm text-slate-500">
            Chọn lead để gọi / ghi nhật ký / nurture. Lead hot thêm bằng form phía trên.
          </p>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900">{detail.customerName}</h3>
              <p className="text-xs text-slate-500">
                {detail.sourceLabel} · {new Date(detail.createdAt).toLocaleString("vi-VN")}
              </p>
              <p
                className="mt-1 break-all font-mono text-[10px] text-slate-400"
                title="Lead ID"
              >
                ID: {detail.id}
              </p>
            </div>

            <OpsLeadTelesalesPanel
              leadId={selectedId}
              onStatusMaybeChanged={() => {
                void load();
                void loadDetail(selectedId);
              }}
            />

            <AssignInternalBrokerPanel
              leadId={selectedId}
              onAssigned={() => {
                setSelectedId(null);
                setDetail(null);
                notifyAdminQueueRefresh();
                void load();
              }}
            />

            <label className="block text-sm">
              <span className="font-medium text-slate-700">Trạng thái pipeline</span>
              <select
                className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-500">
                Mới → Đã tiếp nhận (vào pipeline) → Đã liên hệ (đã gọi/chăm sóc).
              </p>
            </label>

            <label className="block text-sm">
              <span className="font-medium text-slate-700">Kịch bản nurture</span>
              <select
                className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm"
                value={nurtureScriptId}
                onChange={(e) => setNurtureScriptId(e.target.value)}
              >
                <option value="">— Chưa chọn —</option>
                {detail.nurtureCatalog.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} ({s.channel})
                  </option>
                ))}
              </select>
              {detail.nurtureScript ? (
                <p className="mt-1 text-xs text-slate-500">{detail.nurtureScript.description}</p>
              ) : null}
            </label>

            <fieldset className="space-y-2 text-sm">
              <legend className="font-medium text-slate-700">Kênh liên hệ</legend>
              {(["phone", "zalo", "email", "facebook"] as const).map((key) => (
                <input
                  key={key}
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm"
                  placeholder={key}
                  value={channels[key]}
                  onChange={(e) =>
                    setChannels((c) => ({ ...c, [key]: e.target.value }))
                  }
                />
              ))}
            </fieldset>

            <label className="block text-sm">
              <span className="font-medium text-slate-700">Ghi chú Ops</span>
              <textarea
                className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm"
                rows={3}
                value={opsNote}
                onChange={(e) => setOpsNote(e.target.value)}
              />
            </label>

            <div>
              <p className="text-xs font-medium text-slate-700">
                Tóm tắt wizard NOXH
              </p>
              <p className="text-[10px] text-slate-500">
                Song ngữ · số tiền cụ thể — chỉ Admin thấy
              </p>
              <div className="mt-2 max-h-[min(70vh,520px)] overflow-y-auto">
                <NoxhWizardOpsSummary
                  wizardSnapshot={detail.wizardSnapshot}
                  fallbackMessage={detail.message}
                  objectGroupLabel={detail.objectGroupLabel}
                  intendToBorrowFromCase={detail.intendToBorrowFromCase}
                />
              </div>
            </div>

            {msg ? <p className="text-sm text-brand-700">{msg}</p> : null}

            <Button type="button" onClick={() => void save()} className="w-full">
              Lưu cập nhật
            </Button>
          </div>
        )}
      </aside>
    </div>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium",
        active
          ? "bg-brand-100 text-brand-800"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200",
      )}
    >
      {label}
    </button>
  );
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  const tone =
    status === "NEW"
      ? "bg-blue-100 text-blue-800"
      : status === "CONTACTED"
        ? "bg-amber-100 text-amber-800"
        : status === "QUALIFIED"
          ? "bg-emerald-100 text-emerald-800"
          : status === "WON"
            ? "bg-green-100 text-green-800"
            : "bg-slate-100 text-slate-600";

  return (
    <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-medium", tone)}>
      {label}
    </span>
  );
}
