import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getOpsContact,
  getOpsSecret,
  recordContact,
} from "@/services/ops-telesales";

const CHIPS = [
  { id: "CONNECTED", label: "Đàm thoại OK" },
  { id: "SEND_INFO", label: "Xin gửi tin" },
  { id: "NO_ANSWER", label: "Không nghe" },
  { id: "NOT_THIS_PROJECT", label: "Không QT dự án này" },
  { id: "SMS_SENT", label: "Đã SMS" },
  { id: "ZALO_OPENED", label: "Đã mở Zalo" },
];

export function OpsLeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [bundle, setBundle] = useState<Awaited<
    ReturnType<typeof getOpsContact>
  >["data"] | null>(null);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function reload() {
    if (!id) return;
    const res = await getOpsContact(id);
    if (!res.ok) {
      setMsg(res.error ?? "Lỗi");
      return;
    }
    setBundle(res.data ?? null);
  }

  useEffect(() => {
    if (!getOpsSecret()) {
      nav("/ops", { replace: true });
      return;
    }
    void reload();
  }, [id, nav]);

  const blocked =
    bundle?.callBlockedUntil &&
    new Date(bundle.callBlockedUntil).getTime() > Date.now();

  async function chip(result: string) {
    if (!id) return;
    const res = await recordContact(id, result, note || undefined);
    setMsg(res.ok ? "Đã ghi" : res.error ?? "Lỗi");
    if (res.ok) {
      setNote("");
      void reload();
    }
  }

  if (!bundle) {
    return <p className="p-4 text-sm text-slate-500">Đang tải…</p>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 pb-20">
      <Link to="/ops/leads" className="text-sm text-rose-800">
        ← Danh sách
      </Link>
      <h1 className="text-lg font-bold">
        {bundle.detail.customerName ?? "Khách"} · {bundle.detail.statusLabel}
      </h1>
      <p className="text-xs text-slate-600">{bundle.conversionHint}</p>

      {bundle.lastContact ? (
        <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs">
          Gần nhất: {bundle.lastContact.reason ?? bundle.lastContact.type} ·{" "}
          {new Date(bundle.lastContact.at).toLocaleString("vi-VN")}
        </p>
      ) : null}

      {blocked ? (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Khoá gọi đến {new Date(bundle.callBlockedUntil!).toLocaleString("vi-VN")}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {bundle.deepLinks ? (
          <>
            <a
              className={`rounded-lg px-3 py-2 text-sm font-semibold text-white ${blocked ? "bg-slate-400" : "bg-rose-800"}`}
              href={blocked ? undefined : bundle.deepLinks.tel}
              aria-disabled={Boolean(blocked)}
            >
              Gọi điện
            </a>
            <a
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              href={bundle.deepLinks.sms}
              onClick={() => void chip("SMS_SENT")}
            >
              SMS
            </a>
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              onClick={() => {
                void navigator.clipboard.writeText(
                  bundle.deepLinks!.zalo.copyPhone,
                );
                void chip("ZALO_OPENED");
                setMsg("Đã copy SĐT — dán Zalo");
              }}
            >
              Copy → Zalo
            </button>
          </>
        ) : (
          <p className="text-sm text-rose-600">Thiếu SĐT</p>
        )}
      </div>

      <textarea
        className="w-full rounded-lg border px-2 py-2 text-sm"
        rows={2}
        placeholder="Ghi chú cuộc gọi"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        {CHIPS.map((c) => (
          <button
            key={c.id}
            type="button"
            className="rounded-full border bg-white px-2.5 py-1 text-xs"
            onClick={() => void chip(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {msg ? <p className="text-xs text-brand-800">{msg}</p> : null}

      <ul className="space-y-1 text-[11px] text-slate-600">
        {(bundle.activities ?? []).slice(0, 10).map((a) => (
          <li key={a.id}>
            {new Date(a.occurredAt).toLocaleString("vi-VN")} · {a.type}
            {a.reason ? `/${a.reason}` : ""}
            {a.note ? ` — ${a.note}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
