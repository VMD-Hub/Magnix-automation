"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";

type Kpi = {
  windowDays: number;
  enrollments: { enrolled: number; cancelled: number; createdInWindow: number };
  dispatches: { sent: number; failed: number; skipped: number };
  engagement: {
    opens: number;
    clicks: number;
    bounces: number;
    complaints: number;
  };
  consent: { withdrawn: number };
  rates: {
    openRatePct: number | null;
    ctrPct: number | null;
    unsubPerSendPct: number | null;
    note: string;
  };
};

type ScriptOption = {
  id: string;
  label: string;
  description: string;
  segment: string | null;
};

type EnrollmentRow = {
  enrollmentId: string;
  leadId: string;
  status: string;
  scriptId: string | null;
  scriptLabel: string | null;
  segment: string | null;
  leadStatus: string;
  source: string;
  customerName: string | null;
  emailMasked: string | null;
  updatedAt: string;
  lastDispatch: {
    id: string;
    status: string;
    occurredAt: string;
    providerMessageId: string | null;
  } | null;
};

type LeadDetail = {
  leadId: string;
  segment: string | null;
  source: string;
  leadStatus: string;
  customerName: string | null;
  emailMasked: string | null;
  hasEmail: boolean;
  eligibility: {
    eligible: boolean;
    action: string | null;
    suppressionReason: string | null;
    nextTouch: string | null;
    enrollment: {
      id: string;
      status: string;
      scriptId: string | null;
    } | null;
    lastDispatch: { status: string; occurredAt: string } | null;
  };
  enrollments: Array<{
    id: string;
    status: string;
    scriptId: string | null;
    scriptLabel: string | null;
    updatedAt: string;
    dispatches: Array<{
      id: string;
      status: string;
      occurredAt: string;
      providerMessageId: string | null;
    }>;
  }>;
  scripts: ScriptOption[];
};

function idemKey(prefix: string) {
  return `${prefix}:${crypto.randomUUID()}`;
}

async function adminJson<T>(
  path: string,
  init?: RequestInit,
): Promise<{
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
  code?: string;
}> {
  const res = await fetch(path, {
    ...init,
    headers: {
      accept: "application/json",
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const body = (await res.json().catch(() => ({}))) as {
    data?: T;
    error?: { code?: string; message?: string };
  };
  if (res.status === 403) {
    window.location.href = "/admin/login";
    return { ok: false, status: 403, error: "FORBIDDEN", code: body.error?.code };
  }
  return {
    ok: res.ok,
    status: res.status,
    data: body.data,
    error: body.error?.message ?? body.error?.code,
    code: body.error?.code,
  };
}

export function EmailMarketingBoard() {
  const [items, setItems] = useState<EnrollmentRow[]>([]);
  const [kpi, setKpi] = useState<Kpi | null>(null);
  const [flags, setFlags] = useState<{
    sendEnabled: boolean;
    espAdapter: string;
  } | null>(null);
  const [scripts, setScripts] = useState<ScriptOption[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<LeadDetail | null>(null);
  const [scriptId, setScriptId] = useState("noxh-tool-email-welcome");
  const [lookupLeadId, setLookupLeadId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminJson<{
      flags: { sendEnabled: boolean; espAdapter: string };
      kpi: Kpi;
      scripts: ScriptOption[];
      items: EnrollmentRow[];
    }>("/api/admin/email-marketing");
    if (!res.ok) {
      setMsg(res.error ?? "Không tải được Email marketing");
      setLoading(false);
      return;
    }
    setFlags(res.data?.flags ?? null);
    setKpi(res.data?.kpi ?? null);
    setScripts(res.data?.scripts ?? []);
    setItems(res.data?.items ?? []);
    setMsg(null);
    setLoading(false);
  }, []);

  const loadDetail = useCallback(async (leadId: string) => {
    const res = await adminJson<LeadDetail>(
      `/api/admin/email-marketing/leads?leadId=${encodeURIComponent(leadId)}`,
    );
    if (!res.ok) {
      setMsg(res.error ?? "Không tải chi tiết lead");
      setDetail(null);
      return;
    }
    setDetail(res.data ?? null);
    const activeScript = res.data?.eligibility.enrollment?.scriptId;
    if (activeScript) setScriptId(activeScript);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (selectedId) void loadDetail(selectedId);
    else setDetail(null);
  }, [selectedId, loadDetail]);

  async function runAction(
    action: string,
    extra?: { leadId?: string; scriptId?: string; stepIndex?: number },
  ) {
    setBusy(true);
    setMsg(null);
    const leadId = extra?.leadId ?? selectedId ?? undefined;
    const res = await adminJson("/api/admin/email-marketing/actions", {
      method: "POST",
      headers: { "Idempotency-Key": idemKey(`email-${action}`) },
      body: JSON.stringify({
        action,
        leadId,
        scriptId: extra?.scriptId ?? scriptId,
        stepIndex: extra?.stepIndex,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setMsg(res.error ?? "Thao tác thất bại");
      return;
    }
    setMsg(`OK — ${action}`);
    await load();
    if (leadId) await loadDetail(leadId);
  }

  const filtered = statusFilter
    ? items.filter((i) => i.status === statusFilter)
    : items;

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-900/5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-semibold text-slate-900">Trạng thái kênh</h2>
            <p className="text-xs text-slate-500">
              Kill switch + ESP adapter + KPI {kpi?.windowDays ?? 30} ngày
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => void runAction("esp_sync")}
            >
              ESP sync
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={loading || busy}
              onClick={() => void load()}
            >
              Làm mới
            </Button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <FlagChip
            ok={Boolean(flags?.sendEnabled)}
            label={
              flags?.sendEnabled
                ? "SEND bật (EMAIL_NURTURE_SEND_ENABLED)"
                : "SEND tắt — enroll vẫn được"
            }
          />
          <FlagChip
            ok={(flags?.espAdapter ?? "none") !== "none"}
            label={`ESP: ${flags?.espAdapter ?? "…"}`}
          />
        </div>
        {kpi ? (
          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            <Stat label="Enrolled" value={kpi.enrollments.enrolled} />
            <Stat label="Sent" value={kpi.dispatches.sent} />
            <Stat label="Failed" value={kpi.dispatches.failed} />
            <Stat label="Open" value={kpi.engagement.opens} />
            <Stat label="Click" value={kpi.engagement.clicks} />
            <Stat label="Unsub" value={kpi.consent.withdrawn} />
            <Stat label="Bounce" value={kpi.engagement.bounces} />
            <Stat
              label="Open %"
              value={kpi.rates.openRatePct ?? "—"}
            />
            <Stat label="CTR %" value={kpi.rates.ctrPct ?? "—"} />
          </dl>
        ) : null}
        {kpi?.rates.note ? (
          <p className="mt-2 text-[11px] text-slate-400">{kpi.rates.note}</p>
        ) : null}
      </section>

      <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
        <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
            <div>
              <h2 className="font-semibold text-slate-900">Enrollment email</h2>
              <p className="text-xs text-slate-500">
                Chọn dòng → consent / enroll / gửi / dừng
              </p>
            </div>
            <div className="flex flex-wrap gap-1">
              <FilterChip
                active={!statusFilter}
                label={`Tất cả (${items.length})`}
                onClick={() => setStatusFilter("")}
              />
              <FilterChip
                active={statusFilter === "ENROLLED"}
                label={`ENROLLED (${items.filter((i) => i.status === "ENROLLED").length})`}
                onClick={() => setStatusFilter("ENROLLED")}
              />
              <FilterChip
                active={statusFilter === "CANCELLED"}
                label={`CANCELLED (${items.filter((i) => i.status === "CANCELLED").length})`}
                onClick={() => setStatusFilter("CANCELLED")}
              />
            </div>
          </div>

          <div className="flex gap-2 border-b border-slate-100 px-4 py-2">
            <input
              className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
              placeholder="Lookup leadId…"
              value={lookupLeadId}
              onChange={(e) => setLookupLeadId(e.target.value)}
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                const id = lookupLeadId.trim();
                if (!id) return;
                setSelectedId(id);
              }}
            >
              Mở
            </Button>
          </div>

          {loading ? (
            <p className="p-4 text-sm text-slate-500">Đang tải…</p>
          ) : filtered.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">
              Chưa có enrollment email trong bộ lọc này.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <li key={row.enrollmentId}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(row.leadId)}
                    className={cn(
                      "flex w-full flex-col gap-0.5 px-4 py-3 text-left hover:bg-slate-50",
                      selectedId === row.leadId && "bg-amber-50/80",
                    )}
                  >
                    <span className="text-sm font-medium text-slate-900">
                      {row.customerName ?? "—"} · {row.emailMasked ?? "no email"}
                    </span>
                    <span className="text-xs text-slate-500">
                      {row.status} · {row.scriptLabel ?? row.scriptId} ·{" "}
                      {row.segment ?? "—"}
                      {row.lastDispatch
                        ? ` · last ${row.lastDispatch.status}`
                        : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-900/5">
          {!selectedId ? (
            <p className="text-sm text-slate-500">
              Chọn enrollment hoặc nhập leadId để thao tác.
            </p>
          ) : !detail ? (
            <p className="text-sm text-slate-500">Đang tải chi tiết…</p>
          ) : (
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-slate-900">
                  {detail.customerName ?? "Lead"}
                </h3>
                <p className="text-xs text-slate-500">
                  {detail.emailMasked ?? "—"} · {detail.segment ?? "—"} ·{" "}
                  {detail.leadStatus}
                </p>
                <p className="mt-1 break-all font-mono text-[10px] text-slate-400">
                  {detail.leadId}
                </p>
              </div>

              <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                Eligible? {detail.eligibility.eligible ? "Có" : "Không"} ·
                consent={detail.eligibility.action ?? "chưa có"}
                {detail.eligibility.suppressionReason
                  ? ` · chặn: ${detail.eligibility.suppressionReason}`
                  : ""}
                {!detail.hasEmail ? " · thiếu email" : ""}
              </p>

              <label className="block text-xs font-medium text-slate-600">
                Script email
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm"
                  value={scriptId}
                  onChange={(e) => setScriptId(e.target.value)}
                >
                  {(detail.scripts.length ? detail.scripts : scripts).map(
                    (s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => void runAction("grant")}
                >
                  Grant consent
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => void runAction("withdraw")}
                >
                  Withdraw
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => void runAction("enroll")}
                >
                  Enroll
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => void runAction("stop")}
                >
                  Stop
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="brand"
                  disabled={busy || !flags?.sendEnabled}
                  onClick={() =>
                    void runAction("send_welcome", { stepIndex: 1 })
                  }
                >
                  Gửi Welcome E1
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="brand"
                  disabled={busy || !flags?.sendEnabled}
                  onClick={() => void runAction("send_campaign")}
                >
                  Gửi campaign
                </Button>
              </div>

              {!flags?.sendEnabled ? (
                <p className="text-[11px] text-amber-700">
                  Kill switch tắt — enroll/consent vẫn chạy; gửi cần
                  EMAIL_NURTURE_SEND_ENABLED=true.
                </p>
              ) : null}

              {detail.enrollments.length > 0 ? (
                <ul className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                  {detail.enrollments.map((e) => (
                    <li key={e.id}>
                      <span className="font-medium">{e.status}</span> ·{" "}
                      {e.scriptLabel ?? e.scriptId}
                      {e.dispatches[0]
                        ? ` · ${e.dispatches[0].status} @ ${e.dispatches[0].occurredAt.slice(0, 16)}`
                        : ""}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}

          {msg ? (
            <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
              {msg}
            </p>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <dt className="text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="text-lg font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function FlagChip({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 font-medium",
        ok ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-600",
      )}
    >
      {label}
    </span>
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
        "rounded-full px-2.5 py-1 text-xs font-medium",
        active
          ? "bg-slate-900 text-white"
          : "bg-white text-slate-600 ring-1 ring-slate-200",
      )}
    >
      {label}
    </button>
  );
}
