"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";

type OpportunityRow = {
  id: string;
  leadId: string;
  journey: string;
  stage: string;
  projectRef: string | null;
  unitRef: string | null;
  reason: string | null;
  updatedAt: string;
};

type ProposalRow = {
  id: string;
  unitCode: string;
  unitStatus: string;
  price: string;
  currency: string;
  generatedAt: string;
};

type OutcomeRow = {
  id: string;
  result: string;
  reasonCode: string;
  referenceType: string;
  referenceId: string;
  hasValue: boolean;
  occurredAt: string;
};

type FunnelData = {
  journey: string;
  stages: Record<string, number>;
  outcomes: Record<string, number>;
};

type NurtureEligibility = {
  eligible: boolean;
  granted: boolean;
  action: string | null;
  suppressionReason: string | null;
  nextTouch?: string | null;
  enrollment?: {
    id: string;
    status: string;
    scriptId: string | null;
    updatedAt: string;
  } | null;
  lastDispatch?: {
    status: string;
    occurredAt: string;
  } | null;
};

const STAGES = [
  "OPEN",
  "DISCOVERY",
  "ACTIVE",
  "COMMITTED",
  "WON",
  "LOST",
  "CANCELLED",
] as const;

function idemKey(prefix: string) {
  return `${prefix}:${crypto.randomUUID()}`;
}

async function adminJson<T>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  const res = await fetch(path, {
    ...init,
    headers: {
      accept: "application/json",
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (res.status === 403) {
    window.location.href = "/admin/login";
    return { ok: false, status: 403, error: "FORBIDDEN" };
  }
  const body = (await res.json().catch(() => ({}))) as {
    data?: T;
    error?: { code?: string; message?: string };
  };
  return {
    ok: res.ok,
    status: res.status,
    data: body.data,
    error: body.error?.message ?? body.error?.code,
  };
}

export function ConversionOpsBoard() {
  const [journey] = useState("P");
  const [stageFilter, setStageFilter] = useState("");
  const [items, setItems] = useState<OpportunityRow[]>([]);
  const [funnel, setFunnel] = useState<FunnelData | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [proposals, setProposals] = useState<ProposalRow[]>([]);
  const [outcome, setOutcome] = useState<OutcomeRow | null>(null);
  const [selected, setSelected] = useState<OpportunityRow | null>(null);
  const [nurture, setNurture] = useState<NurtureEligibility | null>(null);
  const [nurtureChannel, setNurtureChannel] = useState("zalo");
  const [bookingRef, setBookingRef] = useState("");
  const [unitRef, setUnitRef] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadList = useCallback(async () => {
    setLoading(true);
    const q = new URLSearchParams({ journey });
    if (stageFilter) q.set("stage", stageFilter);
    const [listRes, funnelRes] = await Promise.all([
      adminJson<{ items: OpportunityRow[] }>(
        `/api/admin/conversion/opportunities?${q}`,
      ),
      adminJson<FunnelData>(`/api/admin/conversion/funnel?journey=${journey}`),
    ]);
    if (!listRes.ok) setMsg(listRes.error ?? "Không tải được opportunity");
    else {
      setItems(listRes.data?.items ?? []);
      setMsg(null);
    }
    if (funnelRes.ok) setFunnel(funnelRes.data ?? null);
    setLoading(false);
  }, [journey, stageFilter]);

  const loadDetail = useCallback(
    async (id: string, channel = nurtureChannel) => {
      const res = await adminJson<{
        opportunity: OpportunityRow;
        proposals: ProposalRow[];
        outcome: OutcomeRow | null;
      }>(`/api/admin/conversion/opportunities/${id}`);
      if (!res.ok) {
        setMsg(res.error ?? "Không tải chi tiết");
        return;
      }
      setSelected(res.data?.opportunity ?? null);
      setProposals(res.data?.proposals ?? []);
      setOutcome(res.data?.outcome ?? null);
      setUnitRef(res.data?.opportunity?.unitRef ?? "");

      const leadId = res.data?.opportunity?.leadId;
      if (leadId) {
        const elig = await adminJson<NurtureEligibility>(
          `/api/admin/conversion/nurture/eligibility?leadId=${encodeURIComponent(leadId)}&purpose=marketing&channel=${encodeURIComponent(channel)}`,
        );
        setNurture(elig.ok ? (elig.data ?? null) : null);
      } else setNurture(null);
    },
    [nurtureChannel],
  );

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    if (selectedId) void loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  async function createProposal() {
    if (!selectedId || !unitRef.trim()) {
      setMsg("Cần opportunity + unitRef");
      return;
    }
    const res = await adminJson("/api/admin/conversion/proposals", {
      method: "POST",
      headers: { "Idempotency-Key": idemKey("proposal") },
      body: JSON.stringify({
        opportunityId: selectedId,
        unitRef: unitRef.trim(),
        actorId: "admin-ui",
        correlationId: idemKey("corr"),
      }),
    });
    setMsg(res.ok ? "Đã tạo proposal snapshot" : res.error ?? "Lỗi proposal");
    if (res.ok) void loadDetail(selectedId);
  }

  async function commitWithBooking() {
    if (!selectedId || !bookingRef.trim() || !proposals[0]) {
      setMsg("Cần proposal mới nhất + booking id");
      return;
    }
    const res = await adminJson("/api/admin/conversion/opportunities", {
      method: "POST",
      headers: { "Idempotency-Key": idemKey("commit") },
      body: JSON.stringify({
        action: "transition",
        opportunityId: selectedId,
        toStage: "COMMITTED",
        reason: "OPS_COMMIT",
        actorId: "admin-ui",
        occurredAt: new Date().toISOString(),
        correlationId: idemKey("corr"),
        commitEvidence: {
          referenceType: "UNIT_BOOKING",
          referenceId: bookingRef.trim(),
        },
        proposalId: proposals[0].id,
      }),
    });
    setMsg(res.ok ? "Đã COMMITTED" : res.error ?? "Lỗi commit");
    if (res.ok) {
      void loadList();
      void loadDetail(selectedId);
    }
  }

  async function recordOutcome(result: "WON" | "LOST") {
    if (!selectedId || !bookingRef.trim()) {
      setMsg("Cần booking/deposit reference");
      return;
    }
    const res = await adminJson("/api/admin/conversion/outcomes", {
      method: "POST",
      headers: { "Idempotency-Key": idemKey("outcome") },
      body: JSON.stringify({
        opportunityId: selectedId,
        result,
        reasonCode: result === "WON" ? "DEPOSIT_CONFIRMED" : "OTHER",
        referenceType: "UNIT_BOOKING",
        referenceId: bookingRef.trim(),
        actorId: "admin-ui",
        occurredAt: new Date().toISOString(),
        correlationId: idemKey("corr"),
      }),
    });
    setMsg(res.ok ? `Outcome ${result}` : res.error ?? "Lỗi outcome");
    if (res.ok) {
      void loadList();
      void loadDetail(selectedId);
    }
  }

  async function enrollNurtureAction() {
    if (!selected?.leadId) return;
    const res = await adminJson("/api/admin/conversion/nurture/enrollments", {
      method: "POST",
      headers: { "Idempotency-Key": idemKey("nurture-enroll") },
      body: JSON.stringify({
        action: "enroll",
        leadId: selected.leadId,
        purpose: "marketing",
        channel: nurtureChannel,
        scriptId: "noxh-zalo-ads-checklist",
        opportunityId: selected.id,
        actorId: "admin-ui",
        correlationId: idemKey("corr"),
      }),
    });
    setMsg(res.ok ? "Nurture enrolled" : res.error ?? "Lỗi enroll");
    if (res.ok && selectedId) void loadDetail(selectedId);
  }

  async function stopNurture() {
    if (!selected?.leadId) return;
    const res = await adminJson("/api/admin/conversion/nurture/enrollments", {
      method: "POST",
      headers: { "Idempotency-Key": idemKey("nurture-stop") },
      body: JSON.stringify({
        action: "cancel",
        leadId: selected.leadId,
        purpose: "marketing",
        channel: nurtureChannel,
        actorId: "admin-ui",
        correlationId: idemKey("corr"),
      }),
    });
    setMsg(res.ok ? "Nurture cancelled" : res.error ?? "Lỗi nurture");
    if (res.ok && selectedId) void loadDetail(selectedId);
  }

  return (
    <div className="space-y-4">
      {msg ? (
        <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          {msg}
        </p>
      ) : null}

      {funnel ? (
        <div className="flex flex-wrap gap-2 text-xs">
          {Object.entries(funnel.stages).map(([stage, count]) => (
            <span
              key={stage}
              className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700"
            >
              {stage}: {count}
            </span>
          ))}
          {Object.entries(funnel.outcomes).map(([result, count]) => (
            <span
              key={result}
              className="rounded-full bg-violet-100 px-2.5 py-1 font-medium text-violet-800"
            >
              {result}: {count}
            </span>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStageFilter("")}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            !stageFilter ? "bg-slate-900 text-white" : "bg-slate-100",
          )}
        >
          Tất cả
        </button>
        {STAGES.map((stage) => (
          <button
            key={stage}
            type="button"
            onClick={() => setStageFilter(stage)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              stageFilter === stage ? "bg-slate-900 text-white" : "bg-slate-100",
            )}
          >
            {stage}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Opportunity</th>
                <th className="px-3 py-2">Stage</th>
                <th className="px-3 py-2">Lead</th>
                <th className="px-3 py-2">Unit</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-3 py-4 text-slate-500" colSpan={4}>
                    Đang tải…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-slate-500" colSpan={4}>
                    Không có opportunity (flag G2 phải bật).
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "cursor-pointer border-t border-slate-100 hover:bg-slate-50",
                      selectedId === row.id && "bg-sky-50",
                    )}
                    onClick={() => setSelectedId(row.id)}
                  >
                    <td className="px-3 py-2 font-mono text-xs">
                      {row.id.slice(0, 8)}…
                    </td>
                    <td className="px-3 py-2">{row.stage}</td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {row.leadId.slice(0, 8)}…
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {row.unitRef?.slice(0, 8) ?? "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 rounded-lg border border-slate-200 p-3">
          {!selectedId || !selected ? (
            <p className="text-sm text-slate-500">Chọn một opportunity.</p>
          ) : (
            <>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Chi tiết
                </p>
                <p className="mt-1 font-mono text-xs">{selected.id}</p>
                <p className="text-sm">
                  {selected.stage} · journey {selected.journey}
                </p>
              </div>

              <label className="block text-xs font-medium text-slate-600">
                Unit ref (proposal)
                <input
                  className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
                  value={unitRef}
                  onChange={(e) => setUnitRef(e.target.value)}
                />
              </label>
              <Button type="button" size="sm" onClick={() => void createProposal()}>
                Tạo proposal snapshot
              </Button>

              <div className="space-y-1 text-xs">
                <p className="font-semibold text-slate-600">Proposals</p>
                {proposals.length === 0 ? (
                  <p className="text-slate-500">Chưa có</p>
                ) : (
                  proposals.map((p) => (
                    <p key={p.id} className="font-mono">
                      {p.id.slice(0, 8)}… {p.unitCode} {p.price} {p.currency}
                    </p>
                  ))
                )}
              </div>

              <label className="block text-xs font-medium text-slate-600">
                Booking / deposit id (commit & outcome)
                <input
                  className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value)}
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void commitWithBooking()}
                >
                  COMMITTED
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => void recordOutcome("WON")}
                >
                  WON
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void recordOutcome("LOST")}
                >
                  LOST
                </Button>
              </div>

              {outcome ? (
                <p className="text-xs text-slate-600">
                  Outcome {outcome.result} · {outcome.reasonCode} ·{" "}
                  {outcome.hasValue ? "hasValue" : "no value"}
                </p>
              ) : null}

              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Nurture (SC-6)
                </p>
                <label className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                  Channel
                  <select
                    className="rounded border border-slate-200 bg-white px-2 py-1"
                    value={nurtureChannel}
                    onChange={(e) => {
                      const next = e.target.value;
                      setNurtureChannel(next);
                      if (selectedId) void loadDetail(selectedId, next);
                    }}
                  >
                    <option value="zalo">zalo</option>
                    <option value="oa">oa</option>
                    <option value="telegram">telegram</option>
                  </select>
                </label>
                {nurture ? (
                  <p className="mt-1 text-xs text-slate-600">
                    eligible={String(nurture.eligible)} · consent=
                    {nurture.action ?? "none"}
                    {nurture.suppressionReason
                      ? ` · ${nurture.suppressionReason}`
                      : ""}
                    {nurture.nextTouch ? ` · next=${nurture.nextTouch}` : ""}
                    {nurture.enrollment
                      ? ` · enroll=${nurture.enrollment.status}`
                      : ""}
                    {nurture.lastDispatch
                      ? ` · last=${nurture.lastDispatch.status}`
                      : ""}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">
                    Eligibility API chưa trả (thiếu consent hoặc lỗi mạng).
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => void enrollNurtureAction()}
                    disabled={!nurture?.eligible}
                  >
                    Enroll
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => void stopNurture()}
                  >
                    Stop nurture
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
