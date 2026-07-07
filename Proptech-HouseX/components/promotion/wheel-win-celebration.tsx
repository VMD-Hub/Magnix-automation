"use client";

import { useMemo } from "react";

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
};

type WheelWinCelebrationProps = {
  showFireworks: boolean;
  popup: WinPopupData | null;
  onClosePopup: () => void;
};

export function WheelWinCelebration({
  showFireworks,
  popup,
  onClosePopup,
}: WheelWinCelebrationProps) {
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
            ) : null}
            <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
              Quà có giá trị khi ký HĐMB qua HouseX
            </p>
            <button
              type="button"
              onClick={onClosePopup}
              className="mt-4 w-full rounded-xl bg-brand-700 px-3 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-brand-800 active:scale-[0.98]"
            >
              Tuyệt vời!
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
