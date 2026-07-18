import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/auth-context";
import {
  checkBrokerTelesalesAccess,
  getBrokerContact,
  recordBrokerContact,
} from "@/services/broker-telesales";

const CHIPS = [
  { id: "CONNECTED", label: "Đàm thoại OK" },
  { id: "SEND_INFO", label: "Xin gửi tin" },
  { id: "NO_ANSWER", label: "Không nghe" },
  { id: "NOT_THIS_PROJECT", label: "Không QT dự án này" },
  { id: "SMS_SENT", label: "Đã SMS" },
  { id: "ZALO_OPENED", label: "Đã mở Zalo" },
];

export function AgentTelesalesDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { canAgent, loading } = useAuth();
  const nav = useNavigate();
  const [bundle, setBundle] = useState<
    Awaited<ReturnType<typeof getBrokerContact>>["data"] | null
  >(null);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function reload() {
    if (!id) return;
    const res = await getBrokerContact(id);
    if (!res.ok) {
      setMsg(res.error ?? "Không tải được (scope?)");
      return;
    }
    setBundle(res.data ?? null);
  }

  useEffect(() => {
    if (loading) return;
    void (async () => {
      if (!canAgent) {
        nav("/tai-khoan", { replace: true });
        return;
      }
      const access = await checkBrokerTelesalesAccess();
      if (!access.ok || !access.data?.allowed) {
        nav("/agent/telesales", { replace: true });
        return;
      }
      void reload();
    })();
  }, [id, canAgent, loading, nav]);

  const blocked =
    bundle?.callBlockedUntil &&
    new Date(bundle.callBlockedUntil).getTime() > Date.now();

  async function chip(result: string) {
    if (!id) return;
    setBusy(true);
    const res = await recordBrokerContact(id, result, note || undefined);
    setBusy(false);
    setMsg(res.ok ? "Đã ghi" : res.error ?? "Lỗi");
    if (res.ok) {
      setNote("");
      void reload();
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 pb-20">
      <Link to="/agent/telesales" className="text-xs text-slate-500">
        ← Queue
      </Link>
      <h1 className="text-lg font-bold">
        {bundle?.detail?.customerName ?? "Lead"} ·{" "}
        {bundle?.detail?.statusLabel ?? ""}
      </h1>
      <p className="font-mono text-sm">{bundle?.phone ?? "…"}</p>

      <div className="flex flex-wrap gap-2">
        {bundle?.deepLinks?.tel && !blocked ? (
          <a
            href={bundle.deepLinks.tel}
            className="rounded-lg bg-rose-800 px-4 py-2 text-sm font-semibold text-white"
          >
            Gọi
          </a>
        ) : (
          <span className="rounded-lg bg-slate-300 px-4 py-2 text-sm text-slate-600">
            Gọi (cooldown)
          </span>
        )}
        {bundle?.deepLinks?.sms ? (
          <a
            href={bundle.deepLinks.sms}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
          >
            SMS
          </a>
        ) : null}
        {bundle?.deepLinks?.zalo ? (
          <button
            type="button"
            className="rounded-lg border px-3 py-2 text-sm"
            onClick={() => {
              void navigator.clipboard.writeText(
                bundle.deepLinks!.zalo.copyPhone,
              );
              setMsg("Đã copy SĐT");
            }}
          >
            Copy Zalo
          </button>
        ) : null}
      </div>

      {blocked ? (
        <p className="text-xs text-amber-700">
          Cooldown đến{" "}
          {new Date(bundle!.callBlockedUntil!).toLocaleString("vi-VN")}
        </p>
      ) : null}

      <textarea
        className="w-full rounded border px-2 py-1.5 text-sm"
        rows={2}
        placeholder="Ghi chú"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <div className="flex flex-wrap gap-1">
        {CHIPS.map((c) => (
          <button
            key={c.id}
            type="button"
            disabled={busy}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium"
            onClick={() => void chip(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {msg ? <p className="text-xs text-brand-800">{msg}</p> : null}

      <ul className="space-y-1 text-xs text-slate-600">
        {(bundle?.activities ?? []).slice(0, 10).map((a) => (
          <li key={a.id}>
            {new Date(a.occurredAt).toLocaleString("vi-VN")} ·{" "}
            {a.reason ?? a.type}
          </li>
        ))}
      </ul>
    </div>
  );
}
