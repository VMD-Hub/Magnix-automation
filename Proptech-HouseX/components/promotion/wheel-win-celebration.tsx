"use client";

import { useEffect, useMemo, useState } from "react";
import { PROMOTION_CLAIM_REQUIREMENTS } from "@/lib/promotion/scope";

const CONFETTI_COLORS = [
  "#b91c1c",
  "#f59e0b",
  "#fcd34d",
  "#16a34a",
  "#2563eb",
  "#ec4899",
  "#fde047",
  "#ffffff",
];

export type WinPopupData = {
  label: string;
  code: string | null;
  requiresClaim?: boolean;
};

type WheelWinCelebrationProps = {
  showFireworks: boolean;
  popup: WinPopupData | null;
  onClosePopup: () => void;
  onSaveToAccount?: () => void;
};

export function WheelWinCelebration({
  showFireworks,
  popup,
  onClosePopup,
  onSaveToAccount,
}: WheelWinCelebrationProps) {
  const [saveHint, setSaveHint] = useState<string | null>(null);

  useEffect(() => {
    if (popup) setSaveHint(null);
  }, [popup?.label, popup?.code, popup?.requiresClaim]);

  const pieces = useMemo(
    () =>
      Array.from({ length: 96 }, (_, i) => ({
        id: i,
        left: 5 + (i * 19) % 90,
        top: 18 + (i * 13) % 55,
        delay: (i % 14) * 0.04,
        duration: 1.9 + (i % 8) * 0.22,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length]!,
        w: 4 + (i % 5) * 2,
        h: 10 + (i % 6) * 4,
        driftX: -70 + (i * 17) % 140,
        driftY: 90 + (i % 7) * 30,
        spin: 360 + (i * 41) % 720,
      })),
    [],
  );

  async function handleSaveResult() {
    if (!popup) return;

    if (popup.requiresClaim && onSaveToAccount) {
      onSaveToAccount();
      setSaveHint("Đang chuyển bạn đến bước lưu kết quả…");
      return;
    }

    const text = popup.code
      ? `HouseX — Trúng giải: ${popup.label}\nMã quà: ${popup.code}`
      : `HouseX — Trúng giải: ${popup.label}`;

    try {
      await navigator.clipboard.writeText(text);
      setSaveHint("Đã lưu vào clipboard — dán vào ghi chú hoặc gửi CSKH khi cần.");
    } catch {
      setSaveHint("Không copy được — hãy chụp màn hình mã quà để lưu.");
    }
  }

  return (
    <>
      {showFireworks ? (
        <div className="pointer-events-none absolute inset-0 z-30 overflow-visible">
          <span className="wheel-firework-ring" />
          <span className="wheel-firework-ring wheel-firework-ring--delay" />
          <span className="wheel-firework-ring wheel-firework-ring--delay2" />
          {pieces.map((p) => (
            <span
              key={p.id}
              className="wheel-confetti-piece absolute rounded-[1px] shadow-sm"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.w,
                height: p.h,
                backgroundColor: p.color,
                ["--drift-x" as string]: `${p.driftX}px`,
                ["--drift-y" as string]: `${p.driftY}px`,
                ["--spin" as string]: `${p.spin}deg`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>
      ) : null}

      {popup ? (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-3 sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-brand-950/55 backdrop-blur-[3px]"
            aria-label="Đóng thông báo trúng giải"
            onClick={onClosePopup}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wheel-win-title"
            className="wheel-win-popup relative w-full max-w-[15rem] rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-amber-50 via-white to-rose-50 px-4 py-5 text-center shadow-[0_20px_60px_rgba(185,28,28,0.4)] sm:max-w-[17rem]"
          >
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-amber-600">
              Chúc mừng
            </p>
            <p id="wheel-win-title" className="mt-1 text-2xl font-black text-brand-700">
              🎉 Trúng giải!
            </p>
            <p className="mt-2 text-sm font-bold leading-snug text-slate-900">{popup.label}</p>
            {popup.code ? (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50/90 px-2 py-1.5 text-xs text-slate-700">
                Mã quà: <strong className="text-brand-800">{popup.code}</strong>
              </p>
            ) : popup.requiresClaim ? (
              <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
                {PROMOTION_CLAIM_REQUIREMENTS}
              </p>
            ) : null}
            {saveHint ? (
              <p className="mt-2 text-[11px] font-medium leading-relaxed text-emerald-700">
                {saveHint}
              </p>
            ) : null}
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => void handleSaveResult()}
                className="w-full rounded-xl border-2 border-brand-700 bg-white px-3 py-2.5 text-sm font-bold text-brand-800 shadow-sm transition hover:bg-brand-50 active:scale-[0.98]"
              >
                {popup.requiresClaim ? "Lưu vào tài khoản" : "Lưu mã quà"}
              </button>
              <button
                type="button"
                onClick={onClosePopup}
                className="w-full rounded-xl bg-brand-700 px-3 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-brand-800 active:scale-[0.98]"
              >
                Tuyệt vời!
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
