"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type InternalBroker = {
  id: string;
  fullName: string;
  phone: string;
};

function idemKey(prefix: string) {
  return `${prefix}:${crypto.randomUUID()}`;
}

/** Super/Ops: gán lead pool → môi giới nội sàn (rời Ops inbox). */
export function AssignInternalBrokerPanel({
  leadId,
  onAssigned,
}: {
  leadId: string;
  onAssigned?: () => void;
}) {
  const [brokers, setBrokers] = useState<InternalBroker[]>([]);
  const [brokerId, setBrokerId] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/brokers?brokerType=INTERNAL");
    if (!res.ok) return;
    const json = await res.json();
    setBrokers(json.data?.items ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function assign() {
    if (!brokerId) return;
    setBusy(true);
    setMsg(null);
    const res = await fetch(`/api/admin/ops-leads/${leadId}/assign-internal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idemKey("assign-internal"),
      },
      body: JSON.stringify({
        brokerId,
        correlationId: idemKey("corr"),
        actorId: "ops-ui",
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMsg(json.error?.message ?? "Gán thất bại.");
      return;
    }
    setMsg(
      `Đã gán cho ${json.data?.broker?.fullName ?? "nội sàn"} — lead rời pool Ops.`,
    );
    onAssigned?.();
  }

  if (brokers.length === 0) {
    return (
      <p className="text-xs text-slate-500">
        Chưa có môi giới nội sàn. Đánh dấu tại Quyền telesales.
      </p>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-3">
      <p className="text-xs font-medium text-slate-700">
        Phân bổ nội sàn
      </p>
      <select
        className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm"
        value={brokerId}
        onChange={(e) => setBrokerId(e.target.value)}
      >
        <option value="">— Chọn môi giới INTERNAL —</option>
        {brokers.map((b) => (
          <option key={b.id} value={b.id}>
            {b.fullName} ({b.phone})
          </option>
        ))}
      </select>
      <Button
        type="button"
        size="sm"
        disabled={!brokerId || busy}
        onClick={() => void assign()}
        className="w-full"
      >
        Gán lead → nội sàn
      </Button>
      {msg ? <p className="text-xs text-brand-800">{msg}</p> : null}
    </div>
  );
}
