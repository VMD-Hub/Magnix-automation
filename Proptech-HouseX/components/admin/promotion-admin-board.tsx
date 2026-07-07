"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PromotionTermsEditor } from "@/components/admin/promotion-terms-editor";

type PrizeRow = {
  id: string;
  tier: string;
  prizeType: string;
  label: string;
  shortLabel: string;
  weightPercent: number;
  totalQty: number;
  remainingQty: number;
  activeFrom: string | null;
  activeUntil: string | null;
};

type WinRow = {
  id: string;
  displayName: string;
  redemptionCode: string;
  fulfillmentStatus: string;
  createdAt: string;
  prize: { label: string; tier: string };
};

type CampaignDetail = {
  id: string;
  slug: string;
  name: string;
  status: string;
  startAt: string;
  endAt: string;
  maxSpinsPerAccount: number;
  maxSpinsPerDay: number;
  termsMarkdown: string | null;
  prizes: PrizeRow[];
  wins: WinRow[];
};

export function PromotionAdminBoard({ campaignId }: { campaignId: string }) {
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [prizeEdits, setPrizeEdits] = useState<Record<string, Partial<PrizeRow>>>({});

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/promotions/${campaignId}`);
    const json = await res.json();
    if (res.ok) setCampaign(json.data.campaign);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, [campaignId]);

  async function savePrizes() {
    if (!campaign) return;
    setSaving(true);
    setMsg(null);
    const prizes = campaign.prizes.map((p) => ({
      id: p.id,
      tier: p.tier,
      prizeType: p.prizeType,
      label: prizeEdits[p.id]?.label ?? p.label,
      shortLabel: prizeEdits[p.id]?.shortLabel ?? p.shortLabel,
      weightPercent: prizeEdits[p.id]?.weightPercent ?? p.weightPercent,
      totalQty: prizeEdits[p.id]?.totalQty ?? p.totalQty,
      remainingQty: prizeEdits[p.id]?.remainingQty ?? p.remainingQty,
      activeFrom: prizeEdits[p.id]?.activeFrom ?? p.activeFrom,
      activeUntil: prizeEdits[p.id]?.activeUntil ?? p.activeUntil,
      sortOrder: 0,
    }));

    const res = await fetch(`/api/admin/promotions/${campaignId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: campaign.name,
        slug: campaign.slug,
        status: campaign.status,
        startAt: campaign.startAt,
        endAt: campaign.endAt,
        maxSpinsPerAccount: campaign.maxSpinsPerAccount,
        maxSpinsPerDay: campaign.maxSpinsPerDay,
        prizes,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setMsg("Đã lưu cấu hình quà.");
      setPrizeEdits({});
      await load();
    } else {
      const j = await res.json();
      setMsg(j.error?.message ?? "Lỗi lưu.");
    }
  }

  async function updateWinStatus(winId: string, status: string) {
    const res = await fetch(`/api/admin/promotions/${campaignId}/fulfillment?winId=${winId}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ fulfillmentStatus: status }),
      },
    );
    if (res.ok) await load();
  }

  if (loading) return <p className="text-slate-500">Đang tải…</p>;
  if (!campaign) return <p className="text-red-600">Không tìm thấy campaign.</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">/{campaign.slug}</p>
          <p className="text-lg font-bold text-slate-900">{campaign.name}</p>
          <p className="text-sm text-slate-600">
            Trạng thái: <strong>{campaign.status}</strong> ·{" "}
            {new Date(campaign.startAt).toLocaleDateString("vi-VN")} —{" "}
            {new Date(campaign.endAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
        <Link
          href="/khuyen-mai"
          className="text-sm font-medium text-brand-700 hover:underline"
          target="_blank"
        >
          Xem trang công khai →
        </Link>
      </div>

      <PromotionTermsEditor
        campaignId={campaignId}
        initialMarkdown={campaign.termsMarkdown ?? ""}
        onSaved={(md) => setCampaign((c) => (c ? { ...c, termsMarkdown: md } : c))}
      />

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">Cấu hình quà & tỷ lệ</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Giải</th>
                <th className="px-3 py-2">Weight %</th>
                <th className="px-3 py-2">Tổng SL</th>
                <th className="px-3 py-2">Còn lại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaign.prizes.map((p) => (
                <tr key={p.id}>
                  <td className="px-3 py-2 font-medium">{p.label}</td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className="w-20 rounded border px-2 py-1"
                      defaultValue={p.weightPercent}
                      onChange={(e) =>
                        setPrizeEdits((prev) => ({
                          ...prev,
                          [p.id]: {
                            ...prev[p.id],
                            weightPercent: Number(e.target.value),
                          },
                        }))
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className="w-20 rounded border px-2 py-1"
                      defaultValue={p.totalQty}
                      onChange={(e) =>
                        setPrizeEdits((prev) => ({
                          ...prev,
                          [p.id]: {
                            ...prev[p.id],
                            totalQty: Number(e.target.value),
                          },
                        }))
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className="w-20 rounded border px-2 py-1"
                      defaultValue={p.remainingQty}
                      onChange={(e) =>
                        setPrizeEdits((prev) => ({
                          ...prev,
                          [p.id]: {
                            ...prev[p.id],
                            remainingQty: Number(e.target.value),
                          },
                        }))
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button type="button" className="mt-3" disabled={saving} onClick={() => void savePrizes()}>
          {saving ? "Đang lưu…" : "Lưu cấu hình quà"}
        </Button>
        {msg ? <p className="mt-2 text-sm text-brand-700">{msg}</p> : null}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">Danh sách trúng thưởng</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Khách</th>
                <th className="px-3 py-2">Quà</th>
                <th className="px-3 py-2">Mã</th>
                <th className="px-3 py-2">Trạng thái</th>
                <th className="px-3 py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaign.wins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-slate-500">
                    Chưa có người trúng.
                  </td>
                </tr>
              ) : (
                campaign.wins.map((w) => (
                  <tr key={w.id}>
                    <td className="px-3 py-2">{w.displayName}</td>
                    <td className="px-3 py-2">{w.prize.label}</td>
                    <td className="px-3 py-2 font-mono text-xs">{w.redemptionCode}</td>
                    <td className="px-3 py-2">{w.fulfillmentStatus}</td>
                    <td className="px-3 py-2">
                      <select
                        className="rounded border px-2 py-1 text-xs"
                        defaultValue={w.fulfillmentStatus}
                        onChange={(e) => void updateWinStatus(w.id, e.target.value)}
                      >
                        <option value="PENDING_CONTRACT">Chờ HĐMB</option>
                        <option value="CONTRACT_SIGNED">Đã ký HĐMB</option>
                        <option value="DELIVERED">Đã trao quà</option>
                        <option value="VOID">Huỷ</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
