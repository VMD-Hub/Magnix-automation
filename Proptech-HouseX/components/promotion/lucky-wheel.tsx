"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/ui/cn";
import { spinDeltaDeg } from "@/lib/promotion/spin-engine";
import type { PromotionPrizePublic } from "@/lib/data/promotion";

/** Cùng giải → cùng màu. ĐB = brand ruby + chữ vàng (may mắn VN). */
const TIER_STYLE: Record<
  string,
  { fill: string; stroke: string; text: string; fontSize: number; strokeWidth: number }
> = {
  SPECIAL: {
    fill: "#9b111e",
    stroke: "#3d070c",
    text: "#fcd34d",
    fontSize: 9,
    strokeWidth: 2.4,
  },
  FIRST: {
    fill: "#14532d",
    stroke: "#052e16",
    text: "#dcfce7",
    fontSize: 8.5,
    strokeWidth: 2,
  },
  SECOND: {
    fill: "#facc15",
    stroke: "#a16207",
    text: "#422006",
    fontSize: 8,
    strokeWidth: 1.8,
  },
  THIRD: {
    fill: "#2563eb",
    stroke: "#1e3a8a",
    text: "#eff6ff",
    fontSize: 8,
    strokeWidth: 1.6,
  },
  CONSOLATION: {
    fill: "#0d9488",
    stroke: "#115e59",
    text: "#ecfdf5",
    fontSize: 8,
    strokeWidth: 1.6,
  },
  EMPTY: {
    fill: "#e2e8f0",
    stroke: "#64748b",
    text: "#334155",
    fontSize: 7.5,
    strokeWidth: 1.2,
  },
};

const TIER_TITLE: Record<string, string> = {
  SPECIAL: "Giải ĐB",
  FIRST: "Giải Nhất",
  SECOND: "Giải Nhì",
  THIRD: "Giải Ba",
  CONSOLATION: "Voucher",
  EMPTY: "Chúc",
};

/** Tách dòng 1 (tên giải) và dòng 2 (tên quà). */
function segmentLineLabels(
  tier: string,
  shortLabel: string,
): { tierTitle: string; giftName: string } {
  switch (tier) {
    case "SPECIAL":
    case "FIRST":
    case "SECOND":
    case "THIRD":
      return { tierTitle: TIER_TITLE[tier] ?? shortLabel, giftName: shortLabel };
    case "CONSOLATION": {
      const parts = shortLabel.trim().split(/\s+/);
      if (parts.length >= 2) {
        return { tierTitle: parts[0]!, giftName: parts.slice(1).join(" ") };
      }
      return { tierTitle: TIER_TITLE.CONSOLATION!, giftName: shortLabel };
    }
    case "EMPTY":
      return { tierTitle: TIER_TITLE.EMPTY!, giftName: "may mắn" };
    default:
      return { tierTitle: shortLabel, giftName: "" };
  }
}

export type SpinOutcome = {
  segmentIndex: number;
  prizeLabel: string;
  won: boolean;
  redemptionCode: string | null;
};

type LuckyWheelProps = {
  prizes: PromotionPrizePublic[];
  wheelLayout: string[];
  spinDurationMs: number;
  disabled?: boolean;
  onSpinComplete?: (outcome: SpinOutcome) => void;
  onRequestSpin: () => Promise<{
    segmentIndex: number;
    prize: { label: string };
    won: boolean;
    redemptionCode: string | null;
  }>;
};

type WheelSegment = {
  index: number;
  prizeId: string;
  tierTitle: string;
  giftName: string;
  tier: string;
};

/** Góc xoay chữ: dọc theo bán kính; lật nửa dưới vòng quay để dễ đọc. */
function radialTextRotation(midAngleDeg: number): number {
  const norm = ((midAngleDeg % 360) + 360) % 360;
  if (norm > 90 && norm < 270) return midAngleDeg + 180;
  return midAngleDeg;
}

/** Hai dòng cố định: trên = tên giải, dưới = tên quà — không chồng chéo. */
function RadialTwoLineLabel({
  cx,
  cy,
  midAngleDeg,
  tierTitle,
  giftName,
  tier,
}: {
  cx: number;
  cy: number;
  midAngleDeg: number;
  tierTitle: string;
  giftName: string;
  tier: string;
}) {
  const style = TIER_STYLE[tier] ?? TIER_STYLE.EMPTY!;
  const rad = (midAngleDeg * Math.PI) / 180;
  const textRot = radialTextRotation(midAngleDeg);
  const isTopTier = tier === "SPECIAL" || tier === "FIRST";

  const labelRadius = isTopTier ? 64 : 66;
  const x = cx + labelRadius * Math.cos(rad);
  const y = cy + labelRadius * Math.sin(rad);

  const giftLen = giftName.length;
  let giftFontSize =
    giftLen > 14
      ? style.fontSize - 1.25
      : giftLen > 11
        ? style.fontSize - 0.75
        : giftLen > 8
          ? style.fontSize - 0.25
          : style.fontSize + 0.5;

  if (isTopTier) {
    giftFontSize += 0.5;
  }

  const tierFontSize = Math.max(
    giftFontSize * 0.62,
    style.fontSize - 2.75,
  );

  const lineGap = giftFontSize * 1.1;

  return (
    <text
      x={x}
      y={y}
      fill={style.text}
      textAnchor="middle"
      dominantBaseline="middle"
      transform={`rotate(${textRot}, ${x}, ${y})`}
      aria-hidden="true"
    >
      <tspan
        x={x}
        dy={-lineGap * 0.42}
        fontSize={tierFontSize}
        fontWeight={600}
        opacity={0.88}
      >
        {tierTitle}
      </tspan>
      {giftName ? (
        <tspan
          x={x}
          dy={lineGap}
          fontSize={giftFontSize}
          fontWeight={isTopTier ? 900 : 800}
        >
          {giftName}
        </tspan>
      ) : null}
    </text>
  );
}

export function LuckyWheel({
  prizes,
  wheelLayout,
  spinDurationMs,
  disabled,
  onSpinComplete,
  onRequestSpin,
}: LuckyWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const activeAnimRef = useRef<Animation | null>(null);
  const segmentCount = wheelLayout.length || 12;
  const prizeMap = useMemo(
    () => new Map(prizes.map((p) => [p.id, p])),
    [prizes],
  );

  const segments = useMemo((): WheelSegment[] => {
    return wheelLayout.map((prizeId, index) => {
      const prize = prizeMap.get(prizeId);
      const tier = prize?.tier ?? "EMPTY";
      const shortLabel = prize?.shortLabel ?? "?";
      const { tierTitle, giftName } = segmentLineLabels(tier, shortLabel);
      return {
        index,
        prizeId,
        tierTitle,
        giftName,
        tier,
      };
    });
  }, [wheelLayout, prizeMap]);

  const playTick = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.04;
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      /* ignore */
    }
  }, []);

  const playWin = useCallback(() => {
    try {
      const ctx = new AudioContext();
      [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.value = 0.06;
        const t = ctx.currentTime + i * 0.12;
        osc.start(t);
        osc.stop(t + 0.2);
      });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!spinning) return;
    const id = window.setInterval(playTick, 400);
    return () => window.clearInterval(id);
  }, [spinning, playTick]);

  useEffect(() => {
    rotationRef.current = rotation;
    const el = wheelRef.current;
    if (!el || spinning) return;
    el.style.transform = `rotate(${rotation}deg)`;
  }, [rotation, spinning]);

  useEffect(() => {
    return () => {
      activeAnimRef.current?.cancel();
    };
  }, []);

  function applyWheelRotation(deg: number) {
    rotationRef.current = deg;
    const el = wheelRef.current;
    if (el) {
      el.style.transform = `rotate(${deg}deg)`;
    }
  }

  function spinDuration(): number {
    if (typeof window === "undefined") return spinDurationMs;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 1200
      : spinDurationMs;
  }

  async function handleSpin() {
    const el = wheelRef.current;
    if (!el || spinning || disabled) return;
    setConfetti(false);
    setSpinning(true);

    const startRot = rotationRef.current;
    const duration = spinDuration();

    activeAnimRef.current?.cancel();
    const loadingAnim = el.animate(
      [
        { transform: `rotate(${startRot}deg)` },
        { transform: `rotate(${startRot + 360}deg)` },
      ],
      { duration: 500, iterations: Infinity, easing: "linear" },
    );
    activeAnimRef.current = loadingAnim;

    try {
      const result = await onRequestSpin();
      loadingAnim.cancel();

      const endRot =
        startRot + spinDeltaDeg(startRot, result.segmentIndex, segmentCount, 5);

      const finalAnim = el.animate(
        [
          { transform: `rotate(${startRot}deg)` },
          { transform: `rotate(${endRot}deg)` },
        ],
        {
          duration,
          easing: "cubic-bezier(0.17, 0.67, 0.12, 0.99)",
          fill: "forwards",
        },
      );
      activeAnimRef.current = finalAnim;
      await finalAnim.finished;

      finalAnim.cancel();
      applyWheelRotation(endRot);
      setRotation(endRot);
      setSpinning(false);

      if (result.won) {
        playWin();
        setConfetti(true);
        window.setTimeout(() => setConfetti(false), 4000);
      }
      onSpinComplete?.({
        segmentIndex: result.segmentIndex,
        prizeLabel: result.prize.label,
        won: result.won,
        redemptionCode: result.redemptionCode,
      });
    } catch {
      loadingAnim.cancel();
      applyWheelRotation(startRot);
      setSpinning(false);
    }
  }

  const segmentAngle = 360 / segmentCount;

  return (
    <div className="relative mx-auto w-full max-w-[min(100%,26rem)]">
      {confetti ? (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-2 w-2 animate-bounce rounded-full"
              style={{
                left: `${(i * 17) % 100}%`,
                top: `${(i * 13) % 60}%`,
                backgroundColor: ["#b91c1c", "#f59e0b", "#10b981", "#6366f1"][i % 4],
                animationDelay: `${(i % 5) * 0.1}s`,
              }}
            />
          ))}
        </div>
      ) : null}

      <div className="relative aspect-square">
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1">
          <div className="h-0 w-0 border-x-[16px] border-x-transparent border-t-[32px] border-t-brand-800 drop-shadow-lg" />
        </div>

        <div
          ref={wheelRef}
          className="promotion-wheel-disc absolute inset-[4%] rounded-full border-[5px] border-brand-900 bg-white shadow-[0_8px_32px_rgba(127,29,29,0.25)]"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "center center",
          }}
        >
          <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label="Vòng quay may mắn">
            <defs>
              <filter id="wheel-special-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="1.8" floodColor="#fcd34d" floodOpacity="0.55" />
              </filter>
              <filter id="wheel-first-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor="#14532d" floodOpacity="0.45" />
              </filter>
            </defs>

            {segments.map((seg) => {
              const style = TIER_STYLE[seg.tier] ?? TIER_STYLE.EMPTY!;
              const startAngle = seg.index * segmentAngle - 90;
              const endAngle = startAngle + segmentAngle;
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              const x1 = 100 + 96 * Math.cos(startRad);
              const y1 = 100 + 96 * Math.sin(startRad);
              const x2 = 100 + 96 * Math.cos(endRad);
              const y2 = 100 + 96 * Math.sin(endRad);
              const largeArc = segmentAngle > 180 ? 1 : 0;
              const midAngle = startAngle + segmentAngle / 2;
              const isHighlight = seg.tier === "SPECIAL" || seg.tier === "FIRST";

              return (
                <g
                  key={seg.index}
                  filter={
                    seg.tier === "SPECIAL"
                      ? "url(#wheel-special-glow)"
                      : seg.tier === "FIRST"
                        ? "url(#wheel-first-glow)"
                        : undefined
                  }
                >
                  <path
                    d={`M 100 100 L ${x1} ${y1} A 96 96 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={style.fill}
                    stroke={style.stroke}
                    strokeWidth={style.strokeWidth}
                  />
                  {isHighlight ? (
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 96 96 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill="none"
                      stroke="rgba(255,255,255,0.55)"
                      strokeWidth="0.8"
                      strokeDasharray="2 2"
                    />
                  ) : null}
                  <RadialTwoLineLabel
                    cx={100}
                    cy={100}
                    midAngleDeg={midAngle}
                    tierTitle={seg.tierTitle}
                    giftName={seg.giftName}
                    tier={seg.tier}
                  />
                </g>
              );
            })}

            {/* Vòng phân cách giữa các ô */}
            {segments.map((seg) => {
              const angle = (seg.index * segmentAngle - 90) * (Math.PI / 180);
              return (
                <line
                  key={`sep-${seg.index}`}
                  x1={100}
                  y1={100}
                  x2={100 + 96 * Math.cos(angle)}
                  y2={100 + 96 * Math.sin(angle)}
                  stroke="#1e293b"
                  strokeWidth="0.6"
                  strokeOpacity="0.35"
                />
              );
            })}

            <circle cx="100" cy="100" r="22" fill="#991b1b" stroke="#7f1d1d" strokeWidth="2" />
            <circle cx="100" cy="100" r="17" fill="#fef2f2" />
          </svg>
        </div>

        <button
          type="button"
          onClick={handleSpin}
          disabled={spinning || disabled}
          className={cn(
            "absolute left-1/2 top-1/2 z-10 h-[4.25rem] w-[4.25rem] -translate-x-1/2 -translate-y-1/2 rounded-full text-xs font-extrabold uppercase tracking-wide text-white shadow-lg transition-transform",
            spinning || disabled
              ? "cursor-not-allowed bg-slate-400"
              : "bg-brand-700 hover:scale-105 active:scale-95",
          )}
        >
          {spinning ? "…" : "Quay"}
        </button>
      </div>

      <ul className="mt-4 flex flex-wrap justify-center gap-2 text-[10px] font-semibold sm:text-xs">
        {(
          [
            ["SPECIAL", "Đặc biệt"],
            ["FIRST", "Nhất"],
            ["SECOND", "Nhì"],
            ["THIRD", "Hỗ trợ 1:1"],
            ["CONSOLATION", "Voucher 500k"],
            ["EMPTY", "May mắn"],
          ] as const
        ).map(([tier, name]) => {
          const s = TIER_STYLE[tier];
          return (
            <li
              key={tier}
              className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5"
              style={{ borderColor: s.stroke, backgroundColor: s.fill, color: s.text }}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full border"
                style={{ backgroundColor: s.fill, borderColor: s.stroke }}
              />
              {name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
