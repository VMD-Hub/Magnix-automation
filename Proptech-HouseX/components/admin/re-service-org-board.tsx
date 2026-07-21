"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";
import type {
  ReServiceAdminUnitMeta,
  ReServiceOrgRecord,
} from "@/lib/admin/re-service-org-registry";
import {
  OPS_STATUS_LABEL,
  SOURCE_KIND_LABEL,
  UNIT_TYPE_LABEL,
  adminUnitLabel,
} from "@/lib/admin/re-service-org-registry";

type Counts = {
  total: number;
  activeCandidate: number;
  needsVerify: number;
  archive: number;
  readerEligible: number;
  filtered: number;
};

const CONFIDENCE_CLASS: Record<string, string> = {
  HIGH: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  MED: "bg-amber-50 text-amber-900 ring-amber-200",
  LOW: "bg-slate-100 text-slate-600 ring-slate-200",
};

const STATUS_CLASS: Record<string, string> = {
  ACTIVE_CANDIDATE: "bg-sky-50 text-sky-900 ring-sky-200",
  NEEDS_VERIFY: "bg-orange-50 text-orange-900 ring-orange-200",
  ARCHIVE: "bg-slate-100 text-slate-600 ring-slate-200",
  STALE: "bg-rose-50 text-rose-800 ring-rose-200",
};

function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ReServiceOrgBoard() {
  const [items, setItems] = useState<ReServiceOrgRecord[]>([]);
  const [units, setUnits] = useState<ReServiceAdminUnitMeta[]>([]);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [adminUnit, setAdminUnit] = useState("ALL");
  const [unitType, setUnitType] = useState("ALL");
  const [opsStatus, setOpsStatus] = useState("ALL");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    const params = new URLSearchParams();
    if (adminUnit !== "ALL") params.set("adminUnit", adminUnit);
    if (unitType !== "ALL") params.set("unitType", unitType);
    if (opsStatus !== "ALL") params.set("opsStatus", opsStatus);
    if (q.trim()) params.set("q", q.trim());

    const res = await fetch(`/api/admin/re-service-orgs?${params}`);
    if (res.status === 403) {
      window.location.href = "/admin/login";
      return;
    }
    const json = await res.json();
    if (!res.ok) {
      setErr(json.error?.message ?? "Không tải được registry.");
      setLoading(false);
      return;
    }
    setItems(json.data?.items ?? []);
    setUnits(json.data?.units ?? []);
    setCounts(json.data?.counts ?? null);
    setLoading(false);
  }, [adminUnit, unitType, opsStatus, q]);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = useMemo(
    () => items.find((i) => i.id === selectedId) ?? null,
    [items, selectedId],
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
        <p className="font-semibold">Nội bộ — Chủ quản (L3)</p>
        <p className="mt-1 text-amber-900/90">
          Tài sản dữ liệu quản lý / biên tập. Không dump lên tin người đọc hay Mini
          App. Phase 1 = seed tĩnh; Phase 2 = DB khi ổn định. Doc:{" "}
          <code className="rounded bg-white/70 px-1 text-xs">
            docs/RE_SERVICE_ORG_REGISTRY_OPS.md
          </code>
        </p>
      </div>

      {counts ? (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: "Tổng seed", value: counts.total },
            { label: "Ứng viên", value: counts.activeCandidate },
            { label: "Cần xác minh", value: counts.needsVerify },
            { label: "Archive", value: counts.archive },
            { label: "Reader-eligible", value: counts.readerEligible },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-xl border border-slate-200/80 bg-white px-3 py-2 shadow-sm ring-1 ring-slate-900/5"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                {c.label}
              </p>
              <p className="text-xl font-semibold text-slate-900">{c.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-end gap-2 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <label className="text-xs text-slate-600">
          Địa giới mới
          <select
            className="mt-1 block rounded-md border border-slate-200 px-2 py-1.5 text-sm"
            value={adminUnit}
            onChange={(e) => setAdminUnit(e.target.value)}
          >
            <option value="ALL">Tất cả</option>
            {units.map((u) => (
              <option key={u.slug} value={u.slug}>
                {u.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-slate-600">
          Loại
          <select
            className="mt-1 block rounded-md border border-slate-200 px-2 py-1.5 text-sm"
            value={unitType}
            onChange={(e) => setUnitType(e.target.value)}
          >
            <option value="ALL">Tất cả</option>
            <option value="SAN">Sàn</option>
            <option value="MOI_GIOI">Môi giới</option>
            <option value="TU_VAN_QL">Tư vấn / QL</option>
          </select>
        </label>
        <label className="text-xs text-slate-600">
          Trạng thái ops
          <select
            className="mt-1 block rounded-md border border-slate-200 px-2 py-1.5 text-sm"
            value={opsStatus}
            onChange={(e) => setOpsStatus(e.target.value)}
          >
            <option value="ALL">Tất cả</option>
            <option value="ACTIVE_CANDIDATE">Ứng viên</option>
            <option value="NEEDS_VERIFY">Cần xác minh</option>
            <option value="ARCHIVE">Archive</option>
            <option value="STALE">Stale</option>
          </select>
        </label>
        <label className="min-w-[12rem] flex-1 text-xs text-slate-600">
          Tìm
          <input
            className="mt-1 block w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm"
            placeholder="Tên, MST, số VB…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void load()}
          disabled={loading}
        >
          Làm mới
        </Button>
      </div>

      {err ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {err}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
          <div className="border-b border-slate-100 px-3 py-2 text-xs text-slate-500">
            {loading
              ? "Đang tải…"
              : `${counts?.filtered ?? items.length} bản ghi (đã lọc)`}
          </div>
          <div className="max-h-[32rem] overflow-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="sticky top-0 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-medium">Tên</th>
                  <th className="px-3 py-2 font-medium">Địa bàn</th>
                  <th className="px-3 py-2 font-medium">Loại</th>
                  <th className="px-3 py-2 font-medium">Ops</th>
                  <th className="px-3 py-2 font-medium">Tin cậy</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "cursor-pointer border-t border-slate-100 hover:bg-slate-50/80",
                      selectedId === row.id && "bg-brand-50/60",
                    )}
                    onClick={() => setSelectedId(row.id)}
                  >
                    <td className="px-3 py-2">
                      <p className="font-medium text-slate-900">{row.name}</p>
                      {row.adminUnitLegacyLabel ? (
                        <p className="text-[11px] text-slate-500">
                          Nhãn cũ: {row.adminUnitLegacyLabel}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-3 py-2 text-slate-700">
                      {adminUnitLabel(row.adminUnitNew)}
                    </td>
                    <td className="px-3 py-2 text-slate-700">
                      {UNIT_TYPE_LABEL[row.unitType]}
                    </td>
                    <td className="px-3 py-2">
                      <Badge className={STATUS_CLASS[row.opsStatus]}>
                        {OPS_STATUS_LABEL[row.opsStatus]}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <Badge className={CONFIDENCE_CLASS[row.confidence]}>
                        {row.confidence}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {!loading && items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-8 text-center text-sm text-slate-500"
                    >
                      Không có bản ghi khớp bộ lọc.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-900/5">
          {selected ? (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Chi tiết
                </p>
                <h3 className="text-base font-semibold text-slate-900">
                  {selected.name}
                </h3>
                <p className="font-mono text-[11px] text-slate-400">
                  {selected.id}
                </p>
              </div>
              <dl className="grid gap-2 text-sm">
                <div>
                  <dt className="text-xs text-slate-500">Địa giới mới</dt>
                  <dd>{adminUnitLabel(selected.adminUnitNew)}</dd>
                </div>
                {selected.adminUnitLegacyLabel ? (
                  <div>
                    <dt className="text-xs text-slate-500">Nhãn địa giới cũ</dt>
                    <dd>{selected.adminUnitLegacyLabel}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-xs text-slate-500">Loại / nguồn</dt>
                  <dd>
                    {UNIT_TYPE_LABEL[selected.unitType]} ·{" "}
                    {SOURCE_KIND_LABEL[selected.sourceKind]}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">MST</dt>
                  <dd>{selected.mst ?? "— (chưa enrich L1)"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Số VB / thông báo</dt>
                  <dd>{selected.permitOrNoticeRef ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Quan sát</dt>
                  <dd>{selected.observedAt}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Reader-eligible</dt>
                  <dd>{selected.readerEligible ? "Có" : "Không"}</dd>
                </div>
                {selected.notes ? (
                  <div>
                    <dt className="text-xs text-slate-500">Ghi chú ops</dt>
                    <dd className="text-slate-700">{selected.notes}</dd>
                  </div>
                ) : null}
              </dl>
              <a
                href={selected.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-sm font-medium text-brand-700 underline-offset-2 hover:underline"
              >
                Mở nguồn →
              </a>
              <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                L1: tra pháp nhân trên dangkykinhdoanh.gov.vn · L2: Sở XD / MOC /
                bds.moc.gov.vn. Có ngành nghề ≠ đã thông báo hoạt động.
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Chọn một dòng để xem chi tiết nguồn và trạng thái xác minh.
            </p>
          )}
        </div>
      </div>

      <section className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-900/5">
        <h3 className="text-sm font-semibold text-slate-900">
          Bản đồ địa giới mới → Sở XD
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Host legacy (Long An, Bình Dương, BR-VT…) đang DOWN — dùng Sở mới + feed
          MOC.
        </p>
        <div className="mt-3 overflow-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-2 py-1.5 font-medium">Đơn vị mới</th>
                <th className="px-2 py-1.5 font-medium">Gồm (cũ)</th>
                <th className="px-2 py-1.5 font-medium">Host</th>
                <th className="px-2 py-1.5 font-medium">List org</th>
                <th className="px-2 py-1.5 font-medium">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {units.map((u) => (
                <tr key={u.slug} className="border-t border-slate-100">
                  <td className="px-2 py-2 font-medium text-slate-900">
                    <a
                      href={u.sxdBaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-700 hover:underline"
                    >
                      {u.label}
                    </a>
                  </td>
                  <td className="px-2 py-2 text-slate-600">{u.legacyParts}</td>
                  <td className="px-2 py-2">
                    <Badge
                      className={
                        u.hostStatus === "VERIFIED"
                          ? CONFIDENCE_CLASS.HIGH
                          : u.hostStatus === "DOWN"
                            ? STATUS_CLASS.STALE
                            : CONFIDENCE_CLASS.MED
                      }
                    >
                      {u.hostStatus}
                    </Badge>
                  </td>
                  <td className="px-2 py-2 text-slate-700">{u.orgListOnSxd}</td>
                  <td className="px-2 py-2 text-xs text-slate-500">
                    {u.orgListNote}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
