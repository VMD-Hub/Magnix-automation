import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/auth-context";
import {
  checkTelesalesAccess,
  getOpsContact,
  recordContact,
  serverSend,
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
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [bundle, setBundle] = useState<
    Awaited<ReturnType<typeof getOpsContact>>["data"] | null
  >(null);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [sendOa, setSendOa] = useState(true);
  const [sendSms, setSendSms] = useState(true);
  const [busy, setBusy] = useState(false);

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
    if (loading) return;
    void (async () => {
      if (!user) {
        nav("/ops", { replace: true });
        return;
      }
      const access = await checkTelesalesAccess();
      if (!access.ok || !access.data?.allowed) {
        nav("/ops", { replace: true });
        return;
      }
      void reload();
    })();
  }, [id, user, loading, nav]);

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

  async function onServerSend() {
    if (!id) return;
    const channels: Array<"oa" | "sms"> = [];
    if (sendOa) channels.push("oa");
    if (sendSms) channels.push("sms");
    if (!channels.length) {
      setMsg("Chọn OA hoặc SMS");
      return;
    }
    setBusy(true);
    const res = await serverSend(id, channels);
    setBusy(false);
    if (!res.ok) {
      setMsg(res.error ?? "Gửi server thất bại");
      return;
    }
    const lines = (res.data?.results ?? [])
      .map(
        (r) =>
          `${r.channel.toUpperCase()}: ${r.status}${
            r.reason ? ` (${r.reason})` : ""
          }`,
      )
      .join(" · ");
    setMsg(lines || "Đã xử lý");
    void reload();
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
          Khoá gọi đến{" "}
          {new Date(bundle.callBlockedUntil!).toLocaleString("vi-VN")}
        </p>
      ) : null}

      {bundle.callCue ? (
        <div className="space-y-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2">
          <p className="text-xs font-semibold text-sky-950">
            Gợi ý gọi NOXH — không đọc thuộc
          </p>
          {bundle.callCue.projectFacts.projectName ? (
            <p className="text-[11px] text-slate-700">
              {bundle.callCue.projectFacts.projectName}
              {bundle.callCue.projectFacts.priceFromLabel
                ? ` · ${bundle.callCue.projectFacts.priceFromLabel}`
                : ""}
              {bundle.callCue.projectFacts.applicationDeadlineLabel
                ? ` · hạn ${bundle.callCue.projectFacts.applicationDeadlineLabel}`
                : ""}
            </p>
          ) : (
            <p className="text-[11px] text-amber-800">Chưa gắn dự án trên lead</p>
          )}
          <p className="text-[11px] text-slate-800">{bundle.callCue.openingLine}</p>
          <ul className="list-disc space-y-0.5 pl-4 text-[11px] text-slate-700">
            {bundle.callCue.mustCover.map((m) => (
              <li key={m.id}>
                <span className="font-medium">{m.label}</span> — {m.hint}
              </li>
            ))}
          </ul>
          {bundle.callCue.softMode ? (
            <p className="text-[10px] text-amber-900">
              Soft mode: thiếu hạn đợt/ưu đãi trên master — đừng framing mất mát mạnh.
            </p>
          ) : null}
        </div>
      ) : bundle.deferredSegment === "CCTM" ? (
        <p className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
          Cue CCTM phase sau — dùng SOP gọi chung.
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

      <div className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="text-xs font-semibold text-slate-800">
          Gửi OA / SMS server
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Cần marketing consent. Deep-link phía trên vẫn dùng khi chưa bật server.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              checked={sendOa}
              onChange={(e) => setSendOa(e.target.checked)}
            />
            OA
          </label>
          <label className="flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              checked={sendSms}
              onChange={(e) => setSendSms(e.target.checked)}
            />
            SMS
          </label>
          <button
            type="button"
            disabled={busy || (!sendOa && !sendSms)}
            className="rounded-lg bg-rose-800 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
            onClick={() => void onServerSend()}
          >
            Gửi server
          </button>
        </div>
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
