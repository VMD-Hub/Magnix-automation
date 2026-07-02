"use client";

import { STREET_LAMPS, TRAIN_HEADLIGHTS } from "@/lib/brand/cinematic-hero-lights";

/**
 * Cột đèn đường cố định — sáng đúng vị trí khi ban đêm (opacity theo --night-strength).
 */
export function CinematicStreetLamps() {
  return (
    <svg
      className="cinematic-hero-street-lamps absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <radialGradient id="lamp-head-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff8dc" stopOpacity="1" />
          <stop offset="35%" stopColor="#daa520" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#daa520" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lamp-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" />
        </radialGradient>
        <filter id="lamp-bloom" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="0.35" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {STREET_LAMPS.map((lamp) => {
        const s = lamp.scale;
        const poleW = 0.14 * s;
        const headR = 0.38 * s;
        const armLen = 0.55 * s;
        const poolRy = 1.8 * s;
        const poolRx = 2.4 * s;

        return (
          <g
            key={lamp.id}
            transform={`translate(${lamp.x} ${lamp.y}) scale(${s})`}
            className="cinematic-hero-lamp"
          >
            {/* Chân cột — mờ ban ngày, rõ ban đêm */}
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={-lamp.poleH}
              stroke="rgba(180, 188, 200, 0.35)"
              strokeWidth={poleW}
              strokeLinecap="round"
              className="cinematic-hero-lamp-pole"
            />
            <line
              x1={0}
              y1={-lamp.poleH}
              x2={armLen}
              y2={-lamp.poleH - 0.15}
              stroke="rgba(180, 188, 200, 0.3)"
              strokeWidth={poleW * 0.85}
              strokeLinecap="round"
              className="cinematic-hero-lamp-pole"
            />
            {/* Vệt sáng xuống mặt đường/viaduct */}
            <ellipse
              cx={armLen * 0.35}
              cy={0.8}
              rx={poolRx}
              ry={poolRy}
              fill="url(#lamp-pool)"
              className="cinematic-hero-lamp-light"
              filter="url(#lamp-bloom)"
            />
            {/* Đèn đầu cột */}
            <circle
              cx={armLen}
              cy={-lamp.poleH - 0.15}
              r={headR}
              fill="url(#lamp-head-glow)"
              className="cinematic-hero-lamp-light"
              filter="url(#lamp-bloom)"
            />
          </g>
        );
      })}

      {TRAIN_HEADLIGHTS.map((hl, i) => (
        <ellipse
          key={`train-hl-${i}`}
          cx={hl.x}
          cy={hl.y}
          rx={hl.r * 1.4}
          ry={hl.r * 0.85}
          fill="url(#lamp-head-glow)"
          className="cinematic-hero-lamp-light"
          filter="url(#lamp-bloom)"
        />
      ))}
    </svg>
  );
}
