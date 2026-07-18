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
    emailMasked: string | null;
    emailVerified: boolean;
    needsInviteEmail: boolean;
  };
};

export function OpsToolGrantsBoard() {
  const [items, setItems] = useState<GrantRow[]>([]);
  const [status, setStatus] = useState<"ACTIVE" | "REVOKED" | "ALL">("ACTIVE");
  const [phone, setPhone] = useState("");
  const [zaloUserId, setZaloUserId] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
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
        inviteEmail,
        note: note || null,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error?.message ?? "Cấp quyền thất bại.");
      return;
    }
    const invite = json.data?.invite;
    setMsg(
      `Đã cấp ${json.data.grant.user.name}. Đã gửi thông báo tới ${invite?.emailMasked ?? inviteEmail}. User đặt MK trong Tài khoản (OTP).`,
    );
    setPhone("");
    setZaloUserId("");
    setInviteEmail("");
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

  async function resend(id: string, fallbackEmail?: string | null) {
    setMsg(null);
    const email =
      fallbackEmail ||
      window.prompt("Email công việc để gửi lại lời mời (bỏ trống nếu đã có):") ||
      undefined;
    const res = await fetch(`/api/admin/ops-tool-grants/${id}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(email ? { inviteEmail: email } : {}),
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error?.message ?? "Gửi lại thất bại.");
      return;
    }
    setMsg(
      `Đã gửi lại lời mời tới ${json.data?.invite?.emailMasked ?? "email đã gắn"}.`,
    );
    void load();
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => void grant(e)}
        className="grid gap-2 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2"
      >
        <p className="sm:col-span-2 text-sm text-slate-600">
          Người dùng phải có UserAccount (Mini App Zalo / đăng ký SĐT) trước.
          Super nhập <strong>email công việc</strong> để gửi thông báo đã được
          cấp tool. Mật khẩu đặt trong <strong>Tài khoản</strong> (OTP email) —
          không phải mật khẩu riêng của tool.
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
          type="email"
          required
          placeholder="Email công việc * (nhận lời mời đặt mật khẩu)"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
        />
        <input
          className="rounded-md border border-slate-200 px-2 py-1.5 text-sm sm:col-span-2"
          placeholder="Ghi chú (tuỳ chọn)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button type="submit" size="sm" className="sm:w-fit">
          Cấp quyền + gửi email thông báo
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
            {s === "ACTIVE"
              ? "Đang hiệu lực"
              : s === "REVOKED"
                ? "Đã thu hồi"
                : "Tất cả"}
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
                  {row.user.emailMasked
                    ? ` · ${row.user.emailMasked}${row.user.emailVerified ? " ✓" : " (chưa xác nhận MK)"}`
                    : " · chưa gắn email thật"}
                  {row.user.zaloUserId
                    ? ` · zalo:${row.user.zaloUserId}`
                    : ""}
                  {" · "}
                  {new Date(row.grantedAt).toLocaleString("vi-VN")}
                </p>
              </div>
              {row.status === "ACTIVE" ? (
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => void resend(row.id)}
                  >
                    Gửi lại thông báo
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => void revoke(row.id)}
                  >
                    Thu hồi
                  </Button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
