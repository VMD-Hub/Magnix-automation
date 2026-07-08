"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NOXH_OBJECT_GROUPS } from "@/lib/finance/noxh-rules";
import type { NoxhObjectGroupId } from "@/lib/finance/noxh-rules";
import { OPS_STATUS_LABEL } from "@/lib/inbound/segment-labels";
import { cn } from "@/lib/ui/cn";

type ProjectOption = {
  id: string;
  name: string;
  slug: string;
  projectType: string;
};

type InboundRow = {
  id: string;
  uidMasked: string;
  uidSource: string;
  normalizedKey: string;
  segment: string;
  segmentLabel: string;
  score: number;
  interestKey: string | null;
  textPreview: string | null;
  magnixStatus: string;
  opsStatus: string;
  opsStatusLabel: string;
  opsNote: string | null;
  platformLeadId: string | null;
  noxhCaseId: string | null;
  noxhCaseCode: string | null;
  capturedAt: string;
};

const OBJECT_GROUP_OPTIONS = (
  Object.keys(NOXH_OBJECT_GROUPS) as NoxhObjectGroupId[]
).filter((id) => id !== "NONE");

export function InboundLeadBoard() {
  const [items, setItems] = useState<InboundRow[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<
    (InboundRow & { text: string | null }) | null
  >(null);
  const [opsNote, setOpsNote] = useState("");
  const [opsStatus, setOpsStatus] = useState<string>("pending");
  const [customerName, setCustomerName] = useState("Khách Magnix");
  const [phone, setPhone] = useState("");
  const [projectId, setProjectId] = useState("");
  const [objectGroup, setObjectGroup] = useState<NoxhObjectGroupId>("WORKER");
  const [intendToBorrow, setIntendToBorrow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/inbound-leads?queue=open");
    if (res.status === 403) {
      window.location.href = "/admin/login";
      return;
    }
    const json = await res.json();
    setItems(json.data?.items ?? []);
    setLoading(false);
  }, []);

  const loadProjects = useCallback(async () => {
    const res = await fetch("/api/admin/article-tags");
    if (!res.ok) return;
    const json = await res.json();
    const all = (json.data?.projects ?? []) as ProjectOption[];
    setProjects(all.filter((p) => p.projectType === "NHA_O_XA_HOI"));
  }, []);

  const loadDetail = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/inbound-leads/${id}`);
    const json = await res.json();
    const row = json.data;
    setDetail(row);
    setOpsNote(row?.opsNote ?? "");
    setOpsStatus(row?.opsStatus ?? "pending");
  }, []);

  useEffect(() => {
    void load();
    void loadProjects();
  }, [load, loadProjects]);

  useEffect(() => {
    if (selectedId) void loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  async function saveOps() {
    if (!selectedId) return;
    setMsg(null);
    const res = await fetch(`/api/admin/inbound-leads/${selectedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opsStatus, opsNote }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error?.message ?? "Lỗi lưu");
      return;
    }
    setMsg("Đã lưu");
    await load();
    await loadDetail(selectedId);
  }

  async function convertToPlatformLead() {
    if (!selectedId) return;
    setMsg(null);
    const res = await fetch(`/api/admin/inbound-leads/${selectedId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error?.message ?? "Lỗi tạo lead");
      return;
    }
    setMsg(
      json.data?.created
        ? `Đã tạo lead sàn #${json.data.platformLeadId.slice(0, 8)}…`
        : "Lead sàn đã tồn tại",
    );
    await load();
    await loadDetail(selectedId);
  }

  async function createNoxhCase() {
    if (!selectedId) return;
    setMsg(null);
    const res = await fetch("/api/admin/noxh-cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        phone,
        projectId: projectId || null,
        objectGroup,
        intendToBorrow,
        opsNote: opsNote || undefined,
        inboundLeadId: selectedId,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      const existingCode = json.error?.details?.caseCode;
      setMsg(
        existingCode
          ? `${json.error?.message ?? "Lỗi"} (${existingCode})`
          : (json.error?.message ?? "Lỗi tạo hồ sơ"),
      );
      return;
    }
    setMsg(
      json.data?.created
        ? `Đã tạo hồ sơ ${json.data.case.code}`
        : `Hồ sơ đã tồn tại: ${json.data.case.code}`,
    );
    await load();
    await loadDetail(selectedId);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Magnix inbound → lead sàn → hồ sơ NOXH (không auto-gán CTV). UID được
        mask; nhập SĐT khách sau khi liên hệ ngoài hệ thống.
      </p>

      {msg && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {msg}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-2">
          {loading && <p className="text-sm text-slate-500">Đang tải…</p>}
          {!loading && items.length === 0 && (
            <p className="text-sm text-slate-500">Không có inbound mở.</p>
          )}
          {items.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => setSelectedId(row.id)}
              className={cn(
                "w-full rounded-xl border p-3 text-left transition",
                selectedId === row.id
                  ? "border-brand-500 bg-white shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-slate-900">
                  {row.segmentLabel}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    row.score >= 70
                      ? "bg-rose-100 text-rose-800"
                      : "bg-slate-100 text-slate-700",
                  )}
                >
                  {row.score}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {row.uidSource} · {row.uidMasked}
              </p>
              {row.textPreview && (
                <p className="mt-2 line-clamp-2 text-sm text-slate-700">
                  {row.textPreview}
                </p>
              )}
              <p className="mt-2 text-xs text-slate-500">
                {row.opsStatusLabel}
                {row.noxhCaseCode ? ` · ${row.noxhCaseCode}` : ""}
              </p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-4">
          {!selectedId && (
            <p className="text-sm text-slate-500">Chọn một inbound để xử lý.</p>
          )}
          {selectedId && detail && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {detail.segmentLabel}
                </h2>
                <p className="text-sm text-slate-600">
                  {detail.uidSource} · {detail.uidMasked} · score {detail.score}
                </p>
                <p className="mt-1 font-mono text-xs text-slate-400">
                  {detail.normalizedKey}
                </p>
              </div>

              {detail.text && (
                <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-800">
                  {detail.text}
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">
                    Trạng thái Ops
                  </span>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={opsStatus}
                    onChange={(e) => setOpsStatus(e.target.value)}
                  >
                    {Object.entries(OPS_STATUS_LABEL).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700">
                  Ghi chú Ops
                </span>
                <textarea
                  className="min-h-[80px] w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={opsNote}
                  onChange={(e) => setOpsNote(e.target.value)}
                />
              </label>

              <div className="rounded-lg border border-dashed border-slate-300 p-4 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Tạo hồ sơ NOXH (Ops)
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">
                      Họ tên khách
                    </span>
                    <input
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      disabled={!!detail.noxhCaseId}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">
                      SĐT (sau khi liên hệ)
                    </span>
                    <input
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0901234567"
                      disabled={!!detail.noxhCaseId}
                    />
                  </label>
                  <label className="block text-sm sm:col-span-2">
                    <span className="mb-1 block font-medium text-slate-700">
                      Dự án NOXH (tùy chọn)
                    </span>
                    <select
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      disabled={!!detail.noxhCaseId}
                    >
                      <option value="">— Chưa chọn —</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">
                      Nhóm đối tượng
                    </span>
                    <select
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={objectGroup}
                      onChange={(e) =>
                        setObjectGroup(e.target.value as NoxhObjectGroupId)
                      }
                      disabled={!!detail.noxhCaseId}
                    >
                      {OBJECT_GROUP_OPTIONS.map((id) => (
                        <option key={id} value={id}>
                          {NOXH_OBJECT_GROUPS[id].label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-center gap-2 text-sm pt-6">
                    <input
                      type="checkbox"
                      checked={intendToBorrow}
                      onChange={(e) => setIntendToBorrow(e.target.checked)}
                      disabled={!!detail.noxhCaseId}
                    />
                    <span>Có vay ngân hàng</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void saveOps()}>
                  Lưu
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void convertToPlatformLead()}
                  disabled={!!detail.platformLeadId}
                >
                  {detail.platformLeadId
                    ? "Đã có lead sàn"
                    : "Tạo lead sàn (không CTV)"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void createNoxhCase()}
                  disabled={!!detail.noxhCaseId || !phone.trim()}
                >
                  {detail.noxhCaseId
                    ? "Đã có hồ sơ NOXH"
                    : "Tạo hồ sơ NOXH"}
                </Button>
              </div>

              {detail.platformLeadId && (
                <p className="text-xs text-slate-500">
                  Lead sàn ID: {detail.platformLeadId}
                </p>
              )}
              {detail.noxhCaseCode && detail.noxhCaseId && (
                <p className="text-sm text-slate-700">
                  Hồ sơ:{" "}
                  <Link
                    href={`/admin/noxh-cases?caseId=${detail.noxhCaseId}`}
                    className="font-medium text-brand-600 hover:underline"
                  >
                    {detail.noxhCaseCode}
                  </Link>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
