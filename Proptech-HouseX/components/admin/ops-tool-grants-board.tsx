"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";

type GrantRow = {
  id: string;
  status: string;
  note: string | null;
  grantedAt: string;
  revokedAt: string | null;
  user: {
    id: string;
    name: string;
    phoneMasked: string;
    zaloUserId: string | null;
    role: string;
  };
};

export function OpsToolGrantsBoard() {
  const [items, setItems] = useState<GrantRow[]>([]);
  const [status, setStatus] = useState<"ACTIVE" | "REVOKED" | "ALL">("ACTIVE");
  const [phone, setPhone] = useState("");
  const [zaloUserId, setZaloUserId] = useState("");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/ops-tool-grants?status=${status}`);
    if (res.status === 403) {
      window.location.href = "/admin/login";
      return;
    }
    const json = await res.json();
    setItems(json.data?.items ?? []);
    setLoading(false);
  }, [status]);

  useEffect(() => {
    void load();
  }, [load]);

  async function grant(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/admin/ops-tool-grants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phone || undefined,
        zaloUserId: zaloUserId || undefined,
        note: note || null,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error?.message ?? "Cấp quyền thất bại.");
      return;
    }
    setMsg(`Đã cấp: ${json.data.grant.user.name}`);
    setPhone("");
    setZaloUserId("");
    setNote("");
    void load();
  }

  async function revoke(id: string) {
    setMsg(null);
    const res = await fetch(`/api/admin/ops-tool-grants/${id}/revoke`, {
      method: "POST",
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error?.message ?? "Thu hồi thất bại.");
      return;
    }
    setMsg("Đã thu hồi quyền.");
    void load();
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => void grant(e)}
        className="grid gap-2 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2"
      >
        <p className="sm:col-span-2 text-sm text-slate-600">
          Người dùng phải có UserAccount (mở Mini App Zalo hoặc đăng ký SĐT) trước
          khi cấp quyền CRM Telesales.
        </p>
        <input
          className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
          placeholder="SĐT"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
          placeholder="Zalo user id"
          value={zaloUserId}
          onChange={(e) => setZaloUserId(e.target.value)}
        />
        <input
          className="rounded-md border border-slate-200 px-2 py-1.5 text-sm sm:col-span-2"
          placeholder="Ghi chú (tuỳ chọn)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button type="submit" size="sm" className="sm:w-fit">
          Cấp quyền TELESALES_CRM
        </Button>
        {msg ? (
          <p className="text-xs text-brand-800 sm:col-span-2">{msg}</p>
        ) : null}
      </form>

      <div className="flex flex-wrap gap-1">
        {(["ACTIVE", "REVOKED", "ALL"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              status === s
                ? "bg-brand-800 text-white"
                : "bg-slate-100 text-slate-700",
            )}
          >
            {s === "ACTIVE" ? "Đang hiệu lực" : s === "REVOKED" ? "Đã thu hồi" : "Tất cả"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Đang tải…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500">Chưa có grant.</p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {items.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {row.user.name}{" "}
                  <span className="text-sm font-normal text-slate-500">
                    {row.user.phoneMasked}
                  </span>
                </p>
                <p className="text-xs text-slate-500">
                  {row.status} · {row.user.role}
                  {row.user.zaloUserId
                    ? ` · zalo:${row.user.zaloUserId}`
                    : " · chưa gắn Zalo"}
                  {" · "}
                  {new Date(row.grantedAt).toLocaleString("vi-VN")}
                </p>
              </div>
              {row.status === "ACTIVE" ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void revoke(row.id)}
                >
                  Thu hồi
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
