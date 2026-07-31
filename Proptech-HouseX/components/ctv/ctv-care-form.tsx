"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";

const CARE_TYPES = [
  { id: "CALL", label: "Gọi" },
  { id: "CHAT", label: "Chat" },
  { id: "MEET", label: "Gặp" },
  { id: "SITE_VISIT", label: "Thăm DA" },
  { id: "DOCUMENT", label: "Giấy tờ" },
  { id: "OTHER", label: "Khác" },
] as const;

type CareType = (typeof CARE_TYPES)[number]["id"];

type CareActivity = {
  id: string;
  activityType: string;
  note: string;
  status: string;
  occurredAt: string;
};

type Props = {
  caseId: string;
  careActivities?: CareActivity[];
  onSaved?: () => void;
};

/** CS hợp lệ: enum + note + ≥1 ảnh → upload rồi POST /care (desktop: nhiều ảnh). */
export function CtvCareForm({ caseId, careActivities = [], onSaved }: Props) {
  const [careType, setCareType] = useState<CareType>("CALL");
  const [careNote, setCareNote] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    if (careNote.trim().length < 3 || files.length === 0) return;
    setBusy(true);
    setMsg(null);
    setErr(null);
    try {
      const urls: string[] = [];
      for (const file of files.slice(0, 8)) {
        const form = new FormData();
        form.append("file", file);
        const up = await fetch(`/api/ctv/cases/${caseId}/care/upload`, {
          method: "POST",
          body: form,
        });
        const upJson = await up.json().catch(() => ({}));
        if (!up.ok) {
          setErr(upJson?.error?.message ?? "Không upload được ảnh.");
          return;
        }
        const url = upJson?.data?.url as string | undefined;
        if (!url) {
          setErr("Upload không trả URL ảnh.");
          return;
        }
        urls.push(url);
      }

      const res = await fetch(`/api/ctv/cases/${caseId}/care`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          activityType: careType,
          note: careNote.trim(),
          imageUrls: urls,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(json?.error?.message ?? "Không ghi được CS.");
        return;
      }
      setCareNote("");
      setFiles([]);
      setMsg("Đã ghi chăm sóc hợp lệ — đồng hồ độc quyền được làm mới.");
      onSaved?.();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 border-t border-slate-100 pt-5">
      <h4 className="text-sm font-bold text-slate-900">Chăm sóc (CS hợp lệ)</h4>
      <p className="mt-1 text-xs text-slate-500">
        Enum + ghi chú + ≥1 ảnh — reset đồng hồ im 30 ngày. Desktop có thể chọn
        nhiều ảnh (tối đa 8).
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {CARE_TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setCareType(t.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition",
              careType === t.id
                ? "border-brand-400 bg-brand-50 text-brand-800"
                : "border-slate-200 text-slate-600 hover:bg-slate-50",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <textarea
        rows={3}
        value={careNote}
        onChange={(e) => setCareNote(e.target.value)}
        placeholder="Nội dung chăm sóc…"
        className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
      />

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="mt-2 block w-full text-sm text-slate-600"
        onChange={(e) =>
          setFiles(Array.from(e.target.files ?? []).slice(0, 8))
        }
      />
      {files.length > 0 ? (
        <p className="mt-1 text-xs text-slate-500">{files.length} ảnh đã chọn</p>
      ) : null}

      <Button
        type="button"
        size="sm"
        className="mt-3"
        disabled={busy || careNote.trim().length < 3 || files.length === 0}
        onClick={() => void submit()}
      >
        {busy ? "Đang gửi…" : "Gửi CS"}
      </Button>

      {msg ? <p className="mt-2 text-sm text-emerald-700">{msg}</p> : null}
      {err ? <p className="mt-2 text-sm text-rose-600">{err}</p> : null}

      {careActivities.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {careActivities.slice(0, 5).map((a) => (
            <li
              key={a.id}
              className="rounded-lg border border-slate-100 px-3 py-2 text-sm"
            >
              <p className="font-medium text-slate-800">
                {a.activityType} · {a.status}
              </p>
              <p className="text-slate-600">{a.note}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
