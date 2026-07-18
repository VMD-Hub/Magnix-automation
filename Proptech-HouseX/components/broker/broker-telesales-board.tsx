"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";

type LeadRow = {
  id: string;
  statusLabel: string;
  customerName: string | null;
  phoneMasked: string | null;
  sourceLabel: string;
  createdAt: string;
};

type ContactBundle = {
  phone: string | null;
  deepLinks: {
    tel: string;
    sms: string;
    zalo: { copyPhone: string; hint: string };
  } | null;
  callBlockedUntil: string | null;
  activities: Array<{
    id: string;
    type: string;
    reason: string | null;
    note: string | null;
    occurredAt: string;
  }>;
};

const CHIPS = [
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

export function BrokerTelesalesBoard() {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [lane, setLane] = useState<string | null>(null);
  const [brokerType, setBrokerType] = useState<string | null>(null);
  const [items, setItems] = useState<LeadRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bundle, setBundle] = useState<ContactBundle | null>(null);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const checkAccess = useCallback(async () => {
    const res = await fetch("/api/broker/telesales/access");
    const json = await res.json();
    setAllowed(Boolean(json.data?.allowed));
    setLane(json.data?.lane ?? null);
    setBrokerType(json.data?.brokerType ?? null);
  }, []);

  const loadList = useCallback(async () => {
    const res = await fetch("/api/broker/telesales/leads?status=NEW");
    if (!res.ok) {
      setMsg("Không tải được queue.");
      return;
    }
    const json = await res.json();
    setItems(json.data?.items ?? []);
  }, []);

  const loadContact = useCallback(async (id: string) => {
    const res = await fetch(`/api/broker/telesales/leads/${id}/contact`);
    if (!res.ok) {
      setMsg("Không tải contact (scope?).");
      setBundle(null);
      return;
    }
    const json = await res.json();
    setBundle(json.data ?? null);
  }, []);

  useEffect(() => {
    void (async () => {
      await checkAccess();
    })();
  }, [checkAccess]);

  useEffect(() => {
    if (allowed) void loadList();
  }, [allowed, loadList]);

  useEffect(() => {
    if (selectedId) void loadContact(selectedId);
    else setBundle(null);
  }, [selectedId, loadContact]);

  const callBlocked =
    bundle?.callBlockedUntil &&
    new Date(bundle.callBlockedUntil).getTime() > Date.now();

  async function record(result: string) {
    if (!selectedId) return;
    setBusy(true);
    setMsg(null);
    const res = await fetch(
      `/api/broker/telesales/leads/${selectedId}/contact`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idemKey("contact"),
        },
        body: JSON.stringify({
          result,
          note: note || null,
          actorId: "broker-web",
          correlationId: idemKey("corr"),
        }),
      },
    );
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMsg(json.error?.message ?? "Ghi thất bại.");
      return;
    }
    setMsg("Đã ghi nhật ký.");
    setNote("");
    setBundle(json.data?.bundle ?? null);
    void loadList();
  }

  if (allowed === null) {
    return <p className="text-sm text-slate-500">Đang kiểm tra quyền…</p>;
  }

  if (!allowed) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
        <h1 className="text-lg font-semibold text-slate-900">
          Không có lane telesales môi giới
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Chỉ CTV (lead/hồ sơ thuộc mình) hoặc môi giới nội sàn (lead Super
          gán) mới dùng được trang này. Pool Ops cần grant riêng tại{" "}
          <code className="text-xs">/ops/telesales</code>.
        </p>
        <Link href="/moi-gioi/tai-khoan" className="mt-4 inline-block text-sm underline">
          Về tài khoản môi giới
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="font-semibold text-slate-900">Queue telesales</h2>
          <p className="text-xs text-slate-500">
            Lane: {lane === "noi_san" ? "Nội sàn" : "CTV own"} · type{" "}
            {brokerType} · SOP Phase 1 (deep-link)
          </p>
        </div>
        <ul className="divide-y divide-slate-100">
          {items.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-slate-500">
              Chưa có lead trong phạm vi.
            </li>
          ) : (
            items.map((row) => (
              <li key={row.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(row.id)}
                  className={cn(
                    "flex w-full flex-col items-start px-4 py-3 text-left text-sm hover:bg-slate-50",
                    selectedId === row.id && "bg-brand-50",
                  )}
                >
                  <span className="font-medium text-slate-900">
                    {row.customerName ?? "—"} · {row.phoneMasked}
                  </span>
                  <span className="text-xs text-slate-500">
                    {row.statusLabel} · {row.sourceLabel}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      <aside className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        {!selectedId ? (
          <p className="text-sm text-slate-500">Chọn lead để gọi.</p>
        ) : (
          <>
            <p className="text-sm font-medium text-slate-900">
              SĐT: {bundle?.phone ?? "…"}
            </p>
            <div className="flex flex-wrap gap-2">
              {bundle?.deepLinks?.tel ? (
                <a
                  href={callBlocked ? undefined : bundle.deepLinks.tel}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-semibold text-white",
                    callBlocked ? "bg-slate-400" : "bg-rose-800",
                  )}
                  aria-disabled={Boolean(callBlocked)}
                >
                  Gọi
                </a>
              ) : null}
              {bundle?.deepLinks?.sms ? (
                <a
                  href={bundle.deepLinks.sms}
                  className="rounded-md bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white"
                >
                  SMS
                </a>
              ) : null}
              {bundle?.deepLinks?.zalo ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    void navigator.clipboard.writeText(
                      bundle.deepLinks!.zalo.copyPhone,
                    );
                    setMsg("Đã copy SĐT — mở Zalo tìm số.");
                  }}
                >
                  Copy Zalo
                </Button>
              ) : null}
            </div>
            {callBlocked ? (
              <p className="text-xs text-amber-700">
                Cooldown gọi đến{" "}
                {new Date(bundle!.callBlockedUntil!).toLocaleString("vi-VN")}
              </p>
            ) : null}
            <textarea
              className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm"
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
                  onClick={() => void record(c.id)}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800 hover:bg-brand-100"
                >
                  {c.label}
                </button>
              ))}
            </div>
            {msg ? <p className="text-xs text-brand-800">{msg}</p> : null}
            <ul className="max-h-48 space-y-1 overflow-y-auto text-xs text-slate-600">
              {(bundle?.activities ?? []).slice(0, 12).map((a) => (
                <li key={a.id}>
                  {new Date(a.occurredAt).toLocaleString("vi-VN")} ·{" "}
                  {a.reason ?? a.type}
                  {a.note ? ` — ${a.note}` : ""}
                </li>
              ))}
            </ul>
          </>
        )}
      </aside>
    </div>
  );
}
