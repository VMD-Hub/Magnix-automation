"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/ui/cn";
import type { TelesalesCallCuePayload } from "@/lib/leads/telesales-call-cues";

function storageKey(leadId: string) {
  return `hx-telesales-mustcover:${leadId}`;
}

function loadChecked(leadId: string): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(storageKey(leadId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveChecked(leadId: string, map: Record<string, boolean>) {
  try {
    localStorage.setItem(storageKey(leadId), JSON.stringify(map));
  } catch {
    /* ignore quota */
  }
}

export function TelesalesCallCuePanel({
  leadId,
  callCue,
  deferredSegment,
  activeChipHint,
}: {
  leadId: string;
  callCue: TelesalesCallCuePayload | null;
  deferredSegment?: string | null;
  /** Optional: chip id vừa chọn để hiện hint. */
  activeChipHint?: string | null;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [openExample, setOpenExample] = useState<string | null>(null);
  const [showDiagnose, setShowDiagnose] = useState(false);
  const [openSituation, setOpenSituation] = useState<string | null>(
    "commission_cut_pressure",
  );

  useEffect(() => {
    setChecked(loadChecked(leadId));
  }, [leadId]);

  const facts = callCue?.projectFacts;
  const chipHint = useMemo(() => {
    if (!callCue || !activeChipHint) return null;
    return callCue.chipHints[
      activeChipHint as keyof typeof callCue.chipHints
    ] ?? null;
  }, [callCue, activeChipHint]);

  if (!callCue) {
    return (
      <div className="rounded-md border border-slate-200 bg-white/90 px-2.5 py-2 text-[11px] text-slate-600">
        {deferredSegment === "CCTM" ? (
          <p>
            Cue CCTM sẽ ship phase sau. Lead này segment CCTM — dùng SOP chung
            (gọi → chip → Conversion khi nóng).
          </p>
        ) : (
          <p>
            Chưa có call cue (segment chưa phải NOXH hoặc chưa phân loại). Gắn
            segment NOXH trên lead để hiện must-cover.
          </p>
        )}
      </div>
    );
  }

  function toggle(id: string) {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveChecked(leadId, next);
      return next;
    });
  }

  return (
    <div className="space-y-2.5 rounded-md border border-sky-200 bg-sky-50/50 p-2.5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-950">
          Gợi ý cuộc gọi — NOXH
        </p>
        <p className="mt-0.5 text-[11px] text-sky-900/80">
          Cue nhớ ý — không đọc nguyên văn. Tick must-cover để khỏi sót kỹ thuật.
        </p>
      </div>

      {facts?.projectName ? (
        <p className="text-[11px] text-slate-700">
          Dự án: <span className="font-medium">{facts.projectName}</span>
          {facts.priceFromLabel || facts.pricePerSqmLabel ? (
            <>
              {" "}
              · Giá:{" "}
              <span className="font-medium">
                {[facts.pricePerSqmLabel, facts.priceFromLabel]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </>
          ) : null}
          {facts.applicationDeadlineLabel ? (
            <>
              {" "}
              · Hạn đợt:{" "}
              <span className="font-medium">{facts.applicationDeadlineLabel}</span>
            </>
          ) : null}
          {facts.promoUnitsRemaining != null ? (
            <>
              {" "}
              · Còn ưu đãi:{" "}
              <span className="font-medium">{facts.promoUnitsRemaining} căn</span>
              {facts.promoDiscountLabel ? ` (${facts.promoDiscountLabel})` : ""}
            </>
          ) : null}
        </p>
      ) : (
        <p className="text-[11px] text-amber-800">
          Lead chưa gắn dự án — gắn project trên lead để hiện giá/đợt từ master.
        </p>
      )}

      {facts && facts.missingFields.length > 0 ? (
        <p className="text-[11px] text-amber-900/90">
          Thiếu trên master: {facts.missingFields.join(", ")}. Soft mode — không
          bịa mất mát/giá. Cập nhật{" "}
          <code className="rounded bg-white/80 px-1">overviewData.telesalesFacts</code>.
        </p>
      ) : null}

      {facts && facts.valueAnchors.length > 0 ? (
        <p className="text-[11px] text-slate-600">
          Neo giá trị gợi ý: {facts.valueAnchors.join(" · ")}
        </p>
      ) : null}

      <div className="rounded border border-sky-100 bg-white/90 px-2 py-1.5">
        <p className="text-[11px] font-medium text-slate-800">Mở máy</p>
        <p className="mt-0.5 text-[11px] leading-snug text-slate-700">
          {callCue.openingLine}
        </p>
      </div>

      <div>
        <p className="mb-1 text-[11px] font-medium text-slate-800">Luồng 5 bước</p>
        <ol className="list-decimal space-y-0.5 pl-4 text-[11px] text-slate-700">
          {callCue.flowSteps.map((s) => (
            <li key={s}>{s.replace(/^\d+\.\s*/, "")}</li>
          ))}
        </ol>
      </div>

      <div>
        <button
          type="button"
          className="text-[11px] font-medium text-sky-900 underline"
          onClick={() => setShowDiagnose((v) => !v)}
        >
          {showDiagnose ? "Ẩn" : "Hiện"} câu hỏi chẩn đoán
        </button>
        {showDiagnose ? (
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11px] text-slate-700">
            {callCue.diagnoseQuestions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <div>
        <p className="mb-1 text-[11px] font-medium text-slate-800">
          Must-cover (tick khi đã nói)
        </p>
        <ul className="space-y-1">
          {callCue.mustCover.map((item) => (
            <li key={item.id}>
              <label className="flex cursor-pointer items-start gap-2 text-[11px] text-slate-800">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={Boolean(checked[item.id])}
                  onChange={() => toggle(item.id)}
                />
                <span>
                  <span
                    className={cn(
                      "font-medium",
                      checked[item.id] && "text-slate-500 line-through",
                    )}
                  >
                    {item.label}
                  </span>
                  <span className="block text-slate-500">{item.hint}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-1 text-[11px] font-medium text-slate-800">
          Tình huống đặc thù
        </p>
        <ul className="space-y-1.5">
          {(callCue.situations ?? []).map((s) => {
            const open = openSituation === s.id;
            return (
              <li
                key={s.id}
                className="rounded border border-rose-200 bg-rose-50/70 px-2 py-1.5"
              >
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() =>
                    setOpenSituation((cur) => (cur === s.id ? null : s.id))
                  }
                >
                  <p className="text-[11px] font-semibold text-rose-950">
                    {s.title} {open ? "▾" : "▸"}
                  </p>
                  <p className="text-[11px] text-rose-900/90">{s.principle}</p>
                </button>
                {open ? (
                  <div className="mt-1.5 space-y-1.5 border-t border-rose-100 pt-1.5">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-rose-900">
                      Các bước
                    </p>
                    <ol className="list-decimal space-y-0.5 pl-4 text-[11px] text-slate-800">
                      {s.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-rose-900">
                      Gợi ý lời (ý chính — không đọc thuộc)
                    </p>
                    <ul className="space-y-1">
                      {s.exampleLines.map((line) => (
                        <li
                          key={line.slice(0, 48)}
                          className="rounded bg-white/80 px-1.5 py-1 text-[11px] italic text-slate-700"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                    <p className="text-[11px] font-medium text-slate-900">
                      {s.boundary}
                    </p>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-rose-900">
                      Câu khách nên hỏi bên kia
                    </p>
                    <ul className="list-disc space-y-0.5 pl-4 text-[11px] text-slate-700">
                      {s.verifyQuestions.map((q) => (
                        <li key={q}>{q}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <p className="mb-1 text-[11px] font-medium text-slate-800">
          4 kỹ thuật (cue)
        </p>
        <ul className="space-y-1.5">
          {callCue.techniques.map((t) => (
            <li
              key={t.id}
              className="rounded border border-slate-100 bg-white/80 px-2 py-1.5"
            >
              <p className="text-[11px] font-medium text-slate-900">{t.title}</p>
              <p className="text-[11px] text-slate-700">{t.cue}</p>
              {callCue.softMode && t.id === "loss_frame" ? (
                <p className="mt-0.5 text-[10px] text-amber-800">
                  Soft: thiếu hạn đợt/số căn — đừng dùng framing mất mát mạnh.
                </p>
              ) : null}
              <button
                type="button"
                className="mt-0.5 text-[10px] text-sky-800 underline"
                onClick={() =>
                  setOpenExample((cur) => (cur === t.id ? null : t.id))
                }
              >
                {openExample === t.id ? "Ẩn ví dụ" : "Ví dụ NOXH"}
              </button>
              {openExample === t.id ? (
                <p className="mt-0.5 text-[11px] italic text-slate-600">
                  {t.exampleNoxh}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      {chipHint ? (
        <p className="rounded border border-emerald-200 bg-emerald-50/80 px-2 py-1.5 text-[11px] text-emerald-950">
          Sau chip: {chipHint}
        </p>
      ) : null}
    </div>
  );
}
