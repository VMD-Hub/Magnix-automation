"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";
import { TelesalesCallCuePanel } from "@/components/admin/telesales-call-cue-panel";
import type { TelesalesCallCuePayload } from "@/lib/leads/telesales-call-cues";

type ContactBundle = {
  phone: string | null;
  deepLinks: {
    tel: string | null;
    sms: string;
    zalo: { copyPhone: string; hint: string };
  } | null;
  voiceCallAllowed?: boolean;
  waitlist?: boolean;
  waitlistHint?: string | null;
  lastContact: {
    at: string;
    type: string;
    reason: string | null;
    channel: string | null;
    actorId: string;
    note: string | null;
  } | null;
  callBlockedUntil: string | null;
  openCallbackTask: {
    id: string;
    dueAt: string | null;
    note: string | null;
  } | null;
  activities: Array<{
    id: string;
    type: string;
    channel: string | null;
    note: string | null;
    reason: string | null;
    actorId: string;
    occurredAt: string;
    dueAt: string | null;
  }>;
  conversionHint: string;
  callCue?: TelesalesCallCuePayload | null;
  deferredSegment?: string | null;
};

const RESULT_CHIPS: Array<{ id: string; label: string }> = [
  { id: "CONNECTED", label: "Đàm thoại OK" },
  { id: "SEND_INFO", label: "Xin gửi tin / Zalo" },
  { id: "NO_ANSWER", label: "Không nghe" },
  { id: "NOT_THIS_PROJECT", label: "Không QT dự án này" },
  { id: "WRONG_NUMBER", label: "Sai số" },
  { id: "HARD_REJECT", label: "Từ chối cứng" },
  { id: "SMS_SENT", label: "Đã mở SMS" },
  { id: "ZALO_OPENED", label: "Đã mở Zalo" },
];

function idemKey(prefix: string) {
  return `${prefix}:${crypto.randomUUID()}`;
}

export function OpsLeadTelesalesPanel({
  leadId,
  onStatusMaybeChanged,
}: {
  leadId: string;
  onStatusMaybeChanged?: () => void;
}) {
  const [bundle, setBundle] = useState<ContactBundle | null>(null);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sendOa, setSendOa] = useState(true);
  const [sendSms, setSendSms] = useState(true);
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [lastChip, setLastChip] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/ops-leads/${leadId}/contact`);
    if (!res.ok) {
      setMsg("Không tải được nhật ký liên hệ.");
      return;
    }
    const json = await res.json();
    setBundle(json.data ?? null);
  }, [leadId]);

  useEffect(() => {
    void load();
  }, [load]);

  const callBlocked =
    bundle?.callBlockedUntil &&
    new Date(bundle.callBlockedUntil).getTime() > Date.now();

  async function recordResult(result: string) {
    setBusy(true);
    setMsg(null);
    const res = await fetch(`/api/admin/ops-leads/${leadId}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idemKey("contact"),
      },
      body: JSON.stringify({
        result,
        note: note || null,
        actorId: "ops-ui",
        correlationId: idemKey("corr"),
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMsg(json.error?.message ?? "Ghi kết quả thất bại.");
      return;
    }
    setMsg("Đã ghi nhật ký.");
    setNote("");
    setLastChip(result);
    setBundle(json.data?.bundle ?? null);
    onStatusMaybeChanged?.();
  }

  async function copyZaloPhone() {
    const p = bundle?.deepLinks?.zalo.copyPhone;
    if (!p) return;
    try {
      await navigator.clipboard.writeText(p);
      setMsg("Đã copy SĐT — dán vào Zalo để xem avatar/tên.");
      void recordResult("ZALO_OPENED");
    } catch {
      setMsg(`Copy thủ công: ${p}`);
    }
  }

  async function serverSend() {
    const channels: Array<"oa" | "sms"> = [];
    if (sendOa) channels.push("oa");
    if (sendSms) channels.push("sms");
    if (channels.length === 0) {
      setServerMsg("Chọn ít nhất một kênh OA hoặc SMS.");
      return;
    }
    setBusy(true);
    setServerMsg(null);
    const res = await fetch(`/api/admin/ops-leads/${leadId}/server-send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idemKey("server-send"),
      },
      body: JSON.stringify({
        channels,
        actorId: "ops-ui",
        correlationId: idemKey("corr"),
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setServerMsg(json.error?.message ?? "Gửi server thất bại.");
      return;
    }
    const lines = (json.data?.results ?? []) as Array<{
      channel: string;
      status: string;
      reason: string | null;
    }>;
    setServerMsg(
      lines.length
        ? lines
            .map(
              (r) =>
                `${r.channel.toUpperCase()}: ${r.status}${
                  r.reason ? ` (${r.reason})` : ""
                }`,
            )
            .join(" · ")
        : "Đã xử lý.",
    );
    if (json.data?.bundle) setBundle(json.data.bundle);
    else void load();
    onStatusMaybeChanged?.();
  }

  if (!bundle) {
    return <p className="text-xs text-slate-500">Đang tải telesales…</p>;
  }

  return (
    <div className="space-y-3 rounded-lg border border-emerald-100 bg-emerald-50/40 p-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900">
          Telesales — gọi trước
        </p>
        <p className="mt-0.5 text-[11px] text-emerald-900/80">
          {bundle.conversionHint}
        </p>
        {bundle.lastContact?.type === "CONNECTED" &&
        bundle.lastContact.reason !== "NOT_THIS_PROJECT" ? (
          <a
            href="/admin/conversion"
            className="mt-1 inline-block text-[11px] font-medium text-brand-800 underline"
          >
            Mở Conversion (chỉ khi đã có hướng căn/dự án)
          </a>
        ) : null}
      </div>

      {bundle.lastContact ? (
        <p className="rounded-md bg-white/80 px-2 py-1.5 text-xs text-slate-700">
          Liên hệ gần nhất: {bundle.lastContact.reason ?? bundle.lastContact.type}{" "}
          · {new Date(bundle.lastContact.at).toLocaleString("vi-VN")}
          {bundle.lastContact.note ? ` — ${bundle.lastContact.note}` : ""}
        </p>
      ) : (
        <p className="text-xs text-slate-500">Chưa có nhật ký gọi trên lead này.</p>
      )}

      {bundle.waitlistHint ? (
        <p className="rounded-md border border-sky-200 bg-sky-50 px-2 py-1.5 text-xs text-sky-950">
          {bundle.waitlistHint}
        </p>
      ) : null}

      {callBlocked ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-900">
          Đang khoá gọi đến{" "}
          {new Date(bundle.callBlockedUntil!).toLocaleString("vi-VN")} (chống trùng
          sau không nghe). Dùng SMS/Zalo hoặc chờ Task gọi lại.
        </p>
      ) : null}

      {bundle.openCallbackTask ? (
        <p className="text-xs text-slate-600">
          Task gọi lại:{" "}
          {bundle.openCallbackTask.dueAt
            ? new Date(bundle.openCallbackTask.dueAt).toLocaleString("vi-VN")
            : "—"}
        </p>
      ) : null}

      <TelesalesCallCuePanel
        leadId={leadId}
        callCue={bundle.callCue ?? null}
        deferredSegment={bundle.deferredSegment}
        activeChipHint={lastChip}
      />

      <div className="flex flex-wrap gap-2">
        {bundle.deepLinks ? (
          <>
            <Button
              type="button"
              size="sm"
              disabled={
                Boolean(callBlocked) ||
                bundle.voiceCallAllowed === false ||
                !bundle.deepLinks.tel
              }
              onClick={() => {
                if (!bundle.deepLinks?.tel) return;
                window.location.href = bundle.deepLinks.tel;
              }}
            >
              {bundle.voiceCallAllowed === false
                ? "Gọi (chặn — waitlist)"
                : "Gọi điện"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                window.location.href = bundle.deepLinks!.sms;
                void recordResult("SMS_SENT");
              }}
            >
              SMS chào
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void copyZaloPhone()}
            >
              Copy SĐT → Zalo
            </Button>
          </>
        ) : (
          <p className="text-xs text-rose-600">Thiếu SĐT — điền kênh phone rồi Lưu.</p>
        )}
      </div>

      {bundle.deepLinks ? (
        <p className="text-[11px] text-slate-500">{bundle.deepLinks.zalo.hint}</p>
      ) : null}

      <div className="rounded-md border border-slate-200 bg-white/90 p-2.5">
        <p className="text-xs font-medium text-slate-800">
          Gửi OA / SMS server (Phase 2)
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Cần marketing consent theo kênh. Deep-link phía trên vẫn dùng được khi chưa
          bật server send.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1.5 text-[11px] text-slate-700">
            <input
              type="checkbox"
              checked={sendOa}
              onChange={(e) => setSendOa(e.target.checked)}
            />
            OA
          </label>
          <label className="flex items-center gap-1.5 text-[11px] text-slate-700">
            <input
              type="checkbox"
              checked={sendSms}
              onChange={(e) => setSendSms(e.target.checked)}
            />
            SMS
          </label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={busy || (!sendOa && !sendSms)}
            onClick={() => void serverSend()}
          >
            Gửi OA / SMS server
          </Button>
        </div>
        {serverMsg ? (
          <p className="mt-1.5 text-[11px] text-brand-800">{serverMsg}</p>
        ) : null}
      </div>

      <label className="block text-xs">
        <span className="font-medium text-slate-700">Ghi chú cuộc gọi (tuỳ chọn)</span>
        <textarea
          className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Tóm tắt 1–2 câu…"
        />
      </label>

      <div>
        <p className="mb-1.5 text-xs font-medium text-slate-700">
          Kết quả sau khi gọi / follow-up
        </p>
        <div className="flex flex-wrap gap-1.5">
          {RESULT_CHIPS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              disabled={busy}
              onClick={() => void recordResult(chip.id)}
              className={cn(
                "rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50",
                busy && "opacity-50",
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1 text-xs font-medium text-slate-700">Nhật ký gần đây</p>
        <ul className="max-h-36 space-y-1 overflow-y-auto text-[11px] text-slate-600">
          {bundle.activities.length === 0 ? (
            <li>Trống</li>
          ) : (
            bundle.activities.slice(0, 12).map((a) => (
              <li key={a.id} className="border-t border-slate-100 pt-1">
                {new Date(a.occurredAt).toLocaleString("vi-VN")} · {a.type}
                {a.reason ? ` / ${a.reason}` : ""}
                {a.channel ? ` · ${a.channel}` : ""}
                {a.note ? ` — ${a.note}` : ""}
              </li>
            ))
          )}
        </ul>
      </div>

      {msg ? <p className="text-xs text-brand-800">{msg}</p> : null}
    </div>
  );
}

export function OpsHotLeadCreateForm({
  onCreated,
}: {
  onCreated: (leadId: string) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("hot:manual");
  const [segment, setSegment] = useState("");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/admin/ops-leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name || "Khách hot",
        phone,
        source,
        segment: segment || null,
        note: note || null,
        actorId: "ops-ui",
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error?.message ?? "Tạo lead thất bại.");
      return;
    }
    setMsg(json.data?.created ? "Đã tạo lead hot." : "Đã có lead mở cùng SĐT — mở lại.");
    setName("");
    setPhone("");
    setNote("");
    onCreated(json.data.leadId);
  }

  return (
    <div className="border-b border-slate-100 bg-white px-4 py-3">
      <button
        type="button"
        className="text-sm font-semibold text-brand-800"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "▾" : "▸"} Thêm lead hot (SĐT ads / công ty / tay)
      </button>
      {open ? (
        <form onSubmit={(e) => void submit(e)} className="mt-3 grid gap-2 sm:grid-cols-2">
          <input
            className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
            placeholder="Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
            placeholder="SĐT *"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <select
            className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="hot:manual">Hot — nhập tay</option>
            <option value="ads:offline">Ads offline</option>
            <option value="partner">Đối tác / công ty</option>
            <option value="ops:manual">Ops nhập tay</option>
          </select>
          <select
            className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
          >
            <option value="">Segment —</option>
            <option value="NOXH">NOXH</option>
            <option value="CCTM">CCTM</option>
          </select>
          <input
            className="rounded-md border border-slate-200 px-2 py-1.5 text-sm sm:col-span-2"
            placeholder="Ghi chú ngắn"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <Button type="submit" size="sm" className="sm:col-span-2 sm:w-fit">
            Lưu lead + Task gọi lần 1
          </Button>
          {msg ? <p className="text-xs text-brand-800 sm:col-span-2">{msg}</p> : null}
        </form>
      ) : null}
    </div>
  );
}
