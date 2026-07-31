"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DEAL_TIER_LABEL } from "@/lib/ctv/deal-tiers";

export type AffiliateCareRow = {
  id: string;
  activityType: string;
  note: string;
  status: string;
  occurredAt: string;
  imageUrls?: string[];
};

export type AffiliateOpsSnapshot = {
  dealTier: string | null;
  exclusiveStatus: string | null;
  lockExpiresAt: string | null;
  extendRequestedAt: string | null;
  hdmbBaseAmount: number | null;
  siteVisitBonusVerified: boolean;
  brokerId: string | null;
  partnerContractStatus: string | null;
  partnerContractSignedAt: string | null;
  partnerContractVersion: string | null;
  careActivities: AffiliateCareRow[];
};

type Props = {
  caseId: string;
  snapshot: AffiliateOpsSnapshot;
  onChanged: () => void;
  onMsg: (msg: string) => void;
};

const vnd = (n: number) =>
  n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

/** Phase 4 — HĐMB / CS reject / +15 / thăm DA / dealTier · e-contract. */
export function NoxhAffiliateOpsPanel({
  caseId,
  snapshot,
  onChanged,
  onMsg,
}: Props) {
  const [hdmbInput, setHdmbInput] = useState(
    snapshot.hdmbBaseAmount != null ? String(snapshot.hdmbBaseAmount) : "",
  );
  const [busy, setBusy] = useState(false);

  async function postJson(path: string, body?: unknown) {
    setBusy(true);
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: body
          ? { "content-type": "application/json" }
          : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        onMsg(json?.error?.message ?? "Lỗi.");
        return null;
      }
      return json.data;
    } finally {
      setBusy(false);
    }
  }

  async function saveHdmb() {
    const amount = Number(hdmbInput.replace(/[,\s]/g, ""));
    if (!(amount > 0)) {
      onMsg("Nhập giá HĐMB hợp lệ (> 0).");
      return;
    }
    const data = await postJson(`/api/admin/noxh-cases/${caseId}/hdmb`, {
      hdmbBaseAmount: amount,
    });
    if (!data) return;
    const preview = data.preview as
      | { totalAmount: number; rate: number; siteVisitBonus: number }
      | undefined;
    onMsg(
      preview
        ? `Đã lưu HĐMB. HH dự kiến ${vnd(preview.totalAmount)} (${(preview.rate * 100).toFixed(1)}%${preview.siteVisitBonus ? " + thưởng thăm DA" : ""}).`
        : "Đã lưu giá HĐMB.",
    );
    onChanged();
  }

  async function verifyVisit() {
    const data = await postJson(
      `/api/admin/noxh-cases/${caseId}/site-visit/verify`,
    );
    if (!data) return;
    onMsg(
      data.alreadyVerified
        ? "Thăm DA đã xác minh trước đó."
        : "Đã xác minh thăm DA (+500k khi tính HH).",
    );
    onChanged();
  }

  async function extend(action: "approve" | "deny") {
    let reason: string | undefined;
    if (action === "deny") {
      reason = window.prompt("Lý do từ chối +15:") ?? undefined;
      if (!reason?.trim()) return;
    }
    const data = await postJson(
      `/api/admin/noxh-cases/${caseId}/exclusive/extend`,
      { action, reason },
    );
    if (!data) return;
    onMsg(
      action === "approve"
        ? `Đã duyệt +15 — hết hạn ${data.lockExpiresAt ? new Date(data.lockExpiresAt).toLocaleDateString("vi-VN") : ""}.`
        : "Đã từ chối yêu cầu +15.",
    );
    onChanged();
  }

  async function rejectCare(activityId: string) {
    const reason = window.prompt("Lý do từ chối CS giả:") ?? undefined;
    if (!reason?.trim()) return;
    const data = await postJson(
      `/api/admin/noxh-cases/${caseId}/care/${activityId}/reject`,
      { reason: reason.trim() },
    );
    if (!data) return;
    onMsg("Đã từ chối CS — đồng hồ im 30 ngày sẽ tính lại.");
    onChanged();
  }

  return (
    <div className="mt-6 space-y-4 rounded-lg border border-amber-200 bg-amber-50/40 p-3 text-sm">
      <h4 className="font-bold text-slate-900">Affiliate Ops (Phase 4)</h4>

      <div className="grid gap-1 text-xs text-slate-700 sm:grid-cols-2">
        <p>
          dealTier:{" "}
          <strong>
            {snapshot.dealTier
              ? (DEAL_TIER_LABEL[snapshot.dealTier] ?? snapshot.dealTier)
              : "—"}
          </strong>
        </p>
        <p>
          Độc quyền:{" "}
          <strong>{snapshot.exclusiveStatus ?? "—"}</strong>
          {snapshot.lockExpiresAt
            ? ` · hết ${new Date(snapshot.lockExpiresAt).toLocaleDateString("vi-VN")}`
            : ""}
        </p>
        <p>
          E-contract CTV:{" "}
          <strong>{snapshot.partnerContractStatus ?? "NONE"}</strong>
          {snapshot.partnerContractVersion
            ? ` · v${snapshot.partnerContractVersion}`
            : ""}
          {snapshot.brokerId &&
          snapshot.partnerContractStatus === "SIGNED" ? (
            <>
              {" · "}
              <a
                href={`/api/admin/brokers/${snapshot.brokerId}/partner-contract`}
                target="_blank"
                rel="noreferrer"
                className="text-brand-700 underline"
              >
                Xem snapshot
              </a>
            </>
          ) : null}
        </p>
        <p>
          Thăm DA:{" "}
          <strong>
            {snapshot.siteVisitBonusVerified ? "Đã xác minh" : "Chưa"}
          </strong>
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700">
          Giá HĐMB (chưa VAT, chưa 2% bảo trì)
          <input
            type="number"
            min={1}
            step={1000}
            value={hdmbInput}
            onChange={(e) => setHdmbInput(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            placeholder="vd. 980000000"
          />
        </label>
        <Button
          type="button"
          size="sm"
          className="mt-2"
          disabled={busy}
          onClick={() => void saveHdmb()}
        >
          Lưu HĐMB → tính HH
        </Button>
        {snapshot.hdmbBaseAmount != null ? (
          <p className="mt-1 text-xs text-slate-500">
            Đã lưu: {vnd(snapshot.hdmbBaseAmount)}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={busy || snapshot.siteVisitBonusVerified}
          onClick={() => void verifyVisit()}
        >
          Xác minh thăm DA (+500k)
        </Button>
        {(snapshot.exclusiveStatus === "EXTEND_REQUESTED" ||
          snapshot.extendRequestedAt) && (
          <>
            <Button
              type="button"
              size="sm"
              disabled={busy}
              onClick={() => void extend("approve")}
            >
              Duyệt +15
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={busy}
              onClick={() => void extend("deny")}
            >
              Từ chối +15
            </Button>
          </>
        )}
        {snapshot.exclusiveStatus === "EXCLUSIVE" ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => void extend("approve")}
            title="Admin có thể duyệt +15 khi gần hết hạn"
          >
            Duyệt +15 (override)
          </Button>
        ) : null}
      </div>

      <div>
        <h5 className="text-xs font-bold uppercase tracking-wide text-slate-500">
          CS hợp lệ
        </h5>
        {snapshot.careActivities.length === 0 ? (
          <p className="mt-1 text-xs text-slate-500">Chưa có CS.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {snapshot.careActivities.slice(0, 8).map((a) => (
              <li
                key={a.id}
                className="rounded border border-slate-200 bg-white px-2 py-2"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-800">
                      {a.activityType} · {a.status}
                    </p>
                    <p className="text-xs text-slate-600">{a.note}</p>
                    <p className="text-[11px] text-slate-400">
                      {new Date(a.occurredAt).toLocaleString("vi-VN")}
                      {a.imageUrls?.length
                        ? ` · ${a.imageUrls.length} ảnh`
                        : ""}
                    </p>
                  </div>
                  {a.status === "ACCEPTED" ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={busy}
                      onClick={() => void rejectCare(a.id)}
                    >
                      Reject CS
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
