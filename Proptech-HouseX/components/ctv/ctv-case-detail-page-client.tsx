"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CtvCaseDetailPanel,
  type CtvCaseDetailView,
} from "@/components/ctv/ctv-case-detail-panel";

/** Chi tiết hồ sơ + CS upload — desktop-friendly deep link. */
export function CtvCaseDetailPageClient({ caseId }: { caseId: string }) {
  const [detail, setDetail] = useState<CtvCaseDetailView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ctv/cases/${caseId}`);
      if (res.status === 401 || res.status === 403) {
        window.location.href = "/dang-ky/moi-gioi";
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không tìm thấy hồ sơ.");
        setDetail(null);
        return;
      }
      setDetail(json.data);
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function nudge() {
    setActionMsg(null);
    const res = await fetch(`/api/ctv/cases/${caseId}/nudge`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    const json = await res.json();
    setActionMsg(
      res.ok
        ? (json.data?.message ?? "Đã gửi nhắc.")
        : (json?.error?.message ?? "Lỗi."),
    );
    void load();
  }

  async function assistNote() {
    const message = window.prompt("Ghi nhận bạn đã hỗ trợ khách (ngoài đời):");
    if (!message?.trim()) return;
    await fetch(`/api/ctv/cases/${caseId}/assist`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ assistType: "NOTE", message }),
    });
    void load();
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Đang tải…</p>;
  }
  if (error || !detail) {
    return (
      <div>
        <p className="text-sm text-rose-600">{error ?? "Không tìm thấy"}</p>
        <Link
          href="/moi-gioi/ho-so"
          className="mt-3 inline-block text-sm text-brand-700 underline"
        >
          Về danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <CtvCaseDetailPanel
        detail={detail}
        actionMsg={actionMsg}
        onNudge={() => void nudge()}
        onAssistNote={() => void assistNote()}
        onCareSaved={() => void load()}
      />
    </div>
  );
}
