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

const STAGE_LABEL: Record<(typeof STAGES)[number], string> = {
  OPEN: "Mở",
  DISCOVERY: "Tìm hiểu",
  ACTIVE: "Đang tư vấn",
  COMMITTED: "Đã cam kết (cọc/giữ chỗ)",
  WON: "Thắng",
  LOST: "Thua / mất deal",
  CANCELLED: "Huỷ",
};

function idemKey(prefix: string) {
  return `${prefix}:${crypto.randomUUID()}`;
}

async function adminJson<T>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; data?: T; error?: string; code?: string }> {
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
  const code = body.error?.code;
  // Only bounce on real auth denial — FEATURE_DISABLED is not a session failure.
  if (res.status === 403 && code !== "FEATURE_DISABLED") {
    window.location.href = "/admin/login";
    return { ok: false, status: 403, error: "FORBIDDEN", code };
  }
  return {
    ok: res.ok,
    status: res.status,
    data: body.data,
    error: body.error?.message ?? body.error?.code,
    code,
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
    if (!listRes.ok) {
      setMsg(
        listRes.code === "FEATURE_DISABLED"
          ? "Flag HOUSEX_CONVERSION_G2_JOURNEY_P chưa bật trên app (set true trong .env rồi pm2 restart --update-env)."
          : (listRes.error ?? "Không tải được opportunity"),
      );
    } else {
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
      <details
        open
        className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
      >
        <summary className="cursor-pointer font-semibold text-slate-900">
          Hướng dẫn nhanh — dùng bảng này thế nào?
        </summary>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-slate-600">
          <li>
            Nhìn hàng đếm phía trên (funnel): tổng cơ hội theo từng bước và kết
            quả WON/LOST.
          </li>
          <li>
            Chọn bộ lọc <strong>Tất cả</strong> để xem danh sách; các tab stage
            khác chỉ hiện cơ hội đang ở đúng bước đó (trống ≠ lỗi hệ thống).
          </li>
          <li>
            <strong>Bấm một dòng</strong> trong bảng → panel bên phải mở chi
            tiết (proposal, cọc, WON/LOST, nurture).
          </li>
          <li>
            Thứ tự thao tác chuẩn: tạo <em>proposal</em> (chụp giá/căn) → nhập
            mã booking/cọc → <em>COMMITTED</em> → ghi <em>WON</em> hoặc{" "}
            <em>LOST</em>.
          </li>
          <li>
            Nurture: chỉ Enroll khi đã có đồng ý marketing; Stop để dừng gửi.
          </li>
        </ol>
        <p className="mt-3 text-xs text-slate-500">
          ID hiển thị dạng rút gọn (không PII). Bản ghi smoke test (vd. stage
          LOST) dùng để đối chiếu bằng chứng — an toàn khi xem.
        </p>
      </details>

      {msg ? (
        <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          {msg}
        </p>
      ) : null}

      {funnel ? (
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Tóm tắt funnel Journey P
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {Object.entries(funnel.stages).map(([stage, count]) => (
              <span
                key={stage}
                className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700"
                title={STAGE_LABEL[stage as (typeof STAGES)[number]] ?? stage}
              >
                {STAGE_LABEL[stage as (typeof STAGES)[number]] ?? stage}: {count}
              </span>
            ))}
            {Object.entries(funnel.outcomes).map(([result, count]) => (
              <span
                key={result}
                className="rounded-full bg-violet-100 px-2.5 py-1 font-medium text-violet-800"
              >
                Kết quả {result}: {count}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Lọc theo bước
        </p>
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
              title={STAGE_LABEL[stage]}
              onClick={() => setStageFilter(stage)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                stageFilter === stage ? "bg-slate-900 text-white" : "bg-slate-100",
              )}
            >
              {STAGE_LABEL[stage]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <div>
          <p className="mb-1.5 text-xs text-slate-500">
            Danh sách cơ hội — bấm một dòng để xem / thao tác bên phải
          </p>
          <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Cơ hội</th>
                <th className="px-3 py-2">Bước</th>
                <th className="px-3 py-2">Lead</th>
                <th className="px-3 py-2">Căn</th>
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
                    {msg?.includes("HOUSEX_CONVERSION_G2")
                      ? msg
                      : stageFilter
                        ? `Không có cơ hội ở bước “${STAGE_LABEL[stageFilter as (typeof STAGES)[number]] ?? stageFilter}”. Thử “Tất cả”.`
                        : "Chưa có cơ hội Journey P."}
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
                    <td className="px-3 py-2">
                      {STAGE_LABEL[row.stage as (typeof STAGES)[number]] ??
                        row.stage}
                    </td>
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
        </div>

        <div className="space-y-3 rounded-lg border border-slate-200 p-3">
          {!selectedId || !selected ? (
            <div className="space-y-2 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Chi tiết cơ hội</p>
              <p>
                Chưa chọn dòng nào. Hãy bấm một cơ hội bên trái (vd. bản smoke
                đang ở bước Thua / mất deal).
              </p>
            </div>
          ) : (
            <>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Chi tiết cơ hội
                </p>
                <p className="mt-1 font-mono text-xs">{selected.id}</p>
                <p className="text-sm">
                  {STAGE_LABEL[selected.stage as (typeof STAGES)[number]] ??
                    selected.stage}{" "}
                  · Journey {selected.journey} (sơ cấp / NOXH)
                </p>
              </div>

              <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Bước trên panel này</p>
                <ol className="mt-1 list-decimal space-y-0.5 pl-4">
                  <li>Nhập / giữ mã căn → Tạo proposal (chụp giá tại thời điểm)</li>
                  <li>Dán mã booking/cọc → COMMITTED</li>
                  <li>Ghi kết quả WON hoặc LOST</li>
                  <li>(Tuỳ chọn) Enroll / Stop nurture</li>
                </ol>
              </div>

              <label className="block text-xs font-medium text-slate-600">
                Mã căn (unit) — dùng khi tạo proposal
                <input
                  className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
                  value={unitRef}
                  onChange={(e) => setUnitRef(e.target.value)}
                />
              </label>
              <Button type="button" size="sm" onClick={() => void createProposal()}>
                Tạo proposal (chụp giá/căn)
              </Button>

              <div className="space-y-1 text-xs">
                <p className="font-semibold text-slate-600">Proposal đã tạo</p>
                {proposals.length === 0 ? (
                  <p className="text-slate-500">Chưa có — tạo ở bước trên</p>
                ) : (
                  proposals.map((p) => (
                    <p key={p.id} className="font-mono">
                      {p.id.slice(0, 8)}… {p.unitCode} {p.price} {p.currency}
                    </p>
                  ))
                )}
              </div>

              <label className="block text-xs font-medium text-slate-600">
                Mã booking / cọc — bắt buộc khi COMMITTED / WON / LOST
                <input
                  className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value)}
                  placeholder="UUID unit booking"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void commitWithBooking()}
                >
                  Đánh dấu đã cam kết
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => void recordOutcome("WON")}
                >
                  Thắng (WON)
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void recordOutcome("LOST")}
                >
                  Thua (LOST)
                </Button>
              </div>

              {outcome ? (
                <p className="text-xs text-slate-600">
                  Kết quả đã ghi: {outcome.result} · lý do {outcome.reasonCode}{" "}
                  · {outcome.hasValue ? "có giá trị" : "không gắn giá"}
                </p>
              ) : null}

              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Nurture (chăm sóc sau / marketing)
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Chỉ enroll khi lead còn đồng ý nhận tin marketing trên kênh đã
                  chọn. Stop = dừng nurture.
                </p>
                <label className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                  Kênh
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
                    Được gửi? {nurture.eligible ? "Có" : "Không"} · consent=
                    {nurture.action ?? "chưa có"}
                    {nurture.suppressionReason
                      ? ` · chặn: ${nurture.suppressionReason}`
                      : ""}
                    {nurture.nextTouch ? ` · bước tiếp: ${nurture.nextTouch}` : ""}
                    {nurture.enrollment
                      ? ` · enrollment: ${nurture.enrollment.status}`
                      : ""}
                    {nurture.lastDispatch
                      ? ` · lần gửi gần: ${nurture.lastDispatch.status}`
                      : ""}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">
                    Chưa đọc được eligibility (thiếu consent hoặc lỗi mạng).
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
                    Đăng ký nurture
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => void stopNurture()}
                  >
                    Dừng nurture
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
